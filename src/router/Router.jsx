import { Route, Routes } from "react-router-dom"
import { Home } from "../components/pages/Home/Home"
import { NotFound } from "../components/pages/NotFound/NotFound"
import { PrivateRoute } from "./PrivateRoute"

export const Router = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
