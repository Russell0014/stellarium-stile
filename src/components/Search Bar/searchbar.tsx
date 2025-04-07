import styled from 'styled-components';
import type { SearchResults } from '../../types/stellarium';

type Props = {
	search: string;
	results: SearchResults;
	onSearch: (searchTerm: string) => void;
	onClose: () => void;
};

export default function SearchBar({ search, results, onSearch, onClose }: Props) {
	return (
		<SearchDiv>
			<div>
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
				{results?.map((searchresult) => <div key={searchresult.match}>{searchresult.match}</div>)}
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

const SearchDropDown = styled.div`
	display: flex-col;
	background: rgb(255, 255, 255, 0.1);
	margin-top: 15px;
`;
