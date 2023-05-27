import st from "./AddModal.module.css"

export const AddModal = ({ addIsOpen }) => {
  return (
    <div className={`${st.modal} ${addIsOpen ? st.open : ""}`}>
      <div className={st.modalScreen}>

      </div>
    </div>
  )
}
