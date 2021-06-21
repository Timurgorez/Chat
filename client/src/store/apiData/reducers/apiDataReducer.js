import * as actionTypes from '../actionTypes';

const initialState = {
  chat: {},
  users: [],
  messages: [],
  name: '',
  roomId: null,
  isAuth: false
};

export default function apiDataReducer(state = initialState, action) {
    switch (action.type) {
      case actionTypes.SET_CHAT:
        return { ...state, chat: action.payload  };
        break;

      case actionTypes.SET_USERS:
        return { ...state, users: action.payload };
        break;

      case actionTypes.SET_MESSAGES:
        return { ...state, messages: action.payload  };
        break;

      case actionTypes.ADD_MESSAGE:
        return { ...state, messages: [ ...state.messages, action.payload ]  };
        break;

      case actionTypes.SET_IS_AUTH:
        return { ...state, isAuth: action.payload  };
        break;

      default:
            return state
    }
}