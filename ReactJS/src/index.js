import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxStore, { persistor, history } from './redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";
import App from './containers/App';

ReactDOM.render(
    <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
            <IntlProviderWrapper>
                <ConnectedRouter history={history}>
                    <App persistor={persistor} />
                </ConnectedRouter>
            </IntlProviderWrapper>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);