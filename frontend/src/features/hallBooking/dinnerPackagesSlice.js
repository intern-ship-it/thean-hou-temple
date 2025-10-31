// src/features/hallBooking/dinnerPackagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ==================== ASYNC THUNKS ====================

// Fetch all dinner packages
export const fetchDinnerPackages = createAsyncThunk(
  "dinnerPackages/fetchDinnerPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-booking/dinner-packages");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dinner packages"
      );
    }
  }
);

// Create dinner package
export const createDinnerPackage = createAsyncThunk(
  "dinnerPackages/createDinnerPackage",
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/hall-booking/dinner-packages",
        packageData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create dinner package"
      );
    }
  }
);

// Update dinner package
export const updateDinnerPackage = createAsyncThunk(
  "dinnerPackages/updateDinnerPackage",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/hall-booking/dinner-packages/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update dinner package"
      );
    }
  }
);

// Delete dinner package
export const deleteDinnerPackage = createAsyncThunk(
  "dinnerPackages/deleteDinnerPackage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/dinner-packages/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete dinner package"
      );
    }
  }
);

// Calculate total cost
export const calculateTotal = createAsyncThunk(
  "dinnerPackages/calculateTotal",
  async ({ dinner_package_id, number_of_tables }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/hall-booking/dinner-packages/calculate-total",
        {
          dinner_package_id,
          number_of_tables,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to calculate total"
      );
    }
  }
);

// ==================== SLICE ====================

const dinnerPackagesSlice = createSlice({
  name: "dinnerPackages",
  initialState: {
    packages: [],
    calculatedTotal: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCalculatedTotal: (state) => {
      state.calculatedTotal = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch packages
      .addCase(fetchDinnerPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDinnerPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.data;
      })
      .addCase(fetchDinnerPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create package
      .addCase(createDinnerPackage.fulfilled, (state, action) => {
        state.packages.push(action.payload.data);
      })
      // Update package
      .addCase(updateDinnerPackage.fulfilled, (state, action) => {
        const index = state.packages.findIndex(
          (pkg) => pkg.id === action.payload.data.id
        );
        if (index !== -1) {
          state.packages[index] = action.payload.data;
        }
      })
      // Delete package
      .addCase(deleteDinnerPackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(
          (pkg) => pkg.id !== action.payload.id
        );
      })
      // Calculate total
      .addCase(calculateTotal.fulfilled, (state, action) => {
        state.calculatedTotal = action.payload.data;
      });
  },
});

export const { clearCalculatedTotal, clearError } = dinnerPackagesSlice.actions;
export default dinnerPackagesSlice.reducer;
