export const DISEASE_COLORS = ["blue", "yellow", "black", "red"];

export const CITIES = {
  atlanta: { name: "Atlanta", color: "blue", x: 210, y: 190, links: ["montreal", "miami", "london"] },
  montreal: { name: "Montreal", color: "blue", x: 275, y: 120, links: ["atlanta", "london"] },
  london: { name: "London", color: "blue", x: 440, y: 110, links: ["atlanta", "montreal", "cairo"] },
  miami: { name: "Miami", color: "yellow", x: 220, y: 270, links: ["atlanta", "lagos", "sao-paulo"] },
  lagos: { name: "Lagos", color: "yellow", x: 455, y: 300, links: ["miami", "sao-paulo", "cairo"] },
  "sao-paulo": { name: "Sao Paulo", color: "yellow", x: 345, y: 400, links: ["miami", "lagos", "cairo", "sydney"] },
  cairo: { name: "Cairo", color: "black", x: 550, y: 225, links: ["london", "lagos", "sao-paulo", "baghdad", "delhi"] },
  baghdad: { name: "Baghdad", color: "black", x: 630, y: 205, links: ["cairo", "delhi", "tokyo"] },
  delhi: { name: "Delhi", color: "black", x: 720, y: 255, links: ["cairo", "baghdad", "tokyo", "manila"] },
  tokyo: { name: "Tokyo", color: "red", x: 875, y: 145, links: ["baghdad", "delhi", "manila"] },
  manila: { name: "Manila", color: "red", x: 840, y: 300, links: ["delhi", "tokyo", "sydney"] },
  sydney: { name: "Sydney", color: "red", x: 890, y: 415, links: ["manila", "sao-paulo"] },
};

const shuffle = (items, random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

const loseGame = (state, message) => ({ ...state, finished: true, status: "lost", message });
const cloneCities = (cities) => Object.fromEntries(Object.entries(cities).map(([id, city]) => [id, { ...city }]));

const infectOne = (sourceCities, cityId, sourceOutbreaks) => {
  const cities = cloneCities(sourceCities);
  const outbreaked = new Set();
  let outbreaks = sourceOutbreaks;

  const spread = (id) => {
    if (cities[id].cubes < 3) {
      cities[id].cubes += 1;
      return;
    }
    if (outbreaked.has(id)) return;
    outbreaked.add(id);
    outbreaks += 1;
    CITIES[id].links.forEach(spread);
  };

  spread(cityId);
  return { cities, outbreaks };
};

export const applyInfections = (state, cityIds) => {
  let cities = state.cities;
  let outbreaks = state.outbreaks;
  for (const cityId of cityIds) {
    const infection = infectOne(cities, cityId, outbreaks);
    cities = infection.cities;
    outbreaks = infection.outbreaks;
    if (outbreaks >= 4) return loseGame({ ...state, cities, outbreaks }, "Four outbreaks overwhelmed the response team.");
  }
  return { ...state, cities, outbreaks };
};

export const createPandemicGame = (names = ["Player 1", "Player 2"], random = Math.random) => {
  const cityIds = Object.keys(CITIES);
  const playerCards = shuffle(Array.from({ length: 3 }, () => cityIds).flat(), random);
  const infectionDeck = shuffle(Array.from({ length: 3 }, () => cityIds).flat(), random);
  const infectedCities = shuffle(cityIds, random).slice(0, 6);
  const cities = Object.fromEntries(cityIds.map((id) => [id, { cubes: 0, station: id === "atlanta" }]));
  infectedCities.forEach((id, index) => { cities[id].cubes = index < 2 ? 3 : index < 4 ? 2 : 1; });
  const players = [
    { name: names[0].trim() || "Player 1", role: "Medic", city: "atlanta", hand: playerCards.slice(0, 4) },
    { name: names[1].trim() || "Player 2", role: "Scientist", city: "atlanta", hand: playerCards.slice(4, 8) },
  ];

  return {
    cities,
    players,
    playerDeck: playerCards.slice(8),
    infectionDeck,
    cures: Object.fromEntries(DISEASE_COLORS.map((color) => [color, false])),
    currentPlayer: 0,
    actionsRemaining: 4,
    outbreaks: 0,
    turn: 1,
    finished: false,
    status: "playing",
    message: `${players[0].name} begins in Atlanta.`,
  };
};

export const movePlayer = (state, destination) => {
  const player = state.players[state.currentPlayer];
  if (state.finished || !state.actionsRemaining || !CITIES[player.city].links.includes(destination)) return state;
  const players = state.players.map((current, index) => index === state.currentPlayer ? { ...current, city: destination } : current);
  const cities = cloneCities(state.cities);
  if (player.role === "Medic" && state.cures[CITIES[destination].color]) cities[destination].cubes = 0;
  return {
    ...state,
    players,
    cities,
    actionsRemaining: state.actionsRemaining - 1,
    message: `${player.name} moved to ${CITIES[destination].name}.`,
  };
};

export const treatDisease = (state) => {
  const player = state.players[state.currentPlayer];
  const city = state.cities[player.city];
  if (state.finished || !state.actionsRemaining || !city.cubes) return state;
  const cities = cloneCities(state.cities);
  const removeAll = player.role === "Medic" || state.cures[CITIES[player.city].color];
  cities[player.city].cubes = removeAll ? 0 : city.cubes - 1;
  return {
    ...state,
    cities,
    actionsRemaining: state.actionsRemaining - 1,
    message: `${player.name} treated disease in ${CITIES[player.city].name}.`,
  };
};

export const buildStation = (state) => {
  const player = state.players[state.currentPlayer];
  const cardIndex = player.hand.indexOf(player.city);
  if (state.finished || !state.actionsRemaining || state.cities[player.city].station || cardIndex < 0) return state;
  const players = state.players.map((current, index) => index === state.currentPlayer
    ? { ...current, hand: current.hand.filter((_, handIndex) => handIndex !== cardIndex) }
    : current);
  const cities = cloneCities(state.cities);
  cities[player.city].station = true;
  return {
    ...state,
    players,
    cities,
    actionsRemaining: state.actionsRemaining - 1,
    message: `${player.name} built a research station in ${CITIES[player.city].name}.`,
  };
};

export const shareKnowledge = (state) => {
  const player = state.players[state.currentPlayer];
  const teammateIndex = state.currentPlayer === 0 ? 1 : 0;
  const teammate = state.players[teammateIndex];
  const cardIndex = player.hand.indexOf(player.city);
  if (state.finished || !state.actionsRemaining || teammate.city !== player.city || cardIndex < 0) return state;
  const players = state.players.map((current, index) => {
    if (index === state.currentPlayer) return { ...current, hand: current.hand.filter((_, handIndex) => handIndex !== cardIndex) };
    if (index === teammateIndex) return { ...current, hand: [...current.hand, player.city] };
    return current;
  });
  return {
    ...state,
    players,
    actionsRemaining: state.actionsRemaining - 1,
    message: `${player.name} shared the ${CITIES[player.city].name} card with ${teammate.name}.`,
  };
};

export const cureCost = (player) => player.role === "Scientist" ? 3 : 4;
export const cardsOfColor = (player, color) => player.hand.filter((cityId) => CITIES[cityId].color === color).length;

export const discoverCure = (state, color) => {
  const player = state.players[state.currentPlayer];
  const cost = cureCost(player);
  if (
    state.finished || !state.actionsRemaining || !DISEASE_COLORS.includes(color) || state.cures[color]
    || !state.cities[player.city].station || cardsOfColor(player, color) < cost
  ) return state;

  let discarded = 0;
  const hand = player.hand.filter((cityId) => {
    if (CITIES[cityId].color === color && discarded < cost) {
      discarded += 1;
      return false;
    }
    return true;
  });
  const players = state.players.map((current, index) => index === state.currentPlayer ? { ...current, hand } : current);
  const cures = { ...state.cures, [color]: true };
  const won = Object.values(cures).every(Boolean);
  return {
    ...state,
    players,
    cures,
    actionsRemaining: state.actionsRemaining - 1,
    finished: won,
    status: won ? "won" : state.status,
    message: won ? "Every disease is cured. The response team wins." : `${player.name} discovered the ${color} cure.`,
  };
};

export const endTurn = (state) => {
  if (state.finished) return state;
  if (state.playerDeck.length < 2) return loseGame(state, "The player deck ran out before every cure was found.");
  const infectionRate = Math.min(4, 2 + Math.floor((state.turn - 1) / 4));
  if (state.infectionDeck.length < infectionRate) return loseGame(state, "The infection deck ran out before every cure was found.");

  const players = state.players.map((player, index) => index === state.currentPlayer
    ? { ...player, hand: [...player.hand, ...state.playerDeck.slice(0, 2)] }
    : player);
  const infectedIds = state.infectionDeck.slice(0, infectionRate);
  const infected = applyInfections({
    ...state,
    players,
    playerDeck: state.playerDeck.slice(2),
    infectionDeck: state.infectionDeck.slice(infectionRate),
  }, infectedIds);
  if (infected.finished) return infected;

  const currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  return {
    ...infected,
    currentPlayer,
    actionsRemaining: 4,
    turn: state.turn + 1,
    message: `${infectedIds.map((id) => CITIES[id].name).join(" and ")} infected. ${players[currentPlayer].name}'s turn.`,
  };
};
