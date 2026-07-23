import { useState } from "react";
import { Castle, Church, RotateCcw, RotateCw, Route } from "lucide-react";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import {
  canPlaceFollower,
  createCarcassonneGame,
  discardTile,
  hasAnyPlacement,
  legalPlacements,
  placeTile,
  rotateTile,
  tileFeatures,
} from "../utils/carcassonneGame.mjs";
import "../Carcassonne.css";

const FEATURE_LABELS = { road: "Road", city: "City", monastery: "Monastery" };

const TileGraphic = ({ tile }) => {
  const Icon = tile.center === "monastery" ? Church : tile.center === "city" ? Castle : tile.center !== "field" ? Route : null;
  return (
    <span className="carcassonne-tile-art" aria-hidden="true">
      {Object.entries(tile.edges).map(([side, feature]) => (
        <i key={side} className={`tile-edge ${side} ${feature}`} />
      ))}
      {Icon && <Icon className={`tile-landmark ${tile.center}`} />}
      {tile.follower && <b className={`tile-follower player-${tile.follower.player + 1}`}>{tile.follower.player + 1}</b>}
    </span>
  );
};

const Carcassonne = () => {
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [game, setGame] = useState(null);
  const [selected, setSelected] = useState(null);
  const [follower, setFollower] = useState("");

  const startGame = (event) => {
    event?.preventDefault();
    setGame(createCarcassonneGame(names));
    setSelected(null);
    setFollower("");
  };

  const rotateCurrentTile = () => {
    setGame((state) => ({ ...state, currentTile: rotateTile(state.currentTile), message: "Tile rotated clockwise." }));
    setSelected(null);
    setFollower("");
  };

  const placeCurrentTile = () => {
    if (!selected) return;
    setGame((state) => placeTile(state, selected.row, selected.col, follower || null));
    setSelected(null);
    setFollower("");
  };

  const activePlayer = game?.players[game.currentPlayer];
  const legal = game ? new Set(legalPlacements(game.board, game.currentTile).map(({ row, col }) => `${row},${col}`)) : new Set();
  const followerOptions = game && selected && activePlayer.followers
    ? tileFeatures(game.currentTile).filter((feature) => canPlaceFollower(game.board, game.currentTile, selected.row, selected.col, feature))
    : [];

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <main className="carcassonne-page">
        <section className="ems-home-hero carcassonne-hero">
          <p className="ems-kicker">Board games</p>
          <h1>Carcassonne Landscape Duel</h1>
          <p>Rotate and connect landscape tiles, claim features with followers, and complete the highest-scoring map.</p>
        </section>

        {!game ? (
          <form className="carcassonne-setup" onSubmit={startGame}>
            <div>
              <p className="ems-kicker">New game</p>
              <h2>Choose builders</h2>
            </div>
            {names.map((name, index) => (
              <label key={index} htmlFor={`carcassonne-player-${index}`}>
                Player {index + 1}
                <input
                  id={`carcassonne-player-${index}`}
                  value={name}
                  onChange={(event) => setNames(names.map((current, nameIndex) => nameIndex === index ? event.target.value : current))}
                  maxLength="24"
                  autoComplete="off"
                  required
                />
              </label>
            ))}
            <button type="submit" className="ems-button">Start Game</button>
          </form>
        ) : (
          <section className="carcassonne-game" aria-label="Carcassonne landscape game">
            <header className="carcassonne-game-header">
              <div>
                <p className="ems-kicker">Turn {game.turn}</p>
                <h2>{game.finished ? game.winner === "Tie game" ? game.winner : `${game.winner} wins` : `${activePlayer.name}'s turn`}</h2>
                <p className="carcassonne-message" aria-live="polite">{game.message}</p>
              </div>
              <button type="button" className="carcassonne-reset" onClick={startGame} title="Restart game" aria-label="Restart game">
                <RotateCcw size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="carcassonne-player-strip">
              {game.players.map((player, index) => (
                <article key={index} className={`player-${index + 1}${index === game.currentPlayer && !game.finished ? " current" : ""}`}>
                  <strong>{player.name}</strong>
                  <span>{player.score} points</span>
                  <small>{player.followers} followers</small>
                </article>
              ))}
            </div>

            <div className="carcassonne-layout">
              <div className="carcassonne-board" aria-label="Carcassonne tile board">
                {game.board.map((line, row) => line.map((tile, col) => {
                  const key = `${row},${col}`;
                  const isLegal = legal.has(key);
                  const isSelected = selected?.row === row && selected?.col === col;
                  return (
                    <button
                      type="button"
                      key={key}
                      className={`carcassonne-cell${tile ? " occupied" : " empty"}${isLegal ? " legal" : ""}${isSelected ? " selected" : ""}`}
                      onClick={() => {
                        setSelected({ row, col });
                        setFollower("");
                      }}
                      disabled={Boolean(tile) || !isLegal || game.finished}
                      aria-pressed={isSelected}
                      aria-label={tile ? `${tile.label} at row ${row + 1}, column ${col + 1}${tile.follower ? `, claimed by ${game.players[tile.follower.player].name}` : ""}` : `Row ${row + 1}, column ${col + 1}${isLegal ? ", legal placement" : ", unavailable"}`}
                    >
                      {tile && <TileGraphic tile={tile} />}
                    </button>
                  );
                }))}
              </div>

              <aside className="carcassonne-controls">
                {!game.finished ? (
                  <>
                    <div className="carcassonne-current-tile">
                      <div>
                        <p className="ems-kicker">Current tile</p>
                        <h3>{game.currentTile.label}</h3>
                      </div>
                      <TileGraphic tile={game.currentTile} />
                      <button type="button" className="carcassonne-rotate" onClick={rotateCurrentTile} title="Rotate tile clockwise" aria-label="Rotate tile clockwise">
                        <RotateCw size={20} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="carcassonne-placement">
                      <span>Selected space</span>
                      <strong>{selected ? `Row ${selected.row + 1}, column ${selected.col + 1}` : "None"}</strong>
                    </div>

                    <label className="carcassonne-follower" htmlFor="carcassonne-follower">
                      Follower
                      <select id="carcassonne-follower" value={follower} onChange={(event) => setFollower(event.target.value)} disabled={!selected || !activePlayer.followers}>
                        <option value="">No follower</option>
                        {followerOptions.map((feature) => <option key={feature} value={feature}>{FEATURE_LABELS[feature]}</option>)}
                      </select>
                    </label>

                    <button type="button" className="ems-button carcassonne-place" onClick={placeCurrentTile} disabled={!selected}>Place Tile</button>
                    <button
                      type="button"
                      className="carcassonne-discard"
                      onClick={() => setGame(discardTile)}
                      disabled={hasAnyPlacement(game.board, game.currentTile)}
                    >
                      Discard Unplayable Tile
                    </button>

                    <div className="carcassonne-deck-status">
                      <span>Tiles remaining</span>
                      <strong>{game.deck.length + 1}</strong>
                    </div>
                  </>
                ) : (
                  <div className="carcassonne-finished">
                    <p className="ems-kicker">Landscape complete</p>
                    <h3>{game.winner}</h3>
                    <button type="button" className="ems-button" onClick={startGame}>Play Again</button>
                  </div>
                )}

                <div className="carcassonne-legend" aria-label="Tile feature legend">
                  <span><i className="city" />City</span>
                  <span><i className="road" />Road</span>
                  <span><i className="field" />Field</span>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>
      <EmployeeFooter />
    </div>
  );
};

export default Carcassonne;
