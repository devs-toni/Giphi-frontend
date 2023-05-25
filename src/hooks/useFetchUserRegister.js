import axios from "axios"

export const useFetchUserRegister = () => {

  const fetchUserRegister = async (form) => {
    return await axios.post(process.env.REACT_APP_BACKEND_URL + '/users', form)
  }

  return { fetchUserRegister }
}