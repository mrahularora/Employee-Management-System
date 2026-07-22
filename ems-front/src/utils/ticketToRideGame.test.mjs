import assert from "node:assert/strict";
import {
  canClaim,
  createTicketGame,
  destinationScore,
  hasConnection,
  routePoints,
  ROUTES,
} from "./ticketToRideGame.mjs";

const game = createTicketGame(["Rahul", "Alex"], () => 0.25);
assert.equal(game.routes.length, 14);
assert.equal(game.players.length, 2);
assert.equal(Object.values(game.players[0].hand).reduce((total, count) => total + count, 0), 10);
assert.equal(routePoints(4), 7);

const route = { ...ROUTES[0], owner: null };
const readyPlayer = { ...game.players[0], hand: { ...game.players[0].hand, green: 3 } };
assert.equal(canClaim(readyPlayer, route), true);

const connectedRoutes = game.routes.map((current) => (
  ["van-cal", "cal-wpg", "wpg-tor"].includes(current.id) ? { ...current, owner: 0 } : current
));
assert.equal(hasConnection(connectedRoutes, 0, "Vancouver", "Toronto"), true);
assert.equal(hasConnection(connectedRoutes, 1, "Vancouver", "Toronto"), false);
assert.equal(destinationScore(connectedRoutes, 0, ["van-tor"]), 12);
assert.equal(destinationScore(connectedRoutes, 1, ["van-tor"]), -12);

console.log("Ticket to Ride game validation passed");
