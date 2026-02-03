import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { alertsApi } from './alerts.api';
import type { AlertsState, CreateAlertRuleDTO, UpdateAlertRuleDTO } from './alerts.types';

const initialState: AlertsState = {
  alerts: [],
  activeAlerts: [],
  resolvedAlerts: [],
  alertRules: [],
  currentRule: null,
  isLoading: false,
  error: null,
};

// Async thunks - Alerts
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAll',
  async (resolved: boolean | undefined, { rejectWithValue }) => {
    try {
      const response = await alertsApi.getAll(resolved);
      return { data: response.data, resolved };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar alertas');
    }
  }
);

export const resolveAlert = createAsyncThunk(
  'alerts/resolve',
  async (id: string, { rejectWithValue }) => {
    try {
      await alertsApi.resolve(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al resolver alerta');
    }
  }
);

// Async thunks - Alert Rules
export const fetchAlertRules = createAsyncThunk(
  'alerts/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      const data = await alertsApi.getAllRules();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reglas');
    }
  }
);

export const fetchAlertRuleById = createAsyncThunk(
  'alerts/fetchRuleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await alertsApi.getRuleById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar regla');
    }
  }
);

export const createAlertRule = createAsyncThunk(
  'alerts/createRule',
  async (data: CreateAlertRuleDTO, { rejectWithValue }) => {
    try {
      const rule = await alertsApi.createRule(data);
      return rule;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear regla');
    }
  }
);

export const updateAlertRule = createAsyncThunk(
  'alerts/updateRule',
  async ({ id, data }: { id: string; data: UpdateAlertRuleDTO }, { rejectWithValue }) => {
    try {
      const rule = await alertsApi.updateRule(id, data);
      return rule;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar regla');
    }
  }
);

export const deleteAlertRule = createAsyncThunk(
  'alerts/deleteRule',
  async (id: string, { rejectWithValue }) => {
    try {
      await alertsApi.deleteRule(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar regla');
    }
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch alerts
    builder.addCase(fetchAlerts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAlerts.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, resolved } = action.payload;
      
      if (resolved === false) {
        state.activeAlerts = data;
      } else if (resolved === true) {
        state.resolvedAlerts = data;
      } else {
        state.alerts = data;
        state.activeAlerts = data.filter(a => a.status === 'ACTIVE');
        state.resolvedAlerts = data.filter(a => a.status === 'RESOLVED');
      }
    });
    builder.addCase(fetchAlerts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Resolve alert
    builder.addCase(resolveAlert.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resolveAlert.fulfilled, (state, action) => {
      state.isLoading = false;
      const alertId = action.payload;
      
      // Remove from active alerts
      state.activeAlerts = state.activeAlerts.filter(a => a._id !== alertId);
      
      // Update in all alerts
      const alertIndex = state.alerts.findIndex(a => a._id === alertId);
      if (alertIndex !== -1) {
        state.alerts[alertIndex].status = 'RESOLVED';
        state.alerts[alertIndex].resolvedAt = new Date().toISOString();
        state.resolvedAlerts.push(state.alerts[alertIndex]);
      }
    });
    builder.addCase(resolveAlert.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch alert rules
    builder.addCase(fetchAlertRules.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAlertRules.fulfilled, (state, action) => {
      state.isLoading = false;
      state.alertRules = action.payload;
    });
    builder.addCase(fetchAlertRules.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch rule by ID
    builder.addCase(fetchAlertRuleById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAlertRuleById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRule = action.payload;
    });
    builder.addCase(fetchAlertRuleById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create rule
    builder.addCase(createAlertRule.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createAlertRule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.alertRules.push(action.payload);
    });
    builder.addCase(createAlertRule.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update rule
    builder.addCase(updateAlertRule.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateAlertRule.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.alertRules.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.alertRules[index] = action.payload;
      }
    });
    builder.addCase(updateAlertRule.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete rule
    builder.addCase(deleteAlertRule.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteAlertRule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.alertRules = state.alertRules.filter(r => r._id !== action.payload);
    });
    builder.addCase(deleteAlertRule.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = alertsSlice.actions;
export default alertsSlice.reducer;
