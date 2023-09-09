import React, { useEffect, useState } from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/images/slide1.webp'
import slider2 from '../../assets/images/slide2.webp'
import slider3 from '../../assets/images/slide3.webp'
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(5)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllProductType = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK')
            setTypeProducts(res?.data)
    }

    useEffect(() => {
        fetchAllProductType()
    }, [])

    const { isLoading, data: products } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })
    console.log(setLoading)
    return (
        <>
            <div style={{ padding: '0 120px' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div id="container" style={{
                backgroundColor: "#efefef",
                padding: "0 120px",
                minHeight: "1000px",
                display: "flex",
                flexDirection: "column",
            }}>
                < SliderComponent arrImages={[slider1, slider2, slider3]} />
                <Loading isLoading={isLoading || loading}>
                    <WrapperProduct>
                        {products?.data?.map((product) => {
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
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <WrapperButtonMore
                        disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                        textButton="View More"
                        //style={{ border: '1px solid blue', width: '240px', height: '38px', boderRadius: '5px' }}
                        styleButton={{ width: '240px', height: '38px', boderRadius: '5px', background: products?.total === products?.data?.length ? '#ccc' : '#fff' }}
                        onClick={() => setLimit((prev) => prev + 5)} />
                </div>
            </div >
        </>
    );
}

export default HomePage;

