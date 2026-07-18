import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Create from './pages/Create';
import ListPage from './pages/ListPage';
import Recreation from './pages/Recreation';
import Community from './pages/Community';
import CommunityData from "./pages/CommunityData";
import TicTacToe from './pages/Tictactoe';
import Error404 from './pages/Error404';
import BoardGames from "./pages/BoardGames";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedPage = (page) => <ProtectedRoute>{page}</ProtectedRoute>;
const pageTitles = {
  "/": "Home",
  "/login": "Login",
  "/admin": "Admin Panel",
  "/create": "Add Employee",
  "/listpage": "Employee Directory",
  "/community": "Community",
  "/community-data": "Community Data",
  "/recreation": "Recreation",
  "/recreation/boardgames": "Board Games",
  "/tictactoe": "Tic Tac Toe",
};

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${pageTitles[pathname] || "Page Not Found"} | EMS`;
  }, [pathname]);

  return null;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("emsTheme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("emsTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="App">
      <BrowserRouter>
        <PageTitle />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route index element={protectedPage(<Home />)} />
          <Route path="/admin" element={protectedPage(<Admin />)} />
          <Route path="/create" element={protectedPage(<Create />)} />
          <Route path="/listpage" element={protectedPage(<ListPage />)} />
          <Route path="/recreation" element={protectedPage(<Recreation />)} />
          <Route path="/community" element={protectedPage(<Community />)} />
          <Route path="/community-data" element={protectedPage(<CommunityData />)} />
          <Route path="/tictactoe" element={protectedPage(<TicTacToe />)} />
          <Route path="/recreation/boardgames" element={protectedPage(<BoardGames />)} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setDarkMode((enabled) => !enabled)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
      </button>
    </div>
  );
}

export default App;
