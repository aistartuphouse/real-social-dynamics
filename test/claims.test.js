import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/lib/config.js';
import { preparationParagraph } from '../src/lib/claims.js';
import { EMAILS, renderText } from '../src/lib/email.js';

test('prerequisite wording switches between planned and approved policy (QA #11)', () => {
  const planned = loadConfig({ mode: 'production', preparationPolicyApproved: false });
  const approved = loadConfig({ mode: 'production', preparationPolicyApproved: true });
  assert.match(preparationParagraph(planned), /intended to support preparation/);
  assert.doesNotMatch(preparationParagraph(planned), /prerequisite/);
  assert.match(preparationParagraph(approved), /prerequisite to attendance/);
  const day11 = EMAILS.find((e) => e.id === 'day11-preparation');
  assert.match(renderText(day11, planned), /We are developing a preparation path/);
  assert.doesNotMatch(renderText(day11, planned), /must be completed/);
  assert.match(renderText(day11, approved), /must be completed/);
});
