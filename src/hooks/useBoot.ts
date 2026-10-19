import { createContext, useContext } from 'react'

/** True once the boot loader has finished — hero intro animations wait for it. */
export const BootContext = createContext(true)
export const useBooted = () => useContext(BootContext)
