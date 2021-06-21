import React from 'react';

import * as actionTypesAPI from '../actionTypes';

export const setChat = (chat) => {
    return {
        type: actionTypesAPI.SET_CHAT,
        payload: chat
    }
};
