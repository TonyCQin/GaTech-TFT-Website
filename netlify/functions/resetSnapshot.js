// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"

const fs = require("fs").promises;
// Helper Libraries
const util = require("./util");

async function resetSnapshot() {
  // Read and Parse the JSON File
  // console.log("getting database info");
  const personJSON = JSON.parse((await util.getData()).info.userinfo);
  // console.log(personJSON);
  const JSONArray = Object.values(personJSON);
  // console.log(JSONArray[0].snapshotPoints);
  // console.log(JSONArray);

  // Update Snapshot points
  const len = JSONArray.length;
  for (let i = 0; i < len; i++) {
    let newSnapshotPoints = 0;
    // console.log(personJSON[i].username);
    util.updateDatabaseSnapshotPoints(JSONArray[i].username, newSnapshotPoints);
  }
  console.log("The snapshotPoints were reset!");
}

exports.handler = async function () {
  resetSnapshot();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "The snapshot points were reset!",
    }),
  };
};

resetSnapshot();
