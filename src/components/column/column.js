import "./column.css";

export default class Column {
  constructor(title) {
    this.title = title;
  }

  render() {
    // создаём колонку
    const column = document.createElement("div");
    column.classList.add("column");

    // контейнер для заголовка и меню
    const columnHeader = document.createElement("div");
    columnHeader.classList.add("column-header");

    // заголовок колонки
    const columnTitle = document.createElement("h2");
    columnTitle.classList.add("column-title");
    columnTitle.textContent = this.title;

    // кнопка меню
    const columnMenuButton = document.createElement("button");
    columnMenuButton.classList.add("column-menu-button", "menu-button");
    columnMenuButton.type = "button";
    columnMenuButton.innerHTML = "&#8226;&#8226;&#8226;";

    columnHeader.append(columnTitle, columnMenuButton);

    column.append(columnHeader);

    return column;
  }
}
