import assert from "node:assert/strict";
import {
  createCodenamesGame,
  guessCard,
  remainingAgents,
  submitClue,
} from "./codenamesGame.mjs";

const game = createCodenamesGame(["Red", "Blue"], () => 0.42);
assert.equal(game.cards.length, 25);
assert.equal(remainingAgents(game.cards, "red"), 9);
assert.equal(remainingAgents(game.cards, "blue"), 8);
assert.equal(remainingAgents(game.cards, "neutral"), 7);
assert.equal(game.cards.filter(({ role }) => role === "assassin").length, 1);

const guessing = submitClue(game, "Nature", 2);
assert.equal(guessing.phase, "guess");
assert.equal(guessing.guessesRemaining, 3);

const ownAgent = guessing.cards.find(({ role }) => role === "red");
const correctGuess = guessCard(guessing, ownAgent.id);
assert.equal(correctGuess.cards.find(({ id }) => id === ownAgent.id).revealed, true);
assert.equal(correctGuess.guessesRemaining, 2);

const neutral = correctGuess.cards.find(({ role }) => role === "neutral");
assert.equal(guessCard(correctGuess, neutral.id).currentTeam, 1);

const assassinGame = submitClue(createCodenamesGame(["Red", "Blue"], () => 0.42), "Risk", 1);
const assassin = assassinGame.cards.find(({ role }) => role === "assassin");
assert.equal(guessCard(assassinGame, assassin.id).winner, "Blue");

console.log("Codenames game checks passed");
