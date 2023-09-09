import React, { useEffect, useState } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd';
import { WrapperNavbar, WrapperProduct } from './style';
import * as ProductService from '../../services/ProductService';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const TypeProductPage = () => {

    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })

    const fetchProductTye = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setProducts(res?.data)
            setLoading(false)
            setPanigate({ ...panigate, total: res?.total })
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (state)
            fetchProductTye(state, panigate.page, panigate.limit)
    }, [state, panigate.page, panigate.limit])

    const onShowSizeChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }

    return (
        <div style={{ width: '100%', padding: '0 120px', background: '#efefef', height: 'calc(100vh-64px)' }} >
            <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '20px', marginBottom: '20px', height: 'calc(100%-20px)' }}>
                    <WrapperNavbar span={4}>
                        <NavbarComponent />
                    </WrapperNavbar>
                    <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Loading isLoading={loading}>
                            <WrapperProduct>
                                {products?.filter((pro) => {
                                    if (searchDebounce === '') {
                                        return pro
                                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLocaleLowerCase())) {
                                        return pro
                                    }
                                })?.map((product) => {
                                    return (
                                        <CardComponent
                                            id={product._id}
                                            key={product._id} countInStock={product.countInStock}
                                            description={product.description} image={product.image}
                                            name={product.name} price={product.price}
                                            rating={product.rating} type={product.type}
                                            sold={product.sold} discount={product.discount} />
                                    )
                                })}
                            </WrapperProduct>
                        </Loading>
                        <Pagination
                            showSizeChanger onShowSizeChange={onShowSizeChange}
                            defaultCurrent={panigate.page + 1} total={panigate?.total}
                            style={{ textAlign: 'center', marginTop: '10px' }} />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default TypeProductPage;
