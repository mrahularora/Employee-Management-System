import { useState } from "react";
import {
  Activity,
  Building2,
  FlaskConical,
  HandHeart,
  RotateCcw,
  ShieldPlus,
} from "lucide-react";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import {
  buildStation,
  cardsOfColor,
  CITIES,
  createPandemicGame,
  cureCost,
  DISEASE_COLORS,
  discoverCure,
  endTurn,
  movePlayer,
  shareKnowledge,
  treatDisease,
} from "../utils/pandemicGame.mjs";
import "../Pandemic.css";

const COLOR_LABELS = { blue: "Blue", yellow: "Yellow", black: "Black", red: "Red" };
const CONNECTIONS = Object.entries(CITIES).flatMap(([cityId, city]) => city.links
  .filter((linkedId) => cityId < linkedId)
  .map((linkedId) => ({ from: cityId, to: linkedId })));

const Pandemic = () => {
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [game, setGame] = useState(null);
  const [cureColor, setCureColor] = useState("blue");

  const startGame = (event) => {
    event?.preventDefault();
    setGame(createPandemicGame(names));
    setCureColor("blue");
  };

  const activePlayer = game?.players[game.currentPlayer];
  const teammate = game?.players[game.currentPlayer === 0 ? 1 : 0];
  const currentCity = activePlayer ? game.cities[activePlayer.city] : null;
  const canAct = game && !game.finished && game.actionsRemaining > 0;
  const canShare = canAct && teammate.city === activePlayer.city && activePlayer.hand.includes(activePlayer.city);
  const canBuild = canAct && !currentCity.station && activePlayer.hand.includes(activePlayer.city);
  const canCure = canAct && currentCity.station && !game.cures[cureColor]
    && cardsOfColor(activePlayer, cureColor) >= cureCost(activePlayer);
  const infectionRate = game ? Math.min(4, 2 + Math.floor((game.turn - 1) / 4)) : 2;

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <main className="pandemic-page">
        <section className="ems-home-hero pandemic-hero">
          <p className="ems-kicker">Board games</p>
          <h1>Pandemic Response Team</h1>
          <p>Coordinate two specialists, contain connected outbreaks, and discover four cures before the decks run out.</p>
        </section>

        {!game ? (
          <form className="pandemic-setup" onSubmit={startGame}>
            <div>
              <p className="ems-kicker">New mission</p>
              <h2>Choose specialists</h2>
            </div>
            {names.map((name, index) => (
              <label key={index} htmlFor={`pandemic-player-${index}`}>
                {index === 0 ? "Medic" : "Scientist"}
                <input
                  id={`pandemic-player-${index}`}
                  value={name}
                  onChange={(event) => setNames(names.map((current, nameIndex) => nameIndex === index ? event.target.value : current))}
                  maxLength="24"
                  autoComplete="off"
                  required
                />
              </label>
            ))}
            <button type="submit" className="ems-button">Start Mission</button>
          </form>
        ) : (
          <section className="pandemic-game" aria-label="Pandemic cooperative game">
            <header className="pandemic-game-header">
              <div>
                <p className="ems-kicker">Turn {game.turn}</p>
                <h2>{game.finished ? game.status === "won" ? "Team victory" : "Global crisis lost" : `${activePlayer.name}'s turn`}</h2>
                <p className="pandemic-message" aria-live="polite">{game.message}</p>
              </div>
              <button type="button" className="pandemic-reset" onClick={startGame} title="Restart mission" aria-label="Restart mission">
                <RotateCcw size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="pandemic-status-strip">
              <div className="pandemic-cures" aria-label="Disease cures">
                {DISEASE_COLORS.map((color) => (
                  <span key={color} className={`${color}${game.cures[color] ? " cured" : ""}`}>
                    <i aria-hidden="true" />{COLOR_LABELS[color]} {game.cures[color] ? "cured" : "active"}
                  </span>
                ))}
              </div>
              <div className="pandemic-pressure">
                <span>Outbreaks <strong>{game.outbreaks}/4</strong></span>
                <span>Infection rate <strong>{infectionRate}</strong></span>
              </div>
            </div>

            <div className="pandemic-player-strip">
              {game.players.map((player, index) => (
                <article key={index} className={`player-${index + 1}${index === game.currentPlayer && !game.finished ? " current" : ""}`}>
                  <strong>{player.name}</strong>
                  <span>{player.role}</span>
                  <small>{CITIES[player.city].name} | {player.hand.length} cards</small>
                </article>
              ))}
            </div>

            <div className="pandemic-layout">
              <div className="pandemic-map" aria-label="Connected world disease map">
                <svg viewBox="0 0 1000 500" role="img" aria-label="World map with city connections">
                  <path className="pandemic-land" d="M55 95 L125 55 L265 70 L345 125 L305 190 L230 205 L185 270 L105 245 L55 170 Z M285 285 L370 270 L410 325 L380 465 L335 445 L310 365 Z M405 75 L505 55 L555 105 L530 155 L475 150 Z M450 175 L575 155 L635 240 L580 420 L500 400 L455 290 Z M545 70 L745 55 L940 105 L920 245 L805 270 L720 225 L635 245 L570 160 Z M820 340 L945 330 L970 435 L875 465 L815 410 Z" />
                  {CONNECTIONS.map(({ from, to }) => (
                    <line key={`${from}-${to}`} x1={CITIES[from].x} y1={CITIES[from].y} x2={CITIES[to].x} y2={CITIES[to].y} />
                  ))}
                </svg>

                {Object.entries(CITIES).map(([cityId, city]) => {
                  const reachable = CITIES[activePlayer.city].links.includes(cityId);
                  const occupants = game.players.map((player, index) => player.city === cityId ? index : null).filter((index) => index !== null);
                  return (
                    <button
                      type="button"
                      key={cityId}
                      className={`pandemic-city ${city.color}${reachable && canAct ? " reachable" : ""}`}
                      style={{ left: `${city.x / 10}%`, top: `${city.y / 5}%` }}
                      onClick={() => setGame((state) => movePlayer(state, cityId))}
                      disabled={!reachable || !canAct}
                      aria-label={`${city.name}, ${game.cities[cityId].cubes} disease cubes${game.cities[cityId].station ? ", research station" : ""}${occupants.length ? `, ${occupants.map((index) => game.players[index].name).join(" and ")}` : ""}${reachable && canAct ? ", reachable" : ""}`}
                    >
                      <span>{city.name}</span>
                      {game.cities[cityId].cubes > 0 && <b>{game.cities[cityId].cubes}</b>}
                      {game.cities[cityId].station && <Building2 className="pandemic-station" size={13} aria-hidden="true" />}
                      <i className="pandemic-pawns" aria-hidden="true">
                        {occupants.map((index) => <em key={index} className={`player-${index + 1}`}>{index + 1}</em>)}
                      </i>
                    </button>
                  );
                })}
              </div>

              <aside className="pandemic-controls">
                {!game.finished ? (
                  <>
                    <div className="pandemic-location">
                      <div>
                        <p className="ems-kicker">Current location</p>
                        <h3>{CITIES[activePlayer.city].name}</h3>
                      </div>
                      <strong>{game.actionsRemaining} actions</strong>
                    </div>

                    <div className="pandemic-hand" aria-label={`${activePlayer.name} city cards`}>
                      {activePlayer.hand.map((cityId, index) => (
                        <span className={CITIES[cityId].color} key={`${cityId}-${index}`}>{CITIES[cityId].name}</span>
                      ))}
                    </div>

                    <div className="pandemic-actions">
                      <button type="button" onClick={() => setGame(treatDisease)} disabled={!canAct || !currentCity.cubes}>
                        <ShieldPlus size={17} aria-hidden="true" /> Treat Disease
                      </button>
                      <button type="button" onClick={() => setGame(buildStation)} disabled={!canBuild}>
                        <Building2 size={17} aria-hidden="true" /> Build Station
                      </button>
                      <button type="button" onClick={() => setGame(shareKnowledge)} disabled={!canShare}>
                        <HandHeart size={17} aria-hidden="true" /> Share Knowledge
                      </button>
                    </div>

                    <div className="pandemic-cure-action">
                      <select value={cureColor} onChange={(event) => setCureColor(event.target.value)} aria-label="Cure color">
                        {DISEASE_COLORS.map((color) => <option value={color} key={color}>{COLOR_LABELS[color]}</option>)}
                      </select>
                      <button type="button" onClick={() => setGame((state) => discoverCure(state, cureColor))} disabled={!canCure}>
                        <FlaskConical size={17} aria-hidden="true" /> Discover Cure
                      </button>
                    </div>

                    <button type="button" className="ems-button pandemic-end-turn" onClick={() => setGame(endTurn)}>
                      <Activity size={18} aria-hidden="true" /> End Turn and Infect
                    </button>

                    <div className="pandemic-decks">
                      <span>Player deck <strong>{game.playerDeck.length}</strong></span>
                      <span>Infection deck <strong>{game.infectionDeck.length}</strong></span>
                    </div>
                  </>
                ) : (
                  <div className="pandemic-finished">
                    <p className="ems-kicker">Mission complete</p>
                    <h3>{game.status === "won" ? "All four cures found" : "Response overwhelmed"}</h3>
                    <button type="button" className="ems-button" onClick={startGame}>Play Again</button>
                  </div>
                )}

                <div className="pandemic-role-note">
                  <span><strong>Medic</strong> clears every cube with one treatment.</span>
                  <span><strong>Scientist</strong> discovers cures with three cards.</span>
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

export default Pandemic;
