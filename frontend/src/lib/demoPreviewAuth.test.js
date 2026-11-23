import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesDemoPreviewCredentials } from './demoPreviewAuth.js';

const acceptedCredentials = { email: 'demo@smartatlas.test', password: 'SmartAtlasDemo2026!' };

test('development demo preview accepts the supplied credentials', () => {
  assert.equal(matchesDemoPreviewCredentials(acceptedCredentials, true), true);
  assert.equal(matchesDemoPreviewCredentials({ ...acceptedCredentials, email: ' DEMO@smartatlas.test ' }, true), true);
});

test('development demo preview rejects incorrect credentials', () => {
  assert.equal(matchesDemoPreviewCredentials({ ...acceptedCredentials, password: 'wrong' }, true), false);
  assert.equal(matchesDemoPreviewCredentials({ ...acceptedCredentials, email: 'other@smartatlas.test' }, true), false);
});

test('demo preview credentials are disabled outside development', () => {
  assert.equal(matchesDemoPreviewCredentials(acceptedCredentials, false), false);
});
