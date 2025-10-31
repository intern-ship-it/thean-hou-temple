// src/features/hallBooking/billingItemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ==================== ASYNC THUNKS ====================

// Fetch all billing items
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

// Create billing item
export const createBillingItem = createAsyncThunk(
  "billingItems/createBillingItem",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-booking/billing-items", itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create billing item"
      );
    }
  }
);

// Update billing item
export const updateBillingItem = createAsyncThunk(
  "billingItems/updateBillingItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hall-booking/billing-items/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update billing item"
      );
    }
  }
);

// Delete billing item
export const deleteBillingItem = createAsyncThunk(
  "billingItems/deleteBillingItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/billing-items/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete billing item"
      );
    }
  }
);

// Get item price
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

// ==================== SLICE ====================

const billingItemsSlice = createSlice({
  name: "billingItems",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      category: "",
    },
  },
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
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
      })
      // Create item
      .addCase(createBillingItem.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      // Update item
      .addCase(updateBillingItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      // Delete item
      .addCase(deleteBillingItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      });
  },
});

export const { setCategory, clearError } = billingItemsSlice.actions;
export default billingItemsSlice.reducer;
