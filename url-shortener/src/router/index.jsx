import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ShortenerPage from "../pages/ShortenerPage";
import StatsPage from "../pages/StatsPage";
import RedirectPage from "../pages/RedirectPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <ShortenerPage />
      </App>
    ),
  },
  {
    path: "/stats",
    element: (
      <App>
        <StatsPage />
      </App>
    ),
  },
  {
    path: "/:code",
    element: <RedirectPage />,
  },
]);

export default router;
