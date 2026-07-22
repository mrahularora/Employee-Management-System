import { useState } from "react";
import { RotateCcw, Tickets, TrainFront } from "lucide-react";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import {
  canClaim,
  CITIES,
  createTicketGame,
  DESTINATIONS,
  destinationScore,
  drawCards,
  hasConnection,
  routePoints,
  spendRouteCards,
  TRAIN_COLORS,
} from "../utils/ticketToRideGame.mjs";
import "../TicketToRide.css";

const COLOR_LABELS = {
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
  black: "Black",
  orange: "Orange",
};

const finishGame = (state) => {
  const players = state.players.map((player, index) => {
    const ticketScore = destinationScore(state.routes, index, player.destinations);
    return { ...player, ticketScore, finalScore: player.score + ticketScore };
  });
  const topScore = Math.max(...players.map(({ finalScore }) => finalScore));
  const leaders = players.filter(({ finalScore }) => finalScore === topScore);
  return {
    ...state,
    players,
    finished: true,
    selectedRoute: null,
    winner: leaders.length === 1 ? leaders[0].name : "Tie game",
    message: leaders.length === 1 ? `${leaders[0].name} completed the strongest network.` : "The networks finished level.",
  };
};

const TicketToRide = () => {
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [game, setGame] = useState(null);

  const startGame = (event) => {
    event?.preventDefault();
    setGame(createTicketGame(names));
  };

  const passTurn = (state, players, message, routes = state.routes) => ({
    ...state,
    players,
    routes,
    currentPlayer: state.currentPlayer === 0 ? 1 : 0,
    selectedRoute: null,
    message,
  });

  const drawTrainCards = () => {
    setGame((state) => {
      if (state.finished) return state;
      const player = state.players[state.currentPlayer];
      const hand = drawCards(player.hand);
      const players = state.players.map((current, index) => index === state.currentPlayer ? { ...current, hand } : current);
      const nextIndex = state.currentPlayer === 0 ? 1 : 0;
      return passTurn(state, players, `${player.name} drew 2 train cards. ${players[nextIndex].name}'s turn.`);
    });
  };

  const claimSelectedRoute = () => {
    setGame((state) => {
      const route = state.routes.find(({ id }) => id === state.selectedRoute);
      const player = state.players[state.currentPlayer];
      if (state.finished || !route || !canClaim(player, route)) return state;
      const nextPlayer = {
        ...player,
        hand: spendRouteCards(player.hand, route),
        trains: player.trains - route.length,
        score: player.score + routePoints(route.length),
      };
      const players = state.players.map((current, index) => index === state.currentPlayer ? nextPlayer : current);
      const routes = state.routes.map((current) => current.id === route.id ? { ...current, owner: state.currentPlayer } : current);
      const nextIndex = state.currentPlayer === 0 ? 1 : 0;
      const nextState = passTurn(state, players, `${player.name} claimed ${route.from} to ${route.to}. ${players[nextIndex].name}'s turn.`, routes);
      return routes.every(({ owner }) => owner !== null) || nextPlayer.trains <= 2 ? finishGame(nextState) : nextState;
    });
  };

  const activePlayer = game?.players[game.currentPlayer];
  const selectedRoute = game?.routes.find(({ id }) => id === game.selectedRoute);

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <main className="ticket-page">
        <section className="ems-home-hero ticket-hero">
          <p className="ems-kicker">Board games</p>
          <h1>Ticket to Ride: Canada Routes</h1>
          <p>Connect Canadian cities, collect matching train cards, and complete destination tickets.</p>
        </section>

        {!game ? (
          <form className="ticket-setup" onSubmit={startGame}>
            <div>
              <p className="ems-kicker">New game</p>
              <h2>Choose conductors</h2>
            </div>
            {names.map((name, index) => (
              <label key={index} htmlFor={`ticket-player-${index}`}>
                Player {index + 1}
                <input
                  id={`ticket-player-${index}`}
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
          <section className="ticket-game" aria-label="Ticket to Ride Canada game">
            <header className="ticket-game-header">
              <div>
                <p className="ems-kicker">Canada route challenge</p>
                <h2>{game.finished ? `${game.winner} - game complete` : `${activePlayer.name}'s turn`}</h2>
                <p className="ticket-message" aria-live="polite">{game.message}</p>
              </div>
              <button type="button" className="ticket-reset" onClick={startGame} title="Restart game" aria-label="Restart game">
                <RotateCcw size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="ticket-player-strip">
              {game.players.map((player, index) => (
                <article key={index} className={`${index === game.currentPlayer && !game.finished ? "current" : ""} player-${index + 1}`}>
                  <strong>{player.name}</strong>
                  <span>{game.finished ? player.finalScore : player.score} points</span>
                  <small>{player.trains} trains{game.finished ? ` | tickets ${player.ticketScore >= 0 ? "+" : ""}${player.ticketScore}` : ""}</small>
                </article>
              ))}
            </div>

            <div className="ticket-layout">
              <div className="ticket-map" aria-label="Canada train route map">
                <svg viewBox="0 0 1000 560" role="img" aria-labelledby="ticket-map-title">
                  <title id="ticket-map-title">Interactive train routes between Canadian cities</title>
                  <path className="ticket-land" d="M35 430 L70 330 L170 305 L215 165 L315 145 L400 220 L515 205 L585 315 L690 245 L770 205 L840 115 L930 160 L965 410 L845 475 L650 470 L510 425 L335 450 L165 465 Z" />
                  {game.routes.map((route) => {
                    const from = CITIES[route.from];
                    const to = CITIES[route.to];
                    const selected = route.id === game.selectedRoute;
                    const ownerClass = route.owner !== null ? ` claimed player-${route.owner + 1}` : "";
                    return (
                      <g
                        key={route.id}
                        className={`ticket-route ${route.color}${selected ? " selected" : ""}${ownerClass}`}
                        role="button"
                        tabIndex={game.finished ? -1 : 0}
                        aria-label={`${route.from} to ${route.to}, ${route.length} ${COLOR_LABELS[route.color]} trains${route.owner !== null ? `, claimed by ${game.players[route.owner].name}` : ", available"}`}
                        aria-pressed={selected}
                        onClick={() => !game.finished && setGame((state) => ({ ...state, selectedRoute: route.id }))}
                        onKeyDown={(event) => {
                          if (!game.finished && ["Enter", " "].includes(event.key)) {
                            event.preventDefault();
                            setGame((state) => ({ ...state, selectedRoute: route.id }));
                          }
                        }}
                      >
                        <line className="ticket-route-hit" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                        <line className="ticket-route-line" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                        <text className="ticket-route-length" x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 7}>{route.length}</text>
                      </g>
                    );
                  })}
                  {Object.entries(CITIES).map(([city, point]) => (
                    <g className="ticket-city" key={city}>
                      <circle cx={point.x} cy={point.y} r="10" />
                      <text x={point.x} y={point.y - 16}>{city}</text>
                    </g>
                  ))}
                </svg>
              </div>

              <aside className="ticket-controls">
                <button type="button" className="ems-button ticket-draw" onClick={drawTrainCards} disabled={game.finished}>
                  <Tickets size={18} aria-hidden="true" /> Draw 2 Cards
                </button>

                <section className="ticket-hand" aria-label={`${activePlayer.name} train cards`}>
                  {TRAIN_COLORS.map((color) => (
                    <div key={color} className={color}>
                      <span>{COLOR_LABELS[color]}</span>
                      <strong>{activePlayer.hand[color]}</strong>
                    </div>
                  ))}
                </section>

                <section className="ticket-destinations" aria-label={`${activePlayer.name} destination tickets`}>
                  <h3>Destination Tickets</h3>
                  {activePlayer.destinations.map((id) => {
                    const ticket = DESTINATIONS.find((destination) => destination.id === id);
                    const connected = hasConnection(game.routes, game.currentPlayer, ticket.from, ticket.to);
                    return (
                      <div key={id} className={connected ? "connected" : ""}>
                        <span>{ticket.from} - {ticket.to}</span>
                        <strong>{ticket.points}</strong>
                      </div>
                    );
                  })}
                </section>

                <div className="ticket-selection">
                  {selectedRoute ? (
                    <>
                      <div>
                        <span>{selectedRoute.from} to {selectedRoute.to}</span>
                        <small>{selectedRoute.length} {COLOR_LABELS[selectedRoute.color]} cards | {routePoints(selectedRoute.length)} points</small>
                      </div>
                      <strong>{selectedRoute.owner === null ? "Available" : `Claimed by ${game.players[selectedRoute.owner].name}`}</strong>
                    </>
                  ) : <span>Select a route on the map</span>}
                </div>

                <button
                  type="button"
                  className="ems-button ticket-claim"
                  onClick={claimSelectedRoute}
                  disabled={game.finished || !selectedRoute || !canClaim(activePlayer, selectedRoute)}
                >
                  <TrainFront size={18} aria-hidden="true" /> Claim Route
                </button>
                <button type="button" className="ticket-finish" onClick={() => setGame(finishGame)} disabled={game.finished}>Finish Game</button>
              </aside>
            </div>
          </section>
        )}
      </main>
      <EmployeeFooter />
    </div>
  );
};

export default TicketToRide;
