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
	z-index: 2;
	position: absolute;
	display: flex;
	padding: 24px;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
`;
