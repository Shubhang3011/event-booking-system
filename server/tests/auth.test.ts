import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

const valid = { name: 'Ada Lovelace', email: 'ada@test.dev', password: 'password123' };

describe('Auth', () => {
  it('registers a user, returns it without the password hash, and sets a cookie', async () => {
    const res = await request(app).post('/api/auth/register').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('ada@test.dev');
    expect(res.body.data).not.toHaveProperty('passwordHash');
    expect(res.headers['set-cookie']?.[0]).toMatch(/ebs_token=/);
    expect(res.headers['set-cookie']?.[0]).toMatch(/HttpOnly/i);
  });

  it('rejects duplicate emails with 409', async () => {
    await request(app).post('/api/auth/register').send(valid);
    const res = await request(app).post('/api/auth/register').send(valid);
    expect(res.status).toBe(409);
  });

  it('rejects weak passwords with 422', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...valid, password: 'short' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('logs in with valid credentials and rejects bad ones with the same message', async () => {
    await request(app).post('/api/auth/register').send(valid);

    const ok = await request(app).post('/api/auth/login').send({ email: valid.email, password: valid.password });
    expect(ok.status).toBe(200);

    const wrongPass = await request(app).post('/api/auth/login').send({ email: valid.email, password: 'wrongpass1' });
    const wrongUser = await request(app).post('/api/auth/login').send({ email: 'nobody@test.dev', password: 'whatever12' });
    expect(wrongPass.status).toBe(401);
    expect(wrongUser.status).toBe(401);
    // Identical message → no account enumeration.
    expect(wrongPass.body.error.message).toBe(wrongUser.body.error.message);
  });

  it('protects /me and returns the user when authenticated', async () => {
    const anon = await request(app).get('/api/auth/me');
    expect(anon.status).toBe(401);

    const agent = request.agent(app);
    await agent.post('/api/auth/register').send(valid);
    const me = await agent.get('/api/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe(valid.email);
  });

  it('clears the cookie on logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']?.[0]).toMatch(/ebs_token=;/);
  });
});
