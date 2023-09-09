import React, { useEffect, useState, useCallback } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLogin } from './style';
import InputForm from '../../components/InputForm/InputForm';
import InputPassWord from '../../components/InputForm/InputPassword';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import imglogin from '../../assets/images/logologin.png';
import { Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlice';


const SigninPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )

    const { data, isLoading, isSuccess } = mutation

    const handleDetailsUser = useCallback(async (id, token) => {
        const storage = localStorage.getItem('refresh_token');
        if (storage) {
            const refreshToken = JSON.parse(storage);
            const res = await UserService.getDetailsUser(id, token);
            dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
        } else {
            // Handle the case when 'refresh_token' is not found in localStorage
            console.error('Refresh token not found in localStorage');
        }
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess) {
            if (location?.state) {
                navigate(location?.state)
            } else {
                navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if (data?.access_token) {
                const decoded = jwt_decode(data?.access_token)
                if (decoded?.id) {
                    handleDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess, data?.access_token, data?.refresh_token, location?.state, handleDetailsUser, navigate]);

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
            <div style={{ width: '800px', height: '443px', borderRadius: '10px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h4>Welcome,</h4>
                    <p>Login account</p>
                    <InputForm
                        style={{ marginBottom: '10px' }} placeholder="abc@gmail.com"
                        type="email" value={email} onChange={handleOnchangeEmail} />
                    <InputPassWord
                        placeholder="Enter password" type="password"
                        value={password} onChange={handleOnchangePassword} />
                    <br />
                    {data?.status === "ERR" && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handleSignIn}
                            styleButton={{
                                background: 'rgb(255,57,69)', height: '45px', width: '100%', margin: '26px 0 10px'
                            }}
                            textButton={'Login'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </Loading>
                    <WrapperTextLogin><span className='addcolor'>Forget password?</span></WrapperTextLogin>
                    <WrapperTextLogin>
                        <span className='notcolor'>Don't have an account? </span>
                        <span className='addcolor' onClick={handleNavigateSignUp}>Create an account</span>
                    </WrapperTextLogin>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imglogin} alt="logoLogin" preview={false} width="203px" height="203px" />
                    <h4>Shopping in SM</h4>
                    <p>Supper promotion every day</p>
                </WrapperContainerRight>
            </div>
        </div>
    );
}

export default SigninPage;
