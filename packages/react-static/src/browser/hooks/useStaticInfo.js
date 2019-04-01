import { useContext } from 'react'
import staticInfoContext from '../context/staticInfoContext'

export { staticInfoContext }

export const useStaticInfo = () => useContext(staticInfoContext)
