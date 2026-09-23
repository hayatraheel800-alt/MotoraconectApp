import React,{createContext,useContext} from "react";
import {colors,spacing,radius,typography} from "@motoraconect/ui";
const theme={colors,spacing,radius,typography}; type Theme=typeof theme; const ThemeContext=createContext<Theme>(theme);
export function ThemeProvider({children}:{children:React.ReactNode}){return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>}
export function useTheme():Theme{return useContext(ThemeContext)}