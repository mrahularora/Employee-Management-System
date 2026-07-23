export const BOARD_SIZE = 7;

const DIRECTIONS = [
  { key: "n", opposite: "s", row: -1, col: 0 },
  { key: "e", opposite: "w", row: 0, col: 1 },
  { key: "s", opposite: "n", row: 1, col: 0 },
  { key: "w", opposite: "e", row: 0, col: -1 },
];

const TILE_TEMPLATES = [
  ...Array(4).fill({ label: "Straight road", center: "road", edges: { n: "road", e: "field", s: "road", w: "field" } }),
  ...Array(4).fill({ label: "Curved road", center: "road", edges: { n: "road", e: "road", s: "field", w: "field" } }),
  ...Array(2).fill({ label: "Three-way road", center: "road", edges: { n: "road", e: "road", s: "field", w: "road" } }),
  ...Array(4).fill({ label: "City cap", center: "city", edges: { n: "city", e: "field", s: "field", w: "field" } }),
  ...Array(4).fill({ label: "City gate", center: "mixed", edges: { n: "city", e: "field", s: "road", w: "field" } }),
  ...Array(2).fill({ label: "City corner", center: "city", edges: { n: "city", e: "city", s: "field", w: "field" } }),
  ...Array(3).fill({ label: "Monastery", center: "monastery", edges: { n: "field", e: "field", s: "field", w: "field" } }),
  { label: "Meadow", center: "field", edges: { n: "field", e: "field", s: "field", w: "field" } },
];

const shuffle = (items, random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

const inBounds = (board, row, col) => row >= 0 && col >= 0 && row < board.length && col < board[0].length;
const cellKey = (row, col) => `${row},${col}`;
const hasFeature = (tile, feature) => feature === "monastery"
  ? tile.center === "monastery"
  : Object.values(tile.edges).includes(feature);

export const rotateTile = (tile, turns = 1) => {
  let rotated = { ...tile, edges: { ...tile.edges } };
  for (let turn = 0; turn < ((turns % 4) + 4) % 4; turn += 1) {
    const { n, e, s, w } = rotated.edges;
    rotated = { ...rotated, edges: { n: w, e: n, s: e, w: s } };
  }
  return rotated;
};

export const tileFeatures = (tile) => [
  ...new Set([
    ...Object.values(tile.edges).filter((edge) => edge !== "field"),
    ...(tile.center === "monastery" ? ["monastery"] : []),
  ]),
];

export const isLegalPlacement = (board, tile, row, col) => {
  if (!tile || !inBounds(board, row, col) || board[row][col]) return false;
  let touchesTile = false;
  for (const direction of DIRECTIONS) {
    const neighborRow = row + direction.row;
    const neighborCol = col + direction.col;
    if (!inBounds(board, neighborRow, neighborCol) || !board[neighborRow][neighborCol]) continue;
    touchesTile = true;
    if (tile.edges[direction.key] !== board[neighborRow][neighborCol].edges[direction.opposite]) return false;
  }
  return touchesTile;
};

export const legalPlacements = (board, tile) => {
  const placements = [];
  board.forEach((line, row) => line.forEach((cell, col) => {
    if (isLegalPlacement(board, tile, row, col)) placements.push({ row, col });
  }));
  return placements;
};

export const hasAnyPlacement = (board, tile) => [0, 1, 2, 3]
  .some((turns) => legalPlacements(board, rotateTile(tile, turns)).length > 0);

const featureComponent = (board, row, col, feature) => {
  const queue = [{ row, col }];
  const visited = new Set();
  const component = [];

  while (queue.length) {
    const current = queue.shift();
    const key = cellKey(current.row, current.col);
    if (visited.has(key)) continue;
    visited.add(key);
    const tile = board[current.row]?.[current.col];
    if (!tile || !hasFeature(tile, feature)) continue;
    component.push(current);

    DIRECTIONS.forEach((direction) => {
      if (tile.edges[direction.key] !== feature) return;
      const nextRow = current.row + direction.row;
      const nextCol = current.col + direction.col;
      if (board[nextRow]?.[nextCol]?.edges[direction.opposite] === feature) {
        queue.push({ row: nextRow, col: nextCol });
      }
    });
  }
  return component;
};

const featureComplete = (board, component, feature) => component.every(({ row, col }) =>
  DIRECTIONS.every((direction) => {
    if (board[row][col].edges[direction.key] !== feature) return true;
    return board[row + direction.row]?.[col + direction.col]?.edges[direction.opposite] === feature;
  }));

const surroundingTiles = (board, row, col) => {
  let count = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if ((rowOffset || colOffset) && board[row + rowOffset]?.[col + colOffset]) count += 1;
    }
  }
  return count;
};

export const canPlaceFollower = (board, tile, row, col, feature) => {
  if (!tileFeatures(tile).includes(feature) || !isLegalPlacement(board, tile, row, col)) return false;
  const nextBoard = board.map((line) => [...line]);
  nextBoard[row][col] = { ...tile, follower: null };
  if (feature === "monastery") return true;
  return featureComponent(nextBoard, row, col, feature)
    .every((cell) => nextBoard[cell.row][cell.col].follower?.feature !== feature);
};

const scoreFeatures = (sourceBoard, sourcePlayers, completedOnly) => {
  const board = sourceBoard.map((line) => line.map((tile) => tile ? { ...tile } : null));
  const players = sourcePlayers.map((player) => ({ ...player }));
  const visited = { road: new Set(), city: new Set() };
  const events = [];

  const award = (cells, feature, points) => {
    const followers = cells
      .map(({ row, col }) => board[row][col].follower)
      .filter((follower) => follower?.feature === feature);
    if (!followers.length) return;
    const counts = followers.reduce((totals, follower) => ({
      ...totals,
      [follower.player]: (totals[follower.player] || 0) + 1,
    }), {});
    const majority = Math.max(...Object.values(counts));
    const winners = Object.entries(counts)
      .filter(([, count]) => count === majority)
      .map(([player]) => Number(player));
    winners.forEach((player) => { players[player].score += points; });
    followers.forEach(({ player }) => { players[player].followers += 1; });
    cells.forEach(({ row, col }) => {
      if (board[row][col].follower?.feature === feature) board[row][col] = { ...board[row][col], follower: null };
    });
    events.push(`${winners.map((player) => players[player].name).join(" and ")} scored ${points} ${feature} points.`);
  };

  board.forEach((line, row) => line.forEach((tile, col) => {
    if (!tile) return;
    ["road", "city"].forEach((feature) => {
      const key = cellKey(row, col);
      if (!hasFeature(tile, feature) || visited[feature].has(key)) return;
      const component = featureComponent(board, row, col, feature);
      component.forEach((cell) => visited[feature].add(cellKey(cell.row, cell.col)));
      const complete = featureComplete(board, component, feature);
      if (!completedOnly || complete) award(component, feature, component.length * (feature === "city" && complete ? 2 : 1));
    });

    if (tile.center === "monastery" && tile.follower?.feature === "monastery") {
      const neighbors = surroundingTiles(board, row, col);
      if (!completedOnly || neighbors === 8) award([{ row, col }], "monastery", neighbors + 1);
    }
  }));

  return { board, players, events };
};

export const scoreCompletedFeatures = (board, players) => scoreFeatures(board, players, true);

const finishGame = (state) => {
  const scored = scoreFeatures(state.board, state.players, false);
  const topScore = Math.max(...scored.players.map(({ score }) => score));
  const leaders = scored.players.filter(({ score }) => score === topScore);
  const winner = leaders.length === 1 ? leaders[0].name : "Tie game";
  return {
    ...state,
    ...scored,
    currentTile: null,
    finished: true,
    winner,
    message: leaders.length === 1 ? `${winner} completed the strongest landscape.` : "The final scores are tied.",
  };
};

const advanceTile = (state, board, players, message) => {
  if (!state.deck.length) return finishGame({ ...state, board, players });
  const currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  return {
    ...state,
    board,
    players,
    currentPlayer,
    currentTile: state.deck[0],
    deck: state.deck.slice(1),
    turn: state.turn + 1,
    message: `${message} ${players[currentPlayer].name}'s turn.`,
  };
};

export const createCarcassonneGame = (names = ["Player 1", "Player 2"], random = Math.random) => {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  board[3][3] = {
    id: "start",
    label: "Starting village",
    center: "mixed",
    edges: { n: "city", e: "road", s: "field", w: "road" },
    follower: null,
  };
  const deck = shuffle(TILE_TEMPLATES.map((template, index) => ({
    ...template,
    edges: { ...template.edges },
    id: `tile-${index}`,
    follower: null,
  })), random).map((tile) => rotateTile(tile, Math.floor(random() * 4)));
  const players = names.map((name, index) => ({
    name: name.trim() || `Player ${index + 1}`,
    score: 0,
    followers: 5,
  }));

  return {
    board,
    players,
    currentPlayer: 0,
    currentTile: deck[0],
    deck: deck.slice(1),
    turn: 1,
    finished: false,
    winner: null,
    message: `${players[0].name} places the first tile.`,
  };
};

export const placeTile = (state, row, col, followerFeature = null) => {
  if (state.finished || !isLegalPlacement(state.board, state.currentTile, row, col)) {
    return { ...state, message: "Choose a highlighted space where every edge matches." };
  }
  const players = state.players.map((player) => ({ ...player }));
  if (followerFeature) {
    if (!players[state.currentPlayer].followers || !canPlaceFollower(state.board, state.currentTile, row, col, followerFeature)) {
      return { ...state, message: "That connected feature cannot take a follower." };
    }
    players[state.currentPlayer].followers -= 1;
  }

  const board = state.board.map((line) => [...line]);
  board[row][col] = {
    ...state.currentTile,
    follower: followerFeature ? { player: state.currentPlayer, feature: followerFeature } : null,
  };
  const scored = scoreCompletedFeatures(board, players);
  const message = scored.events.length ? scored.events.join(" ") : `${players[state.currentPlayer].name} placed ${state.currentTile.label}.`;
  return advanceTile(state, scored.board, scored.players, message);
};

export const discardTile = (state) => {
  if (state.finished || hasAnyPlacement(state.board, state.currentTile)) return state;
  return advanceTile(state, state.board, state.players, `${state.players[state.currentPlayer].name} discarded an unplayable tile.`);
};
