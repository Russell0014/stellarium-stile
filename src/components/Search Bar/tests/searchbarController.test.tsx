import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBarController from '../searchBarController';

import { render } from '../tests/init/index';
import { userEvent } from '@vitest/browser/context';
import swh from '../../../assets/sw_helper';
import { SearchResults } from '@/types/stellarium';

describe('Render', () => {
	it('should render', () => {
		const { asFragment } = render(<SearchBarController />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should render with initial state', () => {
		const { getByRole } = render(<SearchBarController />);
		const input = getByRole('textbox');
		expect(input).toHaveValue(''); // Initial search value should be empty
	});
});

describe('searchBarControlller', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('waits 500ms after typing', async () => {
		//Checking the Debouncer
		const mock = vi.fn();

		const screen = render(<SearchBarController />);

		vi.spyOn(screen.getByRole('textbox'), 'fill').mockImplementation(mock);
		await screen.getByRole('textbox').fill('h');

		expect(mock).not.toBeCalled(); //Expecting the Debouncer to stop the search going through straight away

		vi.waitFor(() => expect(mock).not.toHaveBeenCalledWith('H'), { timeout: 300 }); //The call should not go through after 300ms

		vi.waitFor(() => expect(mock).toHaveBeenCalledWith('H'), { timeout: 500 }); //After 500ms, the query should go through.
	});

	it('should fetch search results when typing', async () => {
		const mockSearchObjects = vi.spyOn(swh, 'searchObjects').mockResolvedValue([]);
		const { getByRole } = render(<SearchBarController />);
		const input = getByRole('textbox');

		await userEvent.type(input, 'galaxy');
		vi.waitFor(() => expect(mockSearchObjects).toHaveBeenCalledWith('galaxy', 10), {
			timeout: 500,
		});
	});

	it('should trim "NAME " from search results', () => {
		//TRIM function below, should return just name without 'NAME: '
		const trimmedResults = trim(search);

		expect(trimmedResults[0].match).toBe('Andromeda Nebula');
		expect(trimmedResults[1].match).toBe('Angelfish Cluster');
	});

	it('should not fetch results for invalid input', async () => {
		const mockSearchObjects = vi.spyOn(swh, 'searchObjects').mockResolvedValue([]);
		const { getByRole } = render(<SearchBarController />);
		const input = getByRole('textbox');

		await userEvent.click(input); // Clicked Input

		vi.waitFor(() => expect(mockSearchObjects).not.toHaveBeenCalled(), {
			//Empty Input
			timeout: 500,
		});

		await userEvent.type(input, 'hi!');
		await userEvent.type(input, '[Backspace][Backspace]');

		vi.waitFor(() => expect(mockSearchObjects).not.toHaveBeenCalled(), {
			//Type and then Delete
			timeout: 500,
		});

		await userEvent.type(input, 'a'.repeat(11)); // Input exceeds 10 characters
		vi.waitFor(() => expect(mockSearchObjects).not.toHaveBeenCalled(), {
			timeout: 500,
		});
	});
});

//Trim Function
const trim = (results: SearchResults): SearchResults => {
	results.map((searchresult) => (searchresult.match = searchresult.match.replace('NAME ', '')));
	return results;
};

//Search Results
const search: SearchResults = [
	{
		interest: 4.62624,
		match: 'NAME Andromeda Nebula',
		model: 'dso',
		model_data: {
			Bmag: 4.36,
			Umag: 4.86,
			Vmag: 3.44,
			angle: 35,
			de: 41.26875,
			dimx: 177.83,
			dimy: 69.66,
			morpho: 'SA(s)b',
			ra: 10.6847083,
			rv: -300,
		},
		names: [
			'NAME Andromeda Nebula',
			'M 31',
			'NAME Andromeda Galaxy',
			'NAME Great Nebula in Andromeda',
			'NGC 224',
			'UGC 454',
			'PGC 2557',
			'MCG+07-02-016',
			'DA 21',
			'2C 56',
			'GIN 801',
			'K79 1C',
			'RAFGL 104',
			'IRC +40013',
			'Z 535-17',
			'2MAXI J0043+412',
			'IRAS F00400+4059',
			'IRAS 00400+4059',
			'XSS J00425+4102',
			'Z 0040.0+4100',
			'3FGL J0042.5+4117',
			'2FGL J0042.5+4114',
			'UZC J004244.3+411608',
			'2MASX J00424433+4116074',
		],
		short_name: 'M 31',
		types: ['G', 'dso'],
	},
	{
		interest: 4.6156,
		match: 'NAME Angelfish Cluster',
		model: 'dso',
		model_data: {
			Bmag: 7.91,
			Vmag: 6.1,
			angle: 0,
			de: 18.779194,
			dimx: 6.9,
			dimy: 6.9,
			pm_de: -3.93,
			pm_ra: -0.16,
			ra: 298.443708,
			rv: -16.9,
		},
		names: [
			'M 71',
			'NAME Angelfish Cluster',
			'NAME Arrowhead Cluster',
			'NGC 6838',
			'GCl 115',
			'GCRV 12241',
			'CSI+18-19515',
		],
		short_name: 'M 71',
		types: ['GlC', 'Cl*', 'mul', 'dso'],
	},
];
