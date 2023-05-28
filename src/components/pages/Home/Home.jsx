import { useEffect, useRef, useState } from "react"
import { Container } from "../../Container/Container"
import { Nav } from "../../Nav/Nav"
import { COMPONENT_TYPES } from "../../types"
import st from "./Home.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useData } from "../../../context/DataContext"
import { useAuth } from "../../../context/AuthContext"
import { AddMenu } from "../../AddMenu/AddMenu"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

export const Home = () => {


  const [section, setSection] = useState(COMPONENT_TYPES.EXPLORER)

  const { dataState } = useData()
  const { authState } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q')

  const searchRef = useRef()

  const [list, setList] = useState(dataState.gifs ? dataState.gifs : [])

  useEffect(() => {

    switch (section) {
      case COMPONENT_TYPES.EXPLORER:
        return setList(dataState.gifs)

      case COMPONENT_TYPES.MY:
        return setList(dataState.userGifs)

      case COMPONENT_TYPES.USERS:
        return setList(dataState.otherGifs)

      default:
        return
    }

  }, [section, dataState.gifs, dataState.userGifs, dataState.otherGifs, authState.isAuthenticated])

  const search = ({ target }) => {

    setSearchParams({ q: target.value })

    switch (section) {
      case COMPONENT_TYPES.EXPLORER:
        if (target.value.length > 1) {
          axios.get(process.env.REACT_APP_BACKEND_URL + "/gifs/search/all/" + q).then(({ data }) => {
            setList(data);
          })
        } else setList(dataState.gifs)
        return

      case COMPONENT_TYPES.MY:
        if (target.value.length > 1) {
          axios.get(process.env.REACT_APP_BACKEND_URL + "/gifs/search/user/" + q, {
            headers: {
              "Authorization": authState.token
            }
          }).then(({ data }) => {
            setList(data);
          })
        } else setList(dataState.userGifs);
        return

      case COMPONENT_TYPES.USERS:
        if (target.value.length > 1) {

          axios.get(process.env.REACT_APP_BACKEND_URL + "/gifs/search/users/" + q).then(({ data }) => {
            setList(data.filter(it => it.userId !== authState.user.id));
          })
        } else setList(dataState.otherGifs)
        return

      default:
        return
    }
  }

  return (
    <>
      <div className={st.searchContainer}>
        <FontAwesomeIcon className={st.searchIcon} icon={faSearch} />
        <input value={q ? q : ""} className={st.search} onChange={search} ref={searchRef} />
      </div>
      <Nav section={section} setSection={setSection} />
      {
        (section === COMPONENT_TYPES.MY && authState.isAuthenticated)
        &&
        (
          <>
            <div className={st.menu}>
              <AddMenu />
            </div>
          </>
        )
      }

      <Container gifs={list} />
    </>
  )
}