import { describe, it, expect, vi } from 'vitest';
import DateTime, { Slidr } from '../dateTime';
import SelectionButton from '../TimeUpdateComponent';
import { render } from '../../tests/init/index';
import moment from 'moment';

const slider: Slidr = {
	defaultValue: [1],
	min: 1,
	max: 100,
	step: 1,
	onValueChange: (n: number) => {},
};
const moment_ = moment(new Date());

describe('DateTime', () => {
	it('Render', () => {
		const { asFragment } = render(
			<DateTime
				DateSlider={slider}
				resetTime={() => {}}
				moment={moment_}
				changeDateTime={(s: string, n: number) => {}}
			/>,
		);
		const fragment = asFragment();
		// check if not null, then it must have rendered
		expect(fragment).not.null;
	});

	it.todo('Buttons increments time on press.', () => {
		// check current date
		const currDate = new Date();
		const changeDateTime = (s: string, n: number) => {};

		// call function to increment
		const { asFragment } = render(
			<SelectionButton
				moment={moment_}
				changeDateTime={changeDateTime}
			/>,
		);
		expect(asFragment());

		// check if date changed on press
	});

	it('Time Changes.', () => {});

	it('Reset button.', () => {});
});
