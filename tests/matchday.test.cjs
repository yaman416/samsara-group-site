const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const src = ts.transpileModule(fs.readFileSync('lib/matchday.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', src)(m, m.exports);
const { leagueDateKey, pickMatchday, tallyGoals, validateMatchSheet } = m.exports;

const H = 'home', A = 'away';
const players = new Map([['h1', H], ['h2', H], ['a1', A], ['x1', 'other']]);
const sheet = (o = {}) => ({ fixture_id: 'f', home_score: 2, away_score: 1, goals: [], cards: [], ...o });
const goal = (player_id, club_id, o = {}) => ({ player_id, club_id, minute: 10, is_own_goal: false, is_penalty: false, ...o });

test('matchday dates use Canberra time', () => {
  // 7:15pm Saturday in Canberra is still Saturday morning UTC
  assert.equal(leagueDateKey('2026-11-14T08:15:00Z'), '2026-11-14');
  // 11:30pm UTC Friday is already Saturday in Canberra
  assert.equal(leagueDateKey('2026-11-13T13:30:00Z'), '2026-11-14');
});

test('picks today, then the next matchday, then the latest', () => {
  const days = ['2026-11-21', '2026-11-14', '2026-11-14', '2026-11-28'];
  assert.equal(pickMatchday(days, '2026-11-14'), '2026-11-14');
  assert.equal(pickMatchday(days, '2026-11-09'), '2026-11-14');
  assert.equal(pickMatchday(days, '2026-11-15'), '2026-11-21');
  assert.equal(pickMatchday(days, '2027-03-01'), '2026-11-28');
  assert.equal(pickMatchday([], '2026-11-14'), null);
});

test('own goals count for the other team', () => {
  assert.deepEqual(tallyGoals([goal('h1', H), goal('a1', A, { is_own_goal: true }), goal('a1', A)], H, A), { home: 2, away: 1 });
});

test('a valid sheet passes, with or without every scorer named', () => {
  assert.deepEqual(validateMatchSheet(sheet({ goals: [goal('h1', H), goal('a1', A, { is_own_goal: true }), goal('a1', A)], cards: [{ player_id: 'a1', card_type: 'yellow', minute: 50 }] }), H, A, players), []);
  assert.deepEqual(validateMatchSheet(sheet({ goals: [goal('h1', H)] }), H, A, players), []);
});

test('rejects more scorers than goals', () => {
  const e = validateMatchSheet(sheet({ home_score: 1, goals: [goal('h1', H), goal('h2', H)] }), H, A, players);
  assert.match(e.join(' '), /More goal scorers than goals/);
});

test('rejects players outside the two squads or credited to the wrong club', () => {
  assert.match(validateMatchSheet(sheet({ goals: [goal('x1', 'other')] }), H, A, players).join(' '), /not in either squad/);
  assert.match(validateMatchSheet(sheet({ goals: [goal('h1', A)] }), H, A, players).join(' '), /not in either squad/);
  assert.match(validateMatchSheet(sheet({ goals: [goal('nobody', H)] }), H, A, players).join(' '), /registered player/);
  assert.match(validateMatchSheet(sheet({ cards: [{ player_id: 'x1', card_type: 'red', minute: 1 }] }), H, A, players).join(' '), /registered player/);
});

test('rejects bad scores, card types and minutes', () => {
  assert.ok(validateMatchSheet(sheet({ home_score: -1 }), H, A, players).length);
  assert.ok(validateMatchSheet(sheet({ away_score: 1.5 }), H, A, players).length);
  assert.ok(validateMatchSheet(sheet({ cards: [{ player_id: 'h1', card_type: 'second_yellow', minute: 1 }] }), H, A, players).length);
  assert.ok(validateMatchSheet(sheet({ goals: [goal('h1', H, { minute: 200 })] }), H, A, players).length);
  assert.ok(validateMatchSheet(sheet({ goals: [goal('h1', H, { is_own_goal: true, is_penalty: true })] }), H, A, players).length);
});
