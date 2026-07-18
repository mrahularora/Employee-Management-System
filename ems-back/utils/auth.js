const crypto = require("crypto");
const { AuthenticationError } = require("apollo-server-express");

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const sign = (value) =>
  crypto.createHmac("sha256", process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "dev-secret")
    .update(value)
    .digest("base64url");

const createToken = (user) => {
  const payload = encode({ user, exp: Date.now() + 1000 * 60 * 60 * 8 });
  return `${payload}.${sign(payload)}`;
};

const verifyToken = (token) => {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || signature !== sign(payload)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.exp > Date.now() ? data.user : null;
  } catch {
    return null;
  }
};

const requireAuth = ({ user }) => {
  if (!user) throw new AuthenticationError("Unauthorized");
};

module.exports = { createToken, requireAuth, verifyToken };
