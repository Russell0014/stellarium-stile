import styled from 'styled-components';
import { Moment } from 'moment';

type Props = {
	moment: Moment;
	changeDateTime: (s: string, n: number) => void;
};

const SelectionButton = ({ moment, changeDateTime }: Props) => {
	return (
		<div>
			<ButtonContainer>
				<UpButtons>
					<Button onClick={() => changeDateTime('year', 1)}> ▲ </Button>
					<Button onClick={() => changeDateTime('month', 1)}> ▲ </Button>
					<Button onClick={() => changeDateTime('day', 1)}> ▲ </Button>
					<Padding> </Padding>
					<Button onClick={() => changeDateTime('hour', 1)}> ▲ </Button>
					<Button onClick={() => changeDateTime('minute', 1)}> ▲ </Button>
					<Button onClick={() => changeDateTime('second', 1)}> ▲ </Button>
				</UpButtons>
				<DisplayTime>
					<div>{moment.format('YYYY')}</div>
					<div>{moment.format('MM')}</div>
					<div>{moment.format('DD')}</div>
					<Padding> </Padding>
					<div>{moment.format('HH')}</div>
					<div>{moment.format('mm')}</div>
					<div>{moment.format('ss')}</div>
				</DisplayTime>
				<DownButtons>
					<Button onClick={() => changeDateTime('year', -1)}>▼</Button>
					<Button onClick={() => changeDateTime('month', -1)}> ▼</Button>
					<Button onClick={() => changeDateTime('day', -1)}> ▼</Button>
					<Padding> </Padding>
					<Button onClick={() => changeDateTime('hour', -1)}> ▼</Button>
					<Button onClick={() => changeDateTime('minute', -1)}>▼ </Button>
					<Button onClick={() => changeDateTime('second', -1)}> ▼</Button>
				</DownButtons>
			</ButtonContainer>
		</div>
	);
};

export default SelectionButton;

const ButtonContainer = styled.div`
	display: grid;
	height: 20vh;
	color: white;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(3, 1fr);
	grid-column-gap: 20px;
	grid-row-gap: 20px;
`;

const UpButtons = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: repeat(1, fr);
`;

const DownButtons = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: repeat(1, fr);
`;

const DisplayTime = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: repeat(1, fr);
	align-items: center;
	text-align: center;
	font-size: 30px;
`;

const Padding = styled.div`
	padding-right: 30px;
	padding-left: 30px;
`;

const Button = styled.button``;
