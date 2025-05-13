// DayOfYearSlider.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import moment from 'moment';
import styled from 'styled-components';

type Props = {
	/** 1-based day-of-year (1 … 365/366) */
	value: number;
	min: number;
	max: number;
	onValueChange: (n: number) => void;
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

	// Initialize timeline width and position
	useEffect(() => {
		if (containerRef.current) {
			// Reduce the pixels per day to make months closer together
			// 1.5px per day instead of 3px
			totalWidth.current = (max - min + 1) * 1.5;
			updatePositionFromValue(value);
		}
	}, []);

	// Sync position with external value changes
	useEffect(() => {
		if (!isDragging) {
			updatePositionFromValue(value);
		}
	}, [value, isDragging]);

	// Convert timeline position to day value
	const calculateValueFromPosition = (offsetX: number) => {
		if (!containerRef.current) return value;

		const containerWidth = containerRef.current.clientWidth;
		const pixelsPerDay = totalWidth.current / (max - min + 1);

		const centerOffset = offsetX + containerWidth / 2;
		const dayAtCenter = min + Math.round(centerOffset / pixelsPerDay);

		return Math.max(min, Math.min(max, dayAtCenter));
	};

	// Convert day value to timeline position
	const updatePositionFromValue = (day: number) => {
		if (!containerRef.current) return;

		const containerWidth = containerRef.current.clientWidth;
		const pixelsPerDay = totalWidth.current / (max - min + 1);

		const newOffset = (day - min) * pixelsPerDay - containerWidth / 2;

		setOffset(-newOffset);
	};

	// Drag interaction handlers
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

		e.preventDefault();
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	// Global event listeners for drag handling
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

				<TickerIndicator />
			</Ticker>

			<TrackContainer ref={containerRef}>
				<CenterIndicator />

				<Timeline
					ref={timelineRef}
					style={{
						width: `${totalWidth.current}px`,
						transform: `translateX(${offset}px)`,
						transition: isDragging ? 'none' : 'transform 0.2s ease-out',
					}}
					onMouseDown={handleMouseDown}
					onTouchStart={handleTouchStart}
					onMouseMove={handleMouseMove}
					onTouchMove={handleTouchMove}
					onMouseUp={handleDragEnd}
					onTouchEnd={handleDragEnd}
					onMouseLeave={handleDragEnd}
					className={isDragging ? 'dragging' : ''}>
					{/* Month markers */}
					{monthStarts.map((start, idx) => (
						<MonthTickContainer
							key={idx}
							style={{
								// Ensure the tick is centered, not left-aligned with the day position
								left: `${((start - min) / (max - min + 1)) * totalWidth.current}px`,
								transform: 'translateX(-50%)',
							}}>
							<MonthTick $isActive={value >= start && value < (monthStarts[idx + 1] ?? 367)} />
							<MonthLabel $isActive={value >= start && value < (monthStarts[idx + 1] ?? 367)}>
								{monthShort[idx]}
							</MonthLabel>
						</MonthTickContainer>
					))}
					{/* Day markers (every 10 days) */}
					{Array.from({ length: Math.ceil((max - min + 1) / 10) }).map((_, idx) => {
						const dayValue = min + idx * 10;
						return (
							<DayTick
								key={dayValue}
								style={{
									left: `${((dayValue - min) / (max - min + 1)) * totalWidth.current}px`,
								}}
								$isActive={Math.abs(value - dayValue) < 2}
							/>
						);
					})}
				</Timeline>
			</TrackContainer>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const Ticker = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
	font-weight: 600;
	letter-spacing: 0.04em;

	span {
		font-size: 12px;
		margin-top: 4px;
	}
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

const TickerIndicator = styled.div`
	width: 2px;
	height: 10px;
	background: #fff;
	margin-top: 4px;
`;

const CenterIndicator = styled.div`
	position: absolute;
	top: 0;
	height: 70px; /* Adjust as needed */
	left: 50%;
	width: 2px;
	background: #fff;
	transform: translateX(-50%);
	z-index: 10;
	pointer-events: none;
	max-height: 55px;
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

const MonthTickContainer = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MonthTick = styled.div<{ $isActive: boolean }>`
	width: 2px;
	height: 50px;
	background: white;
`;

const MonthLabel = styled.span<{ $isActive: boolean }>`
	font-size: 14px;
	margin-top: 8px;
	color: ${(p) => (p.$isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)')};
	transform: ${(p) => (p.$isActive ? 'scale(1.1)' : 'none')};
	transition: all 0.2s;
	white-space: nowrap;
`;

const DayTick = styled.div<{ $isActive: boolean }>`
	position: absolute;
	top: 20px;
	width: 1px;
	height: 10px;
	background: ${(p) => (p.$isActive ? '#fff' : 'rgba(255, 255, 255, 0.50)')};
	opacity: ${(p) => (p.$isActive ? 1 : 0.5)};
`;
