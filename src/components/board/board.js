import "./board.css";

export default class Board {
  render() {
    // создаём доску
    const board = document.createElement("div");
    board.classList.add("board");

    return board;
  }
}
