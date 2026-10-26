import test from 'node:test';
import assert from 'node:assert/strict';
import {questions, remainingSeconds, formatTime} from '../questions.js';
import {server} from '../server.js';
test('each part has ten distinct, complete sample prompts', () => {
  for(const part of [1,2,3]) {assert.equal(questions[part].length,10); assert.equal(new Set(questions[part].map(q=>q.prompt)).size,10); for(const q of questions[part]) {assert.ok(q.topic); assert.ok(q.prompt);}}
  for(const q of questions[2]) {assert.equal(q.points.length,3); assert.ok(q.explain);}
});
test('countdown uses real elapsed time and never goes below zero', () => {
  assert.equal(remainingSeconds(61000,1000),60); assert.equal(remainingSeconds(121000,1000),120); assert.equal(remainingSeconds(61000,60500),1); assert.equal(remainingSeconds(61000,65000),0);
  assert.equal(formatTime(60),'01:00'); assert.equal(formatTime(120),'02:00'); assert.equal(formatTime(0),'00:00');
});
test('preview serves application assets and keeps repository files private', async () => {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {const base = `http://127.0.0.1:${server.address().port}`; for (const path of ['/','/app.js','/styles.css','/questions.js']) {const res = await fetch(base+path); assert.equal(res.status,200); assert.ok((await res.text()).length>0);}
    assert.equal((await fetch(base+'/.git/config')).status,404);
    assert.equal((await fetch(base+'/package.json')).status,404);
  } finally {await new Promise(resolve=>server.close(resolve));}
});
