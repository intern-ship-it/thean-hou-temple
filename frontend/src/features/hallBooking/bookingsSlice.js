// src/features/hallBooking/bookingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showToast } from "../../utils/toast"; // ✅ ADDED

// Async thunks
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (
    { page = 1, status = "", start_date = "", end_date = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("per_page", 15);
      if (status) params.append("status", status);
      if (start_date) params.append("start_date", start_date);
      if (end_date) params.append("end_date", end_date);

      const response = await api.get(
        `/hall-booking/bookings?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchBookingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hall-booking/bookings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-booking/bookings", bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hall-booking/bookings/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking"
      );
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/bookings/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete booking"
      );
    }
  }
);

export const fetchUpcomingBookings = createAsyncThunk(
  "bookings/fetchUpcomingBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-booking/bookings-upcoming");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch upcoming bookings"
      );
    }
  }
);

export const fetchBookingStats = createAsyncThunk(
  "bookings/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-booking/bookings-statistics");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    currentBooking: null,
    upcomingBookings: [],
    statistics: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
    },
    filters: {
      status: "",
      start_date: "",
      end_date: "",
    },
  },
  reducers: {
    setStatus: (state, action) => {
      state.filters.status = action.payload;
    },
    setDateRange: (state, action) => {
      state.filters.start_date = action.payload.start_date;
      state.filters.end_date = action.payload.end_date;
    },
    clearFilters: (state) => {
      state.filters = {
        status: "",
        start_date: "",
        end_date: "",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.meta;
        // ✅ NO TOAST ON FETCH SUCCESS (would be annoying)
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch error
        showToast.error(action.payload || "toast.bookings.fetch_error");
      })

      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data;
        // ✅ NO TOAST (internal operation)
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch single booking error
        showToast.error(action.payload || "toast.bookings.fetch_error");
      })

      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload.data);
        // ✅ ADDED: Success toast with booking code
        showToast.success(
          "toast.bookings.add_success",
          {},
          {
            code: action.payload.data.booking_code,
          }
        );
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.bookings.add_error");
      })

      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.data.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload.data;
        }
        if (state.currentBooking?.id === action.payload.data.id) {
          state.currentBooking = action.payload.data;
        }
        // ✅ ADDED: Success toast with booking code
        showToast.success(
          "toast.bookings.update_success",
          {},
          {
            code: action.payload.data.booking_code,
          }
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.bookings.update_error");
      })

      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (b) => b.id !== action.payload.id
        );
        // ✅ ADDED: Success toast
        showToast.success("toast.bookings.delete_success");
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.bookings.delete_error");
      })

      // Fetch upcoming bookings
      .addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
        state.upcomingBookings = action.payload.data;
        // ✅ NO TOAST (background operation)
      })

      // Fetch stats
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
        // ✅ NO TOAST (background operation)
      });
  },
});

export const {
  setStatus,
  setDateRange,
  clearFilters,
  clearError,
  clearCurrentBooking,
} = bookingsSlice.actions;
export default bookingsSlice.reducer;
