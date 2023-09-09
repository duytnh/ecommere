import { styled } from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display:flex;
    align-items:center;
    gap:24px;
    justify-content: center;
    height:44px;
`
export const WrapperButtonMore = styled(ButtonComponent)`
    background-color:#fff;
    &:hover{
        background-color:blue;
        span{
            color:#fff;
        }
    }
    cursor: ${(props) => props.disabled ? 'no-drop' : 'pointer'}
`
export const WrapperProduct = styled.div`
    gap: 24px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
`