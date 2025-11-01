// src/features/hallBooking/quotationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showToast } from "../../utils/toast"; // ✅ ADDED

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
        // ✅ NO TOAST ON FETCH SUCCESS (would be annoying)
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch error
        showToast.error(action.payload || "toast.quotations.fetch_error");
      })

      // Fetch quotation by ID
      .addCase(fetchQuotationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuotation = action.payload.data;
        // ✅ NO TOAST (internal operation)
      })
      .addCase(fetchQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch single quotation error
        showToast.error(action.payload || "toast.quotations.fetch_error");
      })

      // Create quotation
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations.unshift(action.payload.data);
        // ✅ ADDED: Success toast with quotation code
        showToast.success(
          "toast.quotations.add_success",
          {},
          {
            code: action.payload.data.quotation_code,
          }
        );
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.quotations.add_error");
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
        // ✅ ADDED: Success toast with quotation code
        showToast.success(
          "toast.quotations.update_success",
          {},
          {
            code: action.payload.data.quotation_code,
          }
        );
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.quotations.update_error");
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
        // ✅ ADDED: Success toast
        showToast.success("toast.quotations.delete_success");
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.quotations.delete_error");
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
        // ✅ ADDED: Success toast with booking code
        // Note: The toast will be shown in the component after navigation
      })
      .addCase(acceptQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.quotations.accept_error");
      });
  },
});

export const { setStatus, clearFilters, clearError, clearCurrentQuotation } =
  quotationsSlice.actions;
export default quotationsSlice.reducer;
