import { Col, Image, Rate, Row } from 'antd';
import React, { useState } from 'react';
import imageProSm from '../../assets/images/details1small1.webp';
import { WrapperAddress, WrapperDiscount, WrapperDivPrice, WrapperImageSmall, WrapperInputNumber, WrapperNameProduct, WrapperQualityProduct, WrapperTextPrice, WrapperTextPriceDiscount, WrapperTextSell } from './style';
import {
    MinusOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlice';
import { convertPrice, initFacebookSDK } from '../../utils';
import { useEffect } from 'react'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent';
import CommentComponent from '../CommentComponent/CommentComponent';

const ProductDetailsComponent = ({ idProduct }) => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const [quantityProduct, setQuantityProduct] = useState(1)

    const onChange = (value) => {
        setQuantityProduct(Number(value))
    }

    //function get detail product
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + quantityProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [quantityProduct, order?.orderItems, productDetails?._id, productDetails?.countInStock])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder, dispatch])

    const changeQuantity = (type, limited) => {
        if (type === 'increase') {
            if (!limited)
                setQuantityProduct(quantityProduct + 1)
        }
        else {
            if (!limited)
                setQuantityProduct(quantityProduct - 1)
        }
    }

    const handleAddCart = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + quantityProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: quantityProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInStock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }


    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '5px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image" preview={false} />
                    <Row style={{ padding: '10px', justifyContent: 'center' }}>
                        <Col span={4}>
                            <WrapperImageSmall src={imageProSm} alt="imagesm" preview={false} />
                        </Col>
                        <Col span={4}>
                            <WrapperImageSmall src={imageProSm} alt="imagesm" preview={false} />
                        </Col>
                        <Col span={4}>
                            <WrapperImageSmall src={imageProSm} alt="imagesm" preview={false} />
                        </Col>
                        <Col span={4}>
                            <WrapperImageSmall src={imageProSm} alt="imagesm" preview={false} />
                        </Col>
                        <Col span={4}>
                            <WrapperImageSmall src={imageProSm} alt="imagesm" preview={false} />
                        </Col>
                        <Col span={4}>
                            <WrapperImageSmall src={imageProSm} alt="imagesm" preview={false} />
                        </Col>
                    </Row>
                </Col>
                <Col span={14}>
                    <div style={{ marginLeft: '10px' }}>
                        <WrapperNameProduct>{productDetails?.name}</WrapperNameProduct>
                        <div>
                            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                            <WrapperTextSell> (view 5 comments) | Sold {productDetails?.sold}+</WrapperTextSell>
                        </div>
                        <WrapperDivPrice>
                            <WrapperTextPrice>{convertPrice(productDetails?.price - (productDetails?.price * productDetails?.discount) / 100)}</WrapperTextPrice>
                            <WrapperTextPriceDiscount><strike>{convertPrice(productDetails?.price)}</strike></WrapperTextPriceDiscount>
                            <WrapperDiscount>-{productDetails?.discount}%</WrapperDiscount>
                        </WrapperDivPrice>
                        <WrapperAddress>
                            <span>Shipping to </span>
                            <span className="address">{user?.address}</span>
                            <span className="changeaddress"> - Change Address</span>
                        </WrapperAddress>
                        <LikeButtonComponent
                            dataHref={process.env.REACT_APP_IS_LOCAL
                                ? "https://developers.facebook.com/docs/plugins/"
                                : window.location.href
                            }
                        />
                        <div style={{ paddingTop: '10px' }}>
                            <div style={{ paddingBottom: '10px' }}>Quality</div>
                            <WrapperQualityProduct>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => changeQuantity('decrease', quantityProduct === 1)} >
                                    <MinusOutlined style={{ color: '#000', fontSize: '20px' }} /></button>
                                <WrapperInputNumber defaultValue={1} onChange={onChange} value={quantityProduct} max={productDetails?.countInStock} min={1} />
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => changeQuantity('increase', quantityProduct === productDetails?.countInStock)} >
                                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} /></button>
                            </WrapperQualityProduct>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                            <ButtonComponent
                                styleButton={{
                                    color: '#fff', height: '48px', width: '221px'
                                }}
                                textButton={'Add to Cart'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}
                                onClick={handleAddCart}
                            ></ButtonComponent>
                            <ButtonComponent
                                style={{
                                    background: '#fff', height: '48px', width: '221px',
                                    border: '1px solid rgb(13,92,182)'
                                }}
                                textButton={'Buy and after Pay'}
                                styleTextButton={{ color: 'rgb(13,92,182)', fontSize: '15px', fontWeight: '500' }}
                            ></ButtonComponent>
                        </div>
                        {errorLimitOrder && <div style={{ color: 'red' }}>Đã vượt quá số lượng trong kho</div>}
                    </div>
                </Col>
                <CommentComponent
                    dataHref={process.env.REACT_APP_IS_LOCAL
                        ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                        : window.location.href
                    }
                    width="1270"
                />
            </Row>
        </Loading >
    );
}

export default ProductDetailsComponent;
