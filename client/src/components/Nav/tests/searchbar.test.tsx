import SearchBar from '../../Search Bar/searchbar';
import type { SearchResults } from '@/types/stellarium';
import { describe, it, expect, beforeAll, vi } from 'vitest';

import { render } from '../tests/init/index';

describe('render', () => {
	it('displays an empty list', () => {
		const { asFragment } = render(
			<SearchBar
				results={[]}
				onSearch={() => {}}
				search=''
				onClose={() => {}}
			/>,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('displays some items in a list', () => {
		const { asFragment } = render(
			<SearchBar
				results={search}
				onSearch={() => {}}
				search='blah'
				onClose={() => {}}
			/>,
		);
		expect(asFragment()).toMatchSnapshot();
	});
});

describe('onSearch', () => {
	let mockOnSearch: ReturnType<typeof vi.fn>;

	beforeAll(() => {
		mockOnSearch = vi.fn();
	});

	it('calls when typed into', async () => {
		const screen = render(
			<SearchBar
				results={[]}
				onSearch={mockOnSearch}
				search=''
				onClose={() => {}}
			/>,
		);

		await screen.getByRole('textbox').fill('h');

		expect(mockOnSearch).toHaveBeenCalledTimes(1); // Called once per character typed
		expect(mockOnSearch).toHaveBeenCalledWith('H');
	});
});

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
			morpho: 'SA(s)b ',
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
