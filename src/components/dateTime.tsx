import styled from 'styled-components';

type Props = {
	dateTime: Date;
};

export default function dateTime({ dateTime }: Props) {
	return (
		<>
			<DateTimeContainer>
				<p>This is the date-time box!</p>
			</DateTimeContainer>
		</>
	);
}

const DateTimeContainer = styled.div`
	display: flex;
	align_items: center;
	flex-direction: column;
	align-self: start;
	background: red;
`;
