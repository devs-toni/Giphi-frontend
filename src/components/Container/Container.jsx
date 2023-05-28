import st from "./Container.module.css"
import { EditModal } from '../EditModal/EditModal';
import { useState } from 'react';
import { Gif } from '../Gif/Gif';
import { v4 as uuidv4 } from 'uuid'

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
              key={uuidv4()}
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

