import AsciiTable from "ascii-table";

export class GameStatistics {
  constructor() {
    this.switchedRounds = 0;
    this.stayedRounds = 0;
    this.switchedWins = 0;
    this.stayedWins = 0;
    this.totalRounds = 0;
  }

  addRoundResult(rickWon, rickSwitched) {
    this.totalRounds++;

    if (rickSwitched) {
      this.switchedRounds++;
      if (rickWon) this.switchedWins++;
    } else {
      this.stayedRounds++;
      if (rickWon) this.stayedWins++;
    }
  }

  calculateRate(wins, rounds) {
    return rounds > 0 ? (wins / rounds).toFixed(3) : "-";
  }

  displayFinalStatistics(quantityBoxes) {
    const table = new AsciiTable("Game results");

    table.setHeading("", "Rick switched", "Rick stayed");

    table.addRow("Rounds", this.switchedRounds, this.stayedRounds);
    table.addRow("Wins", this.switchedWins, this.stayedWins);

    const expSwitched = this.calculateRate(
      this.switchedWins,
      this.switchedRounds
    );
    const expStayed = this.calculateRate(this.stayedWins, this.stayedRounds);
    table.addRow("P (estimate)", expSwitched, expStayed);

    const theorySwitched = ((quantityBoxes - 1) / quantityBoxes).toFixed(3);
    const theoryStayed = (1 / quantityBoxes).toFixed(3);
    table.addRow("P (exact)", theorySwitched, theoryStayed);

    return table.toString();
  }

  reset() {
    this.switchedRounds = 0;
    this.stayedRounds = 0;
    this.switchedWins = 0;
    this.stayedWins = 0;
    this.totalRounds = 0;
  }
}
