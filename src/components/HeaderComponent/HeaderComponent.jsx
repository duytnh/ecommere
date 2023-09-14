import React, { useEffect, useState } from 'react';
import { Badge, Col, Popover } from 'antd';
import { WrapperHeader, WrapperTextHeader, WrapperAccountHeader, WrapperTextHeaderSmall, WrapperContentPopup } from './style';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as UserServive from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlice';
import Loading from '../../components/LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlice';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [searchText, setSearchText] = useState('')

    const handleLogout = async () => {
        setLoading(true)
        await UserServive.logoutUser()
        localStorage.removeItem('refresh_token')
        dispatch(resetUser())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>My Order</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>User Profile</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>System Manager</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Logout</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile')
        } else if (type === 'admin') {
            navigate('/admin')
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    console.log(searchText)
    const handleonChange = (e) => {
        setSearchText(e.target.value)
        dispatch(searchProduct(e.target.value));
    }
    return (
        <div>
            <WrapperHeader gutter={14} style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
                <Col span={5}>
                    <WrapperTextHeader to='/'>SMARTPHONE</WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13}>
                        <Search
                            placeholder="input search text"
                            onChange={handleonChange}
                            //onSearch={onSearch}
                            enterButton />
                    </Col>
                )}

                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <Loading isLoading={loading}>
                        <WrapperAccountHeader>
                            {userAvatar ? (
                                <img src={userAvatar} alt="User Avatar" style={{
                                    height: '35px', width: '35px',
                                    borderRadius: '50%', objectFit: 'cover'
                                }} />
                            ) : (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}
                            {user?.access_token ? (
                                <>
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName || 'User'}</div>
                                    </Popover>
                                </>
                            ) : (
                                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall>Login/Signin</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperAccountHeader>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                            <Badge count={order?.orderItems?.length} size='small'>
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Cart</WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    );
}

export default HeaderComponent;
