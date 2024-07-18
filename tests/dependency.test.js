import test from 'ava';
import { Dependency, Files } from '../packages/lib/index.js';
import { resolve } from 'path';

test('Local Ava has been installed', async (t) => {
  const result = await Dependency.checkDependency('ava');
  t.not(result.local, undefined);
  t.not(result.local.version, undefined);
});

test('An incorrect dependency(local and global)', async (t) => {
  const result = await Dependency.checkDependency('fe-nofound', true);
  t.is(result.local, undefined);
  t.is(result.global, undefined);
});

test('Local ava version is: 6.1.3', async (t) => {
  const pkg = Files.readJSON(resolve('./package.json'));
  const result = await Dependency.checkDependency('ava');
  t.is(result.local.version, '6.1.3');
  t.is(pkg.devDependencies.ava.includes(result.local.version), true);
});
