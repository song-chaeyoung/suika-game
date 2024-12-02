import React, { useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Start from "./pages/Start";
import Game from "./pages/Game";
import Result from "./pages/Result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
    // children: [
    //   {
    //     path: "game",
    //     element: <Game />,
    //   },
    //   {
    //     path: "result",
    //     element: <Result />,
    //   },
    // ],
  },
  {
    path: "game",
    element: <Game />,
  },
  {
    path: "result",
    element: <Result />,
  },
]);

export const ScoreContext = React.createContext();

const App = () => {
  const [score, setScore] = useState(0);

  return (
    <>
      <ScoreContext.Provider value={{ score, setScore }}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6024244883165619"
          data-ad-slot="YOUR_AD_SLOT_ID"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </ScoreContext.Provider>
    </>
  );
};

export default App;
