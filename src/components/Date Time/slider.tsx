// SliderDemo.tsx
import * as Slider from '@radix-ui/react-slider';
import styled from 'styled-components';

export type Slidr = {
	defaultValue: number[];
	min: number;
	max: number;
	step: number;
	onValueChange: (n: number) => void;
};

const SliderComponent = ({ defaultValue, min, max, step, onValueChange }: Slidr) => (
	<Form>
		<StyledSliderRoot
			defaultValue={defaultValue}
			min={min}
			max={max}
			step={step}
			onValueChange={(value) => onValueChange(value[0])}>
			<StyledSliderTrack>
				<StyledSliderRange />
			</StyledSliderTrack>
			<StyledSliderThumb aria-label='Volume' />
		</StyledSliderRoot>
	</Form>
);

export default SliderComponent;

// Styled Components
const Form = styled.form`
	display: flex;
	align-items: center;
	width: 100%;
`;

const StyledSliderRoot = styled(Slider.Root)`
	position: relative;
	display: flex;
	align-items: center;
	user-select: none;
	touch-action: none;
	width: 200px;
	height: 20px;
`;

const StyledSliderTrack = styled(Slider.Track)`
	background-color: var(--black-a10);
	position: relative;
	flex-grow: 1;
	border-radius: 9999px;
	height: 3px;
`;

const StyledSliderRange = styled(Slider.Range)`
	position: absolute;
	background-color: white;
	border-radius: 9999px;
	height: 100%;
`;

const StyledSliderThumb = styled(Slider.Thumb)`
	display: block;
	width: 20px;
	height: 20px;
	background-color: white;
	box-shadow: 0 2px 10px var(--black-a7);
	border-radius: 10px;
	transition: background-color 0.2s;

	&:hover {
		background-color: var(--violet-3);
	}

	&:focus {
		outline: none;
		box-shadow: 0 0 0 5px var(--black-a8);
	}
`;
