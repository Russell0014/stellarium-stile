import styled from 'styled-components';
import type { SearchResults, SearchResult } from '../../types/stellarium';
import { useRef } from 'react';
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

export type SearchBarProps = {
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

export default function SearchBar({
	search,
	results,
	onSearch,
	onClose,
	onResultClick,
}: SearchBarProps) {
	const ref = useRef<HTMLDivElement>(null);
	return (
		<SearchDiv
			ref={ref}
			onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
				if (ref.current?.contains(e.relatedTarget)) {
					return;
				}
				onClose();
			}}
			onPointerDown={(e: React.MouseEvent<HTMLDivElement>) => {
				if (ref.current?.contains(document.activeElement)) {
					e.preventDefault();
					e.stopPropagation();
				}
				// Stop focus changing when clicking inside div
			}}>
			<img
				src={icon_search}
				alt='search icon'
			/>
			<SearchText
				placeholder='Search for stars, constellation...'
				value={search}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					onSearch(e.target.value.toUpperCase().replace(/\s+/g, ''));
				}}
			/>
			{results.length > 0 && (
				<SearchDropDown>
					{results?.map((searchresult) => (
						<SearchResultItem
							key={searchresult.match}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => onResultClick(searchresult)}>
							{/* default to galaxy icon if ineligible model icon */}
							<img src={modelIcons[(searchresult.model || 'galaxy') as ModelName]} />
							<p>
								{searchresult.model === 'constellation' &&
								searchresult.names &&
								searchresult.names.length > 0
									? searchresult.names[0] // Use the first name (English name) for constellations
									: searchresult.short_name}
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
	box-sizing: border-box;
	position: relative;
	width: 376px;
	padding: 8px 12px;
	display: flex;
	align-items: center;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.25);
	background: rgba(0, 0, 0, 0.5);
`;

const SearchText = styled.input`
	width: 100%;
	border: none;
	background: transparent;
	color: white
	font-family: 'Open Sans';

	&:focus {
		outline: none;
		color: white;
	}

	&::placeholder {
		color: rgba(255, 255, 255, 0.4);
	}
`;

const SearchDropDown = styled.div`
	width: 100%;
	position: absolute;
	left: 0%;
	top: 100%;
	margin-top: 8px;
	padding-block: 12px;
	background: rgba(0, 0, 0, 0.5);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: 8px;
	max-height: 527px;
	overflow: auto;
	scrollbar-gutter: stable both-edges;

	/* scrollbar */
	&::-webkit-scrollbar {
		width: 12px;
	}

	&::-webkit-scrollbar-track {
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 999px;
		border: 3.5px solid transparent;
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
	font-weight: 600;
	font-size: 14px;
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
		font-size: 12px;
		font-weight: 400;
	}

	cursor: pointer;
	transition: background-color 0.2s;
`;
