import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

// Renders the wrapped component only on the home page (content/index.md).
const IndexOnly = (component: QuartzComponent): QuartzComponent => {
  const Wrapped: QuartzComponent = (props: QuartzComponentProps) =>
    props.fileData.slug === "index" ? component(props) : null
  Wrapped.css = component.css
  Wrapped.beforeDOMLoaded = component.beforeDOMLoaded
  Wrapped.afterDOMLoaded = component.afterDOMLoaded
  return Wrapped
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  // `afterBody` lives on SharedLayout, not PageLayout, so the quotation
  // attribution is registered here. It renders only on `type: quotation` notes.
  afterBody: [
    Component.Quotation(),
    IndexOnly(
      Component.RecentNotes({
        showTags: true,
        title: "Recently updated notes:",
        showDate: true,
        limit: 4,
      }),
    ),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/tinkererthinker",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    // Renders only on notes with `type: blogmark` in frontmatter.
    Component.Blogmark(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    // Renders only on typed posts; untyped notes see the usual sidebar.
    Component.Metabox(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
