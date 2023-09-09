import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperPriceOther, WrapperProduct, WrapperStyleContent, WrapperTD } from './style'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'

const DetailsOrderPage = () => {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token)
        return res.data
    }

    const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
        enabled: id
    })
    const { isLoading, data } = queryOrder

    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [data])


    return (
        <Loading isLoading={isLoading}>
            <div style={{ width: '100%', height: '100vh', background: '#f5f5fa' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '1270px' }}>
                    <h3>Order Detail</h3>
                    <WrapperHeaderUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Recipient address</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                                <div className='address-info'><span>Address: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                                <div className='phone-info'><span>Phone: </span> {data?.shippingAddress?.phone}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Delivery Method</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='delivery-info'><span className='name-delivery'>FAST </span>Fast delivery</div>
                                <div className='delivery-fee'><span>Delivery fee: </span> {convertPrice(data?.shippingPrice)}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Payment Method</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
                                <div className='status-payment'>{data?.isPaid ? 'Payment completed' : 'Not Payment'}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                    </WrapperHeaderUser>
                    <hr />
                    <WrapperStyleContent>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '300px' }}>Product</th>
                                    <th style={{ width: '200px' }}>Price</th>
                                    <th style={{ width: '200px' }}>Quantity</th>
                                    <th style={{ width: '200px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.orderItems?.map((order, index) => {
                                    return (
                                        <tr key={index}>
                                            <WrapperTD style={{ width: '300px', display: 'flex', alignItems: 'center' }}>
                                                <img src={order?.image}
                                                    style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        objectFit: 'cover',
                                                        border: '1px solid rgb(238, 238, 238)',
                                                        padding: '2px'
                                                    }} />
                                                <span style={{ marginLeft: '10px', alignItems: 'center' }}>{order.name}</span>
                                            </WrapperTD>
                                            <WrapperTD style={{ width: '300px' }}><span>{convertPrice(order?.price)}</span></WrapperTD>
                                            <WrapperTD style={{ borderRight: '1px solid #ccc' }}>{order?.amount}</WrapperTD>
                                            <WrapperTD style={{ fontWeight: 'bold' }}>
                                                <div>Discount: <span style={{ color: 'red', marginLeft: '10px', textAlign: 'end' }}> {convertPrice((order.price * order.discount * order.amount) / 100)}</span></div>
                                            </WrapperTD>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td></td>
                                    <WrapperTD style={{ fontWeight: 'bold', fontSize: '16px', color: 'green' }}>
                                        <div>Tạm tính: <span style={{ color: 'red', marginLeft: '10px', textAlign: 'end' }}>{convertPrice(priceMemo)}</span></div>
                                    </WrapperTD>
                                    <WrapperTD style={{ fontWeight: 'bold', fontSize: '16px', color: 'green' }}>
                                        <div>Delivery price: <span style={{ color: 'red', marginLeft: '10px', textAlign: 'end' }}>{convertPrice(data?.shippingPrice)}</span></div>
                                    </WrapperTD>
                                    <WrapperTD style={{ fontWeight: 'bold', fontSize: '16px', color: 'green' }}>
                                        <div>Total: <span style={{ color: 'red', marginLeft: '10px', textAlign: 'end' }}>{convertPrice(data?.totalPrice)}</span></div>
                                    </WrapperTD>
                                </tr>
                            </tbody>
                        </table>
                    </WrapperStyleContent>
                </div>
            </div>
        </Loading>
    )
}

export default DetailsOrderPage