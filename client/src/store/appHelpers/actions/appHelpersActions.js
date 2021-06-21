import {
    SHOW_LOADER, HIDE_LOADER, HIDE_ALERT,
    SHOW_ALERT
} from "../actionTypes";



export const showLoader = () => {
    return {
        type: SHOW_LOADER
    }
};


export const hideLoader = () => {
    return {
        type: HIDE_LOADER
    }
};


export const showAlert = (text, time = 3000) => {
    return dispatch => {
        dispatch({
            type: SHOW_ALERT,
            payload: text
        });
        // setTimeout(() => dispatch(hideAlert()), time);
    }
};


export const hideAlert = () => {
    return {
        type: HIDE_ALERT
    }
};
