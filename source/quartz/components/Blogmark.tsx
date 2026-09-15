import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { field, getPostType } from "./postTypes"

/**
 * The link line of a blogmark (link post): the outbound link, plus an optional
 * "(via)" credit. The commentary is just the note body, which renders after
 * this, so place this component in `beforeBody`.
 *
 * Frontmatter:
 *   type: blogmark
 *   link_url:   required — the URL being linked to
 *   link_title: optional — defaults to the note title
 *   via_url:    optional — where you found it
 *   via_title:  optional — tooltip for the via link
 */
const Blogmark: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  if (getPostType(fileData) !== "blogmark") return null

  const linkUrl = field(fileData, "link_url")
  if (!linkUrl) return null

  const linkTitle = field(fileData, "link_title") ?? field(fileData, "title") ?? linkUrl
  const viaUrl = field(fileData, "via_url")
  const viaTitle = field(fileData, "via_title")

  return (
    <p class={classNames(displayClass, "blogmark-link")}>
      <strong>
        <a href={linkUrl} class="external" rel="noopener noreferrer">
          {linkTitle}
        </a>
      </strong>
      {viaUrl && (
        <span class="blogmark-via">
          {" ("}
          <a href={viaUrl} title={viaTitle ?? "via"} class="external" rel="noopener noreferrer">
            via
          </a>
          {viaTitle && <span class="blogmark-via-title"> {viaTitle}</span>}
          {")"}
        </span>
      )}
    </p>
  )
}

Blogmark.css = `
.blogmark-link {
  margin: 0.5rem 0 1rem 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

.blogmark-link .blogmark-via,
.blogmark-link .blogmark-via-title {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--gray);
}

.blogmark-link .blogmark-via a {
  color: var(--gray);
}
`

export default (() => Blogmark) satisfies QuartzComponentConstructor
