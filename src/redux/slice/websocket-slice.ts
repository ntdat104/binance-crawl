import WebsocketService from "@/utils/websocket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WebsocketState {
  ws: WebsocketService;
  wsf: WebsocketService;
  connected: boolean;
  symbol: string;
  interval: string;
}

const initialState: WebsocketState = {
  ws: new WebsocketService({
    url: import.meta.env.VITE_BASE_BINANCE_STREAM,
  }),
  wsf: new WebsocketService({
    url: import.meta.env.VITE_BASE_BINANCE_FSTREAM,
  }),
  connected: false,
  symbol: "BTCUSDT",
  interval: "1d",
};

export const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    connect: (state: any) => {
      if (!state.connected) {
        state.ws.connect();
        state.wsf.connect();
        state.connected = true;
      }
    },
    setSymbol: (state: any, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    setInterval: (state: any, action: PayloadAction<string>) => {
      state.interval = action.payload;
    },
  },
});

export const { connect, setSymbol, setInterval } = websocketSlice.actions;

export default websocketSlice.reducer;
