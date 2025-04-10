import styled from 'styled-components';
import SliderComponent from './slider';
import SelectionComponent from './selectionButtons';
import type { Slidr } from './slider';
import { Moment } from 'moment';

type Props = {
	Slider: Slidr;
	resetTime: () => void;
	timeSlider: (n: number) => void;
	moment: Moment;
	changeDateTime: (s: string, n: number) => void;
};

export default function DateTime({ Slider, resetTime, changeDateTime, moment }: Props) {
	return (
		<>
			<DateTimeContainer>
				<SelectionComponent
					moment={moment}
					changeDateTime={changeDateTime}
				/>
				<p onClick={resetTime}>Reset Time </p>
				<SliderComponent
					defaultValue={Slider.defaultValue} //Default Value == current time
					min={Slider.min} //Min: 0
					max={Slider.max} //Max: 100
					step={Slider.step} //Increment = 1
					onValueChange={Slider.onValueChange} //Updates Time
				/>
			</DateTimeContainer>
		</>
	);
}

//Fix Div Displays
//width: 20vw;
//height: 15vh;
const DateTimeContainer = styled.div`
	position: fixed;
	bottom: 20px;
	left: 50%;
	padding-top: 10px;
	background: rgba(255, 255, 255, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 30vw;
	height: 30vh;
	border-radius: 5px;
	z-index: 1;
`;
