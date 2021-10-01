// tests ~ common code

export * from '../src/lib/$shared.ts';

//====

import { $colors, $path } from './$deps.ts';

import { intoPath, projectPath, projectURL, traversal } from '../src/lib/$shared.ts';

//===

export const isCI = Deno.env.get('CI');
export const isGHA = Deno.env.get('GITHUB_ACTIONS'); // ref: <https://docs.github.com/en/actions/learn-github-actions/environment-variables>

//====

// ToDO: [2021-09-16; rivy] * improved equivalency to NodeJS format/inspect string quoting requires changing the preference expressed [here](https://github.com/denoland/deno/blob/5d814a4c244d489b4ae51002a0cf1d3c2fe16058/ext/console/02_console.js#L648-L669)

const inspect = Deno.inspect;

// ref: <https://nodejs.org/api/util.html#util_util_format_format_args>
function toSpecFormat(specifier: string, value: unknown): string {
	if (specifier === '%s') {
		if (typeof value === 'string' || value instanceof String) {
			return value as string;
		} else return inspect(value, { depth: 2 });
	}
	if (specifier === '%d') {
		if (typeof value === 'bigint') {
			return value + 'n';
		}
		return Number(value).toString();
	}
	if (specifier === '%i') {
		if (typeof value === 'bigint') {
			return value + 'n';
		}
		return parseInt(value as string).toString();
	}
	if (specifier === '%f') {
		return parseFloat(value as string).toString();
	}
	if (specifier === '%j') {
		try {
			return JSON.stringify(value);
		} catch (e) {
			// nodeJS => 'cyclic object value' , deno => 'Converting circular structure to JSON ...'
			// ref: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify>
			if (e instanceof TypeError && e.message.match(/cyclic|circular/)) {
				return '[Circular]';
			} else throw e;
		}
	}
	if (specifier === '%o') {
		return inspect(value, { showHidden: true, showProxy: true });
	}
	if (specifier === '%O') {
		return inspect(value);
	}
	if (specifier === '%c') {
		return '';
	}
	return '';
}

// ref: <https://nodejs.org/docs/latest-v16.x/api/console.html#console_console_log_data_args>
// ref: <https://nodejs.org/docs/latest-v16.x/api/util.html#util_util_format_format_args>
// modified from <https://deno.land/std@0.105.0/node/util.ts#L247-L266>
export function format(...args: unknown[]) {
	const replacement: [number, string][] = [];
	const formatSpecifierRx = /%(s|d|i|f|j|o|O|c|%)/g;
	const hasFormatTemplate = args.length > 0 &&
		(typeof args[0] === 'string' || args[0] instanceof String);
	const formatTemplate = hasFormatTemplate ? (args[0] as string) : '';
	let i = hasFormatTemplate ? 1 : 0;
	let arr: RegExpExecArray | null = null;
	let done = false;
	while ((arr = formatSpecifierRx.exec(formatTemplate)) !== null && !done) {
		if (arr[0] === '%%') {
			replacement.push([arr['index'], '%']);
		} else if (i < args.length) {
			replacement.push([arr['index'], toSpecFormat(arr[0], args[i])]);
			i++;
		} else done = true;
	}
	const lastArgUsed = i;
	let result = '';
	let last = 0;
	for (let i = 0; i < replacement.length; i++) {
		const item = replacement[i];
		result += formatTemplate.slice(last, item[0]);
		result += item[1];
		last = item[0] + 2;
	}
	result += formatTemplate.slice(last);
	for (let i = lastArgUsed; i < args.length; i++) {
		if (i > 0) result += ' ';
		if (typeof args[i] === 'string') {
			result += args[i];
		} else result += inspect(args[i], { colors: true });
	}
	return result;
}

//====

type TestName = string;
const testLog: [TestName, (() => string) | string][] = [];
const testFilePathLineCounts: Map<string, number> = new Map();

function lineCount(filePath: string) {
	if (!testFilePathLineCounts.has(filePath)) {
		try {
			testFilePathLineCounts.set(
				filePath,
				Deno.readTextFileSync(traversal(filePath) ?? '').replace(/\r?\n$/ms, '').split(/\n/).length,
			);
		} catch (_) {
			console.error('`lineCount()`: error happened');
			// cache negative count as an error signal
			testFilePathLineCounts.set(filePath, -1);
		}
	}
	const count = testFilePathLineCounts.get(filePath);
	// console.error('`lineCount()`', { filePath, count });
	return ((count != undefined) && (count >= 0)) ? count : undefined;
}

function composeTestName(
	tag: string,
	description: string,
	options: { align: boolean } = { align: false },
) {
	const align = options.align;
	const padding = (() => {
		if (!align) return 0;
		const tagLineText = tag.match(/:(\d+)$/)?.[1];
		const tagLine = isNaN(Number(tagLineText)) ? -1 : Number(tagLineText);
		const maxLines = ((tagLine >= 0) ? lineCount(tag.replace(/(:\d+)*$/, '')) : undefined) ?? -1;
		return ((tagLine >= 0) && (maxLines >= 0) && (maxLines > tagLine))
			? ([...maxLines.toString()].length - [...tagLine.toString()].length)
			: 0;
	})();
	const filePathText =
		(tag
			? ($colors.dim($path.parse(tag).base.replace(/\d+\s*$/, (s) => '0'.repeat(padding) + s)) +
				' ')
			: '');
	return filePathText + $colors.bold(description);
}

export function createTestFn(testFilePath?: URL | string) {
	const pathOfTestFile = testFilePath && intoPath(testFilePath);
	function test(description: string, fn: () => void | Promise<void>, opts = {}) {
		const tag =
			(pathOfTestFile
				? pathOfTestFile
				: callersFromStackTrace().pop()?.replace(
					/:\d+$/,
					'',
				) /* remove trailing character position */) ?? '';
		const testName: TestName = composeTestName(tag, description, { align: !(pathOfTestFile) });
		Deno.test({
			name: testName,
			fn: async () => {
				// * capture `console.log()` and `console.warn()` messages via intercepts; display only on failure (as part of the error message)
				// ref: <https://stackoverflow.com/questions/9216441/intercept-calls-to-console-log-in-chrome> , <https://www.bayanbennett.com/posts/how-does-mdn-intercept-console-log-devlog-003> @@ <https://archive.is/dfg7H>
				// ref: <https://www.npmjs.com/package/output-interceptor>
				// * "lazy" formatting for `args`
				console.log = (...args) => {
					testLog.push([testName, () => format(...args)]);
				};
				console.warn = (...args) => {
					testLog.push([testName, () => format(...args)]);
				};
				try {
					await fn();
				} catch (e) {
					const logText = testLog.flatMap(([n, v]) =>
						n === testName ? [typeof v === 'function' ? (v as () => string)() : v] : []
					);
					if (logText.length > 0) {
						logText.unshift($colors.dim(`## test log:begin>`));
						logText.push($colors.dim(`## test log:end.`));
					}
					throw (new Error([''].concat(logText).concat([e.toString()]).join('\n')));
				}
			},
			...opts,
		});
	}
	return test;
}

export const test = createTestFn();

//===

function _isValidURL(s: string) {
	try {
		const _ = new URL(s, projectURL);
	} catch (_e) {
		return false;
	}
	return true;
}

function _toURL(s?: string, base: URL = projectURL) {
	if (!s) return undefined;
	try {
		return new URL(s, base);
	} catch (_e) {
		return undefined;
	}
}

export function relativePath(s: string | URL, base: string | URL = projectURL) {
	const url = (s instanceof URL) ? s : new URL(s, projectURL);
	const baseURL = (base instanceof URL) ? base : new URL(base, projectURL);
	const equalOrigin =
		(url.origin.localeCompare(baseURL.origin, undefined, { sensitivity: 'accent' }) == 0);
	// console.warn({ s, url, base, equalOrigin });
	if (equalOrigin) {
		return $path.relative(baseURL.pathname, url.pathname);
	} else {
		try {
			return $path.fromFileUrl(url);
		} catch (_e) {
			return url.href;
		}
	}
}

export function createWarnFn(testFilePath?: URL | string) {
	const path = testFilePath ? relativePath(testFilePath) : undefined;
	const base = path ? $path.parse(path).base : undefined;
	// console.warn({ projectPath, testFilePath, path, base });
	function warn(...args: unknown[]) {
		//# * for GHA CI, convert any warnings to GHA UI annotations; ref: <https://help.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-a-warning-message>
		const s = format(...args);
		if (isCI && isGHA) {
			console.log($colors.stripColor(`::warning ::${base ? (base + ': ') : ''}${s}`));
		} else console.warn($colors.dim(base || '*'), $colors.yellow('Warning:'), s);
	}
	return warn;
}

export const warn = createWarnFn();

//===

export const haveDPrint = () => {
	try {
		const process = Deno.run({
			cmd: ['dprint', '--version'],
			cwd: projectPath,
			stdin: 'null',
			stderr: 'null',
			stdout: 'null',
		});
		return (process.status()).then((status) => status.success).finally(() => process.close());
	} catch (_) {
		return Promise.resolve(false);
	}
};

export const haveGit = () => {
	try {
		const process = Deno.run({
			cmd: ['git', '--version'],
			cwd: projectPath,
			stdin: 'null',
			stderr: 'null',
			stdout: 'null',
		});
		return (process.status()).then((status) => status.success).finally(() => process.close());
	} catch (_) {
		return Promise.resolve(false);
	}
};

//=== * stack inspection functions

function getFramesFromError(error: Error): Array<string> {
	let stack: Error['stack'] | null, frames: string[];
	// retrieve stack from `Error`
	// ref: <https://github.com/winstonjs/winston/issues/401#issuecomment-61913086>
	try {
		stack = error.stack;
	} catch (e) {
		try {
			const previous = e.__previous__ || e.__previous;
			stack = previous && previous.stack;
		} catch (_) {
			stack = null;
		}
	}

	// handle different stack formats
	if (stack) {
		if (Array.isArray(stack)) {
			frames = Array(stack);
		} else {
			frames = stack.toString().split('\n');
		}
	} else {
		frames = [];
	}

	return frames;
}

function stackTrace() {
	// ref: <https://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception>
	// ref: [`get-current-line`](https://github.com/bevry/get-current-line/blob/9364df5392c89e9540314787493dbe142e8ce99d/source/index.ts)
	return getFramesFromError(new Error('stack trace'));
}

function callersFromStackTrace() {
	const callers = stackTrace()
		.slice(1)
		.map((s) => {
			const match = s.match(/^.*\s[(]?(.*?)[)]?$/m);
			if (!match) return undefined;
			else return match[1];
		})
		.filter(Boolean);
	return callers;
}
