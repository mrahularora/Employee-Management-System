export const RESOURCE_KEYS = ["wood", "brick", "grain", "wool", "ore"];

export const COSTS = {
  road: { wood: 1, brick: 1 },
  settlement: { wood: 1, brick: 1, grain: 1, wool: 1 },
  city: { grain: 2, ore: 3 },
};

const RESOURCE_DECK = [
  "wood", "wood", "wood", "wood",
  "grain", "grain", "grain", "grain",
  "wool", "wool", "wool", "wool",
  "brick", "brick", "brick",
  "ore", "ore", "ore",
  "desert",
];
const NUMBER_DECK = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

const shuffle = (items, random) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
};

export const emptyResources = () => Object.fromEntries(RESOURCE_KEYS.map((resource) => [resource, 0]));

export const createBoard = (random = Math.random) => {
  const resources = shuffle(RESOURCE_DECK, random);
  let numberIndex = 0;
  return resources.map((resource, id) => ({
    id,
    resource,
    number: resource === "desert" ? null : NUMBER_DECK[numberIndex++],
    owner: null,
    city: false,
  }));
};

export const seedStartingSettlements = (tiles) => {
  const available = tiles.filter(({ resource }) => resource !== "desert").slice(0, 4);
  const owners = new Map(available.map((tile, index) => [tile.id, index % 2]));
  return tiles.map((tile) => owners.has(tile.id) ? { ...tile, owner: owners.get(tile.id) } : tile);
};

export const createPlayers = (names) => names.map((name, index) => ({
  name: name.trim() || `Player ${index + 1}`,
  resources: { ...emptyResources(), wood: 1, brick: 1, grain: 1, wool: 1 },
  roads: 0,
  score: 2,
}));

export const produceResources = (players, tiles, roll) => {
  const next = players.map((player) => ({
    ...player,
    resources: { ...player.resources },
  }));

  tiles.forEach(({ resource, number, owner, city }) => {
    if (owner !== null && number === roll && resource !== "desert") {
      next[owner].resources[resource] += city ? 2 : 1;
    }
  });
  return next;
};

export const canAfford = (resources, cost) => (
  Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount)
);

export const payCost = (resources, cost) => {
  const next = { ...resources };
  Object.entries(cost).forEach(([resource, amount]) => {
    next[resource] -= amount;
  });
  return next;
};
