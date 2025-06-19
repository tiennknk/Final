import { logger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { persistStore } from 'redux-persist';
import createRootReducer from './store/reducers/rootReducer';
import actionTypes from './store/actions/actionTypes';

export const history = createBrowserHistory({ basename: process.env.REACT_APP_ROUTER_BASE_NAME });

const reduxStateSyncConfig = {
    whitelist: [
        actionTypes.APP_START_UP_COMPLETE,
    ]
};

const rootReducer = createRootReducer(history);
const middleware = [
    routerMiddleware(history),
    thunkMiddleware,
    createStateSyncMiddleware(reduxStateSyncConfig),
    // logger, // bật nếu cần debug log redux
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware)),
);

export const persistor = persistStore(reduxStore);

export default reduxStore;