import { createSlice } from "@reduxjs/toolkit";

type Data = {
  base: string;
  toCurrency: string;
  rate: string;
  dataEntries: [string];
  failed: boolean;
  error: string;
};

const exchangeData: Data = {
  base: "USD",
  toCurrency: "PLN",
  rate: "0",
  dataEntries: [""],
  failed: false,
  error: "",
};

export const exchange = createSlice({
  name: "Exchange Currency App",
  initialState: exchangeData,
  reducers: {
    setBase(state, action) {
      state.base = action.payload;
    },
    setToCurrency(state, action) {
      state.toCurrency = action.payload;
    },
    setRate(state, action) {
      state.rate = action.payload;
    },
    deployAllData(state, action) {
      state.base = action.payload.base;
      state.rate = action.payload.rate;
      state.toCurrency = action.payload.toCurrency;
    },
    setEntries(state, action) {
      state.dataEntries = action.payload;
    },
    apiSuccess(state) {
      state.failed = false;
    },
    apiFailed(state) {
      state.failed = true;
    },
    setErrorMessage(state, action) {
      switch (action.payload) {
        case "Too many requests":
          state.error =
            "Too many requests - It's free API, the response might be late!";
          //  state.failed = true;
          break;
        case "quota_reached":
          state.error =
            "You have reached your quota for this API in the current billing period.";
          state.failed = true;
          break;
        case "same value":
          state.error = "You are trying to exchange the same currency!";
          state.failed = true;
          break;
        default:
          state.error =
            "API network error - It's free API, the response might be late!";
          state.failed = true;
      }
    },
  },
});

export const exchangeActions = exchange.actions;
