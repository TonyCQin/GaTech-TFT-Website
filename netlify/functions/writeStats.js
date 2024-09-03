const username = require("./username");
const util = require("./util");
const Participant = require("./Participant");

// Uses Riot API to gather Stats like LP, Rank, and Tier
async function getStats(username, tag) {
  // API to Access Summoner ID
  const idAPI = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}${apiKey}`;
  // Get Summoner ID
  let puuid = await util.fetchID(idAPI);
  // API to Access Stats of Summoners
  const summoneridAPI = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid.puuid}${apiKey}`;
  let summonerID = await util.fetchID(summoneridAPI);
  const statAPI = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerID.id}${apiKey}`;
  return await util.fetchData(statAPI);
}
let apiKey;

async function writeStats() {
  apiKey = util.fetchAPIKey;
  let playerStats = [];
  const usernames = [
    new username("AetherCrest", "yep"),
    new username("GeneralCai", "NA1"),
  ];

  for (const username of usernames) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    await getStats(username.username, username.tag).then((stats) => {
      let player;
      if (stats != undefined) {
        console.log(stats);
        const newUserScore =
          util.tierMap.get(stats.tier) +
          util.rankMap.get(stats.rank) +
          stats.leaguePoints;
        player = new Participant(
          username.username,
          stats.tier,
          stats.rank,
          stats.leaguePoints,
          newUserScore,
          0
        );
      } else {
        player = new Participant(username.username, "UNRANKED", "", 0, 0, 0);
      }
      playerStats.push(player);
    });
  }
  // Sort the List
  playerStats.sort(Participant.compareFn);
  // FOR DEBUG
  // console.log(updatedPeopleStats);

  // update database with new stats
  playerStats.forEach((player) => {
    util.insertUser(
      player.username,
      player.tier,
      player.rank,
      player.leaguePoints,
      player.orderingScore
    );
  });
  util.sortDatabase();
}

exports.handler = async function () {
  writeStats();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "The stats were written!",
    }),
  };
};

writeStats();
