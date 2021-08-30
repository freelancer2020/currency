import { configureStore } from "@reduxjs/toolkit";
import { exchange } from "./exrate";
import { allRates } from "./allRates";

const store = configureStore({
  reducer: {
    exchange: exchange.reducer,
    rates: allRates.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
