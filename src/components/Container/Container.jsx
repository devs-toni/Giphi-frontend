import { v4 as uuidv4 } from 'uuid';
import st from "./Container.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useData } from '../../context/DataContext';
import Swal from 'sweetalert2';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { useFetchGifDelete } from '../../hooks/useFetchGifDelete';
import { EditModal } from '../EditModal/EditModal';
import { useState } from 'react';

export const Container = ({ gifs }) => {


  const { getUserGifs } = useData()
  const { success, failure, askForDelete } = useToast()
  const { authState } = useAuth()
  const { fetchGifDelete } = useFetchGifDelete()

  const [isEditShow, setIsEditShow] = useState(false)
  const [editId, setEditId] = useState("")
  const [editTitle, setEditTitle] = useState("")

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

  return (
    <div className={st.container}>
      {
        gifs?.length > 0 &&
        gifs?.map(({ _id, title, gif, userId }) => {
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
              <img className={st.gifImage} src={gif} alt={title} />
            </div>
          )
        })
      }
      <EditModal show={isEditShow} setShow={setIsEditShow} id={editId} title={editTitle} />
    </div>
  )
}

