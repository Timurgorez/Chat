import { combineReducers } from 'redux';

import apiDataReducer from "./apiData/reducers/apiDataReducer";
import AppHelperReducers from "./appHelpers/reducers/appHelperReducers";

const rootReducer = combineReducers({
    api: apiDataReducer,
    helper: AppHelperReducers
});

export default rootReducer