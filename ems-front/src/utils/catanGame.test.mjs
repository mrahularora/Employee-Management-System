import assert from "node:assert/strict";
import {
  canAfford,
  COSTS,
  createBoard,
  createPlayers,
  payCost,
  produceResources,
  seedStartingSettlements,
} from "./catanGame.mjs";

const board = seedStartingSettlements(createBoard(() => 0.42));
assert.equal(board.length, 19);
assert.equal(board.filter(({ resource }) => resource === "desert").length, 1);
assert.equal(board.filter(({ owner }) => owner === 0).length, 2);
assert.equal(board.filter(({ owner }) => owner === 1).length, 2);
assert.equal(board.filter(({ number }) => number !== null).length, 18);

const players = createPlayers(["Rahul", "Alex"]);
const producingTile = { ...board.find(({ owner }) => owner === 0), resource: "wood", number: 6, city: true };
const produced = produceResources(players, [producingTile], 6);
assert.equal(produced[0].resources.wood, 3);
assert.equal(produced[1].resources.wood, 1);

const stocked = { ...players[0].resources, wood: 2, brick: 1 };
assert.equal(canAfford(stocked, COSTS.road), true);
assert.deepEqual(payCost(stocked, COSTS.road), { ...stocked, wood: 1, brick: 0 });

console.log("Catan game validation passed");
