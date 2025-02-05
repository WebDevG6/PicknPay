import { createContext, useState } from "react";

export const authContext = createContext(null);

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    function updateUserInfo(data) {
        setUserInfo(data);
    }

    return <authContext.Provider value={{ userInfo, updateUserInfo }}>{children}</authContext.Provider>;
}
