export const TRAIN_COLORS = ["red", "blue", "green", "yellow", "black", "orange"];

export const CITIES = {
  Vancouver: { x: 80, y: 390 },
  Calgary: { x: 250, y: 350 },
  Edmonton: { x: 245, y: 220 },
  Winnipeg: { x: 440, y: 300 },
  Toronto: { x: 625, y: 410 },
  Ottawa: { x: 710, y: 295 },
  Montreal: { x: 795, y: 270 },
  Quebec: { x: 865, y: 175 },
  Halifax: { x: 925, y: 390 },
};

export const ROUTES = [
  { id: "van-cal", from: "Vancouver", to: "Calgary", length: 3, color: "green" },
  { id: "van-edm", from: "Vancouver", to: "Edmonton", length: 4, color: "red" },
  { id: "cal-edm", from: "Calgary", to: "Edmonton", length: 2, color: "blue" },
  { id: "cal-wpg", from: "Calgary", to: "Winnipeg", length: 4, color: "yellow" },
  { id: "edm-wpg", from: "Edmonton", to: "Winnipeg", length: 3, color: "black" },
  { id: "wpg-tor", from: "Winnipeg", to: "Toronto", length: 4, color: "orange" },
  { id: "wpg-ott", from: "Winnipeg", to: "Ottawa", length: 5, color: "blue" },
  { id: "tor-ott", from: "Toronto", to: "Ottawa", length: 2, color: "green" },
  { id: "tor-mtl", from: "Toronto", to: "Montreal", length: 3, color: "red" },
  { id: "ott-mtl", from: "Ottawa", to: "Montreal", length: 1, color: "black" },
  { id: "mtl-que", from: "Montreal", to: "Quebec", length: 2, color: "yellow" },
  { id: "que-hal", from: "Quebec", to: "Halifax", length: 4, color: "green" },
  { id: "mtl-hal", from: "Montreal", to: "Halifax", length: 5, color: "orange" },
  { id: "tor-hal", from: "Toronto", to: "Halifax", length: 6, color: "blue" },
];

export const DESTINATIONS = [
  { id: "van-tor", from: "Vancouver", to: "Toronto", points: 12 },
  { id: "van-mtl", from: "Vancouver", to: "Montreal", points: 15 },
  { id: "cal-hal", from: "Calgary", to: "Halifax", points: 14 },
  { id: "edm-que", from: "Edmonton", to: "Quebec", points: 11 },
  { id: "wpg-hal", from: "Winnipeg", to: "Halifax", points: 10 },
  { id: "tor-que", from: "Toronto", to: "Quebec", points: 7 },
];

const shuffle = (items, random) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
};

export const emptyHand = () => Object.fromEntries(TRAIN_COLORS.map((color) => [color, 0]));

export const drawCards = (hand, count = 2, random = Math.random) => {
  const next = { ...hand };
  for (let draw = 0; draw < count; draw += 1) {
    const color = TRAIN_COLORS[Math.floor(random() * TRAIN_COLORS.length)];
    next[color] += 1;
  }
  return next;
};

export const routePoints = (length) => ({ 1: 1, 2: 2, 3: 4, 4: 7, 5: 10, 6: 15 }[length] || 0);

export const canClaim = (player, route) => (
  route.owner === null
  && player.trains >= route.length
  && player.hand[route.color] >= route.length
);

export const spendRouteCards = (hand, route) => ({
  ...hand,
  [route.color]: hand[route.color] - route.length,
});

export const hasConnection = (routes, playerIndex, start, destination) => {
  const graph = new Map();
  routes.filter(({ owner }) => owner === playerIndex).forEach(({ from, to }) => {
    graph.set(from, [...(graph.get(from) || []), to]);
    graph.set(to, [...(graph.get(to) || []), from]);
  });
  const queue = [start];
  const visited = new Set();
  while (queue.length) {
    const city = queue.shift();
    if (city === destination) return true;
    if (visited.has(city)) continue;
    visited.add(city);
    queue.push(...(graph.get(city) || []));
  }
  return false;
};

export const destinationScore = (routes, playerIndex, destinationIds) => (
  destinationIds.reduce((total, destinationId) => {
    const ticket = DESTINATIONS.find(({ id }) => id === destinationId);
    return total + (hasConnection(routes, playerIndex, ticket.from, ticket.to) ? ticket.points : -ticket.points);
  }, 0)
);

export const createTicketGame = (names, random = Math.random) => {
  const tickets = shuffle(DESTINATIONS, random);
  const starterHand = Object.fromEntries(TRAIN_COLORS.map((color) => [color, 1]));
  const players = names.map((name, index) => ({
    name: name.trim() || `Player ${index + 1}`,
    hand: drawCards(starterHand, 4, random),
    trains: 20,
    score: 0,
    destinations: tickets.slice(index * 2, index * 2 + 2).map(({ id }) => id),
  }));
  return {
    players,
    routes: ROUTES.map((route) => ({ ...route, owner: null })),
    currentPlayer: 0,
    selectedRoute: null,
    finished: false,
    winner: null,
    message: `${players[0].name} starts the journey.`,
  };
};
