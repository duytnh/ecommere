import React from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    return (
        <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
            <h4 style={{ cursor: 'pointer', fontWeight: 'bold' }}><span onClick={() => navigate('/')}>Home</span> - Product Detail</h4>
            <ProductDetailsComponent idProduct={id} />
        </div>
    );
}

export default ProductDetailsPage;
