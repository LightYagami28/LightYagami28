import {build} from './build.ts';
import {run as runCheck} from './seo-check.ts';

export interface Output {
    readonly log: (line: string) => void;
    readonly error: (line: string) => void;
}

const FIRST = 0;
const SECOND = 1;
const SKIP = 1;

/**
 * Run a command line: `build` or `seo <page>`.
 * @param {readonly string[]} args Arguments without the interpreter.
 * @param {Output} out Where lines are written.
 * @returns {Promise<number>} Process exit code.
 */
export const main = (args: readonly string[], out: Output = console): Promise<number> => {
    if (args[FIRST] === 'build') {
        return build().then((page: string): number => {
            out.log(`build: ${page}`);
            return 0;
        });
    }
    return runCheck(args[SECOND] ?? '').then(({code, message}): number => {
        (code === 0 ? out.log : out.error)(message);
        return code;
    });
};

/**
 * Entry point used by the npm scripts.
 * @param {readonly string[]} argv Arguments after the script name.
 * @returns {Promise<void>} Resolves once the exit code is set.
 */
export const start = (argv: readonly string[] = process.argv.slice(SKIP)): Promise<void> =>
    main(argv).then((code: number): void => {
        process.exitCode = code;
    });
