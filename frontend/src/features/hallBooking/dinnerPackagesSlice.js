// src/features/hallBooking/dinnerPackagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { showToast } from "../../utils/toast"; // ✅ ADDED

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
        // ✅ NO TOAST ON FETCH SUCCESS (would be annoying)
      })
      .addCase(fetchDinnerPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Toast on fetch error
        showToast.error(action.payload || "toast.dinner_packages.fetch_error");
      })

      // Create package
      .addCase(createDinnerPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDinnerPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.push(action.payload.data);
        // ✅ ADDED: Success toast with package name
        showToast.success(
          "toast.dinner_packages.add_success",
          {},
          {
            name: action.payload.data.package_name,
          }
        );
      })
      .addCase(createDinnerPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.dinner_packages.add_error");
      })

      // Update package
      .addCase(updateDinnerPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDinnerPackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.packages.findIndex(
          (pkg) => pkg.id === action.payload.data.id
        );
        if (index !== -1) {
          state.packages[index] = action.payload.data;
        }
        // ✅ ADDED: Success toast with package name
        showToast.success(
          "toast.dinner_packages.update_success",
          {},
          {
            name: action.payload.data.package_name,
          }
        );
      })
      .addCase(updateDinnerPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.dinner_packages.update_error");
      })

      // Delete package
      .addCase(deleteDinnerPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDinnerPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter(
          (pkg) => pkg.id !== action.payload.id
        );
        // ✅ ADDED: Success toast
        showToast.success("toast.dinner_packages.delete_success");
      })
      .addCase(deleteDinnerPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ ADDED: Error toast
        showToast.error(action.payload || "toast.dinner_packages.delete_error");
      })

      // Calculate total
      .addCase(calculateTotal.fulfilled, (state, action) => {
        state.calculatedTotal = action.payload.data;
        // ✅ NO TOAST (internal calculation)
      });
  },
});

export const { clearCalculatedTotal, clearError } = dinnerPackagesSlice.actions;
export default dinnerPackagesSlice.reducer;
