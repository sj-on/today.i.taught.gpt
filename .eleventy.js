const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  // ---- date helpers -------------------------------------------------
  eleventyConfig.addFilter("dateDisplay", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toFormat("d LLLL yyyy")
  );

  eleventyConfig.addFilter("dateDisplayShort", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toFormat("d LLL")
  );

  eleventyConfig.addFilter("dateWeekday", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toFormat("cccc")
  );

  eleventyConfig.addFilter("yearOf", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy")
  );

  eleventyConfig.addFilter("monthOf", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toFormat("LLLL")
  );

  // ---- entries collection (every dated minute, newest first) -------
  eleventyConfig.addCollection("entries", (api) =>
    api
      .getFilteredByGlob("src/entries/*.md")
      .sort((a, b) => b.date - a.date)
  );

  // ---- archive tree: { "2026": { "July": [entry, entry, ...] } } ---
  eleventyConfig.addCollection("archiveTree", (api) => {
    const entries = api
      .getFilteredByGlob("src/entries/*.md")
      .sort((a, b) => b.date - a.date);

    const tree = {};
    for (const entry of entries) {
      const d = DateTime.fromJSDate(entry.date, { zone: "utc" });
      const y = d.toFormat("yyyy");
      const m = d.toFormat("LLLL");
      tree[y] = tree[y] || {};
      tree[y][m] = tree[y][m] || [];
      tree[y][m].push(entry);
    }
    return tree;
  });

  // ---- flat, de-duplicated, sorted list of every topic tag ---------
  eleventyConfig.addCollection("entryTagList", (api) => {
    const entries = api.getFilteredByGlob("src/entries/*.md");
    const tagSet = new Set();
    for (const e of entries) {
      (e.data.tags || []).forEach((t) => tagSet.add(t));
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  });

  // ---- filter: entries that carry a given tag -----------------------
  eleventyConfig.addFilter("withTag", (entries, tag) =>
    entries.filter((e) => (e.data.tags || []).includes(tag))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
