import axios from "axios";
import { TYPES } from "./types";

const { createContext, useContext, useReducer, useCallback, useMemo, useEffect } = require("react");

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const storage_token = localStorage.getItem('giphi_token') || undefined;

export const AuthProvider = ({ children }) => {

  useEffect(() => {
    const validateUser = async () => {
      try {
        axios.post(import.meta.env.VITE_BACKEND + "users/validate", {}, {
          headers: {
            "Authorization": storage_token
          }
        })
          .then(({ data, status }) => {

            status === 200 &&
              refresh(data.id, {
                id: data.id,
                userName: data.user_name,
                email: data.email,
                role: data.role,
                type: data.type,
              });

          })
      } catch (error) {
        console.error(error)
      }
    }

    storage_token && validateUser();
  }, [])



  const initialState = {
    isAuthenticated: storage_token ? true : false,
    user: {
      id: -1,
      userName: "",
      email: "",
      type: "",
    },
    token: "",
    error: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {

      case TYPES.LOGIN_SUCCESS:
        return {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          error: "",
        };
      case TYPES.LOGIN_UNSUCCESS:
        return {
          ...state,
          error: action.payload,
        };
      case TYPES.LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          user: "",
          token: "",
          error: "",
        };
      case TYPES.RESET_ERROR:
        return {
          ...state,
          error: "",
        };

      case TYPES.REFRESH_PAGE:
        return {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          error: ""
        };

      default:
        return state;
    }
  };

  const [authState, dispatch] = useReducer(
    reducer,
    initialState
  );

  const login = useCallback((user, token, error) => {
    !error
      ?
      dispatch({ type: TYPES.LOGIN_SUCCESS, payload: { user, token } })
      :
      dispatch({ type: TYPES.LOGIN_ERROR, payload: error })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('giphi_token');
    dispatch({ type: TYPES.LOGOUT })
  }, []);

  const refresh = useCallback((id, user, error) => {
    !error
      ?
      dispatch({ type: TYPES.REFRESH_PAGE, payload: { id, user, storage_token } })
      :
      dispatch({ type: TYPES.LOGIN_ERROR, payload: error })
  }, [])


  const reset = useCallback(() => {
    dispatch({ type: TYPES.RESET_ERROR })
  }, [])

  const authData = useMemo(() => ({
    authState,
    refresh,
    login,
    logout,
    reset
  }), [authState, login, logout, reset, refresh]);

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
}