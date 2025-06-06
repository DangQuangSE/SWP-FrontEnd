import { createSlice } from '@reduxjs/toolkit'

const initialState = null


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login : (state, action) => {
      // action.payload: thông tin người dùng đăng nhập
      return action.payload
    },
    logout: () => {
      // Xóa thông tin người dùng đăng nhập
      return initialState
    },
   
  },
})

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions

export default userSlice.reducer