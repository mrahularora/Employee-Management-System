const crypto = require("crypto");
const { GraphQLError } = require("graphql");
const User = require("../models/User");

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const normalizeUsername = (username) => String(username || "").trim().toLowerCase();
const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    throw new GraphQLError("Password must be between 8 and 128 characters", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
};

const scrypt = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => (error ? reject(error) : resolve(key)));
  });

const hashPassword = async (password) => {
  validatePassword(password);
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt);
  return { passwordHash: hash.toString("hex"), passwordSalt: salt };
};

const verifyPassword = async (password, salt, storedHash) => {
  const actual = await scrypt(String(password || ""), salt);
  const expected = Buffer.from(storedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

const authSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters");
  }
  return secret;
};

const sign = (value) => crypto.createHmac("sha256", authSecret()).update(value).digest("base64url");

const createToken = (user) => {
  const payload = encode({
    id: String(user.id || user._id),
    username: user.username,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 8,
  });
  return `${payload}.${sign(payload)}`;
};

const verifyToken = (token) => {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;

  try {
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(actual, expected)) return null;

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.exp > Date.now() && data.id ? data : null;
  } catch {
    return null;
  }
};

const authenticateToken = async (token) => {
  const identity = verifyToken(token);
  if (!identity) return null;

  const user = await User.findOne({ _id: identity.id, active: true }).lean();
  return user
    ? { id: String(user._id), username: user.username, role: user.role }
    : null;
};

const requireAuth = ({ user }) => {
  if (!user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

const requireAdmin = (context) => {
  requireAuth(context);
  if (context.user.role !== "admin") {
    throw new GraphQLError("Administrator access is required", {
      extensions: { code: "FORBIDDEN" },
    });
  }
};

const ensureInitialAdmin = async () => {
  if (await User.exists({ role: "admin" })) return;

  const username = normalizeUsername(process.env.ADMIN_USERNAME);
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required to create the initial admin");
  }

  const credentials = await hashPassword(password);
  await User.create({ username, ...credentials, role: "admin" });
  console.log(`Initial admin account created: ${username}`);
};

module.exports = {
  authenticateToken,
  createToken,
  ensureInitialAdmin,
  hashPassword,
  normalizeUsername,
  requireAdmin,
  requireAuth,
  verifyPassword,
  verifyToken,
};
