import { Card } from "antd";
import { styled } from "styled-components";

export const WrapperCartStyle = styled(Card)`
    width:200px;
    & img{
        width:200px;
        height:200px;
    }
    position: relative;
`

export const StyleNameProduct = styled.div`
    font-weight:450;
    font-size:14px;
    line-hieght:16px;
    color: rgb(56,56,61);
`
export const WrapperReportText = styled.div`
    font-size:12px;
    color:rgb(128,28,137);
    display:flex;
    align-items:center;
    margin:6px 0 0;
`

export const WrapperPriceText = styled.div`
    color:rgb(255,66,78);
    font-size:16px;
    font-weight:500;
`

export const WrapperDiscoutText = styled.span`
    color:rgb(255,66,78);
    font-size:12px;
    font-weight:500;
`
export const WrapperImageStyle = styled.img`
    display: absolute;
    top:-1;
    left:-1;
    border-top-left-radius:3px;
    height:14px;
    weight:68px;
`