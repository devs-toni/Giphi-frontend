
export const useFetchGifSave = () => {

  const fetchGifSave = async (gif, token) => {
    const fd = new FormData()
    fd.append("gif", gif)

    return await fetch(process.env.REACT_APP_BACKEND_URL + "/gifs", {
      method: "POST",
      body: fd,
      headers: {
        "Authorization": token
      }
    })
  }

  return { fetchGifSave }
}