import React from 'react';
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperValueText } from './style';
import { Checkbox, Rate } from 'antd';

const NavbarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperValueText >{option}</WrapperValueText>
                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                    return (
                        <div>
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span>from {option} star</span>
                        </div>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLabelText>Label Text</WrapperLabelText>
            <WrapperContent>
                {renderContent('text', ['SAMSUNG', 'OPPO', 'XIAOMI', 'APPLE', 'REALME'])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('checkbox', [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' }
                ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [3, 4, 5])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', ['lower 40.000', 'upper 50.000'])}
            </WrapperContent>
        </div>
    );
}

export default NavbarComponent;
