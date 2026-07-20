const assert = require("node:assert/strict");

process.env.AUTH_SECRET = "test-secret-with-at-least-thirty-two-characters";

const {
  createToken,
  hashPassword,
  normalizeUsername,
  requireAdmin,
  verifyPassword,
  verifyToken,
} = require("./auth");

async function run() {
  const credentials = await hashPassword("correct-password");
  assert.equal(await verifyPassword("correct-password", credentials.passwordSalt, credentials.passwordHash), true);
  assert.equal(await verifyPassword("wrong-password", credentials.passwordSalt, credentials.passwordHash), false);
  assert.equal(normalizeUsername("  New.User  "), "new.user");

  const user = { id: "507f1f77bcf86cd799439011", username: "admin", role: "admin" };
  const token = createToken(user);
  assert.deepEqual(
    (({ id, username, role }) => ({ id, username, role }))(verifyToken(token)),
    user
  );
  assert.equal(verifyToken(`${token}x`), null);
  assert.doesNotThrow(() => requireAdmin({ user }));
  assert.throws(
    () => requireAdmin({ user: { ...user, role: "user" } }),
    (error) => error.extensions?.code === "FORBIDDEN"
  );

  console.log("Authentication validation passed");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
