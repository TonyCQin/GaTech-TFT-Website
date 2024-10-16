const username = require("./username");
const util = require("./util");
const Participant = require("./Participant");

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

let apiKey;

async function writeStats() {
  apiKey = util.fetchAPIKey;
  let playerStats = [];
  const usernames = [
    new username("AetherCrest", "yep"),
    new username("GeneralCai", "NA1"),
    new username("TheSaltyPika", "NA1"),
    new username("Teenyclover", "Ouch"),
    new username("shaply", "400"),
    new username("Djdawg678", "NA1"),
    new username("N8hanGyoz", "8220"),
    new username("Danbot110", "NA1"),
    new username("basicallyAlex", "NA1"),
    new username("hung", "002"),
    new username("DR Jelqy PHD", "Jelq"),
    new username("Raspberri", "Pi3"),
    new username("Candle2k", "NA1"),
    new username("Jason", "0123"),
    new username("ah b", "1008"),
    new username("AaronTheN00b", "NA1"),
    new username("flamevenomspider", "NA1"),
    new username("dunnel", "NA1"),
    new username("Pogful", "IDOT"),
    new username("baba", "aware"),
    new username("anstew", "KNOCK"),
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
          username.tag,
          stats.tier,
          stats.rank,
          stats.leaguePoints,
          newUserScore,
          0
        );
        console.log(player);
      } else {
        player = new Participant(
          username.username,
          username.tag,
          "UNRANKED",
          "",
          0,
          0,
          0
        );
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
      player.tag,
      player.tier,
      player.rank,
      player.leaguePoints,
      player.orderingScore
    );
  });
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
