import axios from "axios";
import { API_URL } from "../config";

/* SELECTORS */
export const getRequest = ({ votes }, name) => votes.requests[name];
export const getVotes = ({ votes }) => votes.data;

/* ACTIONS */

// action name creator
const reducerName = "votes";
const createActionName = (name) => `app/${reducerName}/${name}`;

const START_REQUEST = createActionName("START_REQUEST");
const END_REQUEST = createActionName("END_REQUEST");
const ERROR_REQUEST = createActionName("ERROR_REQUEST");

export const LOAD_VOTES = createActionName("LOAD_VOTES");

export const startRequest = (payload) => ({ payload, type: START_REQUEST });
export const endRequest = (payload) => ({ payload, type: END_REQUEST });
export const errorRequest = (payload) => ({ payload, type: ERROR_REQUEST });

export const loadVotes = (payload) => ({ payload, type: LOAD_VOTES });

/* THUNKS */

export const loadVotesRequest = () => {
  return async (dispatch) => {
    dispatch(startRequest({ name: LOAD_VOTES }));
    try {
      let res = await axios.get(`${API_URL}/votes`);

      dispatch(loadVotes(res.data));
      dispatch(endRequest({ name: LOAD_VOTES }));
    } catch (e) {
      dispatch(errorRequest({ name: LOAD_VOTES, error: e.message }));
    }
  };
};

/* INITIAL STATE */

const initialState = {
  data: [],
  requests: [],
};

/* REDUCER */

export default function reducer(statePart = initialState, action = {}) {
  switch (action.type) {
    case LOAD_VOTES:
      return { ...statePart, data: [...action.payload] };
    case START_REQUEST:
      return {
        ...statePart,
        requests: {
          ...statePart.requests,
          [action.payload.name]: { pending: true, error: null, success: false },
        },
      };
    case END_REQUEST:
      return {
        ...statePart,
        requests: {
          ...statePart.requests,
          [action.payload.name]: { pending: false, error: null, success: true },
        },
      };
    case ERROR_REQUEST:
      return {
        ...statePart,
        requests: {
          ...statePart.requests,
          [action.payload.name]: {
            pending: false,
            error: action.payload.message,
            success: false,
          },
        },
      };
    default:
      return statePart;
  }
}
