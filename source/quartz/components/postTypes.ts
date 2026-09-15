import { QuartzPluginData } from "../plugins/vfile"

/**
 * Post types, modelled on the content types Simon Willison's blog keeps as
 * separate Django models (Entry, Blogmark, Quotation, Note). Here they're just
 * a `type:` field in frontmatter, and the components that render them gate
 * themselves on it.
 */
export type PostType = "blogmark" | "quotation" | "note" | "entry"

const knownTypes: string[] = ["blogmark", "quotation", "note", "entry"]

export const postTypeLabel: Record<PostType, string> = {
  blogmark: "link post",
  quotation: "quotation",
  note: "note",
  entry: "entry",
}

export function getPostType(fileData: QuartzPluginData): PostType | undefined {
  const raw = fileData.frontmatter?.type
  if (typeof raw !== "string") return undefined
  const normalized = raw.trim().toLowerCase()
  return knownTypes.includes(normalized) ? (normalized as PostType) : undefined
}

/** Read a string frontmatter field, treating blank values as absent. */
export function field(fileData: QuartzPluginData, key: string): string | undefined {
  const value = fileData.frontmatter?.[key]
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
