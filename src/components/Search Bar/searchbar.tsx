import styled from 'styled-components';
import type { SearchResults, SearchResult } from '../../types/stellarium';

type Props = {
	search: string;
	results: SearchResults;
	onSearch: (searchTerm: string) => void;
	onClose: () => void;
	onResultClick: (result: SearchResult) => void;
};

export default function SearchBar({ search, results, onSearch, onClose, onResultClick }: Props) {
	return (
		<SearchDiv>
			<SearchText
				placeholder='Search for stars, constellation...'
				value={search}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					onSearch(e.target.value.toUpperCase().replace(/\s+/g, ''));
				}}
				onBlur={onClose}
			/>
			{results.length > 0 && (
				<SearchDropDown>
					{results.map((searchresult) => (
						<SearchResultItem
							key={searchresult.match}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => onResultClick(searchresult)}>
							{searchresult.short_name}
						</SearchResultItem>
					))}
				</SearchDropDown>
			)}
		</SearchDiv>
	);
}

const SearchDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-self: start;
	position: relative;
	width: 300px;
`;

const SearchText = styled.input`
	id: search;
	background: rgba(0, 0, 0, 0.7);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 0.33rem;
	color: white;
	padding: 0.5rem 1.25rem;

	&:focus {
		outline: none;
		border-color: rgba(255, 255, 255);
	}

	&::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}
`;

const SearchDropDown = styled.div`
	display: flex;
	flex-direction: column;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(5px);
	margin-top: 5px;
	border-radius: 4px;
	width: 100%;
	max-height: 300px;
	overflow-y: auto;
	position: absolute;
	top: 100%;
	z-index: 10;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const SearchResultItem = styled.div`
	padding: 8px 12px;
	cursor: pointer;
	transition: background-color 0.2s;
	color: white;
	text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
	font-weight: 500;

	&:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}
`;
