import { useEffect, useState } from "react"
import { Container } from "../../Container/Container"
import { Nav } from "../../Nav/Nav"
import { COMPONENT_TYPES } from "../../types"
import st from "./Home.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useData } from "../../../context/DataContext"
import { useAuth } from "../../../context/AuthContext"

export const Home = () => {


  const [section, setSection] = useState(COMPONENT_TYPES.EXPLORER)

  const { dataState } = useData()
  const { authState } = useAuth()

  const [list, setList] = useState(dataState.gifs ? dataState.gifs : [])

  useEffect(() => {
    if (authState.isAuthenticated) {
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
    } else
      setList(dataState.gifs)
      
  }, [section, dataState.gifs, dataState.userGifs, dataState.otherGifs, authState.isAuthenticated])

  return (
    <>
      <div className={st.searchContainer}>
        <FontAwesomeIcon className={st.searchIcon} icon={faSearch} />
        <input className={st.search} />
      </div>
      <Nav section={section} setSection={setSection} />
      <Container gifs={list} section={section} />
    </>
  )
}