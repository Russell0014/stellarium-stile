import styled from 'styled-components';
import SearchBarController from '../Search Bar/searchBarController';

export default function Header() {
	return (
		<HeaderStyle>
			<div> </div>
			<SearchBarController />
			<div> </div>
		</HeaderStyle>
	);
}

const HeaderStyle = styled.div`
	background: rgb(255, 255, 255, 0.1);
	position: absolute;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100vw;
	height: 40px;
	border-width: 2px;
	border-height: 5px;
	border-radius: 5;
	z-index: 1;
`;
