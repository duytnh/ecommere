import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import {
    UploadOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined
} from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import Loading from '../LoadingComponent/Loading';
import { Button, Form, Space } from 'antd';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { getBase64 } from '../../utils';
import * as message from '../../components/Message/Message';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import * as UserService from '../../services/UserService';

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModelOpenDelete] = useState(false)
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        isAdmin: false,
        avatar: ''
    })
    const user = useSelector((state) => state?.user)

    const [form] = Form.useForm()

    // mutation update product
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = UserService.updateUser(id, rests, token)
            return res
        }
    )

    //mutation delete user
    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = UserService.deleteUser(id, token)
            return res
        }
    )

    //mutation delete many user
    const mutationDeleteMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data
            const res = UserService.deleteManyUser(ids, token)
            return res
        }
    )

    //function delete many user
    const handleDeleteMany = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    //function get all user
    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        return res
    }

    //function get detail user
    const fetchGetDetailsUser = async (rowSelected, access_token) => {
        const res = await UserService.getDetailsUser(rowSelected, access_token)
        if (res?.data) {
            setStateUserDetails(prevState => ({
                ...prevState,
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                address: res?.data?.address,
                city: res?.data?.city,
                isAdmin: res?.data?.isAdmin,
                avatar: res?.data?.avatar
            }))
        }
        setIsLoadingUpdate(false)
    }

    //useEffect setFieldsValue form update in drawer
    useEffect(() => {
        if (stateUserDetails) {
            form.setFieldsValue({
                name: stateUserDetails.name,
                email: stateUserDetails.email,
                phone: stateUserDetails.phone,
                address: stateUserDetails.address,
                city: stateUserDetails.city,
                isAdmin: stateUserDetails.isAdmin,
                avatar: stateUserDetails.avatar
            });
        }
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsUser(rowSelected, user?.access_token)
        }
    }, [rowSelected, user?.access_token])

    //function show details user for update in drawer
    const handleDetailsUser = () => {
        if (rowSelected) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected, user?.access_token)
        }
        setIsOpenDrawer(true)
    }

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
    const { isLoading: isLoadingUser, data: users } = queryUser

    //button edit and delete
    const rederAction = () => {
        return (
            <div>
                <EditOutlined style={{ color: 'orange', fontSize: '25px', cursor: 'pointer', marginRight: '15px' }} onClick={handleDetailsUser} />
                <DeleteOutlined style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }} onClick={() => setIsModelOpenDelete(true)} />
            </div>
        )
    }

    //search table
    const handleSearch = (confirm) => {
        confirm();
    };
    //reset seach table
    const handleReset = (clearFilters) => {
        clearFilters();
    };

    //funtion search table data
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    // columns and data for table product
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email - b.email,
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if (value)
                    return record.isAdmin
                else
                    return !record.isAdmin
            }
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: rederAction,
        },
    ];
    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'True' : 'False' }
    })

    //function close Drawer update product
    const handleCancelDrawer = useCallback(() => {
        setIsOpenDrawer(false)
        setStateUserDetails({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            city: '',
            isAdmin: false,
            avatar: ''
        });
        form.resetFields();
    }, [form]);

    const handleCancelDelete = () => {
        setIsModelOpenDelete(false)
    }

    //effect when update user
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Updated product successfully')
            handleCancelDrawer()
        } else if (isErrorUpdated) {
            message.error('Updated product fail')
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated?.status, handleCancelDrawer])

    //effect when delete user
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Deleted product successfully')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error('Deleted product fail')
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted?.status])

    //effect when delete many user
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Deleted users successfully')
        } else if (isErrorDeletedMany) {
            message.error('Deleted users fail')
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany?.status])

    //Upload image for user when update
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }


    //Input onchange when update
    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        });
    }

    //update function
    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        });
    }

    //delete funtion
    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>User Manager</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <TableComponent
                    data={dataTable}
                    isLoading={isLoadingUser}
                    handleDeleteMany={handleDeleteMany}
                    columns={columns}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        };
                    }} />
            </div>

            <DrawerComponent forceRender title='Details User' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="updateform"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        onFinish={onUpdateUser}
                        autoComplete='on'
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                        //rules={[{ required: true, message: 'Name is required' }]}
                        >
                            <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email is required' }]}
                        >
                            <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name='email' />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                        //rules={[{ required: true, message: 'Address is required' }]}
                        >
                            <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name='address' />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                        //rules={[{ required: true, message: 'Address is required' }]}
                        >
                            <InputComponent value={stateUserDetails.city} onChange={handleOnChangeDetails} name='city' />
                        </Form.Item>


                        <Form.Item
                            label="Phone"
                            name="phone"
                        //rules={[{ required: true, message: 'Phone is required' }]}
                        >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone' />
                        </Form.Item>

                        <Form.Item
                            label="Avatar"
                            name="avatar"
                        //rules={[{ required: !stateUserDetails.image, message: 'Avatar is required' }]}
                        >
                            <div>
                                <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </WrapperUploadFile>
                                {stateUserDetails.avatar && (
                                    <img src={stateUserDetails?.avatar} alt="ImgProduct" style={{
                                        height: '60px', width: '60px',
                                        objectFit: 'cover', marginLeft: '10px', marginTop: '10px'
                                    }} />
                                )}
                            </div>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Change
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            <ModalComponent title="Delete User" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <hr />
                <Loading isLoading={isLoadingDeleted}>
                    <div><DeleteOutlined style={{ color: 'red', marginRight: '2px' }} />Do you want delete <b>{stateUserDetails.name || 'this user'}</b>?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
}

export default AdminUser;
