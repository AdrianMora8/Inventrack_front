import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emailsApi } from './emails.api';
import type { EmailsState, EmailFilters } from './emails.types';

const initialState: EmailsState = {
  emails: [],
  filters: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchEmails = createAsyncThunk(
  'emails/fetchAll',
  async (filters: EmailFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await emailsApi.getAll(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar emails');
    }
  }
);

export const fetchEmailStats = createAsyncThunk(
  'emails/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await emailsApi.getStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

const emailsSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch emails
    builder.addCase(fetchEmails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchEmails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.emails = action.payload;
    });
    builder.addCase(fetchEmails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setFilters, clearFilters, clearError } = emailsSlice.actions;
export default emailsSlice.reducer;
