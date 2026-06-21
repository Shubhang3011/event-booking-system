import type { Request, Response } from 'express';
import { clearAuthCookie, setAuthCookie } from '../../lib/cookies';
import { sendData } from '../../lib/http';
import { signAuthToken } from '../../lib/jwt';
import * as authService from './auth.service';
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from './auth.schema';

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

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const user = await authService.updateProfile(req.userId as string, req.valid.body as UpdateProfileInput);
  sendData(res, user);
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  await authService.changePassword(req.userId as string, req.valid.body as ChangePasswordInput);
  sendData(res, { message: 'Password updated' });
}
