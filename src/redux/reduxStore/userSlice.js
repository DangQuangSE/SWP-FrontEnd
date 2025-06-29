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
      console.log(" Redux login action:", action.payload);
      // Handle both user object and direct user fields
      if (action.payload.user) {
        // Normalize user object fields
        state.user = {
          fullname:
            action.payload.user.fullname || action.payload.user.name || "",
          email: action.payload.user.email || "",
          role: action.payload.user.role || "",
          imageUrl:
            action.payload.user.imageUrl ||
            // action.payload.user.avatar ||
            // action.payload.user.picture ||
            // action.payload.user.photo ||
            // action.payload.user.image ||
            // action.payload.user.profilePicture ||
            // action.payload.user.avatarUrl ||
            // action.payload.user.photoUrl ||
            "",
        };
      } else {
        // If user fields are directly in payload
        state.user = {
          fullname: action.payload.fullname || action.payload.name || "",
          email: action.payload.email || "",
          role: action.payload.role || "",
          imageUrl:
            action.payload.imageUrl ||
            // action.payload.avatar ||
            // action.payload.picture ||
            // action.payload.photo ||
            // action.payload.image ||
            // action.payload.profilePicture ||
            // action.payload.avatarUrl ||
            // action.payload.photoUrl ||
            "",
        };
      }
      // Handle both jwt and token fields
      state.token = action.payload.jwt || action.payload.token || "";
      console.log(" Redux state updated:", {
        user: state.user,
        token: !!state.token,
      });
      console.log(" Final imageUrl in Redux:", state.user.imageUrl);
    },
    logout: () => {
      console.log(" Redux logout action");
      // Xóa thông tin người dùng đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("persist:root");
      localStorage.removeItem("pendingbooking");
      console.log(" Cleared localStorage");
      return initialState;
    },
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
