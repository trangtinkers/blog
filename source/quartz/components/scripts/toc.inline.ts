const bufferPx = 150
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id
    // A page can have two TOCs (sidebar + inline on small screens), so update every link.
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
    const windowHeight = entry.rootBounds?.height
    if (windowHeight) {
      const inView = entry.boundingClientRect.y < windowHeight
      tocEntryElements.forEach((el) => el.classList.toggle("in-view", inView))
    }
  }
})

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.querySelectorAll<HTMLElement>("button#toc")) {
    const content = toc.nextElementSibling as HTMLElement | undefined
    if (!content) continue
    toc.addEventListener("click", toggleToc)
    window.addCleanup(() => toc.removeEventListener("click", toggleToc))
  }
}

window.addEventListener("resize", setupToc)
document.addEventListener("nav", () => {
  setupToc()

  // update toc entry highlighting
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))
})
