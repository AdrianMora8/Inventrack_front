export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';


export interface Movement {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  type: MovementType;
  quantity: number;
  reason?: string;
  userId: string;
  user: {
    _id: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateMovementDTO {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
}

export interface InventoryItem {
  _id?: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    price: number;
    categoryId: {
      _id: string;
      name: string;
    };
  };
  currentStock: number;
  lastMovement?: string;
  movements?: {
    total: number;
    in: number;
    out: number;
    adjustments: number;
  };
}

export interface InventoryFilters {
  productName?: string;
  categoryId?: string;
  minStock?: number;
  maxStock?: number;
}

export interface MovementFilters {
  productId?: string;
  type?: MovementType;
  startDate?: string;
  endDate?: string;
}

export interface InventoryState {
  inventory: InventoryItem[];
  movements: Movement[];
  currentMovement: Movement | null;
  productStock: InventoryItem | null;
  inventoryFilters: InventoryFilters;
  movementFilters: MovementFilters;
  isLoading: boolean;
  error: string | null;
}

export interface InventoryResponse {
  success: boolean;
  data: InventoryItem[];
}

export interface MovementsResponse {
  success: boolean;
  data: Movement[];
}

export interface MovementResponse {
  success: boolean;
  data: Movement;
}
