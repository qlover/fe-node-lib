import test from 'ava';
import { Env } from '../../packages/lib/env.js';

test('should be test env', async (t) => {
  const result = Env.get('NODE_ENV');
  // ava env is test
  t.is(result, 'test');
});

test('should be deleted after obtaining', async (t) => {
  process.env['test-destory'] = 1;
  const result = Env.get('test-destory', true);

  t.is(result, '1');
  t.is(Env.get('test-destory'), undefined);
});
