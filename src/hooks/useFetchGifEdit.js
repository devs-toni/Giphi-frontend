import axios from "axios"

export const useFetchGifEdit = () => {

  const fetchGifEdit = async (id, data, token) => {

    return await axios.patch(process.env.REACT_APP_BACKEND_URL + "/gifs/" + id, data, {
      headers: {
        "Authorization": token
      }
    })
  }

  return { fetchGifEdit }
}