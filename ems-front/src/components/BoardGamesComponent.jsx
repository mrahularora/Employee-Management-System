import { Link } from 'react-router-dom';

const BoardGamesComponent = () => {
  return (
    <div>
      <h1 className="center">Board Games</h1>
      <ul>
        <li><Link to="/tictactoe">Tic Tac Toe</Link> - A simple game where players take turns marking spaces in a 3x3 grid, aiming to get three of their marks in a row.</li>
        <li>Catan (formerly known as Settlers of Catan) - A strategy game where players collect resources and build settlements on a fictional island.</li>
        <li>Ticket to Ride - A game where players collect train cards and claim railway routes across a map to complete destination tickets.</li>
        <li>Codenames - A word game where players give one-word clues to help their team guess the correct words on a grid.</li>
        <li>Carcassonne - A tile-placement game where players build cities, roads, and monasteries on a map and score points based on their placements.</li>
        <li>Pandemic - A cooperative game where players work together to stop global outbreaks of diseases by finding cures before time runs out.</li>
      </ul>
    </div>
  );
};

export default BoardGamesComponent;
