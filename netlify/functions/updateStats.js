// Helper Libraries
const Participant = require("./Participant");
const util = require("./util");
const username = require("./username");

let apiKey;

// Update the Stats of the Summoners on the JSON FIle
async function updateStats() {
  // Get the API Key from the external config file
  apiKey = util.fetchAPIKey;
  // console.log(apiKey);
  // List of the updated stats
  let updatedPeopleStats = [];

  // Read and Parse the JSON File
  const data = JSON.parse((await util.getData()).info.userinfo);

  // Loop through the JSON file and update all stats
  for (const curStats of data) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    await getStats(curStats.username, curStats.tag).then((newStats) => {
      if (typeof newStats == "undefined") {
        let player = new Participant(
          curStats.username,
          curStats.tag,
          "Unranked",
          "",
          0,
          0,
          curStats.snapshotPoints
        );
        updatedPeopleStats.push(player);
      } else {
        const newUserScore =
          util.tierMap.get(newStats.tier) +
          util.rankMap.get(newStats.rank) +
          newStats.leaguePoints;
        console.log(util.tierMap.get(newStats.tier));
        console.log(newUserScore);
        let player = new Participant(
          curStats.username,
          curStats.tag,
          newStats.tier,
          newStats.rank,
          newStats.leaguePoints,
          newUserScore,
          curStats.snapshotPoints
        );
        updatedPeopleStats.push(player);
      }
      // console.log("the stats were updated");
    });
  }
  // Sort the List
  updatedPeopleStats.sort(Participant.compareFn);
  // FOR DEBUG
  // console.log(updatedPeopleStats);

  // update database with new stats
  updatedPeopleStats.forEach((player) => {
    util.updateDatabaseStats(
      player.username,
      player.tag,
      player.tier,
      player.rank,
      player.leaguePoints,
      player.orderingScore
    );
  });
  console.log("The stats were updated!");
  util.sortDatabase();
  console.log("database maybe sorted");
}

// Uses Riot API to gather Stats like LP, Rank, and Tier
async function getStats(username, tag) {
  // API to Access Summoner ID
  const idAPI = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}${apiKey}`;
  // Get Summoner ID
  let puuid = await util.fetchID(idAPI);
  // API to Access Summoners ID through puuid
  const summoneridAPI = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid.puuid}${apiKey}`;
  let summonerID = await util.fetchID(summoneridAPI);
  // API to access stats of username
  const statAPI = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID.id}${apiKey}`;
  return await util.fetchData(statAPI);
}

exports.handler = async function () {
  updateStats();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "The stats were saved!",
    }),
  };
};

updateStats();
