import test from 'node:test';
import assert from 'node:assert/strict';
import { createMood, IDLE_MS, OVERLOOKED_MS } from './mascot-mood.js';

test('idle threshold and activity recovery', () => {
  const mood = createMood();
  assert.equal(mood.tick(IDLE_MS - 1), 'normal');
  assert.equal(mood.tick(IDLE_MS), 'angry');
  assert.equal(mood.reason, 'idle');
  mood.activity(IDLE_MS + 1);
  assert.equal(mood.mode, 'normal');
});
test('page activity does not count as pet attention; acknowledgement gets a fresh grace period', () => {
  const mood = createMood();
  mood.activity(40000); mood.activity(80000);
  assert.equal(mood.tick(OVERLOOKED_MS), 'angry');
  assert.equal(mood.reason, 'overlooked');
  mood.activity(OVERLOOKED_MS + 1);
  assert.equal(mood.tick(OVERLOOKED_MS + 2), 'normal');
});
test('leaving overrides crystal, background activity cannot clear it, return restores crystal', () => {
  const mood = createMood();
  mood.spark(1000); assert.equal(mood.mode, 'crystal');
  mood.leave(); assert.equal(mood.mode, 'angry');
  mood.activity(2000, true); assert.equal(mood.mode, 'angry');
  mood.return(3000); assert.equal(mood.mode, 'crystal');
  assert.equal(mood.tick(3001), 'crystal');
});
test('pet interaction resets both clocks and crystal is transient', () => {
  const mood = createMood();
  mood.activity(OVERLOOKED_MS, true);
  assert.equal(mood.tick(OVERLOOKED_MS + IDLE_MS - 1), 'normal');
  mood.activity(140000, true); mood.spark(140000); assert.equal(mood.mode, 'crystal');
  assert.equal(mood.tick(143399), 'crystal');
  assert.equal(mood.tick(143400), 'normal');
});

test('automatic crystal never resets the idle clock and expires while away', () => {
 const mood = createMood(); mood.spark(44000); assert.equal(mood.tick(45000), 'angry');
 mood.leave(); mood.return(100000); assert.equal(mood.mode, 'normal');
});
