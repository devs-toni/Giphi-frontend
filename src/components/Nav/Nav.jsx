import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useFetchGifSave } from "../../hooks/useFetchGifSave"
import { Link } from "react-router-dom"
import st from './Nav.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightToBracket, faArrowsRotate, faHandScissors, faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons"
import { COMPONENT_TYPES } from "../types"

export const Nav = ({ section, setSection }) => {

  const { authState, logout } = useAuth()
  const { fetchGifSave } = useFetchGifSave()

  const reloadDb = async () => {
    const giphyData = []

    await axios.get(process.env.REACT_APP_API_URL)
      .then(({ data }) => {
        data.data.map(it => {
          giphyData.push({
            title: it.title,
            type: it.type,
            gif: it.images["original"].url
          })
        })
      })

    async function toDataURL(url) {
      return await fetch(url).then(res => res.blob());
    }

    for (let i = 1; i < giphyData.length + 1; i++) {
      setTimeout(() => {
        toDataURL(giphyData[i - 1].gif).then(blob => {
          const image = new File([blob], giphyData[i - 1].title, { type: 'image/png' })
          if (image.size < 10485760) {
            fetchGifSave(image, authState.token)
          }
        })
      }, 2000 * i)
    }
  }

  return (
    <div className={st.navbar}>
      {
        authState.isAuthenticated
          ?
          <FontAwesomeIcon icon={faPersonWalkingArrowRight} className={st.btn} onClick={logout} />
          :
          <Link to="/login" className={st.btn && st.loginBtn}><FontAwesomeIcon icon={faArrowRightToBracket} /></Link>
      }
      <div className={st.navigator}>
        {
          authState.isAuthenticated
            ?
            <>
              <p className={st.user}><FontAwesomeIcon className={st.hand} icon={faHandScissors} /><span className={st.hello}>Bienvenido</span> Pepe!</p>
              <p
                onClick={() => setSection(COMPONENT_TYPES.EXPLORER)}
                className={`${st.title} ${st.hover} ${st.isLogged} ${section === COMPONENT_TYPES.EXPLORER ? st.selected : ""}`}
              >Explorer</p>
              <p
                onClick={() => setSection(COMPONENT_TYPES.MY)}
                className={`${st.title} ${st.hover} ${st.isLogged} ${section === COMPONENT_TYPES.MY ? st.selected : ""}`}
              >Your gifs</p>
              <p
                onClick={() => setSection(COMPONENT_TYPES.USERS)}
                className={`${st.title} ${st.hover} ${st.isLogged} ${section === COMPONENT_TYPES.USERS ? st.selected : ""}`}
              >User gifs</p>
            </>
            :
            <>
              <p className={st.title}>Explorer</p>
            </>
        }
      </div>
      {
        authState?.user?.role === "A"
          ?
          <FontAwesomeIcon icon={faArrowsRotate} className={`${st.reloadAdmin} ${st.btn}`} onClick={reloadDb} />
          :
          <div style={{ width: "111px" }}></div>
      }
    </div>
  )
}
