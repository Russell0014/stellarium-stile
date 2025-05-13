import styled from 'styled-components';
import type { SearchResults, SearchResult } from '../../types/stellarium';

// temp for now
import icon_search from '@/assets/icons/search.svg';
import constellation from '@/assets/icons/constellation.svg';
import star from '@/assets/icons/star.svg';
import planet from '@/assets/icons/planet.svg';
import galaxy from '@/assets/icons/galaxy.svg';
import cluster from '@/assets/icons/open_galactic_cluster.svg';
import interstellar from '@/assets/icons/interstellar_matter.svg';
import sun from '@/assets/icons/sun.svg';
import moon from '@/assets/icons/moon.svg';

type Props = {
	search: string;
	results: SearchResults;
	onSearch: (searchTerm: string) => void;
	onClose: () => void;
	onResultClick: (result: SearchResult) => void;
};

const modelIcons = {
	star: star,
	constellation: constellation,
	planet: planet,
	galaxy: galaxy,
	cluster: cluster,
	interstellar: interstellar,
	sun: sun,
	moon: moon,
};
type ModelName = keyof typeof modelIcons;

export default function SearchBar({ search, results, onSearch, onClose, onResultClick }: Props) {
	return (
		<SearchDiv>
			<SearchText
				placeholder='Search for stars, constellation...'
				value={search}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					onSearch(e.target.value.toUpperCase().replace(/\s+/g, ''));
				}}
			/>
			{results.length > 0 && (
				<SearchDropDown>
					{results.map((searchresult) => (
						<SearchResultItem
							key={searchresult.match}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => onResultClick(searchresult)}>
							<img src={modelIcons[(searchresult.model as ModelName) || 'galaxy']} />
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
	position: relative;
	max-width: 376px;
	box-sizing: border-box;
`;

const SearchText = styled.input`
	id: search;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.5);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: 8px;
	color: white;
	padding: 0.5rem 0.75rem;
	backdrop-filter: blur(5px);
	width: 100%;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}
`;

const SearchDropDown = styled.div`
	box-sizing: border-box;
	position: absolute;
	background: rgba(0, 0, 0, 0.5);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: 8px;
	padding-block: 0.75rem;
	top: calc(100% + 1rem);
	width: 100%;
	max-height: 527px;
	overflow: auto;
	scrollbar-gutter: stable both-edges;

	/* scrollbar */
	&::-webkit-scrollbar {
		width: 1.25rem;
	}

	&::-webkit-scrollbar-track {
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 999px;
		border: 0.4em solid transparent;
		background-clip: content-box;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #a8bbbf;
	}
`;

const SearchResultItem = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
	padding: 0.25rem 0.75rem;
	color: white;
	height: 65px;
	text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
	font-weight: 700;
	border: none;
	border-radius: 5px;

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

	cursor: pointer;
	transition: background-color 0.2s;
`;
