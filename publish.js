import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

function run(cmd, args = []) {
	return new Promise((resolve, reject) => {
		const proc = spawn(cmd, args, { stdio: 'inherit' });
		proc.on('exit', code =>
			code === 0 ? resolve() : reject(new Error(`Command failed (${code}): ${cmd} ${args.join(' ')}`)),
		);
	});
}

async function git(cmd) {
	const { stdout } = await exec('git', cmd);
	return stdout.trim();
}

await run('git', ['remote', 'update']);

const [local, remote, base] = await Promise.all([
	git(['rev-parse', '@']),
	git(['rev-parse', '@{u}']),
	git(['merge-base', '@', '@{u}']),
]);

if (local !== remote && remote !== base) {
	throw new Error('Repository is behind upstream. Please pull first.');
}

await run('npm', ['run', 'format:fix']);
await run('npm', ['run', 'lint']);
await run('npm', ['run', 'rebuild']);
await run('npm', ['run', 'test:cov']);

const versionType = process.argv[2] ?? 'patch';
const isPre = versionType.startsWith('pre');

await run('npm', [
	'version',
	versionType,
	'--commit-hooks',
	'false',
	...(isPre ? ['--preid', 'next'] : []),
	'-m',
	'chore: release version %s',
]);

const dryRun = process.argv.includes('--dry');

if (!dryRun) {
	await run('npm', isPre ? ['publish', '--tag', 'next'] : ['publish']);
}

// eslint-disable-next-line no-console
console.log('✅ Release completed');
