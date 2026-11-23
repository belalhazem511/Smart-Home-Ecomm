import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAuthForm, validateEmail } from './authValidation.js';

test('email validation rejects missing and malformed addresses', () => {
  assert.equal(validateEmail('person@example.com'), true);
  assert.equal(validateEmail('not-an-email'), false);
});

test('sign in requires email and a non-empty password', () => {
  assert.deepEqual(validateAuthForm('sign-in', { email: 'person@example.com', password: '' }), { password: 'Enter your password.' });
});

test('sign up requires a name and matching password within provisional limits', () => {
  const errors = validateAuthForm('sign-up', { name: '', email: 'person@example.com', password: 'short', confirmPassword: 'different' });
  assert.equal(errors.name, 'Enter your name.');
  assert.equal(errors.password, 'Use at least 15 characters.');
  assert.equal(errors.confirmPassword, 'Passwords do not match.');
  assert.deepEqual(validateAuthForm('sign-up', { name: 'Sam Lee', email: 'person@example.com', password: 'correct horse battery staple', confirmPassword: 'correct horse battery staple' }), {});
});

test('passwords over the UI maximum are rejected without truncation', () => {
  const longPassword = 'x'.repeat(129);
  assert.equal(validateAuthForm('sign-up', { name: 'Sam', email: 'person@example.com', password: longPassword, confirmPassword: longPassword }).password, 'Use no more than 128 characters.');
});

test('forgot password validates an email only', () => {
  assert.deepEqual(validateAuthForm('forgot-password', { email: 'bad' }), { email: 'Enter a valid email address.' });
});
