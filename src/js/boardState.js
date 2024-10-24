export default class BoardState {
  constructor() {
    // задаём дефолтные настройки
    this.todo = [];
    this.inprogress = [];
    this.done = [];
  }

  static from(obj) {
    // копируем все свойства из переданного объекта в новый экземпляр BoardState
    const boardState = new BoardState();
    boardState.todo = obj.todo;
    boardState.inprogress = obj.inprogress;
    boardState.done = obj.done;

    return boardState;
  }
}
