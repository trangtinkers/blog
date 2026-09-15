import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { pathToRoot, slugTag } from "../util/path"
import { formatDate, getDate } from "./Date"
import { getPostType, postTypeLabel } from "./postTypes"

interface MetaboxOptions {
  /** Shown as "by <author>" — omit to leave the attribution out. */
  author?: string
  /** Append the number of notes carrying each tag, like Simon's `_tags.html`. */
  showTagCounts: boolean
}

const defaultOptions: MetaboxOptions = {
  showTagCounts: true,
}

/**
 * Sidebar summary for a typed post, modelled on the `.metabox` block in
 * Simon Willison's `item_base.html` descendants: one sentence saying what this
 * thing is and when it was posted, followed by its tags.
 *
 * Renders nothing on untyped notes, so it's safe to leave in the shared layout.
 */
export default ((userOpts?: Partial<MetaboxOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const Metabox: QuartzComponent = ({
    fileData,
    cfg,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const postType = getPostType(fileData)
    if (!postType) return null

    const date = getDate(cfg, fileData)
    const tags = fileData.frontmatter?.tags ?? []
    const baseDir = pathToRoot(fileData.slug!)

    const tagCounts = new Map<string, number>()
    if (opts.showTagCounts) {
      for (const f of allFiles) {
        for (const tag of f.frontmatter?.tags ?? []) {
          tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
        }
      }
    }

    return (
      <div class={classNames(displayClass, "metabox")}>
        <p class="this-is">
          This is a <strong>{postTypeLabel[postType]}</strong>
          {opts.author && <> by {opts.author}</>}
          {date && <>, posted on {formatDate(date, cfg.locale)}</>}.
        </p>
        {tags.length > 0 && (
          <div class="metabox-tags">
            {tags.map((tag) => (
              <a href={`${baseDir}/tags/${slugTag(tag)}`} class="internal item-tag" rel="tag">
                {tag}
                {opts.showTagCounts && tagCounts.has(tag) && <span>{tagCounts.get(tag)}</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  Metabox.css = `
.metabox {
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
}

.metabox .this-is {
  margin: 0;
  color: var(--darkgray);
}

.metabox .metabox-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
}

.metabox a.item-tag {
  background-color: var(--highlight);
  border-radius: 8px;
  padding: 0.15rem 0.4rem;
  white-space: nowrap;
  font-size: 0.8rem;
}

.metabox a.item-tag > span {
  color: var(--gray);
  margin-left: 0.3rem;
}
`

  return Metabox
}) satisfies QuartzComponentConstructor<Partial<MetaboxOptions>>
