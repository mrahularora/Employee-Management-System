import assert from "node:assert/strict";
import {
  createCarcassonneGame,
  legalPlacements,
  placeTile,
  rotateTile,
  scoreCompletedFeatures,
} from "./carcassonneGame.mjs";

let game = createCarcassonneGame(["Ada", "Grace"], () => 0.42);
assert.equal(game.board.length, 7);
assert.equal(game.board.flat().filter(Boolean).length, 1);
assert.deepEqual(rotateTile({ edges: { n: "city", e: "road", s: "field", w: "field" } }).edges, {
  n: "field", e: "city", s: "road", w: "field",
});

let placements = legalPlacements(game.board, game.currentTile);
for (let turns = 0; !placements.length && turns < 3; turns += 1) {
  game = { ...game, currentTile: rotateTile(game.currentTile) };
  placements = legalPlacements(game.board, game.currentTile);
}
assert.ok(placements.length > 0);
const placed = placeTile(game, placements[0].row, placements[0].col);
assert.equal(placed.board.flat().filter(Boolean).length, 2);
assert.equal(placed.currentPlayer, 1);
assert.equal(placed.deck.length, game.deck.length - 1);

const roadEnd = (edges, follower = null) => ({ label: "Road end", center: "road", edges, follower });
const board = Array.from({ length: 3 }, () => Array(3).fill(null));
board[1][0] = roadEnd({ n: "field", e: "road", s: "field", w: "field" }, { player: 0, feature: "road" });
board[1][1] = roadEnd({ n: "field", e: "field", s: "field", w: "road" });
const scored = scoreCompletedFeatures(board, [
  { name: "Ada", score: 0, followers: 4 },
  { name: "Grace", score: 0, followers: 5 },
]);
assert.equal(scored.players[0].score, 2);
assert.equal(scored.players[0].followers, 5);
assert.equal(scored.board[1][0].follower, null);

console.log("Carcassonne game checks passed");
