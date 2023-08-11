// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"
const fs = require("fs").promises;
let jsonPath = "./public/tft.json";
module.exports.path = jsonPath;
let tierMap = new Map([
  ["IRON", 1000],
  ["BRONZE", 2000],
  ["SILVER", 3000],
  ["GOLD", 4000],
  ["PLATINUM", 5000],
  ["DIAMOND", 6000],
  ["MASTER", 7000],
  ["GRANDMASTER", 7000],
  ["CHALLENGER", 7000],
]);
module.exports.tierMap = tierMap;

let rankMap = new Map([
  ["IV", 100],
  ["III", 200],
  ["II", 300],
  ["I", 400],
]);

module.exports.rankMap = rankMap;

// Fetch Data from a API Link
const fetchData = async (link) => {
  const response = await fetch(link);
  if (!response.ok) {
    throw new Error("Network response was not ok for link: " + link);
  }
  const data = await response.json();
  return data;
};

module.exports.fetchData = fetchData;

// Fetch the API Key from the config file

const fetchAPIKey = async () => {
  try {
    const data = await fs.readFile("./netlify/functions/config.json");
    let config = JSON.parse(data);
    // console.log(config);
    const apiKey = config.MY_KEY;
    // console.log(apiKey);
    return apiKey;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
};

module.exports.fetchAPIKey = fetchAPIKey;
