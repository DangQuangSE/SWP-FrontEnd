import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
