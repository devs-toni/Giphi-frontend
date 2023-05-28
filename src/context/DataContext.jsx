import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { TYPES } from "./types";
import axios from "axios";
import { useAuth } from "./AuthContext";

const DataContext = createContext()

export const useData = () => {
  return useContext(DataContext)
}

export const DataProvider = ({ children }) => {

  const { authState } = useAuth()

  const fetchGifGetAll = async () => {
    axios.get(process.env.REACT_APP_BACKEND_URL + "/gifs").then(({ data }) => {
      dispatch({ type: TYPES.SET_GIFS, payload: data.filter(it => typeof it.userId === "undefined") })
      dispatch({ type: TYPES.SET_USER_GIFS, payload: data.filter(it => it?.userId == authState.user.id) })
      dispatch({ type: TYPES.SET_OTHER_GIFS, payload: data.filter(it => it?.userId !== authState.user.id && typeof it.userId !== "undefined") })
    })
  }

  useEffect(() => {
    authState.user.id && fetchGifGetAll();
  }, [authState.user.id])


  const initialState = {
    gifs: [],
    userGifs: [],
    otherGifs: []
  }

  const reducer = (state, action) => {

    switch (action.type) {

      case TYPES.SET_GIFS:
        return {
          ...state,
          gifs: action.payload
        }

      case TYPES.SET_USER_GIFS:
        return {
          ...state,
          userGifs: action.payload
        }

      case TYPES.SET_OTHER_GIFS:
        return {
          ...state,
          otherGifs: action.payload
        }

      default:
        return
    }
  }

  const [dataState, dispatch] = useReducer(reducer, initialState)

  const getUserGifs = useCallback(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + '/gifs/' + authState.user.id, { headers: { "Authorization": authState.token } })
      .then(({ data }) => dispatch({ type: TYPES.SET_USER_GIFS, payload: data }))
  }, [authState.token, authState.user.id])


  const data = {
    dataState,
    getUserGifs,
  }

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}