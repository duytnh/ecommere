import React, { useCallback, useEffect, useState } from 'react';
import imglogin from '../../assets/images/logologin.png';
import { Image } from 'antd';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLogin } from './style';
import InputForm from '../../components/InputForm/InputForm';
import InputPassword from '../../components/InputForm/InputPassword';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';


const SignupPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.registerUser(data)
    )
    const { data, isLoading, isSuccess, isError } = mutation

    const handleNavigateSignIn = useCallback(() => {
        navigate('/sign-in');
    }, [navigate]);

    useEffect(() => {
        if (isSuccess) {
            message.success('Register successfully')
            handleNavigateSignIn()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError, handleNavigateSignIn])

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
        setconfirmPassword(value)
    }

    const handleSignUp = () => {
        mutation.mutate({
            email,
            password,
            confirmPassword
        })
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
            <div style={{ width: '800px', height: '443px', borderRadius: '10px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h4>Welcome,</h4>
                    <p>Register a new account</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
                        placeholder="abc@gmail.com" type="email"
                        value={email} onChange={handleOnchangeEmail} />
                    <InputPassword
                        style={{ marginBottom: '10px' }} placeholder="Password" type="password"
                        value={password} onChange={handleOnchangePassword} />
                    <InputPassword
                        placeholder="Confirm Password" type="password"
                        value={confirmPassword} onChange={handleOnchangeConfirmPassword} />
                    {data?.status === "ERR" && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            styleButton={{
                                background: 'rgb(255,57,69)', height: '45px', width: '100%', margin: '26px 0 10px'
                            }}
                            textButton={'Register'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </Loading>
                    <WrapperTextLogin>
                        <span className='notcolor'>You have an account? </span>
                        <span className='addcolor' onClick={handleNavigateSignIn}>Login to account</span>
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

export default SignupPage;
