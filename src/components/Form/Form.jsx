import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useFetchUserRegister } from "../../hooks/useFetchUserRegister.js"
import { useToast } from "../../hooks/useToast.js"
import { COMPONENT_TYPES } from "../types.js"
import { useFetchUserAuthenticate } from "../../hooks/useFetchUserAuthenticate.js"
import { useAuth } from "../../context/AuthContext.jsx"

export const Form = ({ type }) => {

  const { register, handleSubmit } = useForm()
  const { fetchUserRegister } = useFetchUserRegister()
  const { fetchUserAuthenticate } = useFetchUserAuthenticate()
  const { success, failure } = useToast()

  const { login } = useAuth()

  const [isLogin, setIsLogin] = useState()
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: ""
  })

  const submit = ({ userName, email, password, rPassword }) => {
    console.log(userName)
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
          status === 200 &&
            login(data.user, data.token);
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
    <div>
      <form onSubmit={handleSubmit((data) => submit(data))}>
        {
          !isLogin &&
          (
            <div>
              <label htmlFor="userName">Username:</label>
              <input {...register("userName", { required: true })} type="text" id="userName" placeholder="pepito" />
              <span>{errors.userName}</span>
            </div>
          )
        }
        <div>
          <label htmlFor="email">Email:</label>
          <input {...register("email", { required: true })} type="email" id="email" placeholder="pepito" />
          <span>{errors.email}</span>
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input {...register("password", { required: true })} type="password" id="password" placeholder="pepito" />
          <span>{errors.password}</span>
        </div>
        {
          !isLogin &&
          (
            <div>
              <label htmlFor="rPassword">Repetir Contraseña:</label>
              <input {...register("rPassword", { required: true })} type="password" id="rPassword" placeholder="pepito" />
            </div>
          )
        }
        <p onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Aún no tienes una cuenta?" : "Ya estas registrado?"}</p>
        <input type="submit" value={isLogin ? "Login" : "Registro"} />
      </form >
    </div >
  )
}
