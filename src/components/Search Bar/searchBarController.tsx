import { useState, useEffect } from 'react';
import swh from '../../assets/sw_helper';
import SearchBar from './searchbar';
import type { SearchResults } from '../../types/stellarium';

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
					throw new Error('Error fetching results: ' + error);
				}
			};

			fetchAllData();
		}
	}, [debouncedSearch]);

	const trim = (results: SearchResults): SearchResults => {
		results.map((searchresult) => (searchresult.match = searchresult.match.replace('NAME ', '')));
		return results;
	};

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
