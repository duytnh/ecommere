import { Button } from 'antd';
import React from 'react';

const ButtonComponent = ({ size, styleButton, styleTextButton, disabled, textButton, ...rests }) => {
    return (
        <Button
            size={size}
            style={{
                ...styleButton,
                background: disabled ? '#ccc' : 'rgb(13,92,182)'
            }}
            {...rests}
        >
            <span style={styleTextButton}>{textButton}</span>
        </Button >
    );
}

export default ButtonComponent;
