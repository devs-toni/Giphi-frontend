import st from "./Container.module.css"
import { EditModal } from '../EditModal/EditModal';
import { useState } from 'react';
import { Gif } from '../Gif/Gif';

export const Container = ({ gifs }) => {

  const [isEditShow, setIsEditShow] = useState(false)
  const [editId, setEditId] = useState("")
  const [editTitle, setEditTitle] = useState("")

  return (
    <div className={st.container}>
      {
        gifs?.length > 0 &&
        gifs?.map(({ _id, title, gif, userId }) => {
          return (
            <Gif
              _id={_id}
              title={title}
              gif={gif}
              userId={userId}
              setEditId={setEditId}
              setEditTitle={setEditTitle}
              setIsEditShow={setIsEditShow} />
          )
        })
      }
      <EditModal
        show={isEditShow}
        setShow={setIsEditShow}
        id={editId}
        title={editTitle}
      />
    </div>
  )
}

