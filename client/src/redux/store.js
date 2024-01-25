import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';
import themeReducer from './theme/themeSlice';
import userReducer from './user/userSlice';

const rootReducer = combineReducers({ // This is the nain Reducer where all the reducers will reside to be used....
  user : userReducer,
  theme : themeReducer,
});

const persistConfig = {
  key : 'root',
  storage,
  version : 1,
};

const persistedReducer =  persistReducer(persistConfig , rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) => getDefaultMiddleware({ // Middle Ware is added in order to avoid the errors
    serializableCheck : false,
  }),
});

export const persistor = persistStore(store);
