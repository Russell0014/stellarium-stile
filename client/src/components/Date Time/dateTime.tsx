import styled from 'styled-components';
import SliderComponent from './slider';
import SelectionComponent from './selectionButtons';
import type { Slidr } from './slider';
import { Moment } from 'moment';

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
		<>
			<DateTimeContainer>
				<SelectionComponent
					moment={moment}
					changeDateTime={changeDateTime}
				/>
				<p onClick={resetTime}>Reset Time </p>

				<SliderContainer>
					<SliderLabel>Day of Year:</SliderLabel>
					<SliderComponent
						defaultValue={DateSlider.defaultValue}
						min={DateSlider.min}
						max={DateSlider.max}
						step={DateSlider.step}
						onValueChange={DateSlider.onValueChange}
					/>
				</SliderContainer>

				<SliderContainer>
					<SliderLabel>Time of Day:</SliderLabel>
					<SliderComponent
						defaultValue={TimeSlider.defaultValue}
						min={TimeSlider.min}
						max={TimeSlider.max}
						step={TimeSlider.step}
						onValueChange={TimeSlider.onValueChange}
					/>
				</SliderContainer>
			</DateTimeContainer>
		</>
	);
}

//Fix Div Displays
//width: 20vw;
//height: 15vh;
const DateTimeContainer = styled.div`
	position: fixed;
	bottom: 50px;
	left: 50%;
	padding-top: 10px;
	background: rgba(255, 255, 255, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 350px;
	height: 340px;
	border-radius: 5px;
	z-index: 1;
`;

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
