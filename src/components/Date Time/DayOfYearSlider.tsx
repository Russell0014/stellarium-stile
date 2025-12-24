// DayOfYearSlider.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import moment from 'moment';
import styled from 'styled-components';

type Props = {
	value: number;
	min: number;
	max: number;
	onValueChange: (n: number) => void;
};

type TickData = {
	position: number;
	isMonthStart: boolean;
	monthIndex: number;
};

const monthShort = [
	'JAN',
	'FEB',
	'MAR',
	'APR',
	'MAY',
	'JUN',
	'JUL',
	'AUG',
	'SEP',
	'OCT',
	'NOV',
	'DEC',
];

export default function DayOfYearSlider({ value, min, max, onValueChange }: Props) {
	// Drag state tracking
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [offset, setOffset] = useState(0);

	// DOM refs and measurements
	const containerRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const totalWidth = useRef(0);

	// Current date display values
	const asMoment = moment
		.utc()
		.startOf('year')
		.add(value - 1, 'days');
	const monthName = monthShort[asMoment.month()];
	const day = asMoment.date();

	// Calculate day-of-year for the start of each month
	const monthStarts = useMemo(() => {
		const starts: number[] = [];
		let d = moment.utc('2025-01-01');
		for (let m = 0; m < 12; m++) {
			starts.push(d.dayOfYear());
			d = d.add(1, 'month');
		}
		return starts;
	}, []);

	useEffect(() => {
		if (containerRef.current) {
			totalWidth.current = (max - min + 1) * 3;
			updatePositionFromValue(value);
		}
	}, []);

	useEffect(() => {
		if (!isDragging) {
			updatePositionFromValue(value);
		}
	}, [value, isDragging]);

	const calculateValueFromPosition = (offsetX: number) => {
		if (!containerRef.current) return value;

		const containerWidth = containerRef.current.clientWidth;
		const pixelsPerDay = totalWidth.current / (max - min + 1);

		const centerOffset = offsetX + containerWidth / 2;
		const dayAtCenter = min + Math.round(centerOffset / pixelsPerDay);

		return Math.max(min, Math.min(max, dayAtCenter));
	};

	const updatePositionFromValue = (day: number) => {
		if (!containerRef.current) return;

		const containerWidth = containerRef.current.clientWidth;
		const pixelsPerDay = totalWidth.current / (max - min + 1);

		const newOffset = (day - min) * pixelsPerDay - containerWidth / 2;

		setOffset(-newOffset);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		setStartX(e.clientX);
		e.preventDefault();
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		setIsDragging(true);
		setStartX(e.touches[0].clientX);
		e.preventDefault();
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;

		const deltaX = e.clientX - startX;
		const newOffset = offset + deltaX;
		setOffset(newOffset);
		setStartX(e.clientX);

		const newValue = calculateValueFromPosition(-newOffset);
		if (newValue !== value) {
			onValueChange(newValue);
		}

		e.preventDefault();
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging) return;

		const deltaX = e.touches[0].clientX - startX;
		const newOffset = offset + deltaX;
		setOffset(newOffset);
		setStartX(e.touches[0].clientX);

		const newValue = calculateValueFromPosition(-newOffset);
		if (newValue !== value) {
			onValueChange(newValue);
		}
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		const handleGlobalMouseUp = () => {
			if (isDragging) {
				setIsDragging(false);
			}
		};

		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			const deltaX = e.clientX - startX;
			const newOffset = offset + deltaX;
			setOffset(newOffset);
			setStartX(e.clientX);

			const newValue = calculateValueFromPosition(-newOffset);
			if (newValue !== value) {
				onValueChange(newValue);
			}
		};

		if (isDragging) {
			window.addEventListener('mouseup', handleGlobalMouseUp);
			window.addEventListener('mousemove', handleGlobalMouseMove);
		}

		return () => {
			window.removeEventListener('mouseup', handleGlobalMouseUp);
			window.removeEventListener('mousemove', handleGlobalMouseMove);
		};
	}, [isDragging, startX, offset, value]);

	return (
		<Container>
			<Ticker>
				<div>
					{day} {monthName}
				</div>
				<span>▼</span>
			</Ticker>

			<TrackContainer ref={containerRef}>
				<Timeline
					ref={timelineRef}
					style={{
						width: `${totalWidth.current}px`,
						transform: `translateX(${offset}px)`,
						transition: isDragging ? 'none' : 'transform 0.15s ease-out',
					}}
					onMouseDown={handleMouseDown}
					onTouchStart={handleTouchStart}
					onMouseMove={handleMouseMove}
					onTouchMove={handleTouchMove}
					onMouseUp={handleDragEnd}
					onTouchEnd={handleDragEnd}
					onMouseLeave={handleDragEnd}
					className={isDragging ? 'dragging' : ''}>
					{(() => {
						const allTicks: TickData[] = [];

						monthStarts.forEach((start, idx) => {
							allTicks.push({
								position: start,
								isMonthStart: true,
								monthIndex: idx,
							});
						});

						// Add intermediate ticks
						monthStarts.forEach((start, idx) => {
							const nextStart = monthStarts[idx + 1] || 366;
							const interval = Math.floor((nextStart - start) / 3);

							[1, 2].forEach((tickNum) => {
								const dayValue = start + interval * tickNum;
								if (dayValue < nextStart) {
									allTicks.push({
										position: dayValue,
										isMonthStart: false,
										monthIndex: idx,
									});
								}
							});
						});

						// Find the tick closest to the current value
						let closestTick: TickData | null = null;
						let minDistance = Infinity;

						allTicks.forEach((tick) => {
							const distance = Math.abs(tick.position - value);
							if (distance < minDistance) {
								minDistance = distance;
								closestTick = tick;
							}
						});

						return allTicks.map((tick, index) => {
							const distanceFromCenter = Math.abs(tick.position - value);
							const isClosest = tick === closestTick;
							const height = isClosest
								? 35
								: Math.max(10, 30 - Math.min(distanceFromCenter * 0.8, 60));

							return (
								<TickContainer
									key={`tick-${index}`}
									style={{
										left: `${((tick.position - min) / (max - min + 1)) * totalWidth.current}px`,
									}}>
									<TickWrapper>
										<Tick
											$isActive={isClosest}
											style={{
												width: '2px',
												transform: isClosest ? 'scaleY(1)' : `scaleY(${height / 35})`,
												transformOrigin: 'center',
											}}
										/>
									</TickWrapper>
									{tick.isMonthStart && (
										<TickLabel $isActive={isClosest}>{monthShort[tick.monthIndex]}</TickLabel>
									)}
								</TickContainer>
							);
						});
					})()}
				</Timeline>
			</TrackContainer>
		</Container>
	);
}

const TickWrapper = styled.div`
	height: 35px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* Add will-change for better performance */
	will-change: transform;
`;

const Tick = styled.div<{ $isActive: boolean }>`
	width: 2px;
	height: 35px;
	background: ${(p) => (p.$isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)')};
	opacity: ${(p) => (p.$isActive ? 1 : 0.6)};
	transform-origin: center;
	will-change: transform, opacity;
	transition:
		transform 0.15s ease-out,
		opacity 0.15s ease-out,
		background 0.15s ease-out;
`;

const TickLabel = styled.span<{ $isActive: boolean }>`
	font-size: 14px;
	margin-top: 8px;
	color: ${(p) => (p.$isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)')};
	transform: ${(p) => (p.$isActive ? 'scale(1.1)' : 'none')};
	transition: all 0.15s ease-out; /* Faster transition */
	white-space: nowrap;
	opacity: ${(p) => (p.$isActive ? 1 : 0.8)};
	will-change: transform, opacity;
`;

const TickContainer = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	transform: translateX(-50%);
`;

const Ticker = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
	font-weight: 600;
	letter-spacing: 0.04em;
	margin-bottom: 10px;

	span {
		font-size: 12px;
		margin-top: 4px;
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const TrackContainer = styled.div`
	@media (min-width: 1000px) {
		width: 400px;
	}
	@media (min-width: 800px) {
		width: 500px;
	}
	@media (min-width: 1200px) {
		width: 700px;
	}

	position: relative;
	height: 85px;
	overflow: hidden;
`;

const Timeline = styled.div`
	position: absolute;
	height: 100%;
	top: 0;
	left: 0;
	cursor: grab;

	&.dragging {
		cursor: grabbing;
	}
`;
