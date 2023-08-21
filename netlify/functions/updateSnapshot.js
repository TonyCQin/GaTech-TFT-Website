// THIS IS THE BACKEND FILE FOR THE RASPBERRY PI VERSION OF "TonyCQin.github.io"

const fs = require("fs").promises;
const { compareFn } = require("./Participant");
// Helper Libraries
const util = require("./util");

function compareSnapshot(a, b) {
  let valueA = a.snapshotPoints;
  let valueB = b.snapshotPoints;
  if (valueA < valueB) {
    return 1;
  }
  if (valueA > valueB) {
    return -1;
  }
  return 0;
}

async function updateSnapshot() {
  // console.log("getting database info");
  const personJSON = JSON.parse((await util.getData()).info.userinfo);
  const JSONArray = Object.values(personJSON);
  JSONArray.sort(compareSnapshot);

  // Update Snapshot points
  const len = JSONArray.length;
  for (let i = 0; i < len; i++) {
    let newSnapshotPoints = JSONArray[i].snapshotPoints;
    newSnapshotPoints += len - i;
    // console.log(personJSON[i].username);
    util.updateDatabaseSnapshotPoints(JSONArray[i].username, newSnapshotPoints);
  }
  console.log("The snapshot points were updated!");
}

exports.handler = async function () {
  updateSnapshot();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "The snapshot points were updated!",
    }),
  };
};

updateSnapshot(); //for testing
