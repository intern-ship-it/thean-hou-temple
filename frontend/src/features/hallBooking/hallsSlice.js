// src/features/hallBooking/hallsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchHalls = createAsyncThunk(
  "halls/fetchHalls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-booking/halls");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch halls"
      );
    }
  }
);

export const checkAvailability = createAsyncThunk(
  "halls/checkAvailability",
  async ({ hall_id, event_date, time_slot }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/hall-booking/halls/check-availability",
        {
          hall_id,
          event_date,
          time_slot,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check availability"
      );
    }
  }
);

const hallsSlice = createSlice({
  name: "halls",
  initialState: {
    halls: [],
    availability: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAvailability: (state) => {
      state.availability = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = action.payload.data;
      })
      .addCase(fetchHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload.data;
      });
  },
});

export const { clearAvailability, clearError } = hallsSlice.actions;
export default hallsSlice.reducer;
