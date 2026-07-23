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
        <li><Link to="/recreation/boardgames/carcassonne">Carcassonne Landscape Duel</Link> - A two-player tile, follower, and feature-building challenge.</li>
        <li><Link to="/recreation/boardgames/pandemic">Pandemic Response Team</Link> - A cooperative two-role outbreak and cure challenge.</li>
      </ul>
    </div>
  );
};

export default BoardGamesComponent;
