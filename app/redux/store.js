import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import taskReducer from "./reducers";

const rootReducer = combineReducers({ taskReducer });

// use of middleware is to extend the functionality of redux as it allows store to interact with entire application as async requests
// also it allows to dispatch actions asynchronously and in async ajax calls
export const Store = createStore(rootReducer, applyMiddleware(thunk));
