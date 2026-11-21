const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const src = ts.transpileModule(fs.readFileSync('lib/live.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', src)(m, m.exports);
const { applyLiveAction, emptyLive, matchClock, savesResultAtFullTime } = m.exports;

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
  assert.equal(s.period_started_at, null);
  assert.equal(matchClock(s, Date.parse(T)), 'HT');
  s = applyLiveAction(s, { type: 'period', period: '2H' }, T);
  assert.equal(matchClock(s, Date.parse(T) + 65000), '31:05');
  assert.equal(matchClock(emptyLive(), Date.parse(T)), '');
});

test('rejects bad scores and half lengths', () => {
  assert.equal(typeof applyLiveAction(emptyLive(), { type: 'score', home: -1, away: 0 }, T), 'string');
  assert.equal(typeof applyLiveAction(emptyLive(), { type: 'half_minutes', minutes: 0 }, T), 'string');
  const s = applyLiveAction(emptyLive(), { type: 'score', home: 3, away: 2 }, T);
  assert.equal(s.home_score + s.away_score, 5);
});

test('pause holds the clock, resume carries on, adjust moves it, reset clears it', () => {
  let s = applyLiveAction(emptyLive(), { type: 'period', period: '1H' }, T);
  const at = m => Date.parse(T) + m * 60000;
  s = applyLiveAction(s, { type: 'pause' }, new Date(at(10)).toISOString());
  assert.equal(matchClock(s, at(15)), '10:00');
  s = applyLiveAction(s, { type: 'resume' }, new Date(at(15)).toISOString());
  assert.equal(s.paused_at, null);
  assert.equal(matchClock(s, at(16)), '11:00');
  s = applyLiveAction(s, { type: 'adjust', seconds: 60 }, new Date(at(16)).toISOString());
  assert.equal(matchClock(s, at(16)), '12:00');
  s = applyLiveAction(s, { type: 'adjust', seconds: -3600 }, new Date(at(16)).toISOString());
  assert.equal(matchClock(s, at(16)), '00:00');
  s = applyLiveAction(s, { type: 'goal', side: 'home' }, T);
  s = applyLiveAction(s, { type: 'period', period: 'FT' }, T);
  s = applyLiveAction(s, { type: 'reset' }, T);
  assert.deepEqual([s.period, s.home_score, s.period_started_at], ['pre', 0, null]);
  assert.equal(typeof applyLiveAction(s, { type: 'pause' }, T), 'string');
});

test('live minute follows football convention and the 2nd half carries on from the half length', () => {
  const { liveMinute } = m.exports;
  const start = Date.parse(T);
  assert.equal(liveMinute({ ...emptyLive(), period: 'pre' }, start), null);
  assert.equal(liveMinute({ ...emptyLive(), period: '1H', period_started_at: T }, start + 30e3), 1);
  assert.equal(liveMinute({ ...emptyLive(), period: '1H', period_started_at: T }, start + 22 * 60e3 + 5e3), 23);
  assert.equal(liveMinute({ ...emptyLive(), period: '2H', period_started_at: T }, start + 60e3 + 1e3), 32);
  assert.equal(liveMinute({ ...emptyLive(), period: 'HT' }, start), null);
});

test('full time saves the result; score changes after full time keep it in step', () => {
  const ft = { ...emptyLive(), period: 'FT' };
  assert.equal(savesResultAtFullTime(ft, { type: 'period', period: 'FT' }), true);
  assert.equal(savesResultAtFullTime(ft, { type: 'goal', side: 'home' }), true);
  assert.equal(savesResultAtFullTime(ft, { type: 'undo', side: 'away' }), true);
  assert.equal(savesResultAtFullTime(ft, { type: 'score', home: 2, away: 1 }), true);
  assert.equal(savesResultAtFullTime(ft, { type: 'half_minutes', minutes: 30 }), false);
  assert.equal(savesResultAtFullTime({ ...emptyLive(), period: '2H' }, { type: 'goal', side: 'home' }), false);
  assert.equal(savesResultAtFullTime({ ...emptyLive(), period: 'HT' }, { type: 'period', period: 'HT' }), false);
});
