// src/features/hallBooking/hallsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showToast } from "../../utils/toast"; // ✅ ADDED

// ==================== ASYNC THUNKS ====================

// Fetch all halls
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

// ✅ ADDED: Create hall
export const createHall = createAsyncThunk(
  "halls/createHall",
  async (hallData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-booking/halls", hallData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create hall"
      );
    }
  }
);

// ✅ ADDED: Update hall
export const updateHall = createAsyncThunk(
  "halls/updateHall",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hall-booking/halls/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update hall"
      );
    }
  }
);

// ✅ ADDED: Delete hall
export const deleteHall = createAsyncThunk(
  "halls/deleteHall",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/halls/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete hall"
      );
    }
  }
);

// Check availability
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

// ==================== SLICE ====================

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
      // Fetch halls
      .addCase(fetchHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = action.payload.data;
        // ✅ NO TOAST ON FETCH SUCCESS (would be annoying)
      })
      .addCase(fetchHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch error
        showToast.error(action.payload || "toast.halls.fetch_error");
      })

      // ✅ ADDED: Create hall
      .addCase(createHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHall.fulfilled, (state, action) => {
        state.loading = false;
        state.halls.push(action.payload.data);
        // ✅ ADDED: Success toast with hall name
        showToast.success(
          "toast.halls.add_success",
          {},
          {
            name: action.payload.data.hall_name,
          }
        );
      })
      .addCase(createHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.halls.add_error");
      })

      // ✅ ADDED: Update hall
      .addCase(updateHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHall.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.halls.findIndex(
          (hall) => hall.id === action.payload.data.id
        );
        if (index !== -1) {
          state.halls[index] = action.payload.data;
        }
        // ✅ ADDED: Success toast with hall name
        showToast.success(
          "toast.halls.update_success",
          {},
          {
            name: action.payload.data.hall_name,
          }
        );
      })
      .addCase(updateHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.halls.update_error");
      })

      // ✅ ADDED: Delete hall
      .addCase(deleteHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHall.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = state.halls.filter(
          (hall) => hall.id !== action.payload.id
        );
        // ✅ ADDED: Success toast
        showToast.success("toast.halls.delete_success");
      })
      .addCase(deleteHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.halls.delete_error");
      })

      // Check availability
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload.data;
        // ✅ NO TOAST (internal operation)
      });
  },
});

export const { clearAvailability, clearError } = hallsSlice.actions;
export default hallsSlice.reducer;
