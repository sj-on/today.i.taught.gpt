module.exports = {
  layout: "layouts/entry-page.njk",
  permalink: "/entries/{{ page.fileSlug }}/",

  eleventyComputed: {
    date: data => {
      // page.fileSlug = "2026-07-17"
      return new Date(data.page.fileSlug);
    }
  }
};
