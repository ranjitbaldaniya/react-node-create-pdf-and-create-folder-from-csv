import React, { createContext, useState } from "react";

export const UserContext = createContext();

const LoginContext = ({ children }) => {
  const [user, ] = useState({ name: "ranjit" });

  return (
    <>
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    </>
  );
};

export default LoginContext;
