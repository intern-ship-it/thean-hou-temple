// src/features/hallBooking/customersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (
    { page = 1, search = "", customer_type = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("per_page", 15);
      if (search) params.append("search", search);
      if (customer_type) params.append("customer_type", customer_type);

      const response = await api.get(
        `/hall-booking/customers?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/hall-booking/customers", customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hall-booking/customers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update customer"
      );
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hall-booking/customers/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete customer"
      );
    }
  }
);

export const fetchCustomerStats = createAsyncThunk(
  "customers/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hall-booking/customers-statistics");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
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
      search: "",
      customer_type: "",
    },
  },
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setCustomerType: (state, action) => {
      state.filters.customer_type = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.unshift(action.payload.data);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.data.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload.data;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  },
});

export const { setSearch, setCustomerType, clearError } =
  customersSlice.actions;
export default customersSlice.reducer;
