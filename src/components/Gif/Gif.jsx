import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import st from "./Gif.module.css"
import { faClipboardCheck, faPaste, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useData } from '../../context/DataContext'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { useFetchGifDelete } from '../../hooks/useFetchGifDelete'
import { v4 as uuidv4 } from 'uuid'
import { useRef, useState } from "react"

export const Gif = ({ title, gif, _id, userId, setEditId, setEditTitle, setIsEditShow }) => {


  const { getUserGifs } = useData()
  const { success, failure, askForDelete } = useToast()
  const { authState } = useAuth()
  const { fetchGifDelete } = useFetchGifDelete()
  const imgRef = useRef()

  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleDelete = (id) => {
    askForDelete().then((result) => {
      if (result.isConfirmed) {
        fetchGifDelete(id, authState.token).then(({ status }) => {
          if (status === 200) {
            getUserGifs()
            success("Imagen eliminada!")
          } else failure("El servidor no está disponible!")
        })
      }
    })
  }

  const handleEdit = (id, title) => {
    setEditId(id)
    setEditTitle(title)
    setIsEditShow(true)
  }

  const getLink = (e) => {
    navigator.clipboard.writeText(imgRef.current.src)
    setIsCopied(true)
  }


  return (
    <div className={st.gifContainer} key={uuidv4()}>
      <div className={st.gifData} >
        {
          typeof userId !== "undefined" &&
          <p className={st.gifTitle}>{title.split(".")[0]}</p>
        }
        {
          (typeof userId !== "undefined" && userId === authState.user.id) &&
          <div className={st.gifMenu}>
            <FontAwesomeIcon onClick={() => handleEdit(_id, title)} className={st.iconMenu} icon={faPencil} />
            <FontAwesomeIcon className={st.iconMenu} icon={faTrash} onClick={() => handleDelete(_id)} />
          </div>
        }
      </div>
      <div onMouseEnter={() => {
        authState.isAuthenticated &&
          setIsVisible(true)
      }} onMouseLeave={() => {
        if (authState.isAuthenticated) {
          setIsVisible(false)
          setIsCopied(false)
        }
      }}>
        <img className={st.gifImage} src={gif} alt={title} ref={imgRef} />
        {
          !isCopied
            ?
            <FontAwesomeIcon className={`${st.pasteIcon} ${isVisible ? st.visible : ""} ${authState.isAuthenticated ? st.display : ""}`} icon={faPaste} onClick={getLink} />
            :
            <FontAwesomeIcon className={`${st.pasteIcon} ${isVisible ? st.visible : ""} ${authState.isAuthenticated ? st.display : ""}}`} icon={faClipboardCheck} />
        }
      </div>
    </div>
  )
}
