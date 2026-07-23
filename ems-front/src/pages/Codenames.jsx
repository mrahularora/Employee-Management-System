import { useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import EmployeeFooter from "../components/EmployeeFooter";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import {
  createCodenamesGame,
  endTurn,
  guessCard,
  remainingAgents,
  submitClue,
} from "../utils/codenamesGame.mjs";
import "../Codenames.css";

const ROLE_LABELS = {
  red: "Red agent",
  blue: "Blue agent",
  neutral: "Bystander",
  assassin: "Assassin",
};

const Codenames = () => {
  const [names, setNames] = useState(["Red Team", "Blue Team"]);
  const [game, setGame] = useState(null);
  const [clueWord, setClueWord] = useState("");
  const [clueCount, setClueCount] = useState(2);
  const [keyVisible, setKeyVisible] = useState(false);

  const startGame = (event) => {
    event?.preventDefault();
    setGame(createCodenamesGame(names));
    setClueWord("");
    setClueCount(2);
    setKeyVisible(false);
  };

  const giveClue = (event) => {
    event.preventDefault();
    const nextGame = submitClue(game, clueWord, clueCount);
    setGame(nextGame);
    if (nextGame.phase === "guess") {
      setClueWord("");
      setKeyVisible(false);
    }
  };

  const activeTeam = game?.teams[game.currentTeam];

  return (
    <div>
      <EmployeeHeader />
      <EmployeeNavigation />
      <main className="codenames-page">
        <section className="ems-home-hero codenames-hero">
          <p className="ems-kicker">Board games</p>
          <h1>Codenames Team Challenge</h1>
          <p>Connect one-word clues to the right field agents while avoiding bystanders and the assassin.</p>
        </section>

        {!game ? (
          <form className="codenames-setup" onSubmit={startGame}>
            <div>
              <p className="ems-kicker">New game</p>
              <h2>Choose teams</h2>
            </div>
            {names.map((name, index) => (
              <label key={index} htmlFor={`codenames-team-${index}`}>
                {index === 0 ? "Red" : "Blue"} team
                <input
                  id={`codenames-team-${index}`}
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
          <section className="codenames-game" aria-label="Codenames team game">
            <header className="codenames-game-header">
              <div>
                <p className="ems-kicker">Red team starts</p>
                <h2>{game.winner ? `${game.winner} wins` : `${activeTeam.name}'s turn`}</h2>
                <p className="codenames-message" aria-live="polite">{game.message}</p>
              </div>
              <button type="button" className="codenames-reset" onClick={startGame} title="Restart game" aria-label="Restart game">
                <RotateCcw size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="codenames-team-strip">
              {game.teams.map((team, index) => (
                <article key={team.role} className={`${team.role}${index === game.currentTeam && !game.winner ? " current" : ""}`}>
                  <strong>{team.name}</strong>
                  <span>{remainingAgents(game.cards, team.role)} agents remaining</span>
                </article>
              ))}
            </div>

            <div className="codenames-layout">
              <div className={`codenames-board${keyVisible ? " key-visible" : ""}`} aria-label="Codenames word grid">
                {game.cards.map((card) => (
                  <button
                    type="button"
                    key={card.id}
                    className={`codenames-card ${card.revealed || keyVisible ? card.role : "hidden"}${card.revealed ? " revealed" : ""}`}
                    onClick={() => setGame((state) => guessCard(state, card.id))}
                    disabled={card.revealed || game.phase !== "guess" || Boolean(game.winner)}
                    aria-label={`${card.word}${card.revealed || keyVisible ? `, ${ROLE_LABELS[card.role]}` : ""}`}
                  >
                    <span>{card.word}</span>
                    {card.revealed && <small>{ROLE_LABELS[card.role]}</small>}
                  </button>
                ))}
              </div>

              <aside className="codenames-controls">
                <button
                  type="button"
                  className="codenames-key-toggle"
                  onClick={() => setKeyVisible((visible) => !visible)}
                  aria-pressed={keyVisible}
                >
                  {keyVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  {keyVisible ? "Hide Spymaster Key" : "Show Spymaster Key"}
                </button>

                {game.phase === "clue" && !game.winner ? (
                  <form className="codenames-clue-form" onSubmit={giveClue}>
                    <div>
                      <p className="ems-kicker">Spymaster clue</p>
                      <h3>{activeTeam.name}</h3>
                    </div>
                    <label htmlFor="codenames-clue">One word</label>
                    <input
                      id="codenames-clue"
                      value={clueWord}
                      onChange={(event) => setClueWord(event.target.value)}
                      maxLength="24"
                      autoComplete="off"
                      required
                    />
                    <label htmlFor="codenames-count">Agent count</label>
                    <input
                      id="codenames-count"
                      type="number"
                      value={clueCount}
                      onChange={(event) => setClueCount(event.target.value)}
                      min="1"
                      max="9"
                      required
                    />
                    <button type="submit" className="ems-button">Give Clue</button>
                  </form>
                ) : game.phase === "guess" && !game.winner ? (
                  <div className="codenames-guess-panel">
                    <p className="ems-kicker">Current clue</p>
                    <h3>{game.clue.word} <span>{game.clue.count}</span></h3>
                    <strong>{game.guessesRemaining} guesses available</strong>
                    <button type="button" className="ems-button" onClick={() => setGame(endTurn)}>End Turn</button>
                  </div>
                ) : (
                  <div className="codenames-guess-panel winner">
                    <p className="ems-kicker">Game complete</p>
                    <h3>{game.winner}</h3>
                    <button type="button" className="ems-button" onClick={startGame}>Play Again</button>
                  </div>
                )}

                <div className="codenames-legend" aria-label="Spymaster key legend">
                  {Object.entries(ROLE_LABELS).map(([role, label]) => (
                    <span key={role}><i className={role} aria-hidden="true" />{label}</span>
                  ))}
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

export default Codenames;
