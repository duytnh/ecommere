import { Image, InputNumber } from "antd";
import { styled } from "styled-components";

export const WrapperImageSmall = styled(Image)`
    width:64px;
    height:64px;
`
export const WrapperNameProduct = styled.h1`
    color:rgb(36,36,36);
    font-size:24px;
    font-weight:300;
    line-height:32px;
    word-break: break-word;
`
export const WrapperTextSell = styled.span`
    font-size:15px;
    line-height:24px;
    color:rgb(120,120,120);
`
export const WrapperDivPrice = styled.div`
    background-color:#efefef;
    width:447px;
    height:52px;
    margin-top:10px;
    align-items:center;
    padding-top:5px;
    padding-left:10px;
`
export const WrapperTextPrice = styled.span`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    color:rgb(255, 66, 78);
`
export const WrapperTextPriceDiscount = styled.span`
    color:rgb(60,60,60);
    margin-left:5px;
`
export const WrapperDiscount = styled.span`
    color:red;
    margin-left:5px;
`
export const WrapperAddress = styled.div`
    span.address{
        text-decoration:underline;
        font-size:15px;
        line-height:24px;
        font-weight:500;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    span.changeaddress{
        color: blue;
        font-weight:500;
        cursor:pointer;
    }
    margin-top:10px;
    padding-bottom:10px;
    border-bottom:1px solid #e5e5e5;
`
export const WrapperQualityProduct = styled.div`
    display:flex;
    gap:4px;
    align-items:center;
    border-radius:4px;
    width:115px;
    border:1px solid #ccc;
`
export const WrapperInputNumber = styled(InputNumber)`
    width:60px;
    border-top:none;
    border-bottom:none;
`