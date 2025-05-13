import styled from 'styled-components';
import SliderComponent from './slider';
import SelectionComponent from './selectionButtons';
import type { Slidr } from './slider';
import { Moment } from 'moment';
import DayOfYearSlider from './DayOfYearSlider';

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
			{/* <SelectionComponent
				moment={moment}
				changeDateTime={changeDateTime}
			/>
			<p onClick={resetTime}>Reset Time </p> */}

			<div>
				<DayOfYearSlider
					value={DateSlider.defaultValue[0]}
					min={DateSlider.min}
					max={DateSlider.max}
					onValueChange={(v) => DateSlider.onValueChange(v)}
				/>
			</div>

			{/* <SliderContainer>
				<SliderLabel>Time of Day:</SliderLabel>
				<SliderComponent
					defaultValue={TimeSlider.defaultValue}
					min={TimeSlider.min}
					max={TimeSlider.max}
					step={TimeSlider.step}
					onValueChange={TimeSlider.onValueChange}
				/>
			</SliderContainer> */}
		</div>
	);
}

const SliderContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 80%;
	margin: 8px 0;
`;

const SliderLabel = styled.div`
	color: white;
	font-size: 14px;
	margin-bottom: 5px;
`;
