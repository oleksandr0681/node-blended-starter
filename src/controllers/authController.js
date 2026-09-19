import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCokies } from '../services/auth.js';
import { Session } from '../models/session.js';

export async function registerUser(req, res) {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new createHttpError(400, 'This email in use.');
  }

  const hashedPasswod = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPasswod });
  const newSession = await createSession(newUser._id);
  setSessionCokies(res, newSession);

  res.status(201).json(newUser);
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new createHttpError(401, 'Invalid credentials.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new createHttpError(401, 'Invalid credentials.');
  }

  await Session.deleteOne({ userId: user._id });
  const newSession = await createSession(user._id);
  setSessionCokies(res, newSession);

  res.status(200).json(user);
}

export async function logoutUser(req, res) {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function refreshUserSession(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw new createHttpError(401, 'Missing session credentials.');
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw new createHttpError(401, 'Session not found.');
  }

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();
  if (isRefreshTokenExpired) {
    await Session.deleteOne();
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    throw new createHttpError(401, 'Session token expired.');
  }

  await Session.deleteOne();
  const newSession = await createSession(session.userId);
  setSessionCokies(res, newSession);

  res.status(200).json({
    message: 'Session is refreshed.',
  });
}
