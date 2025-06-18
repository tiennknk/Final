import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from './appReducer';
import userReducer from './userReducer';
import adminReducer from './adminReducer';


const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['isLoggedIn', 'userInfo'],
};

const rootReducer = combineReducers({
    app: appReducer,
    admin: adminReducer,
    user: persistReducer(userPersistConfig, userReducer),
});

export default rootReducer;