export default class BoardStorage {
  static save(boardState) {
    localStorage.setItem("boardState", JSON.stringify(boardState));
  }

  static load() {
    return JSON.parse(localStorage.getItem("boardState"));
  }
}
