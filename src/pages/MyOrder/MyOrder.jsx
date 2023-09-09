import React, { useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'

const MyOrderPage = () => {
    const location = useLocation()
    const { state } = location
    const navigate = useNavigate()

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(state?.id, state?.token)
        return res.data
    }
    const user = useSelector((state) => state.user)

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
        enabled: state?.id && state?.token
    })
    const { isLoading, data } = queryOrder

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token
            }
        })
    }

    const mutation = useMutationHooks(
        (data) => {
            const { id, token, orderItems, userId } = data
            const res = OrderService.cancelOrder(id, token, orderItems, userId)
            return res
        }
    )

    const handleCanceOrder = (order) => {
        mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
            onSuccess: () => {
                queryOrder.refetch()
            },
        })
    }
    const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success('Canceled order successfully')
        } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
            message.error(dataCancel?.message)
        } else if (isErrorCancle) {
            message.error('Canceled order fail')
        }
    }, [isErrorCancle, isSuccessCancel, dataCancel?.status, dataCancel?.message])

    const renderProduct = (data) => {
        return data?.map((order) => {
            return <WrapperHeaderItem key={order?._id}>
                <img src={order?.image}
                    style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px'
                    }}
                    alt={order?.name}
                />
                <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginLeft: '10px'
                }}>{order?.name}</div>
                <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
            </WrapperHeaderItem>
        })
    }

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <WrapperContainer>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3 style={{ marginLeft: '40px' }}>Đơn hàng của tôi</h3>
                    <WrapperListOrder>
                        {data?.map((order) => {
                            return (
                                <WrapperItemOrder key={order?._id}>
                                    <WrapperStatus>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Status</span>
                                        <div>
                                            <span style={{ color: 'rgb(90, 32, 193)' }}>Delivery: </span>
                                            <span style={{ color: `${!order.isDelivered ? 'red' : 'green'}`, fontWeight: 'bold' }}>{`${order.isDelivered ? 'Delivery completed' : 'Not delivery'}`}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: 'rgb(90, 32, 193)' }}>Payment: </span>
                                            <span style={{ color: `${!order.isPaid ? 'red' : 'green'}`, fontWeight: 'bold' }}>{`${order.isPaid ? 'Payment completed' : 'Not Payment'}`}</span>
                                        </div>
                                    </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                    <WrapperFooterItem>
                                        <div>
                                            <span style={{ color: 'rgb(90, 32, 193)' }}>Total price: </span>
                                            <span
                                                style={{ fontSize: '14px', color: 'red', fontWeight: 700 }}
                                            >{convertPrice(order?.totalPrice)}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <ButtonComponent
                                                style={{ background: '#FFA500' }}
                                                styleButton={{
                                                    color: '#fff', height: '36px', width: 'fit-content', border: 'none', borderRadius: '4px'
                                                }}
                                                textButton={'Order cancellation'}
                                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                                onClick={() => handleCanceOrder(order)}
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                style={{ background: 'rgb(13,92,182)' }}
                                                styleButton={{
                                                    color: '#fff', height: '36px', width: 'fit-content', border: 'none', borderRadius: '4px'
                                                }}
                                                textButton={'View details'}
                                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                                onClick={() => handleDetailsOrder(order?._id)}
                                            ></ButtonComponent>
                                        </div>
                                    </WrapperFooterItem>
                                </WrapperItemOrder>
                            )
                        })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>
    )
}

export default MyOrderPage