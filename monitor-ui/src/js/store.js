import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import monitorApp from "reducers";


debugger;

let middleware = [thunk];

if ("production" !== process.env.NODE_ENV) {
    middleware.push(store => next => action => {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result;
    });
}

let store = createStore(monitorApp, applyMiddleware(...middleware));

export default store;
