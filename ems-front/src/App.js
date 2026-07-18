import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Create from './pages/Create';
import ListPage from './pages/ListPage';
import Recreation from './pages/Recreation';
import Community from './pages/Community';
import TicTacToe from './pages/Tictactoe';
import Error404 from './pages/Error404';
import BoardGames from "./pages/BoardGames";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedPage = (page) => <ProtectedRoute>{page}</ProtectedRoute>;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route index element={protectedPage(<ListPage />)} />
          <Route path="/admin" element={protectedPage(<Admin />)} />
          <Route path="/create" element={protectedPage(<Create />)} />
          <Route path="/listpage" element={protectedPage(<ListPage />)} />
          <Route path="/recreation" element={protectedPage(<Recreation />)} />
          <Route path="/community" element={protectedPage(<Community />)} />
          <Route path="/tictactoe" element={protectedPage(<TicTacToe />)} />
          <Route path="/recreation/boardgames" element={protectedPage(<BoardGames />)} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
