const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const src = ts.transpileModule(fs.readFileSync('lib/live.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', src)(m, m.exports);
const { applyLiveAction, emptyLive, matchClock } = m.exports;

const T = '2026-11-14T05:00:00.000Z';

test('goal taps add to the right team and flag the pop-up', () => {
  let s = emptyLive();
  s = applyLiveAction(s, { type: 'goal', side: 'home' }, T);
  s = applyLiveAction(s, { type: 'goal', side: 'away' }, T);
  s = applyLiveAction(s, { type: 'goal', side: 'home' }, T);
  assert.equal(s.home_score, 2);
  assert.equal(s.away_score, 1);
  assert.equal(s.last_goal_side, 'home');
});

test('undo removes a goal, never below zero, and clears that team pop-up', () => {
  let s = applyLiveAction(emptyLive(), { type: 'goal', side: 'away' }, T);
  s = applyLiveAction(s, { type: 'undo', side: 'away' }, T);
  assert.equal(s.away_score, 0);
  assert.equal(s.last_goal_side, null);
  assert.equal(typeof applyLiveAction(s, { type: 'undo', side: 'away' }, T), 'string');
});

test('period changes start and stop the clock', () => {
  let s = applyLiveAction(emptyLive(), { type: 'period', period: '1H' }, T);
  assert.equal(s.period_started_at, T);
  assert.equal(matchClock(s, Date.parse(T) + 754000), '12:34');
  // tapping Kick-off again later keeps the original start
  assert.equal(applyLiveAction(s, { type: 'period', period: '1H' }, '2026-11-14T05:20:00.000Z').period_started_at, T);
  s = applyLiveAction(s, { type: 'period', period: 'HT' }, T);
  assert.equal(matchClock(s, Date.parse(T)), 'HT');
  s = applyLiveAction(s, { type: 'period', period: '2H' }, T);
  assert.equal(matchClock(s, Date.parse(T) + 65000), '31:05');
  assert.equal(matchClock(emptyLive(), Date.parse(T)), '');
});

test('stepping back from a mis-tapped half time or full time keeps the clock', () => {
  const later = '2026-11-14T05:20:00.000Z';
  let s = applyLiveAction(emptyLive(), { type: 'period', period: '1H' }, T);
  s = applyLiveAction(s, { type: 'period', period: 'HT' }, later);
  s = applyLiveAction(s, { type: 'period', period: '1H' }, later);
  assert.equal(s.period_started_at, T);
  assert.equal(matchClock(s, Date.parse(T) + 754000), '12:34');
  s = applyLiveAction(s, { type: 'period', period: 'HT' }, later);
  s = applyLiveAction(s, { type: 'period', period: '2H' }, later);
  assert.equal(s.period_started_at, later); // a real 2nd half starts its own clock
  s = applyLiveAction(s, { type: 'period', period: 'FT' }, '2026-11-14T05:50:00.000Z');
  s = applyLiveAction(s, { type: 'period', period: '2H' }, '2026-11-14T05:51:00.000Z');
  assert.equal(s.period_started_at, later);
  assert.equal(applyLiveAction(s, { type: 'period', period: 'pre' }, later).period_started_at, null);
});

test('rejects bad scores and half lengths', () => {
  assert.equal(typeof applyLiveAction(emptyLive(), { type: 'score', home: -1, away: 0 }, T), 'string');
  assert.equal(typeof applyLiveAction(emptyLive(), { type: 'half_minutes', minutes: 0 }, T), 'string');
  const s = applyLiveAction(emptyLive(), { type: 'score', home: 3, away: 2 }, T);
  assert.equal(s.home_score + s.away_score, 5);
});
