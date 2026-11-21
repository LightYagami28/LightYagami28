import {readFile} from 'node:fs/promises';
import path from 'node:path';

type Rule = readonly [RegExp, string];

export interface Outcome {
    readonly code: number;
    readonly message: string;
}

const RULES: readonly Rule[] = [
    [/<html[^>]*\blang="[^"]+"/iu, 'manca lang su <html>'],
    [/<title>[^<]{10,70}<\/title>/iu, 'title assente o lunghezza fuori da 10-70'],
    [
        /<meta\s+name="description"\s+content="[^"]{50,160}"/iu,
        'meta description assente o lunghezza fuori da 50-160',
    ],
    [/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/iu, 'manca il link canonical'],
];
const EXACT_HEADINGS = 1;

/**
 * Resolve a path and refuse the ones outside the base directory.
 * @param {string} argument Path requested by the caller.
 * @param {string} base Allowed base directory.
 * @returns {string} Absolute path inside the base directory.
 */
export const safePath = (argument: string, base: string = process.cwd()): string => {
    const resolved: string = path.resolve(base, argument);
    const relative: string = path.relative(base, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error('percorso fuori dalla cartella di lavoro');
    }
    return resolved;
};

/**
 * Check the SEO rules on a page.
 * @param {string} html Page source.
 * @returns {string[]} Messages of the failed rules.
 */
export const check = (html: string): string[] => {
    const errors: string[] = RULES.filter(([rule]) => !rule.test(html)).map(([, message]) => message);
    const headings: RegExpMatchArray | [] = html.match(/<h1[\s>]/giu) ?? [];
    return headings.length === EXACT_HEADINGS ? errors : [...errors, 'serve esattamente un h1'];
};

/**
 * Check a page file and describe the result.
 * @param {string} argument Page path.
 * @param {string} base Base directory.
 * @returns {Promise<Outcome>} Exit code and message.
 */
export const run = (argument: string, base: string = process.cwd()): Promise<Outcome> =>
    readFile(safePath(argument, base), 'utf8').then((html: string): Outcome => {
        const errors: string[] = check(html);
        return errors.length === 0
            ? {'code': 0, 'message': 'seo:check ok'}
            : {'code': 1, 'message': errors.join('\n')};
    });
