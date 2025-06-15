import styled from 'styled-components';
import { Moment } from 'moment';

type Props = {
	moment: Moment;
	changeDateTime: (s: string, n: number) => void;
};

const TimeUpdateComponent = ({ moment, changeDateTime }: Props) => {
	return (
		<Container>
			<ButtonsContainer>
				<Button onClick={() => changeDateTime('hour', 1)}>▲</Button>
				<Button onClick={() => changeDateTime('hour', -1)}>▼</Button>
			</ButtonsContainer>
			<DisplayTime>
				<div>{moment.format('HH')}</div>:<div>{moment.format('mm')}</div>
			</DisplayTime>
		</Container>
	);
};

export default TimeUpdateComponent;

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: white;
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const DisplayTime = styled.div`
	display: flex;
`;

const Button = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: white;
`;
