import assert from "node:assert/strict";
import {
  applyInfections,
  createPandemicGame,
  discoverCure,
  endTurn,
  movePlayer,
  treatDisease,
} from "./pandemicGame.mjs";

const game = createPandemicGame(["Ada", "Grace"], () => 0.42);
assert.equal(game.players.length, 2);
assert.equal(game.players[0].hand.length, 4);
assert.equal(game.cities.atlanta.station, true);
assert.equal(Object.values(game.cities).filter(({ cubes }) => cubes > 0).length, 6);

const moved = movePlayer(game, "montreal");
assert.equal(moved.players[0].city, "montreal");
assert.equal(moved.actionsRemaining, 3);

const medicState = {
  ...game,
  cities: { ...game.cities, atlanta: { ...game.cities.atlanta, cubes: 3 } },
};
assert.equal(treatDisease(medicState).cities.atlanta.cubes, 0);

const outbreakState = applyInfections(medicState, ["atlanta"]);
assert.equal(outbreakState.outbreaks, 1);
assert.ok(outbreakState.cities.montreal.cubes > game.cities.montreal.cubes);

const scientistState = {
  ...game,
  currentPlayer: 1,
  players: game.players.map((player, index) => index === 1
    ? { ...player, hand: ["atlanta", "montreal", "london"] }
    : player),
};
const cured = discoverCure(scientistState, "blue");
assert.equal(cured.cures.blue, true);
assert.equal(cured.players[1].hand.length, 0);

const victory = discoverCure({
  ...scientistState,
  cures: { blue: true, yellow: true, black: true, red: false },
  players: scientistState.players.map((player, index) => index === 1
    ? { ...player, hand: ["tokyo", "manila", "sydney"] }
    : player),
}, "red");
assert.equal(victory.finished, true);
assert.equal(victory.status, "won");

const nextTurn = endTurn(game);
assert.equal(nextTurn.currentPlayer, 1);
assert.equal(nextTurn.players[0].hand.length, 6);
assert.equal(nextTurn.actionsRemaining, 4);

console.log("Pandemic game checks passed");
