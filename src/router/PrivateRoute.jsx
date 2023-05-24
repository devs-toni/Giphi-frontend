import { Authentication } from "../components/pages/Authentication/Authentication"
import { useAuth } from "../context/AuthContext"

export const PrivateRoute = ({ children }) => {

  const { authState } = useAuth()

  return authState.isAuthenticated ? children : <Authentication />
}
