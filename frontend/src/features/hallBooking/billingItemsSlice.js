// src/features/hallBooking/billingItemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBillingItems = createAsyncThunk(
  "billingItems/fetchBillingItems",
  async ({ category = "" } = {}, { rejectWithValue }) => {
    try {
      const params = category ? `?category=${category}` : "";
      const response = await api.get(`/hall-booking/billing-items${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch billing items"
      );
    }
  }
);

export const getItemPrice = createAsyncThunk(
  "billingItems/getPrice",
  async ({ billing_item_id, customer_type }, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-booking/billing-items/get-price", {
        billing_item_id,
        customer_type,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get price"
      );
    }
  }
);

const billingItemsSlice = createSlice({
  name: "billingItems",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchBillingItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = billingItemsSlice.actions;
export default billingItemsSlice.reducer;
