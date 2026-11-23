import test from 'node:test';
import assert from 'node:assert/strict';
import { addAddress, chooseDefaultAddress, removeAddress, updateAddress, validateProfile, validateSavedAddress } from './accountState.js';

const validAddress = { fullName: 'Jordan Lee', phone: '01012345678', city: 'Cairo', street: '10 Palm Street', apartment: '' };

test('profile validation requires name and a plausible phone number', () => {
  assert.deepEqual(validateProfile({ name: 'Jordan', phone: '01012345678' }), {});
  assert.ok(validateProfile({ name: ' ', phone: '123' }).phone);
});

test('saved address validation reuses required checkout address rules', () => {
  assert.deepEqual(validateSavedAddress(validAddress), {});
  assert.deepEqual(validateSavedAddress({ ...validAddress, city: '' }), { city: 'Enter your city.' });
});

test('first address becomes default; edits retain stable ID and default state', () => {
  const first = addAddress([], validAddress, 'addr-1');
  const second = addAddress(first, { ...validAddress, street: '22 Oak Road' }, 'addr-2');
  assert.deepEqual(first.map(({ id, isDefault }) => ({ id, isDefault })), [{ id: 'addr-1', isDefault: true }]);
  assert.equal(second[1].isDefault, false);
  const edited = updateAddress(second, 'addr-1', { street: '11 Pine Road', isDefault: false });
  assert.equal(edited[0].id, 'addr-1');
  assert.equal(edited[0].street, '11 Pine Road');
  assert.equal(edited.filter((address) => address.isDefault).length, 1);
});

test('choosing and deleting defaults preserves exactly one default when addresses remain', () => {
  const addresses = addAddress(addAddress([], validAddress, 'addr-1'), { ...validAddress, street: '22 Oak Road' }, 'addr-2');
  const selected = chooseDefaultAddress(addresses, 'addr-2');
  assert.deepEqual(selected.filter((address) => address.isDefault).map(({ id }) => id), ['addr-2']);
  const deletedDefault = removeAddress(selected, 'addr-2');
  assert.deepEqual(deletedDefault.filter((address) => address.isDefault).map(({ id }) => id), ['addr-1']);
  assert.deepEqual(removeAddress(deletedDefault, 'addr-1'), []);
});
