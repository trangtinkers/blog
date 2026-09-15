import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { field, getPostType } from "./postTypes"

/**
 * The attribution line under a saved quote. The quote itself is the note body
 * (write it as a normal markdown blockquote), so this belongs in `afterBody`.
 *
 * Frontmatter:
 *   type: quotation
 *   source:     required — who said it
 *   source_url: optional — link for the source
 *   context:    optional — where/when, appended after the source
 */
const Quotation: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  if (getPostType(fileData) !== "quotation") return null

  const source = field(fileData, "source")
  if (!source) return null

  const sourceUrl = field(fileData, "source_url")
  const context = field(fileData, "context")

  return (
    <p class={classNames(displayClass, "quotation-cite")}>
      {"— "}
      {sourceUrl ? (
        <a href={sourceUrl} class="external" rel="noopener noreferrer">
          {source}
        </a>
      ) : (
        source
      )}
      {context && <span class="quotation-context">, {context}</span>}
    </p>
  )
}

Quotation.css = `
.quotation-cite {
  margin: -0.5rem 0 1rem 0;
  color: var(--gray);
  font-size: 0.95rem;
}

.quotation-cite .quotation-context {
  font-style: italic;
}
`

export default (() => Quotation) satisfies QuartzComponentConstructor
