import * as fs from "fs";
import * as path from "path";

interface ScanDirOptions {
    extensions: string[]
}

export function isFile(file: string) {
    try {
        let stat = fs.statSync(file);
        return stat.isFile() || stat.isFIFO();
    } catch (err) {
        return false;
    }
}

export function scanDir(pathDir: string, options: ScanDirOptions): string[] {
    if (!path.isAbsolute(pathDir)) pathDir = path.join(process.mainModule.path, pathDir);

    if (options.extensions.length === 0) throw new Error("Extensions in empty.");

    let dirs: string[] = [];
    let files: string[] = [];

    try {
        dirs = fs.readdirSync(pathDir);
    } catch (e) {
        console.error("scanDir error > ", e);
    }

    for (const dir of dirs) {
        const file = path.join(pathDir, dir);
        if (isFile(file) && !!dir.match(new RegExp(`(${options.extensions.map((e) => `.${e}`).join('|')})$`, 'g'))) {
            files.push(path.join(pathDir, dir));
        } else if (!isFile(file)) {
            files = files.concat(scanDir(file, options));
        }
    }

    return files;
}

export function lcFirst(text: string) {
    return text.charAt(0).toLowerCase() + text.substr(1);
}