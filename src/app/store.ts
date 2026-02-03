import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import productsReducer from '../features/products/productsSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import alertsReducer from '../features/alerts/alertsSlice';
import emailsReducer from '../features/emails/emailsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    inventory: inventoryReducer,
    alerts: alertsReducer,
    emails: emailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
