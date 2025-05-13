import styled from 'styled-components';
import TimeUpdateComponent from './TimeUpdateComponent';
import type { Slidr } from './slider';
import { Moment } from 'moment';
import DayOfYearSlider from './DayOfYearSlider';
import place from '@/assets/icons/place.svg';

type Props = {
	DateSlider: Slidr;
	TimeSlider: Slidr;
	resetTime: () => void;
	moment: Moment;
	changeDateTime: (s: string, n: number) => void;
};

export default function DateTime({
	DateSlider,
	TimeSlider,
	resetTime,
	changeDateTime,
	moment,
}: Props) {
	return (
		<div>
			<div>
				<DayOfYearSlider
					value={DateSlider.defaultValue[0]}
					min={DateSlider.min}
					max={DateSlider.max}
					onValueChange={(v) => DateSlider.onValueChange(v)}
				/>
			</div>

			<ExtraControlsContainer>
				{/* This is currently hard coded becuase it cannot be changed, 
				and the only thing saved in the engine is the latitude and longitude 
				if we add a way to change locations, we'd need to update this */}
				<SVGWrapper>
					<img
						src={place}
						alt='star icon'
					/>
					<p>Brewarrina Fish Traps</p>
				</SVGWrapper>

				<TimeUpdateComponent
					moment={moment}
					changeDateTime={changeDateTime}
				/>

				<ResetButton onClick={resetTime}>
					<p>Reset</p>
				</ResetButton>
			</ExtraControlsContainer>
		</div>
	);
}

const SVGWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: white;
`;

const ExtraControlsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	font-family: 'Roboto Mono';
	font-size: 14px;
	align-items: center;
`;

const ResetButton = styled.button`
	font-family: 'Roboto Mono';
	padding: 4px 8px;

	height: 30px;
	display: flex;
	align-items: center;

	cursor: pointer;

	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.5);
	color: white;
	background: rgba(0, 0, 0, 0.5);
	&:hover {
		background: rgba(0, 0, 0, 0.8);
	}
`;
