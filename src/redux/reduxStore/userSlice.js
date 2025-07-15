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
      console.log(" Redux login action received:", action.payload);
      console.log(" Payload type:", typeof action.payload);
      console.log(
        " Payload keys:",
        action.payload ? Object.keys(action.payload) : "null"
      );
      console.log(" Initial state check:", state);
      console.log(" State.user check:", state.user);

      // Kiểm tra payload không null/undefined
      if (!action.payload) {
        console.error(" Login payload is null or undefined");
        return;
      }

      // Kiểm tra state.user có tồn tại không, nếu không thì khởi tạo lại
      if (!state.user) {
        console.log("🔧 Reinitializing state.user");
        state.user = {
          fullname: "",
          email: "",
          role: "",
          imageUrl: "",
        };
      }

      // Debug user data
      console.log(" action.payload.user:", action.payload.user);
      console.log(" action.payload.user type:", typeof action.payload.user);

      // Handle both user object and direct user fields
      if (action.payload.user && typeof action.payload.user === "object") {
        console.log(" Using nested user object");
        console.log(" User object keys:", Object.keys(action.payload.user));

        // Normalize user object fields
        const newUser = {
          fullname:
            action.payload.user.fullname || action.payload.user.name || "",
          email: action.payload.user.email || "",
          role: action.payload.user.role || "",
          imageUrl: action.payload.user.imageUrl || "",
        };

        console.log(" Normalized user:", newUser);
        console.log(" Current state:", state);
        console.log(" State.user before:", state.user);

        try {
          // Gán từng property thay vì gán object
          state.user.fullname = newUser.fullname;
          state.user.email = newUser.email;
          state.user.role = newUser.role;
          state.user.imageUrl = newUser.imageUrl;
          console.log(" Successfully set state.user properties");
          console.log(" State.user after:", state.user);
        } catch (error) {
          console.error(" Error setting state.user:", error);
          console.error(" State:", state);
          console.error(" State.user:", state.user);
          throw error;
        }
      } else if (
        action.payload.fullname ||
        action.payload.email ||
        action.payload.role
      ) {
        console.log(" Using direct payload fields");

        // If user fields are directly in payload
        const newUser = {
          fullname: action.payload.fullname || action.payload.name || "",
          email: action.payload.email || "",
          role: action.payload.role || "",
          imageUrl:
            (action.payload.imageUrl && action.payload.imageUrl.trim()) || "",
        };

        console.log(" Direct user:", newUser);
        try {
          // Gán từng property thay vì gán object
          state.user.fullname = newUser.fullname;
          state.user.email = newUser.email;
          state.user.role = newUser.role;
          state.user.imageUrl = newUser.imageUrl;
          console.log(" Successfully set state.user properties (direct)");
        } catch (error) {
          console.error(" Error setting state.user (direct):", error);
          throw error;
        }
      } else {
        console.error(" No valid user data found in payload:", action.payload);
        console.error(" Available keys:", Object.keys(action.payload));
        return;
      }

      // Handle both jwt and token fields
      state.token = action.payload.jwt || action.payload.token || "";
      console.log(" Redux state updated:", {
        user: state.user,
        token: !!state.token,
      });
      console.log(" Final imageUrl in Redux:", state.user.imageUrl);
    },
    updateUserAvatar: (state, action) => {
      console.log(" Redux updateUserAvatar action received:", action.payload);
      if (state.user && action.payload.imageUrl) {
        state.user.imageUrl = action.payload.imageUrl;
        console.log(" Updated user avatar in Redux:", state.user.imageUrl);
      }
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
export const { login, logout, updateUserAvatar } = userSlice.actions;
export default userSlice.reducer;
