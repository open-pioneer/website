// @ts-check
/**
 * Import & transform the Trails documentation from the `trails-starter` repo
 * into this Astro/Starlight site.
 *
 * Source : <trails-starter>/docs/**
 * Target : site_astro/src/content/docs/trails-docs/**
 *
 * Transformations (see ../../Vorgehen.txt for the original manual procedure):
 *   - README.md            -> index.md (folder index, no `slug`)
 *   - every other .md       -> frontmatter injected:
 *                               title: <first H1, plain text; fallback = filename>
 *                               slug:  trails-docs/<relative path without extension>
 *   - internal links        -> trailing `.md` removed (`./Foo.md` -> `./Foo`),
 *                              links to README.md -> the folder index.
 *                              External (http/https/mailto) and image links untouched.
 *   - ```patch fences       -> ```diff
 *   - all non-.md files     -> copied verbatim (images, .odt, ...)
 *
 * The target directory is wiped and regenerated on every run so that renames
 * and deletions in the source propagate. Other content under src/content/docs
 * (e.g. index.mdx) is left untouched.
 *
 * Usage:
 *   node scripts/import-trails-docs.mjs <path-to-trails-starter/docs>
 *   SOURCE_DOCS_DIR=<path> node scripts/import-trails-docs.mjs
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = path.resolve(scriptDir, "..", "src", "content", "docs", "trails-docs");
const TARGET_PREFIX = "trails-docs"; // slug prefix + content sub-directory

const sourceArg = process.argv[2] || process.env.SOURCE_DOCS_DIR;
if (!sourceArg) {
    console.error(
        "Error: missing source path.\n" +
            "Usage: node scripts/import-trails-docs.mjs <path-to-trails-starter/docs>"
    );
    process.exit(1);
}
const SOURCE_DIR = path.resolve(sourceArg);
if (!fs.existsSync(SOURCE_DIR) || !fs.statSync(SOURCE_DIR).isDirectory()) {
    console.error(`Error: source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
}

/** Collect every file (recursively) below `dir`, returned as paths relative to `dir`. */
function listFiles(dir, base = dir) {
    /** @type {string[]} */
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...listFiles(abs, base));
        } else if (entry.isFile()) {
            out.push(path.relative(base, abs));
        }
    }
    return out;
}

/** Reduce a Markdown heading to plain text for use as a frontmatter title. */
function headingToText(h) {
    return h
        .trim()
        .replace(/\s+#+\s*$/, "") // closing ATX hashes: "# Title #"
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
        .replace(/`([^`]*)`/g, "$1") // inline code
        .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
        .replace(/(\*|_)(.*?)\1/g, "$2") // italic
        .trim();
}

/** Find the first level-1 ATX heading, skipping fenced code blocks. */
function firstH1(markdown) {
    let inFence = false;
    let fence = "";
    for (const line of markdown.split(/\r?\n/)) {
        const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
        if (fenceMatch) {
            if (!inFence) {
                inFence = true;
                fence = fenceMatch[1][0];
            } else if (line.trim().startsWith(fence)) {
                inFence = false;
            }
            continue;
        }
        if (inFence) continue;
        const h = line.match(/^#\s+(.+?)\s*$/);
        if (h) return headingToText(h[1]);
    }
    return null;
}

/** Strip a leading YAML frontmatter block, returning the body only. */
function stripFrontmatter(text) {
    const m = text.match(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/);
    return m ? text.slice(m[0].length) : text.replace(/^﻿/, "");
}

/** Quote a value as a YAML scalar only when necessary (keeps output close to the PoC). */
function yamlScalar(s) {
    if (s === "") return '""';
    const needsQuote =
        /[:#\[\]{}&*!|>'"%@`,]/.test(s) ||
        /^[\s\-?]/.test(s) ||
        /\s$/.test(s) ||
        /^(true|false|null|yes|no|on|off|~)$/i.test(s);
    return needsQuote ? '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"' : s;
}

const isReadme = (name) => /^readme\.md$/i.test(name);

/** Rewrite a single relative link target (path part + optional #anchor). */
function rewriteLinkPath(target) {
    // Leave external links, absolute paths and pure anchors alone.
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(target)) return target;

    const hashIdx = target.search(/[#?]/);
    const pathPart = hashIdx === -1 ? target : target.slice(0, hashIdx);
    const suffix = hashIdx === -1 ? "" : target.slice(hashIdx);

    if (!/\.md$/i.test(pathPart)) return target;

    const base = path.posix.basename(pathPart);
    if (isReadme(base)) {
        // Link to a README -> that folder's index. Keep the directory part.
        const dir = pathPart.slice(0, pathPart.length - base.length);
        return (dir || "./") + suffix;
    }
    return pathPart.replace(/\.md$/i, "") + suffix;
}

/** Apply all in-body Markdown transformations. */
function transformBody(body) {
    // Inline links / images: ](target) or ](target "title")
    let out = body.replace(/\]\(\s*([^)\s]+)((?:\s+[^)]*)?)\)/g, (m, target, rest) => {
        return "](" + rewriteLinkPath(target) + rest + ")";
    });
    // Reference-style link definitions: [id]: target "title"
    out = out.replace(/^(\s*\[[^\]]+\]:\s*)(\S+)(.*)$/gm, (m, head, target, rest) => {
        return head + rewriteLinkPath(target) + rest;
    });
    // Code fences: ```patch -> ```diff (fence lines only).
    out = out.replace(/^(\s*(?:`{3,}|~{3,}))patch(\s*)$/gm, "$1diff$2");
    return out;
}

// ---- run ---------------------------------------------------------------

fs.rmSync(TARGET_DIR, { recursive: true, force: true });
fs.mkdirSync(TARGET_DIR, { recursive: true });

const files = listFiles(SOURCE_DIR);
let mdCount = 0;
let assetCount = 0;
let patchHits = 0;
let readmeMapped = 0;

for (const rel of files) {
    const relPosix = rel.split(path.sep).join("/");
    const srcAbs = path.join(SOURCE_DIR, rel);
    const dirPosix = path.posix.dirname(relPosix); // "." for root
    const baseName = path.posix.basename(relPosix);

    if (!/\.md$/i.test(baseName)) {
        // Non-Markdown asset: copy verbatim.
        const destAbs = path.join(TARGET_DIR, rel);
        fs.mkdirSync(path.dirname(destAbs), { recursive: true });
        fs.copyFileSync(srcAbs, destAbs);
        assetCount++;
        continue;
    }

    const raw = fs.readFileSync(srcAbs, "utf8");
    const body = transformBody(stripFrontmatter(raw).replace(/^\n+/, ""));
    if (/^(\s*(?:`{3,}|~{3,}))patch\s*$/m.test(stripFrontmatter(raw))) patchHits++;

    const readme = isReadme(baseName);
    const outName = readme ? "index.md" : baseName;
    const outRelPosix = dirPosix === "." ? outName : `${dirPosix}/${outName}`;

    const title =
        firstH1(body) || path.posix.basename(baseName, path.posix.extname(baseName));

    const fm = ["---", `title: ${yamlScalar(title)}`];
    if (!readme) {
        const slugPath = relPosix.replace(/\.md$/i, "");
        fm.push(`slug: ${yamlScalar(`${TARGET_PREFIX}/${slugPath}`)}`);
    } else {
        readmeMapped++;
    }
    fm.push("---", "");

    const destAbs = path.join(TARGET_DIR, outRelPosix.split("/").join(path.sep));
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    let outText = fm.join("\n") + "\n" + body;
    if (!outText.endsWith("\n")) outText += "\n";
    fs.writeFileSync(destAbs, outText);
    mdCount++;
}

console.log(
    `Imported docs from ${SOURCE_DIR}\n` +
        `  -> ${TARGET_DIR}\n` +
        `  Markdown pages: ${mdCount} (README->index: ${readmeMapped})\n` +
        `  Assets copied : ${assetCount}\n` +
        `  patch->diff fences rewritten: ${patchHits}`
);
