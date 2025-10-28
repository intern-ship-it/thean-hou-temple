// src/features/templeOperations/devoteesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  devotees: [],
  currentDevotee: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 15,
    total: 0,
  },
  filters: {
    search: "",
    status: "all",
  },
};

// Async Thunks
export const fetchDevotees = createAsyncThunk(
  "devotees/fetchAll",
  async ({ page = 1, perPage = 15, search = "" }, { rejectWithValue }) => {
    try {
      const response = await api.get("/temple-operations/devotees", {
        params: { page, per_page: perPage, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch devotees"
      );
    }
  }
);

export const fetchDevoteeById = createAsyncThunk(
  "devotees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/temple-operations/devotees/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch devotee"
      );
    }
  }
);

export const createDevotee = createAsyncThunk(
  "devotees/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/temple-operations/devotees", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create devotee"
      );
    }
  }
);

export const updateDevotee = createAsyncThunk(
  "devotees/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/temple-operations/devotees/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update devotee"
      );
    }
  }
);

export const deleteDevotee = createAsyncThunk(
  "devotees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/temple-operations/devotees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete devotee"
      );
    }
  }
);

// Slice
const devoteesSlice = createSlice({
  name: "devotees",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setStatus: (state, action) => {
      state.filters.status = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDevotee: (state) => {
      state.currentDevotee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchDevotees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevotees.fulfilled, (state, action) => {
        state.loading = false;
        state.devotees = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta?.current_page || 1,
          totalPages: action.payload.meta?.last_page || 1,
          perPage: action.payload.meta?.per_page || 15,
          total: action.payload.meta?.total || 0,
        };
      })
      .addCase(fetchDevotees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchDevoteeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDevoteeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDevotee = action.payload;
      })
      .addCase(fetchDevoteeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createDevotee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevotee.fulfilled, (state, action) => {
        state.loading = false;
        state.devotees.unshift(action.payload);
      })
      .addCase(createDevotee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateDevotee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevotee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.devotees.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.devotees[index] = action.payload;
        }
      })
      .addCase(updateDevotee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteDevotee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDevotee.fulfilled, (state, action) => {
        state.loading = false;
        state.devotees = state.devotees.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDevotee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, setStatus, clearError, clearCurrentDevotee } =
  devoteesSlice.actions;
export default devoteesSlice.reducer;
