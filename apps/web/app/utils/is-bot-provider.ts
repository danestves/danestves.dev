import { createContext, useContext } from "react"

export const IsBotContext = createContext(false)
export const IsBotProvider = IsBotContext.Provider
export const useIsBot = () => useContext(IsBotContext)
