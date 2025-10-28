// src/features/hallBooking/quotationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchQuotations = createAsyncThunk(
  "quotations/fetchQuotations",
  async ({ page = 1, status = "" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("per_page", 15);
      if (status) params.append("status", status);

      const response = await api.get(
        `/hall-booking/quotations?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quotations"
      );
    }
  }
);

export const fetchQuotationById = createAsyncThunk(
  "quotations/fetchQuotationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hall-booking/quotations/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quotation"
      );
    }
  }
);

export const createQuotation = createAsyncThunk(
  "quotations/createQuotation",
  async (quotationData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/hall-booking/quotations",
        quotationData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create quotation"
      );
    }
  }
);

export const updateQuotation = createAsyncThunk(
  "quotations/updateQuotation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hall-booking/quotations/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quotation"
      );
    }
  }
);

export const deleteQuotation = createAsyncThunk(
  "quotations/deleteQuotation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/quotations/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete quotation"
      );
    }
  }
);

export const acceptQuotation = createAsyncThunk(
  "quotations/acceptQuotation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/hall-booking/quotations/${id}/accept`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to accept quotation"
      );
    }
  }
);

const quotationsSlice = createSlice({
  name: "quotations",
  initialState: {
    quotations: [],
    currentQuotation: null,
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
    },
  },
  reducers: {
    setStatus: (state, action) => {
      state.filters.status = action.payload;
    },
    clearFilters: (state) => {
      state.filters.status = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentQuotation: (state) => {
      state.currentQuotation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quotations
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch quotation by ID
      .addCase(fetchQuotationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuotation = action.payload.data;
      })
      .addCase(fetchQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create quotation
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations.unshift(action.payload.data);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update quotation
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotations.findIndex(
          (q) => q.id === action.payload.data.id
        );
        if (index !== -1) {
          state.quotations[index] = action.payload.data;
        }
        if (state.currentQuotation?.id === action.payload.data.id) {
          state.currentQuotation = action.payload.data;
        }
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete quotation
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = state.quotations.filter(
          (q) => q.id !== action.payload.id
        );
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept quotation
      .addCase(acceptQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotations.findIndex(
          (q) => q.id === action.payload.data.id
        );
        if (index !== -1) {
          state.quotations[index] = action.payload.data;
        }
        if (state.currentQuotation?.id === action.payload.data.id) {
          state.currentQuotation = action.payload.data;
        }
      })
      .addCase(acceptQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setStatus, clearFilters, clearError, clearCurrentQuotation } =
  quotationsSlice.actions;
export default quotationsSlice.reducer;
