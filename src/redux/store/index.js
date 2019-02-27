import {createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import {AsyncStorage} from 'react-native';
import rootReducer from './../reducers';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);
  return {store, persistor};
};
