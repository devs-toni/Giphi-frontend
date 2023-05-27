import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useFetchUserRegister } from "../../hooks/useFetchUserRegister.js"
import { useToast } from "../../hooks/useToast.js"
import { COMPONENT_TYPES } from "../types.js"
import { useFetchUserAuthenticate } from "../../hooks/useFetchUserAuthenticate.js"
import { useAuth } from "../../context/AuthContext.jsx"
import { Link, useNavigate } from "react-router-dom"
import st from "./Form.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleLeft, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"

export const Form = ({ type }) => {

  const { register, handleSubmit } = useForm()
  const { fetchUserRegister } = useFetchUserRegister()
  const { fetchUserAuthenticate } = useFetchUserAuthenticate()
  const { success, failure } = useToast()

  const { login } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState()
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: ""
  })

  const submit = ({ userName, email, password, rPassword }) => {
    const errors = {}

    if (email.length < 4)
      errors.email = "El email debe tener al menos 4 caracteres"
    else
      errors.email = ""


    if (!isLogin) {
      if (password !== rPassword)
        errors.password = "Las contraseñas no coinciden"
      else
        errors.password = ""

      if (userName.length < 4)
        errors.userName = "El Username debe tener al menos 4 caracteres"
      else
        errors.userName = ""

      setErrors(errors)

      if (errors.userName.length === 0 && errors.email.length === 0 && errors.password.length === 0)
        fetchUserRegister({
          userName, email, password
        }).then(({ status, data }) => {
          status === 201 &&
            success("Ya puedes iniciar sesión!")
          return setIsLogin(true)
        }).catch(({ response }) => {
          response.status === 409
            ?
            failure("El usuario ya está registrado!")
            :
            failure("El servidor no está disponible!")

        })
    } else {
      if (errors.email.length === 0)
        fetchUserAuthenticate({
          email,
          password
        }).then(({ status, data }) => {
          if (status === 200) {
            login(data.user, data.token)
            navigate("/")
          }
        }).catch(({ response }) => {
          response.status === 401
            ?
            failure("Las credenciales no son correctas!")
            :
            failure("El servidor no está disponible!")
        })
    }

  }

  useEffect(() => {
    setIsLogin(type === COMPONENT_TYPES.LOGIN ? true : false)
  }, [type])

  return (
    <div className={st.formContainer}>
      <Link to="/"><FontAwesomeIcon className={st.back} icon={faArrowCircleLeft} /></Link>
      <form className={st.form} onSubmit={handleSubmit((data) => submit(data))}>
        {
          !isLogin &&
          (
            <div className={st.formSection}>
              <label className={st.label} htmlFor="userName">Username:</label>
              <input className={st.inputText} {...register("userName", { required: true })} type="text" id="userName" placeholder="" />
              <span className={st.error}>{errors.userName}</span>
            </div>
          )
        }
        <div className={st.formSection}>
          <label className={st.label} htmlFor="email">Email:</label>
          <input className={st.inputText} {...register("email")} type="email" id="email" placeholder="" required />
          <span className={st.error}>{errors.email}</span>
        </div>

        <div className={st.formSection}>
          <label className={st.label} htmlFor="password">Contraseña:</label>
          <input className={st.inputText} {...register("password")} type="password" id="password" placeholder="" required />
          <span className={st.error}>{errors.password}</span>
        </div>
        {
          !isLogin &&
          (
            <div className={st.formSection}>
              <label className={st.label} htmlFor="rPassword">Repetir Contraseña:</label>
              <input className={st.inputText} {...register("rPassword")} type="password" id="rPassword" placeholder="" required />
            </div>
          )
        }
        <p className={st.already} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Aún no tienes una cuenta?" : "Ya estas registrado?"}</p>
        <input className={st.submit} type="submit" value={isLogin ? "Login" : "Registro"} />
      </form >
    </div >
  )
}
