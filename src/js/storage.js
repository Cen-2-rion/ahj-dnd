export default class Storage {
  static save(boardState) {
    localStorage.setItem("boardState", JSON.stringify(boardState));
  }

  static load() {
    return JSON.parse(localStorage.getItem("boardState"));
  }
}
