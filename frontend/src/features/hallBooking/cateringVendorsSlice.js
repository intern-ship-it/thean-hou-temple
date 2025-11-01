// src/features/hallBooking/cateringVendorsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showToast } from "../../utils/toast"; // ✅ ADDED

// ==================== ASYNC THUNKS ====================

// Fetch all catering vendors
export const fetchCateringVendors = createAsyncThunk(
  "cateringVendors/fetchCateringVendors",
  async ({ vendor_type = "" } = {}, { rejectWithValue }) => {
    try {
      const params = vendor_type ? `?vendor_type=${vendor_type}` : "";
      const response = await api.get(`/hall-booking/catering-vendors${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendors"
      );
    }
  }
);

// Create catering vendor
export const createCateringVendor = createAsyncThunk(
  "cateringVendors/createCateringVendor",
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/hall-booking/catering-vendors",
        vendorData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create vendor"
      );
    }
  }
);

// Update catering vendor
export const updateCateringVendor = createAsyncThunk(
  "cateringVendors/updateCateringVendor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/hall-booking/catering-vendors/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update vendor"
      );
    }
  }
);

// Delete catering vendor
export const deleteCateringVendor = createAsyncThunk(
  "cateringVendors/deleteCateringVendor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/catering-vendors/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete vendor"
      );
    }
  }
);

// ==================== SLICE ====================

const cateringVendorsSlice = createSlice({
  name: "cateringVendors",
  initialState: {
    vendors: [],
    loading: false,
    error: null,
    filters: {
      vendor_type: "",
    },
  },
  reducers: {
    setVendorType: (state, action) => {
      state.filters.vendor_type = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendors
      .addCase(fetchCateringVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCateringVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
        // ✅ NO TOAST ON FETCH SUCCESS (would be annoying)
      })
      .addCase(fetchCateringVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch error
        showToast.error(action.payload || "toast.catering_vendors.fetch_error");
      })

      // Create vendor
      .addCase(createCateringVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCateringVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.push(action.payload.data);
        // ✅ ADDED: Success toast with vendor name
        showToast.success(
          "toast.catering_vendors.add_success",
          {},
          {
            name: action.payload.data.vendor_name,
          }
        );
      })
      .addCase(createCateringVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.catering_vendors.add_error");
      })

      // Update vendor
      .addCase(updateCateringVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCateringVendor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vendors.findIndex(
          (vendor) => vendor.id === action.payload.data.id
        );
        if (index !== -1) {
          state.vendors[index] = action.payload.data;
        }
        // ✅ ADDED: Success toast with vendor name
        showToast.success(
          "toast.catering_vendors.update_success",
          {},
          {
            name: action.payload.data.vendor_name,
          }
        );
      })
      .addCase(updateCateringVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(
          action.payload || "toast.catering_vendors.update_error"
        );
      })

      // Delete vendor
      .addCase(deleteCateringVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCateringVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter(
          (vendor) => vendor.id !== action.payload.id
        );
        // ✅ ADDED: Success toast
        showToast.success("toast.catering_vendors.delete_success");
      })
      .addCase(deleteCateringVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(
          action.payload || "toast.catering_vendors.delete_error"
        );
      });
  },
});

export const { setVendorType, clearError } = cateringVendorsSlice.actions;
export default cateringVendorsSlice.reducer;
