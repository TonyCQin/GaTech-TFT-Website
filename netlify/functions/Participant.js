class Participant {
  constructor(
    username,
    tag,
    tier,
    rank,
    leaguePoints,
    orderingScore,
    snapshotPoints = 0
  ) {
    this.username = username;
    this.tag = tag;
    this.tier = tier;
    this.rank = rank;
    this.leaguePoints = leaguePoints;
    this.orderingScore = orderingScore;
    this.snapshotPoints = snapshotPoints;
  }
  static compareFn(a, b) {
    if (a.orderingScore > b.orderingScore) {
      return -1;
    } else if (a.orderingScore < b.orderingScore) {
      return 1;
    }
    return 0;
  }
}

module.exports = Participant;
