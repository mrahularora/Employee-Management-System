import { useState } from "react";
import { Dices, RotateCcw } from "lucide-react";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import {
  canAfford,
  COSTS,
  createBoard,
  createPlayers,
  payCost,
  produceResources,
  RESOURCE_KEYS,
  seedStartingSettlements,
} from "../utils/catanGame.mjs";
import "../Catan.css";

const RESOURCE_LABELS = {
  wood: "Wood",
  brick: "Brick",
  grain: "Grain",
  wool: "Wool",
  ore: "Ore",
  desert: "Desert",
};
const ROW_LENGTHS = [3, 4, 5, 4, 3];

const boardRows = (tiles) => {
  let offset = 0;
  return ROW_LENGTHS.map((length) => {
    const row = tiles.slice(offset, offset + length);
    offset += length;
    return row;
  });
};

const Catan = () => {
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [game, setGame] = useState(null);
  const [tradeFrom, setTradeFrom] = useState("wood");
  const [tradeTo, setTradeTo] = useState("brick");

  const startGame = (event) => {
    event?.preventDefault();
    setGame({
      tiles: seedStartingSettlements(createBoard()),
      players: createPlayers(names),
      currentPlayer: 0,
      rolled: false,
      lastRoll: null,
      selectedTile: null,
      message: `${names[0].trim() || "Player 1"} starts the game.`,
      winner: null,
    });
  };

  const updatePlayer = (state, nextPlayer, message, tiles = state.tiles) => ({
    ...state,
    players: state.players.map((player, index) => index === state.currentPlayer ? nextPlayer : player),
    tiles,
    message,
    winner: nextPlayer.score >= 7 ? nextPlayer.name : state.winner,
  });

  const rollDice = () => {
    setGame((state) => {
      if (state.rolled || state.winner) return state;
      const roll = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
      const players = roll === 7 ? state.players : produceResources(state.players, state.tiles, roll);
      return {
        ...state,
        players,
        rolled: true,
        lastRoll: roll,
        message: roll === 7 ? "A 7 was rolled. No resources were produced." : `Production roll: ${roll}.`,
      };
    });
  };

  const buildRoad = () => {
    setGame((state) => {
      const player = state.players[state.currentPlayer];
      if (!state.rolled || state.winner || !canAfford(player.resources, COSTS.road)) return state;
      const roads = player.roads + 1;
      const nextPlayer = {
        ...player,
        resources: payCost(player.resources, COSTS.road),
        roads,
        score: player.score + (roads === 5 ? 2 : 0),
      };
      return updatePlayer(state, nextPlayer, roads === 5 ? "Longest road earned 2 points." : "Road built.");
    });
  };

  const buildSettlement = () => {
    setGame((state) => {
      const tile = state.tiles.find(({ id }) => id === state.selectedTile);
      const player = state.players[state.currentPlayer];
      if (!state.rolled || state.winner || !tile || tile.owner !== null || tile.resource === "desert" || !canAfford(player.resources, COSTS.settlement)) return state;
      const nextPlayer = {
        ...player,
        resources: payCost(player.resources, COSTS.settlement),
        score: player.score + 1,
      };
      const tiles = state.tiles.map((current) => current.id === tile.id ? { ...current, owner: state.currentPlayer } : current);
      return { ...updatePlayer(state, nextPlayer, `Settlement built on ${RESOURCE_LABELS[tile.resource]}.`, tiles), selectedTile: null };
    });
  };

  const buildCity = () => {
    setGame((state) => {
      const tile = state.tiles.find(({ id }) => id === state.selectedTile);
      const player = state.players[state.currentPlayer];
      if (!state.rolled || state.winner || !tile || tile.owner !== state.currentPlayer || tile.city || !canAfford(player.resources, COSTS.city)) return state;
      const nextPlayer = {
        ...player,
        resources: payCost(player.resources, COSTS.city),
        score: player.score + 1,
      };
      const tiles = state.tiles.map((current) => current.id === tile.id ? { ...current, city: true } : current);
      return { ...updatePlayer(state, nextPlayer, "Settlement upgraded to a city.", tiles), selectedTile: null };
    });
  };

  const tradeWithBank = () => {
    setGame((state) => {
      const player = state.players[state.currentPlayer];
      if (!state.rolled || state.winner || tradeFrom === tradeTo || player.resources[tradeFrom] < 4) return state;
      const resources = { ...player.resources };
      resources[tradeFrom] -= 4;
      resources[tradeTo] += 1;
      return updatePlayer(state, { ...player, resources }, `Traded 4 ${RESOURCE_LABELS[tradeFrom]} for 1 ${RESOURCE_LABELS[tradeTo]}.`);
    });
  };

  const endTurn = () => {
    setGame((state) => {
      if (!state.rolled || state.winner) return state;
      const nextPlayer = state.currentPlayer === 0 ? 1 : 0;
      return {
        ...state,
        currentPlayer: nextPlayer,
        rolled: false,
        selectedTile: null,
        message: `${state.players[nextPlayer].name}'s turn.`,
      };
    });
  };

  const activePlayer = game?.players[game.currentPlayer];
  const selectedTile = game?.tiles.find(({ id }) => id === game.selectedTile);

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <main className="catan-page">
        <section className="ems-home-hero catan-hero">
          <p className="ems-kicker">Board games</p>
          <h1>Catan Resource Race</h1>
          <p>Build a local two-player settlement network through resource production, construction, and bank trades.</p>
        </section>

        {!game ? (
          <form className="catan-setup" onSubmit={startGame}>
            <div>
              <p className="ems-kicker">New game</p>
              <h2>Choose players</h2>
            </div>
            {names.map((name, index) => (
              <label key={index} htmlFor={`catan-player-${index}`}>
                Player {index + 1}
                <input
                  id={`catan-player-${index}`}
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
          <section className="catan-game" aria-label="Catan Resource Race game">
            <header className="catan-game-header">
              <div>
                <p className="ems-kicker">First to 7 points</p>
                <h2>{game.winner ? `${game.winner} wins` : `${activePlayer.name}'s turn`}</h2>
                <p className="catan-message" aria-live="polite">{game.message}</p>
              </div>
              <button type="button" className="catan-reset" onClick={startGame} title="Restart game" aria-label="Restart game">
                <RotateCcw size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="catan-player-strip">
              {game.players.map((player, index) => (
                <article key={index} className={`${index === game.currentPlayer ? "current" : ""} player-${index + 1}`}>
                  <strong>{player.name}</strong>
                  <span>{player.score} points</span>
                  <small>{player.roads} roads</small>
                </article>
              ))}
            </div>

            <div className="catan-layout">
              <div className="catan-board" aria-label="Resource tile board">
                {boardRows(game.tiles).map((row, rowIndex) => (
                  <div className="catan-board-row" key={rowIndex}>
                    {row.map((tile) => (
                      <button
                        type="button"
                        key={tile.id}
                        className={`catan-hex ${tile.resource}${game.selectedTile === tile.id ? " selected" : ""}${tile.owner !== null ? ` owned player-${tile.owner + 1}` : ""}`}
                        onClick={() => setGame((state) => ({ ...state, selectedTile: tile.id }))}
                        aria-pressed={game.selectedTile === tile.id}
                        aria-label={`${RESOURCE_LABELS[tile.resource]} tile${tile.number ? ` number ${tile.number}` : ""}${tile.owner !== null ? ` owned by ${game.players[tile.owner].name}${tile.city ? " with city" : ""}` : " unclaimed"}`}
                        disabled={Boolean(game.winner)}
                      >
                        <span className="catan-resource">{RESOURCE_LABELS[tile.resource]}</span>
                        {tile.number && <strong className="catan-number">{tile.number}</strong>}
                        {tile.owner !== null && <small>P{tile.owner + 1}{tile.city ? " City" : ""}</small>}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <aside className="catan-controls">
                <div className="catan-dice-row">
                  <span className="catan-die" aria-live="polite">{game.lastRoll || "-"}</span>
                  <button type="button" className="ems-button" onClick={rollDice} disabled={game.rolled || Boolean(game.winner)}>
                    <Dices size={18} aria-hidden="true" /> Roll Dice
                  </button>
                </div>

                <section className="catan-inventory" aria-label={`${activePlayer.name} resources`}>
                  {RESOURCE_KEYS.map((resource) => (
                    <div key={resource} className={resource}>
                      <span>{RESOURCE_LABELS[resource]}</span>
                      <strong>{activePlayer.resources[resource]}</strong>
                    </div>
                  ))}
                </section>

                <div className="catan-selection">
                  <span>Selected tile</span>
                  <strong>{selectedTile ? `${RESOURCE_LABELS[selectedTile.resource]}${selectedTile.number ? ` ${selectedTile.number}` : ""}` : "None"}</strong>
                </div>

                <div className="catan-actions">
                  <button type="button" onClick={buildRoad} disabled={!game.rolled || Boolean(game.winner) || !canAfford(activePlayer.resources, COSTS.road)}>Build Road</button>
                  <button type="button" onClick={buildSettlement} disabled={!game.rolled || Boolean(game.winner) || !selectedTile || selectedTile.owner !== null || selectedTile.resource === "desert" || !canAfford(activePlayer.resources, COSTS.settlement)}>Build Settlement</button>
                  <button type="button" onClick={buildCity} disabled={!game.rolled || Boolean(game.winner) || !selectedTile || selectedTile.owner !== game.currentPlayer || selectedTile.city || !canAfford(activePlayer.resources, COSTS.city)}>Upgrade City</button>
                </div>

                <div className="catan-trade">
                  <select value={tradeFrom} onChange={(event) => setTradeFrom(event.target.value)} aria-label="Trade resource">
                    {RESOURCE_KEYS.map((resource) => <option value={resource} key={resource}>{RESOURCE_LABELS[resource]}</option>)}
                  </select>
                  <span>4 for 1</span>
                  <select value={tradeTo} onChange={(event) => setTradeTo(event.target.value)} aria-label="Receive resource">
                    {RESOURCE_KEYS.map((resource) => <option value={resource} key={resource}>{RESOURCE_LABELS[resource]}</option>)}
                  </select>
                  <button type="button" onClick={tradeWithBank} disabled={!game.rolled || Boolean(game.winner) || tradeFrom === tradeTo || activePlayer.resources[tradeFrom] < 4}>Trade</button>
                </div>

                <button type="button" className="ems-button catan-end-turn" onClick={endTurn} disabled={!game.rolled || Boolean(game.winner)}>End Turn</button>
              </aside>
            </div>
          </section>
        )}
      </main>
      <EmployeeFooter />
    </div>
  );
};

export default Catan;
