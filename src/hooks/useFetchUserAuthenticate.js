import axios from "axios"

export const useFetchUserAuthenticate = () => {

  const fetchUserAuthenticate = async (form) => {
    return await axios.post(process.env.REACT_APP_BACKEND_URL + "/users/auth", form)
  }

  return { fetchUserAuthenticate }
}