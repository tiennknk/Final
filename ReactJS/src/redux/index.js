import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import rootReducer from './reducers';

const reduxStore = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const persistor = persistStore(reduxStore);

export { reduxStore as default, persistor };