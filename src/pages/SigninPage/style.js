import { styled } from "styled-components";

export const WrapperContainerLeft = styled.div`
    flex:1;
    padding: 40px 45px 24px;
`
export const WrapperContainerRight = styled.div`
    background: linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%);
    width: 300px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:4px;
    flex-direction:column;
`
export const WrapperTextLogin = styled.p`
    span.addcolor{
        font-size:13px;
        color:rgb(13,92,182);
        cursor: pointer;
    }
    span.notcolor{
        font-size:13;
        color:gray;
    }
`