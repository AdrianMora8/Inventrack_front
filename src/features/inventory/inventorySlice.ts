import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from './inventory.api';
import type { 
  InventoryState, 
  CreateMovementDTO, 
  InventoryFilters,
  MovementFilters 
} from './inventory.types';

const initialState: InventoryState = {
  inventory: [],
  movements: [],
  currentMovement: null,
  productStock: null,
  inventoryFilters: {},
  movementFilters: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (filters: InventoryFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getInventory(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar inventario');
    }
  }
);

export const fetchProductStock = createAsyncThunk(
  'inventory/fetchProductStock',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getProductStock(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock');
    }
  }
);

// Exportar como getProductStock para consistencia
export const getProductStock = fetchProductStock;

export const fetchMovements = createAsyncThunk(
  'inventory/fetchMovements',
  async (filters: MovementFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getMovements(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar movimientos');
    }
  }
);

export const createMovement = createAsyncThunk(
  'inventory/createMovement',
  async (data: CreateMovementDTO, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createMovement(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear movimiento');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventoryFilters: (state, action) => {
      state.inventoryFilters = action.payload;
    },
    setMovementFilters: (state, action) => {
      state.movementFilters = action.payload;
    },
    clearInventoryFilters: (state) => {
      state.inventoryFilters = {};
    },
    clearMovementFilters: (state) => {
      state.movementFilters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch inventory
    builder.addCase(fetchInventory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.inventory = action.payload;
    });
    builder.addCase(fetchInventory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch movements
    builder.addCase(fetchMovements.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMovements.fulfilled, (state, action) => {
      state.isLoading = false;
      state.movements = action.payload;
    });
    builder.addCase(fetchMovements.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch product stock
    builder.addCase(fetchProductStock.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductStock.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productStock = action.payload;
    });
    builder.addCase(fetchProductStock.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create movement
    builder.addCase(createMovement.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createMovement.fulfilled, (state, action) => {
      state.isLoading = false;
      state.movements.unshift(action.payload);
    });
    builder.addCase(createMovement.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  setInventoryFilters, 
  setMovementFilters, 
  clearInventoryFilters, 
  clearMovementFilters, 
  clearError 
} = inventorySlice.actions;

export default inventorySlice.reducer;
