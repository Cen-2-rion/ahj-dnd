import "./column.css";

export default class Column {
  constructor(title) {
    this.title = title;
  }

  render() {
    // создаём колонку
    const column = document.createElement("div");
    column.classList.add("column");

    // добавляем заголовок
    const columnTitle = document.createElement("h2");
    columnTitle.classList.add("column-title");
    columnTitle.textContent = this.title;
    column.appendChild(columnTitle);

    return column;
  }
}
