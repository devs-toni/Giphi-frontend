import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import st from "./CrudMenu.module.css"
import { faAdd } from "@fortawesome/free-solid-svg-icons"
import { Button, Modal } from "flowbite-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useFetchGifSave } from "../../hooks/useFetchGifSave"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../hooks/useToast"
import { useData } from "../../context/DataContext"

export const CrudMenu = ({ openAdd }) => {

  const { fetchGifSave } = useFetchGifSave()
  const { authState } = useAuth()
  const { addUserGif } = useData()

  const { failure, success } = useToast()

  const [show, setShow] = useState(false)
  const { register, handleSubmit } = useForm()

  const submit = ({ gif }) => {
    fetchGifSave(gif[0], authState.token)
      .then(({ status, data }) => {
        if (status !== 500) {
          success("File uploaded successfully!")
          addUserGif()
        } else
          failure("File aleady exists")

      })
    setShow(false)
  }


  return (
    <div className={st.menu}>
      <FontAwesomeIcon onClick={() => setShow(true)} className={st.add} icon={faAdd} />

      <Modal
        onClose={() => setShow(false)}
        dismissible
        show={show}
      >
        <form onSubmit={handleSubmit((data) => submit(data))}>
          <Modal.Header>
            Add GIF
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-8">
              <input type="file" accept="image/png, image/gif, image/jpg, image/jpeg" name="upload" {...register("gif")} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
            >
              Upload
            </Button>
            <Button
              color="gray"
              onClick={() => setShow(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}