import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from '../slices/messageSlice';

export const store = configureStore({
  reducer: {
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
