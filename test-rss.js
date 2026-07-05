const Parser = require('rss-parser');

async function test() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://www.reddit.com/r/freelance_forhire/.rss');
    console.log("Total items fetched from RSS:", feed.items.length);
    if (feed.items.length > 0) {
      const item = feed.items[0];
      console.log("\n=================================");
      console.log("          FIRST POST             ");
      console.log("=================================\n");
      console.log("TITLE:");
      console.log(item.title);
      console.log("\n---------------------------------");
      console.log("CONTENT SNIPPET (This is what we send to AI):");
      console.log(item.contentSnippet);
      console.log("\n---------------------------------");
      console.log("FULL CONTENT (HTML):");
      console.log(item.content);
    }
  } catch (err) {
    console.error("Error fetching RSS:", err);
  }
}

test();
