export const WORDS = [
  "Anchor", "Apple", "Bridge", "Brush", "Canada", "Capital", "Card", "Castle", "Clock", "Cloud",
  "Compass", "Court", "Crown", "Diamond", "Doctor", "Dragon", "Engine", "Forest", "Glass", "Glove",
  "Gold", "Grace", "Green", "Heart", "Hotel", "Ice", "Key", "King", "Lab", "Laser", "Leaf", "Light",
  "Maple", "Mercury", "Moon", "Mouse", "Novel", "Nurse", "Ocean", "Olympus", "Orange", "Paper", "Park",
  "Phoenix", "Pilot", "Pipe", "Plate", "Point", "Port", "Queen", "Ring", "Robot", "Root", "Rose", "Satellite",
  "School", "Server", "Shadow", "Ship", "Snow", "Spider", "Spring", "Star", "Stream", "Suit", "Table", "Temple",
  "Tower", "Train", "Wave", "Web", "Whale", "Window", "Winter", "Wire"
];

const shuffle = (items, random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

export const remainingAgents = (cards, role) => cards.filter((card) => card.role === role && !card.revealed).length;

export const createCodenamesGame = (names = ["Red Team", "Blue Team"], random = Math.random) => {
  const roles = shuffle([
    ...Array(9).fill("red"),
    ...Array(8).fill("blue"),
    ...Array(7).fill("neutral"),
    "assassin",
  ], random);
  const words = shuffle(WORDS, random).slice(0, 25);

  return {
    teams: [
      { name: names[0].trim() || "Red Team", role: "red" },
      { name: names[1].trim() || "Blue Team", role: "blue" },
    ],
    cards: words.map((word, index) => ({ id: index, word, role: roles[index], revealed: false })),
    currentTeam: 0,
    phase: "clue",
    clue: null,
    guessesRemaining: 0,
    winner: null,
    message: `${names[0].trim() || "Red Team"}'s spymaster gives the first clue.`,
  };
};

const nextTurn = (state, message) => {
  const currentTeam = state.currentTeam === 0 ? 1 : 0;
  return {
    ...state,
    currentTeam,
    phase: "clue",
    clue: null,
    guessesRemaining: 0,
    message: message || `${state.teams[currentTeam].name}'s spymaster gives a clue.`,
  };
};

export const submitClue = (state, word, count) => {
  if (state.phase !== "clue" || state.winner) return state;
  const clueWord = word.trim();
  const clueCount = Number(count);
  if (!clueWord || /\s/.test(clueWord) || !Number.isInteger(clueCount) || clueCount < 1 || clueCount > 9) {
    return { ...state, message: "Enter one clue word and a number from 1 to 9." };
  }
  return {
    ...state,
    phase: "guess",
    clue: { word: clueWord, count: clueCount },
    guessesRemaining: clueCount + 1,
    message: `${state.teams[state.currentTeam].name} may make up to ${clueCount + 1} guesses.`,
  };
};

export const endTurn = (state) => state.winner ? state : nextTurn(state);

export const guessCard = (state, cardId) => {
  const card = state.cards.find(({ id }) => id === cardId);
  if (state.phase !== "guess" || state.winner || !card || card.revealed) return state;

  const cards = state.cards.map((current) => current.id === cardId ? { ...current, revealed: true } : current);
  const activeTeam = state.teams[state.currentTeam];
  const otherTeam = state.teams[state.currentTeam === 0 ? 1 : 0];
  const revealedState = { ...state, cards };

  if (card.role === "assassin") {
    return { ...revealedState, winner: otherTeam.name, guessesRemaining: 0, message: `${activeTeam.name} found the assassin. ${otherTeam.name} wins.` };
  }
  if (card.role === otherTeam.role) {
    if (remainingAgents(cards, otherTeam.role) === 0) {
      return { ...revealedState, winner: otherTeam.name, guessesRemaining: 0, message: `${otherTeam.name}'s final agent was revealed. ${otherTeam.name} wins.` };
    }
    return nextTurn(revealedState, `${activeTeam.name} revealed an opposing agent. ${otherTeam.name}'s turn.`);
  }
  if (card.role === "neutral") {
    return nextTurn(revealedState, `${activeTeam.name} found a bystander. ${otherTeam.name}'s turn.`);
  }
  if (remainingAgents(cards, activeTeam.role) === 0) {
    return { ...revealedState, winner: activeTeam.name, guessesRemaining: 0, message: `${activeTeam.name} found every agent and wins.` };
  }

  const guessesRemaining = state.guessesRemaining - 1;
  if (guessesRemaining === 0) {
    return nextTurn({ ...revealedState, guessesRemaining }, `${activeTeam.name} used every guess. ${otherTeam.name}'s turn.`);
  }
  return { ...revealedState, guessesRemaining, message: `Correct agent. ${guessesRemaining} guesses remaining.` };
};
