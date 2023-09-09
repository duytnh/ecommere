import { Button, Upload } from "antd";
import { styled } from "styled-components";

export const WrapperHeader = styled.h1`
    font-size:15px;
    color: black;
`
export const WrapperButtonAdd = styled(Button)`
    height:150px;
    width: 150px;
    border-radius: 6px;
    border-style: dashed;
`
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-cart{
        width:60px;
        height:60px;
        border-radius:50%;
    }
    & .ant-upload-list-item-container{
        display:none;
    }
`