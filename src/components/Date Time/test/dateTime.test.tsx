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

	describe('Button', () => {
		it('Increments time on click', () => {
			let mnt = moment_;
			const changeDateTime = (s: string, n: number) => {
				mnt.add(n, s as moment.DurationInputArg2);
			};

			// we will simulate button presses here
			changeDateTime('h', 1);
			changeDateTime('h', 1);

			const { asFragment } = render(
				<SelectionButton
					moment={mnt}
					changeDateTime={changeDateTime}
				/>,
			);
			// div/div/date_time
			const time = asFragment().lastChild?.lastChild?.textContent;

			// just compare formatted dates
			expect(asFragment());
			expect(time).toEqual(`${mnt.format('HH')}:${mnt.format('mm')}`);
		});

		it('Incrementing time and decrementing is original value', () => {
			let mnt = moment_;
			const changeDateTime = (s: string, n: number) => {
				mnt.add(n, s as moment.DurationInputArg2);
			};

			changeDateTime('h', 1);
			changeDateTime('h', -1);

			const { asFragment } = render(
				<SelectionButton
					moment={mnt}
					changeDateTime={changeDateTime}
				/>,
			);
			const time = asFragment().lastChild?.lastChild?.textContent;

			expect(asFragment());
			expect(time).toEqual(`${mnt.format('HH')}:${mnt.format('mm')}`);
		});
	});

	it('Reset button resets time.', () => {
		// same as other test, we will simulate the reset.
		let mnt = moment_.add(15, 'h');

		const resetTime = () => {
			mnt = moment(new Date());
		};

		resetTime();

		const { asFragment } = render(
			<DateTime
				DateSlider={slider}
				resetTime={resetTime}
				moment={mnt}
				changeDateTime={(s: string, n: number) => {}}
			/>,
		);

		const TimeUpdateComponent = asFragment().lastChild?.lastChild?.childNodes[1];
		const time = TimeUpdateComponent?.lastChild?.textContent;

		expect(asFragment());
		expect(time).toEqual(`${mnt.format('HH')}:${mnt.format('mm')}`);
	});
});
