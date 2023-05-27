import { v4 as uuidv4 } from 'uuid';
import st from "./Container.module.css"
import { COMPONENT_TYPES } from '../types';
import { CrudMenu } from '../CrudMenu/CrudMenu';

export const Container = ({ gifs, section }) => {


  const isMySection = section === COMPONENT_TYPES.MY ? true : false

  return (
    <div className={st.container}>
      {
        isMySection
        &&
        (
          <>
            <div>
              <CrudMenu />
            </div>
          </>
        )
      }
      {
        gifs?.length > 0 &&
        gifs?.map(({ title, gif }) => {
          return (
            <div className={st.gifContainer} key={uuidv4()}>
              <p className={st.gifTitle}>{title}</p>
              <img className={st.gifImage} src={gif} alt={title} />
            </div>
          )
        })
      }
    </div>
  )
}

