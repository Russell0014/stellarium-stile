import styled from 'styled-components';
import SliderComponent from './slider';
import type { Slidr } from './slider';

type Props = {
	dateTime: Date;
	Slider: Slidr;
	resetTime: () => void;
	timeSlider: (n: number) => void;
};

export default function DateTime({ dateTime, Slider, resetTime }: Props) {
	return (
		<>
			<DateTimeContainer>
				<p>{dateTime.toLocaleString()}</p>
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

const DateTimeContainer = styled.div`
	position: fixed;
	bottom: 80px;
	left: 50%;
	background: rgba(255, 255, 255, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 20vw;
	height: 15vh;
	border-radius: 5px;
	z-index: 1;
`;
