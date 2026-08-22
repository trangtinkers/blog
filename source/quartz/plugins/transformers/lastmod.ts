import fs from "fs"
import path from "path"
import { execFileSync } from "child_process"
import { QuartzTransformerPlugin } from "../types"
import chalk from "chalk"

export interface Options {
  priority: ("frontmatter" | "git" | "filesystem")[]
}

const defaultOptions: Options = {
  priority: ["frontmatter", "git", "filesystem"],
}

function coerceDate(fp: string, d: any): Date {
  const dt = new Date(d)
  const invalidDate = isNaN(dt.getTime()) || dt.getTime() === 0
  if (invalidDate && d !== undefined) {
    console.log(
      chalk.yellow(
        `\nWarning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`,
      ),
    )
  }

  return invalidDate ? new Date() : dt
}

/**
 * Walk the whole history once and record, for every tracked file, the timestamp
 * of the most recent commit that changed it. Keys are absolute posix paths.
 *
 * `-m --first-parent` matters: without it a merge commit reports no files at
 * all, so notes whose last change arrived through a merge would look untracked
 * and fall back to the filesystem mtime (i.e. "modified just now" on every CI
 * build). The repo root may sit above `cwd`, so paths are rebased onto it.
 */
function buildGitDateMap(cwd: string): Map<string, number> {
  const run = (args: string[]) =>
    execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 512 * 1024 * 1024 })

  const root = run(["rev-parse", "--show-toplevel"]).trim()
  // `-z` NUL-separates filenames, which also turns off git's path quoting —
  // without it, names containing accents, em-dashes or `"` come back C-escaped
  // and never match the file on disk. \x01 then delimits commits.
  const log = run([
    "log",
    "-m",
    "--first-parent",
    "--no-renames",
    "--name-only",
    "-z",
    "--format=%x01%ct",
  ])

  const dates = new Map<string, number>()
  for (const commit of log.split("\x01").slice(1)) {
    const [timestamp, ...files] = commit.split("\0")
    const modified = Number(timestamp) * 1000
    for (const file of files) {
      // the first filename carries the newline that ended the format line
      const rel = file.replace(/^[\r\n]+/, "")
      if (rel === "") continue
      const abs = path.posix.join(root, rel)
      // first occurrence wins: git log is newest-first
      if (!dates.has(abs)) {
        dates.set(abs, modified)
      }
    }
  }

  return dates
}

type MaybeDate = undefined | string | number
export const CreatedModifiedDate: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "CreatedModifiedDate",
    markdownPlugins() {
      return [
        () => {
          let gitDates: Map<string, number> | undefined = undefined
          return async (_tree, file) => {
            let created: MaybeDate = undefined
            let modified: MaybeDate = undefined
            let published: MaybeDate = undefined

            const fp = file.data.filePath!
            const fullFp = path.isAbsolute(fp) ? fp : path.posix.join(file.cwd, fp)
            for (const source of opts.priority) {
              if (source === "filesystem") {
                const st = await fs.promises.stat(fullFp)
                created ||= st.birthtimeMs
                modified ||= st.mtimeMs
              } else if (source === "frontmatter" && file.data.frontmatter) {
                created ||= file.data.frontmatter.date as MaybeDate
                modified ||= file.data.frontmatter.lastmod as MaybeDate
                modified ||= file.data.frontmatter.updated as MaybeDate
                modified ||= file.data.frontmatter["last-modified"] as MaybeDate
                published ||= file.data.frontmatter.publishDate as MaybeDate
              } else if (source === "git") {
                if (!gitDates) {
                  try {
                    gitDates = buildGitDateMap(file.cwd)
                  } catch (err) {
                    gitDates = new Map()
                    console.log(
                      chalk.yellow(
                        `\nWarning: could not read git history (${err}), falling back to other date sources`,
                      ),
                    )
                  }
                }

                const gitModified = gitDates.get(fullFp)
                if (gitModified === undefined) {
                  console.log(
                    chalk.yellow(
                      `\nWarning: ${file.data
                        .filePath!} isn't yet tracked by git, last modification date is not available for this file`,
                    ),
                  )
                } else {
                  modified ||= gitModified
                }
              }
            }

            file.data.dates = {
              created: coerceDate(fp, created),
              modified: coerceDate(fp, modified),
              published: coerceDate(fp, published),
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    dates: {
      created: Date
      modified: Date
      published: Date
    }
  }
}
