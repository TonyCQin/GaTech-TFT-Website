// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"

const fs = require("fs").promises;
// Helper Libraries
const Participant = require("./Participant");
const util = require("./util");

// Path to tft.json
const jsonPath = util.path;
//
let apiKey;

// Update the Stats of the Summoners on the JSON FIle
async function updateStats() {
  // Get the API Key from the external config file
  try {
    apiKey = await util.fetchAPIKey();
    // console.log(apiKey);
  } catch (error) {
    console.log("error fetching API key;", error);
  }
  // console.log(apiKey);
  // List of the updated stats
  let updatedPeopleStats = [];

  // Read and Parse the JSON File
  const data = await fs.readFile(jsonPath, (err) => {
    if (err) {
      return console.error("Error reading the file:", err);
    }
  });
  let personJSON = JSON.parse(data.toString());

  // Loop through the JSON file and update all stats
  for (const curStats of personJSON) {
    await getStats(curStats.username).then((newStats) => {
      const newUserScore =
        util.tierMap.get(newStats.tier) +
        util.rankMap.get(newStats.rank) +
        newStats.leaguePoints;
      let player = new Participant(
        curStats.username,
        newStats.tier,
        newStats.rank,
        newStats.leaguePoints,
        newUserScore,
        curStats.snapshotPoints
      );
      updatedPeopleStats.push(player);
      // console.log("the stats were updated");
    });
  }
  // Sort the List
  updatedPeopleStats.sort(Participant.compareFn);
  // FOR DEBUG
  // console.log(updatedPeopleStats);

  // Write to JSON File
  let jsonData = JSON.stringify(updatedPeopleStats);
  fs.writeFile(jsonPath, jsonData, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log("The updated stats were saved!");
}

// Uses Riot API to gather Stats like LP, Rank, and Tier
async function getStats(username) {
  // API to Access Summoner ID
  const idAPI = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}${apiKey}`;
  // Get Summoner ID
  let user = await util.fetchData(idAPI);
  // API to Access Stats of Summoners
  const statAPI = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${user.id}${apiKey}`;
  return (await util.fetchData(statAPI))[0];
}

exports.handler = async function () {
  updateStats();
  return {
    statusCode: 200,
    body: "The snapshot points were saved!",
  };
};
