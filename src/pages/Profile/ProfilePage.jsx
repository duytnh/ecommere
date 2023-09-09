import React, { useCallback, useEffect, useState } from 'react';
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { updateUser } from '../../redux/slides/userSlice';
import { Button } from 'antd';
import {
    UploadOutlined,
} from '@ant-design/icons';
import { getBase64 } from '../../utils';

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [name, setName] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
    const [phone, setPhone] = useState(user?.phone)
    const [address, setAddress] = useState(user?.address)
    const [city, setCity] = useState(user?.city)
    const [avatar, setAvatar] = useState(user?.avatar)
    const dispatch = useDispatch()

    //mutation hook
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )
    const { data, isLoading, isSuccess, isError } = mutation
    console.log(data)

    //handle details user
    const handleDetailsUser = useCallback(async (id, token) => {
        try {
            const res = await UserService.getDetailsUser(id, token);
            dispatch(updateUser({ ...res?.data, access_token: token }));
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }, [dispatch]);

    //effect infomation
    useEffect(() => {
        setName(user?.name)
        setEmail(user?.email)
        setPhone(user?.phone)
        setAddress(user?.address)
        setCity(user?.city)
        setAvatar(user?.avatar)
    }, [user])

    //effect proccess
    useEffect(() => {
        if (isSuccess) {
            message.success('Update successfully')
            handleDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error('Update fail')
        }
    }, [isSuccess, isError, handleDetailsUser, user?.id, user?.access_token])

    //funtion onchange input
    const handleOnchangeName = (value) => { setName(value) }
    const handleOnchangeEmail = (value) => { setEmail(value) }
    const handleOnchangePhone = (value) => { setPhone(value) }
    const handleOnchangeAddress = (value) => { setAddress(value) }
    const handleOnchangeCity = (value) => { setCity(value) }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    //funtion update button
    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, name, email, phone, address, city, avatar, access_token: user?.access_token })
    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>User Infomation</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor='name'>Name</WrapperLabel>
                        <InputForm
                            style={{ width: '300px' }} id='name' value={name} onChange={handleOnchangeName} />

                        <ButtonComponent
                            onClick={handleUpdate}
                            styleButton={{
                                height: '30px', width: 'fit-content',
                            }}
                            style={{ backgroundColor: '#fff', border: '1px solid rgb(26,148,255)' }}
                            textButton={'Update'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                        <InputForm
                            style={{ width: '300px' }}
                            type="email" id='email' value={email} onChange={handleOnchangeEmail} />

                        <ButtonComponent
                            onClick={handleUpdate}
                            styleButton={{
                                height: '30px', width: 'fit-content',
                            }}
                            style={{ backgroundColor: '#fff', border: '1px solid rgb(26,148,255)' }}
                            textButton={'Update'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>
                        <InputForm
                            style={{ width: '300px' }} id='phone' value={phone} onChange={handleOnchangePhone} />

                        <ButtonComponent
                            onClick={handleUpdate}
                            styleButton={{
                                height: '30px', width: 'fit-content',
                            }}
                            style={{ backgroundColor: '#fff', border: '1px solid rgb(26,148,255)' }}
                            textButton={'Update'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='address'>Address</WrapperLabel>
                        <InputForm
                            style={{ width: '300px' }} id='address' value={address} onChange={handleOnchangeAddress} />

                        <ButtonComponent
                            onClick={handleUpdate}
                            styleButton={{
                                height: '30px', width: 'fit-content',
                            }}
                            style={{ backgroundColor: '#fff', border: '1px solid rgb(26,148,255)' }}
                            textButton={'Update'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='city'>City</WrapperLabel>
                        <InputForm
                            style={{ width: '300px' }} id='city' value={city} onChange={handleOnchangeCity} />

                        <ButtonComponent
                            onClick={handleUpdate}
                            styleButton={{
                                height: '30px', width: 'fit-content',
                            }}
                            style={{ backgroundColor: '#fff', border: '1px solid rgb(26,148,255)' }}
                            textButton={'Update'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='avatar'>Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} alt="Avatar" style={{
                                height: '60px', width: '60px',
                                borderRadius: '50%', objectFit: 'cover'
                            }} />
                        )}
                        <ButtonComponent
                            onClick={handleUpdate}
                            styleButton={{
                                height: '30px', width: 'fit-content',
                            }}
                            style={{ backgroundColor: '#fff', border: '1px solid rgb(26,148,255)' }}
                            textButton={'Update'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    );
}

export default ProfilePage;
