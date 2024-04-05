import React, { useReducer } from "react";

const ReducerCounter = () => {
  const initialState = {
    count: 0,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "Inc":
        return { count: state.count + 1 };
      case "Dec":
        return { count: state.count - 1 };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState );
  console.log("state ", state);
  return (
    <>
      <h1>{state.count}</h1>
      <button onClick={() => dispatch({ type: "Inc" })}>Inc</button>
      <button onClick={() => dispatch({ type: "Dec" })}>minus</button>
    </>
  );
};

export default ReducerCounter;
