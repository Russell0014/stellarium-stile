//import { Icon } from "./Icon";
import { useState, useEffect } from 'react';
import swh from '@/assets/sw_helper';
import SearchBar from './searchbar';

export type SearchResult = {
	interest: number;
	match: string;
	model: string;
	model_data: {
		Bmag?: number;
		Umag?: number;
		Vmag?: number;
		angle?: number;
		de?: number;
		dimx?: number;
		dimy?: number;
		pm_de?: number;
		pm_ra?: number;
		morpho?: string;
		ra?: number;
		rv?: number;
	};
	names: string[];
	short_name: string;
	types: string[];
};

export type SearchResults = SearchResult[];

export default function SearchBarController() {
	const [search, setSearch] = useState<string>('');
	const [results, setResults] = useState<SearchResults>([]);
	const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [search]);

	//Implement Timeout to wait for user to stop typing
	useEffect(() => {
		if (debouncedSearch) {
			if (search === '' || search.length > 10) {
				return;
			}

			const fetchAllData = async () => {
				try {
					const results = await swh.searchObjects(search, 10);
					trim(results);
					setResults(results);
				} catch (error) {
					console.log(error);
				}
			};

			fetchAllData();
		}
	}, [debouncedSearch]);

	function trim(results: SearchResults): SearchResults {
		results.map((searchresult) => (searchresult.match = searchresult.match.replace('NAME ', '')));
		return results;
	}

	const handleChange = (search: string): void => {
		setSearch(search);
	};

	const onClose = (): void => {
		setSearch('');
		setResults([]);
	};

	return (
		<SearchBar
			search={search}
			results={results}
			onSearch={handleChange}
			onClose={onClose}
		/>
	);
}
