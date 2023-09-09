import React from 'react';
import { WrapperInputPassWord } from './style';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


const InputForm = (props) => {
    const { placeholder = 'Enter context', ...rests } = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <div>
            <WrapperInputPassWord
                placeholder={placeholder} value={props.value} {...rests}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                onChange={handleOnchangeInput}
            />
        </div>
    );
}

export default InputForm;
