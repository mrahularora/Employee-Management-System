import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Create from './pages/Create';
import ListPage from './pages/ListPage';
import Recreation from './pages/Recreation';
import Community from './pages/Community';
import TicTacToe from './pages/Tictactoe';
import Error404 from './pages/Error404';
import BoardGames from "./pages/BoardGames";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<ListPage />} />
         
          <Route path="/create" element={<Create />} />
          <Route path="/listpage" element={<ListPage />} />
          <Route path="/recreation" element={<Recreation />} />
          <Route path="/community" element={<Community />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/recreation/boardgames" element={<BoardGames/>} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
