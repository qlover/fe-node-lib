import test from 'ava';
import { Files } from '../../packages/lib/files.js';
import { resolve } from 'path';

test('should be print fe-node-lib package name', async (t) => {
  const pkg = Files.readJSON(resolve('./package.json'));
  t.is(pkg.name, '@qlover/fe-node-lib')
});
