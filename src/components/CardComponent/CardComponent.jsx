import React from 'react';
import { StyleNameProduct, WrapperCartStyle, WrapperDiscoutText, WrapperPriceText, WrapperReportText } from './style';
import {
    StarFilled,
} from '@ant-design/icons';
import official from '../../assets/images/official.png';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';

const CardComponent = (props) => {
    const { name, price, rating, sold, discount, image, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCartStyle
            hoverable
            style={{ width: 200, }}
            bodyStyle={{ padding: "10px" }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <img
                src={official} alt="logo"
                style={{
                    position: 'absolute', top: 1, left: 1, width: '68px', height: '14px',
                    borderTopLeftRadius: '3px'
                }} />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span>{rating}</span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                <span style={{ marginLeft: '5px' }}> | Sold {sold || 0}+</span>
            </WrapperReportText>
            <WrapperPriceText>
                {convertPrice(price - (price * discount) / 100)}
                <WrapperDiscoutText>-{discount || 0}%</WrapperDiscoutText>
            </WrapperPriceText>
        </WrapperCartStyle>
    );
}

export default CardComponent;

