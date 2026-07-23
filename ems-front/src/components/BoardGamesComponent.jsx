import { Link } from 'react-router-dom';

const BoardGamesComponent = () => {
  return (
    <div>
      <h2 className="center">Board Games</h2>
      <ul>
        <li><Link to="/tictactoe">Tic Tac Toe</Link> - A simple game where players take turns marking spaces in a 3x3 grid, aiming to get three of their marks in a row.</li>
        <li><Link to="/recreation/boardgames/catan">Catan Resource Race</Link> - A two-player resource and settlement strategy game.</li>
        <li><Link to="/recreation/boardgames/ticket-to-ride">Ticket to Ride: Canada Routes</Link> - A two-player train card and route-claiming challenge.</li>
        <li><Link to="/recreation/boardgames/codenames">Codenames Team Challenge</Link> - A two-team clue and deduction word game.</li>
        <li>Carcassonne - A tile-placement game where players build cities, roads, and monasteries on a map and score points based on their placements.</li>
        <li>Pandemic - A cooperative game where players work together to stop global outbreaks of diseases by finding cures before time runs out.</li>
      </ul>
    </div>
  );
};

export default BoardGamesComponent;
