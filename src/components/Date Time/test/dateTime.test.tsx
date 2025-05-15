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

	it('Buttons increments time on press.', () => {
		let moment = moment_;
		const changeDateTime = (s: string, n: number) => {
			moment.add(n, s as moment.DurationInputArg2);
		};

		// we will simulate button presses here
		changeDateTime('h', 1);
		changeDateTime('h', 1);

		const { asFragment } = render(
			<SelectionButton
				moment={moment}
				changeDateTime={changeDateTime}
			/>,
		);
		// div/div/date_time
		const time = asFragment().lastChild?.lastChild?.textContent;

		// just compare formatted dates
		expect(asFragment());
		expect(time).toEqual(`${moment.format('HH')}:${moment.format('mm')}`);
	});

	it('Time Changes.', () => {});

	it('Reset button.', () => {});
});
