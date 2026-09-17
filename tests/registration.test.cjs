const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const source = ts.transpileModule(fs.readFileSync('app/api/register/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const valid = { code: 'spl3-test', acct: { email: 'manager@example.com', pass: 'password123' }, club: { short: 'ABC' }, kit: { hp: '#000000', ap: '#ffffff' }, squad: [] };
function harness({ invite, claim = true, clubError = null, playersError = null } = {}) {
  const calls = [];
  const admin = {
    auth: { admin: {
      createUser: async () => { calls.push('createUser'); return { data: { user: { id: 'user' } } }; },
      deleteUser: async () => { calls.push('deleteUser'); return {}; },
    } },
    from(table) {
      let action;
      const q = {
        select() { return q; }, eq() { return q; },
        update(value) { action = 'update'; calls.push([table, action, value]); return q; },
        insert(value) { action = 'insert'; calls.push([table, action, value]); return q; },
        delete() { action = 'delete'; return q; },
        async single() { return table === 'invites' ? { data: invite } : { data: { id: 'club' }, error: clubError }; },
        async maybeSingle() { return { data: claim ? { code: 'SPL3-TEST' } : null }; },
        then(resolve, reject) { return Promise.resolve({ error: table === 'players' ? playersError : null }).then(resolve, reject); },
      }; return q;
    },
  };
  const exports = {};
  vm.runInNewContext(source, { exports, console, require: name => name === 'next/server' ? { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } } : { supabaseAdmin: admin } });
  return { calls, post: body => exports.POST({ json: async () => body }) };
}
const invite = { club_name: 'Invited club', manager_email: valid.acct.email, used: false, season: 4, community: 'Test' };
test('malformed input does not create an account', async () => { const h = harness(); assert.equal((await h.post(null)).status, 400); assert.equal(h.calls.length, 0); });
for (const [name, value] of [['missing', null], ['used', { ...invite, used: true }], ['wrong email', { ...invite, manager_email: 'other@example.com' }]]) {
  test(`${name} invitation cannot create an account`, async () => { const h = harness({ invite: value }); assert.equal((await h.post(valid)).status, 403); assert.equal(h.calls.length, 0); });
}
test('failed concurrent claim removes new account', async () => { const h = harness({ invite, claim: false }); assert.equal((await h.post(valid)).status, 409); assert.ok(h.calls.includes('deleteUser')); });
test('club failure removes account and releases invite', async () => { const h = harness({ invite, clubError: { message: 'failure' } }); assert.equal((await h.post(valid)).status, 400); assert.ok(h.calls.includes('deleteUser')); assert.ok(h.calls.some(c => Array.isArray(c) && c[0] === 'invites' && c[2].used === false)); });
test('success uses trusted invitation club and season', async () => { const h = harness({ invite }); assert.equal((await h.post(valid)).status, 200); const row = h.calls.find(c => Array.isArray(c) && c[0] === 'clubs')[2]; assert.equal(row.name, invite.club_name); assert.equal(row.season, 4); });
test('player insert failure does not report success', async () => { const h = harness({ invite, playersError: { message: 'failure' } }); assert.equal((await h.post({ ...valid, squad: [{ name: 'Player', number: '1', pos: 'GK', dob: '' }] })).status, 400); assert.ok(h.calls.includes('deleteUser')); });
