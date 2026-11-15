import {copyFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

/**
 * Copy the example page into dist and return its relative path.
 * @param {string} root Project directory.
 * @returns {Promise<string>} Relative path of the copied page.
 */
export const build = (root: string = process.cwd()): Promise<string> => {
    const dist: string = path.join(root, 'dist');
    const page: string = path.join('dist', 'index.html');
    return mkdir(dist, {'recursive': true})
        .then(() => copyFile(path.join(root, 'src', 'index.html'), path.join(root, page)))
        .then(() => page);
};
