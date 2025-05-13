import styled from 'styled-components';
import SearchBarController from '../Search Bar/searchBarController';

export default function Header() {
	return (
		<HeaderStyle>
			<SearchBarController />
		</HeaderStyle>
	);
}

const HeaderStyle = styled.div`
	z-index: 1;
	position: absolute;
	top: 1rem;
	left: 0;
	right: 0;
	padding-left: 2.125rem;
`;
