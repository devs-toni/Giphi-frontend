import { Button, Modal } from "flowbite-react"
import { useAuth } from "../../context/AuthContext"
import { useData } from "../../context/DataContext"
import { useToast } from "../../hooks/useToast"
import { useFetchGifEdit } from "../../hooks/useFetchGifEdit"
import { useEffect, useRef } from "react"


export const EditModal = ({ id, title, show, setShow }) => {

  const { fetchGifEdit } = useFetchGifEdit()

  const { authState } = useAuth()
  const { getUserGifs } = useData()
  const { failure, success } = useToast()

  const valRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()

    const titleValue = e.target.titleInput.value;

    fetchGifEdit(id, {
      title: titleValue
    }, authState.token)
      .then(({ status, data }) => {
        if (status !== 500) {
          success("Gif actulaizado correctamente!")
          getUserGifs()
          valRef.current.value = ""
        } else
          failure("El servidor no está disponible")

      })
    setShow(false)
  }

  useEffect(() => {
    if (valRef.current) valRef.current.value = title.split(".")[0]
  }, [title])



  return (
    <>
      <Modal
        onClose={() => setShow(false)}
        dismissible
        show={show}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            Edit GIF
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-8">
              <label>Nombre:</label>
              <input autoFocus defaultValue={title.split(".")[0]} type="text" name="titleInput" id="titleInput" minLength={5} ref={valRef} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
            >
              Edit
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
    </>
  )
}

