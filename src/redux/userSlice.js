import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        allUsers: null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        logout: state => {
            state.user = null
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload
        }
    }
})

export const { login, logout, setAllUsers } = userSlice.actions;

export const selectUser = state => state.user.user;

export const selectAllUsers = state => state.user.allUsers

export default userSlice.reducer;