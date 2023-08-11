class Participant {
  constructor(username, tier, rank, LP, orderingScore, snapshotPoints = 0) {
    this.username = username;
    this.tier = tier;
    this.rank = rank;
    this.LP = LP;
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
