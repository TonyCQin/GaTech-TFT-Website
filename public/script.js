//function to write ranked leaderboard innerHTML
const playerRankInnerHTML = function (summonerName, tier, rank, leaguePoints) {
  let playerRanks = document.querySelector(".center-align-rank");

  let playerRanked = document.createElement("div");
  playerRanked.classList.add("player-rank");

  let docRankUsername = document.createElement("a");
  docRankUsername.innerText = `${summonerName}`;
  docRankUsername.setAttribute("id", "username");
  docRankUsername.href = `https://lolchess.gg/profile/na/${summonerName}`;
  // weird way of keeping the color of the link black
  docRankUsername.style.color = "black";
  docRankUsername.addEventListener("click", () => {
    docRankUsername.style.color = "black";
  });

  let docRank = document.createElement("a");
  let docRankImage = document.createElement("img");
  docRankImage.setAttribute("src", `/rankimages/${tier}.png`);
  docRankImage.setAttribute("loading", "lazy");
  docRankImage.style.width = "auto";
  docRankImage.style.height = "30px";
  docRankImage.style.display = "inline-block";
  docRankImage.style.verticalAlign = "middle";
  let docRankText = document.createElement("a");

  if (tier === "CHALLENGER" || tier === "GRANDMASTER" || tier === "MASTER") {
    docRankText.innerText = `${leaguePoints} LP`;
  } else {
    // docRank.innerText = `${tier} ${rank} ${leaguePoints} LP`;
    docRankText.innerText = `${tier} ${rank}`;
  }

  docRankText.setAttribute("id", "rank-text");

  let rankStyle = docRankText.style;
  rankStyle.display = "inline-block";
  rankStyle.paddingLeft = "2px";
  rankStyle.verticalAlign = "middle";
  rankStyle.height = "fit-content";
  rankStyle.width = "fit-content";

  docRank.setAttribute("id", "rank");
  docRank.classList.add(`${summonerName}-rank`.replace(/\s/g, ""));
  // docRank.classList.add("rank");

  docRank.append(docRankImage);
  docRank.append(docRankText);

  let playerRankedStats = [docRankUsername, docRank];
  playerRankedStats.forEach(function (html) {
    playerRanked.append(html);
  });
  playerRanks.append(playerRanked);
};

// function to write snapshot leaderboard innerHTML
const playerSnapshotInnerHTML = function (summonerName, snapshotPoints) {
  let playerSnapshots = document.querySelector(".center-align-snapshot");

  let playerSnapshot = document.createElement("div");
  playerSnapshot.classList.add("player-snapshot");

  let docSnapshotUsername = document.createElement("a");
  docSnapshotUsername.innerText = `${summonerName}`;
  docSnapshotUsername.setAttribute("id", "username");

  let docSnapshotPoints = document.createElement("a");
  docSnapshotPoints.innerText = `${snapshotPoints}`;
  docSnapshotPoints.setAttribute("id", "snapshot-points");
  docSnapshotPoints.classList.add(`${summonerName}-points`.replace(/\s/g, ""));

  let playerSnapshotStats = [docSnapshotUsername, docSnapshotPoints];

  playerSnapshotStats.forEach(function (html) {
    playerSnapshot.append(html);
  });

  playerSnapshots.append(playerSnapshot);
};

function runFunction(endpoint) {
  fetch(endpoint, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

fetch("/tft.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((player) => {
      playerRankInnerHTML(
        player.username,
        player.tier,
        player.rank,
        player.LP,
        player.snapshotPoints
      );
      playerSnapshotInnerHTML(player.username, player.snapshotPoints);
    });
  })
  .catch((error) => {
    console.error("Error fetching the JSON file:", error);
  });

// setInterval(() => {
//   runFunction("/api/resetSnapshot");
//   fetch("/tft.json")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => {
//       console.error("Error fetching the JSON file:", error);
//     });
// }, 15000);
