import React from 'react';
import { WrapperInput } from './style';

const InputForm = (props) => {
    const { placeholder = 'Enter context', ...rests } = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <div>
            <WrapperInput placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput} />
        </div>
    );
}

export default InputForm;
