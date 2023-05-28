import axios from "axios"

export const useFetchGifDelete = () => {

  const fetchGifDelete = async (id, token) => {
    return await axios.delete(process.env.REACT_APP_BACKEND_URL + "/gifs/" + id, {
      headers: {
        "Authorization": token
      }
    })
  }

  return { fetchGifDelete }
}