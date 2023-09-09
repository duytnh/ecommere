import { styled } from "styled-components";
import { Row } from 'antd';
import { Link } from "react-router-dom";

export const WrapperHeader = styled(Row)`
    padding:10px 120px;
    background-color:rgb(26,148,255);
    align-items:center;
    gap:16px;
    flex-wrap:nowrap;
`
export const WrapperTextHeader = styled(Link)`
    font-size:20px;
    color: white;
    font-weight:bold;
    text-align:left;
`
export const WrapperAccountHeader = styled.div`
    display: flex;
    align-items:center;
    color:white;
    gap:10px;
`
export const WrapperTextHeaderSmall = styled.span`
    font-size:13px;
    color:white;
    white-space:nowrap;
`
export const WrapperContentPopup = styled.p`
    margin:0;
    padding:5px;
    cursor: pointer;
    &:hover{
        color:blue;
        font-weight:400;
    }
`