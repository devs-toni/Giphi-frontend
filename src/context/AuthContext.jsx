import axios from "axios";
import { TYPES } from "./types";

const { createContext, useContext, useReducer, useCallback, useMemo, useEffect } = require("react");

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const storage_token = JSON.parse(localStorage.getItem('giphi_token')) || undefined;

export const AuthProvider = ({ children }) => {

  useEffect(() => {
    const validateUser = async () => {
      try {
        axios.get(process.env.REACT_APP_BACKEND_URL + "/users/validate", {
          headers: {
            "Authorization": storage_token
          }
        })
          .then(({ data, status }) => {
              refresh({
                id: data.id,
                userName: data.userName,
                email: data.email,
                role: data.role
              }, null)
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
      role: "",
    },
    token: "",
    error: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {

      case TYPES.LOGIN_SUCCESS:
        localStorage.setItem("giphi_token", JSON.stringify(action.payload.token))
        return {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          error: "",
        };
      case TYPES.LOGIN_ERROR:
        return {
          ...state,
          error: action.payload,
        };
      case TYPES.LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          user: {
            id: -1,
            userName: "",
            email: "",
            role: "",
          },
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
          user: action.payload,
          token: storage_token,
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

  const refresh = useCallback((user, error) => {
    !error
      ?
      dispatch({ type: TYPES.REFRESH_PAGE, payload: user })
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