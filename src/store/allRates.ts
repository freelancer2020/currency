import { createSlice } from "@reduxjs/toolkit";

type Data = {
  base: string;
};

const allRatesData: Data = {
  base: "",
};

export const allRates = createSlice({
  name: "all rates app",
  initialState: allRatesData,
  reducers: {
    addBase(state, action) {
      state.base = action.payload;
    },
  },
});

export const allRatesActions = allRates.actions;
