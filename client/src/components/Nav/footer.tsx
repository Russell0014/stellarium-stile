import styled from 'styled-components';
import DateTimeController from '../Date Time/dateTimeController';
import { useSEngine } from '@/context/SEngineContext';

export default function Footer() {
	const { engine } = useSEngine();
	function trackEmu() {
		const emu = engine.getObj('CON kamilaroi Emu1');
		engine.core.selection = emu;
		engine.pointAndLock(engine.core.selection, 0.5);
	}
	return (
		<FooterStyle>
			<button onClick={trackEmu}>Track Emu!</button>
			<DateTimeController />
		</FooterStyle>
	);
}

export const FooterStyle = styled.div`
	background: rgb(255, 255, 255, 0.1);
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: right;
	width: 100vw;
	height: 40px;
	border-width: 2px;
	border-height: 5px;
	border-radius: 5;
	z-index: 1;
	bottom: 0;
`;
