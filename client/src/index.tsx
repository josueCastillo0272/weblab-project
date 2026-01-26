import React from "react";
import App from "./components/App";
import Login from "./components/pages/Login/Login";
import Home from "./components/pages/Home/Home";
import NewQuest from "./components/pages/NewQuest/NewQuest";
import Messages from "./components/pages/Messages/Messages";
import Search from "./components/pages/Search/Search";
import Leaderboard from "./components/pages/Leaderboard/Leaderboard";
import Quests from "./components/pages/Quests/Quests";
import Profile from "./components/pages/Profile/Profile";
import AppLayout from "./components/pages/AppLayout";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/pages/NotFound";
import Signup from "./components/pages/Signup/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "/signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />, // contains sidebar in here
            children: [
              { path: "home", element: <Home /> },
              { path: "newquest", element: <NewQuest /> },
              { path: "messages", element: <Messages /> },
              { path: "messages/:recipientId", element: <Messages /> },
              { path: "search", element: <Search /> },
              { path: "leaderboard", element: <Leaderboard /> },
              { path: "quests", element: <Quests /> },
              { path: "profile/:username", element: <Profile /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const a = document.getElementById("root");
if (!a) throw new Error("Root element id not found");
createRoot(a).render(
  <GoogleOAuthProvider clientId="482293298213-1h679p3jh12e767tri4nbtnffig940mf.apps.googleusercontent.com">
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
