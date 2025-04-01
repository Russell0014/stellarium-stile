
import styled from "styled-components";

export default function Footer() {
    
    return (
        <FooterStyle>
            I need the foot
        </FooterStyle>
    )
}

//Include Logo + Search


export const FooterStyle = styled.div`
    background: rgb(255,255,255,0.1);
    display: flex;
    position: absolute;
    align-items: center;
    width: 100vw;
    height: 40px;
    border-width: 2px;
    border-height: 5px;
    border-radius: 5;
    z-index: 1;
    bottom: 0;
`