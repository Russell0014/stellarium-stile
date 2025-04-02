import SearchBar from '../searchbar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('it works', () => {
	expect(true);
});

it('renders an empty list', () => {
	const { asFragment } = render(
		<SearchBar results={[]} onSearch={() => {}} search='' onClose={() => {}} />,
	);
	expect(asFragment()).toMatchSnapshot();
});

it('renders some items in a list', () => {
	const { asFragment } = render(
		<SearchBar
			results={['test', 'blah', 'blah2x']}
			onSearch={() => {}}
			search='blah'
			onClose={() => {}}
		/>,
	);
	expect(asFragment()).toMatchSnapshot();
});

it('calls onSearch when typed into', async () => {
	const user = userEvent.setup(); //Set up a User Event

	const mockOnSearch = jest.fn(); //Jest Mock Function

	render(<SearchBar results={[]} onSearch={mockOnSearch} search='' onClose={() => {}} />);

	const input = screen.getByRole('textbox'); // Select the input field

	await user.type(input, 'h'); // Simulate user typing

	expect(mockOnSearch).toHaveBeenCalledTimes(1); // Called once per character typed
	expect(mockOnSearch).toHaveBeenCalledWith('H');
});
