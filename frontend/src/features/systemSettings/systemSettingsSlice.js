import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../services/api";



// Fetch all settings
export const fetchSystemSettings = createAsyncThunk(
  "systemSettings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/system-settings`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

// Fetch booking form settings
export const fetchBookingSettings = createAsyncThunk(
  "systemSettings/fetchBookingSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/system-settings/booking-settings`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking settings"
      );
    }
  }
);

// Update setting
export const updateSystemSetting = createAsyncThunk(
  "systemSettings/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/system-settings/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update setting"
      );
    }
  }
);

const systemSettingsSlice = createSlice({
  name: "systemSettings",
  initialState: {
    settings: [],
    bookingSettings: {
      time_slots: [],
      booking_types: [],
      customer_types: [],
      booking_statuses: [],
      min_dinner_tables: 50,
      default_tax_percentage: 0,
    },
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
      // Fetch all settings
      .addCase(fetchSystemSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch booking settings
      .addCase(fetchBookingSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingSettings = action.payload;
      })
      .addCase(fetchBookingSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update setting
      .addCase(updateSystemSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSystemSetting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.settings.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.settings[index] = action.payload;
        }
      })
      .addCase(updateSystemSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = systemSettingsSlice.actions;
export default systemSettingsSlice.reducer;
