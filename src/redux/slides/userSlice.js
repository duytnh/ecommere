import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    isAdmin: false,
    city: '',
    refresh_token: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { _id = '', name = '', email = '', access_token = '', phone = '', address = '', avatar = '', isAdmin, city = '', refresh_token = '' } = action.payload
            state.id = _id;
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
            state.city = city;
            state.refresh_token = refresh_token ? refresh_token : state.refresh_token;
        },
        resetUser: (state) => {
            state.id = '';
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.access_token = '';
            state.isAdmin = false;
            state.city = '';
            state.refresh_token = ''
        },
    },
})

export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer