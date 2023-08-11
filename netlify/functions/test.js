const util = require("./util");
let apiKey;

async function lmao() {
  try {
    apiKey = await util.fetchAPIKey();
    console.log("API Key:", apiKey);
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

lmao();
