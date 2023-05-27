import { Route, Routes } from "react-router-dom"
import { Home } from "../components/pages/Home/Home"
import { NotFound } from "../components/pages/NotFound/NotFound"
import { Login } from "../components/Login/Login"

export const Router = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
