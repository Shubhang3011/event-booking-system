import type { Request, Response } from 'express';
import { clearAuthCookie, setAuthCookie } from '../../lib/cookies';
import { sendData } from '../../lib/http';
import { signAuthToken } from '../../lib/jwt';
import * as authService from './auth.service';
import type { LoginInput, RegisterInput } from './auth.schema';

export async function register(req: Request, res: Response): Promise<void> {
  const user = await authService.registerUser(req.valid.body as RegisterInput);
  setAuthCookie(res, signAuthToken(user.id));
  sendData(res, user, 201);
}

export async function login(req: Request, res: Response): Promise<void> {
  const user = await authService.loginUser(req.valid.body as LoginInput);
  setAuthCookie(res, signAuthToken(user.id));
  sendData(res, user);
}

export async function logout(_req: Request, res: Response): Promise<void> {
  clearAuthCookie(res);
  sendData(res, { message: 'Signed out' });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.getUserById(req.userId as string);
  sendData(res, user);
}
