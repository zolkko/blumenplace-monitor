import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import monitorApp from "./reducers";


const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
};

let store = createStore(monitorApp, applyMiddleware(thunk, logger));

export default store;
