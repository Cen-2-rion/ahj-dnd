import "./board.css";

export default class Board {
  constructor(parent) {
    this.parent = parent;
  }

  render() {
    // создаём доску
    const board = document.createElement("div");
    board.classList.add("board");

    return board;
  }
}
