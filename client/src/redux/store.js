import { combineReducers, configureStore } from '@reduxjs/toolkit'
import useReducer from './userslice';
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';

const rootreducer = combineReducers({ user: useReducer });

const persistConfig = {// the name of the key in the local storage
  key: 'root',
  storage:storage,
  version: 1
}
const persistreducer = persistReducer(persistConfig, rootreducer)
export const store = configureStore({
  reducer: persistreducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store); 