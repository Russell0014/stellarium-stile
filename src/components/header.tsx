import styled from "styled-components"

export default function Header() {
    
    return (
            <HeaderStyle>
            <p> Header!</p>
            </ HeaderStyle>
    )
}


const HeaderStyle = styled.div`
    background: rgb(255,255,255,0.1);
    position: absolute;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 40px;
    border-width: 2px;
    border-height: 5px;
    border-radius: 5;
    z-index: 1;
`