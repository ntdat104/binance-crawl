import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "./slice/websocket-slice";

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
