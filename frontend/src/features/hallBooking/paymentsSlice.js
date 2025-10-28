// src/features/hallBooking/paymentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async ({ page = 1, booking_id = "" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("per_page", 15);
      if (booking_id) params.append("booking_id", booking_id);

      const response = await api.get(
        `/hall-booking/payments?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payments"
      );
    }
  }
);

export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-booking/payments", paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create payment"
      );
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.unshift(action.payload.data);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
