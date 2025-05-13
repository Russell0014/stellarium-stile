import styled from 'styled-components';
import type { SearchResults, SearchResult } from '../../types/stellarium';

// temp for now
import icon_search from '@/assets/icons/search.svg';

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
							<img src={icon_search} />
							<p>
								{searchresult.short_name}
								<span>{searchresult.model}</span>
							</p>
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
	width: 380px;
`;

const SearchText = styled.input`
	id: search;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(5px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 8px;
	color: white;
	padding: 0.5rem 1.25rem;

	&:focus {
		outline: none;
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
	margin-top: 0.5rem;
	border-radius: 8px;
	width: 100%;
	max-height: 300px;
	overflow-y: auto;
	position: absolute;
	top: 100%;
	z-index: 10;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.3);
`;

const SearchResultItem = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0rem 1.75rem;
	cursor: pointer;
	transition: background-color 0.2s;
	color: white;
	text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
	font-weight: 700;

	&:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}

	p {
		display: flex;
		flex-direction: column;
		text-transform: capitalize;
	}

	p span {
		font-size: 14px;
		font-weight: 400;
	}
`;
