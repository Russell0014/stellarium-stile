import { describe, it, expect } from 'vitest';
import SearchBarController from '../searchBarController';

import { render } from '../tests/init/index';

describe('Render', () => {
	it('should render', () => {
		const { asFragment } = render(<SearchBarController />);
		expect(asFragment()).toMatchSnapshot();
	});
});
