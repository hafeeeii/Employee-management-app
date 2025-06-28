'use client'
import { User } from "@/lib/session";
import { createContext, ReactNode, useContext } from "react";


const UserContext = createContext<{user:User | null}>({
    user:null
})

export const UserProvider = ({user, children}:{
    user:User | null,
    children: ReactNode
}) => {
    return (
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)