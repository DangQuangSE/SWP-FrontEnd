import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/users/profile", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/users/password", passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);

export const updateSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/users/settings", settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);
const initialState = {
  user: {
    fullname: "",
    email: "",
    role: "",
    imageUrl: "",
  },
  token: "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("🔄 Redux login action:", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      console.log(" Redux state updated:", {
        user: state.user,
        token: state.token,
      });
    },
    logout: () => {
      console.log("🚪 Redux logout action");
      // Xóa thông tin người dùng đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("persist:root");
      console.log("🗑️ Cleared localStorage");
      return initialState;
    },
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
