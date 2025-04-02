//import { Icon } from "./Icon";
import styled from 'styled-components';

type SearchResult = string;

type Props = {
	search: string;
	results: SearchResult[];
	onSearch: (searchTerm: string) => void;
	onClose: () => void;
};

export default function SearchBar({ search, results, onSearch, onClose }: Props) {
	return (
		<SearchDiv>
			<div>
				{/* <Icon icon="MagnifyingGlass" width="20px" height="20px" /> */}
				<SearchText
					placeholder='Search...'
					value={search}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						onSearch(e.target.value.toUpperCase().replace(/\s+/g, ''));
					}}
					onBlur={onClose}
				/>
			</div>
			<SearchDropDown>
				{results.map((name) => (
					<div key={name}>{name}</div>
				))}
			</SearchDropDown>
		</SearchDiv>
	);
}

const SearchDiv = styled.div`
	display: flex;
	align_items: center;
	flex-direction: column;
	align-self: start;
`;

const SearchText = styled.input`
	background: none;
	id: search;
	border: 0;
	border-bottom: 2px solid black;

	&:focus {
		outline: none;
	}
`;

const SearchDropDown = styled.div``;
