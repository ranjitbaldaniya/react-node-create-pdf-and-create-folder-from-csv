import React, { createContext, useReducer } from "react";

export const AuthContext = createContext();

const ContextAndReducer = ({ children }) => {
  const initialState = {
    email: "ranjit@gmail.com",
    password: "Test@123",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "Change":
        return { email: "ranjit", password: "Changed" };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
      <AuthContext.Provider value={{ ...state, dispatch }}>
        {children}
      </AuthContext.Provider>
  );
};

export default ContextAndReducer;
