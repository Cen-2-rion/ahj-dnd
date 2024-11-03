import Board from "../components/board/board";
import Column from "../components/column/column";
import Card from "../components/card/card";
import AddCard from "../components/addCard/addCard";

import boardList from "../data/boardList.json";
import cardList from "../data/cardList.json";

import BoardState from "./boardState";
import Storage from "./storage";

class App {
  constructor() {
    this.boardState = new BoardState();
    this.storage = Storage.load();

    this.actualEl = null;
    this.draggedEl = null;
    
    this.mousePosition = {};

    this.onMouseClick = this.onMouseClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  init() {
    let content;

    if (this.storage) {
      content = BoardState.from(this.storage);
    } else {
      content = cardList;
    }

    this.renderInterface(content);
    document.addEventListener("click", this.onMouseClick);
    document.addEventListener("mousedown", this.onMouseDown);
  }

  renderInterface(content) {
    const board = document.body.appendChild(new Board().render());

    let columns = {},
      card,
      form;

    for (let key in boardList) {
      // создаём колонку и добавляем заголовок
      columns[key] = new Column(boardList[key]).render();
      board.append(columns[key]);

      // создаём карточку и добавляем текст
      content[key].forEach((text) => {
        card = new Card(text).render();
        columns[key].append(card);

        // добавляем текст карточки в массив
        this.boardState[key].push(text);

        // отображаем кнопку закрытия карточки
        card.addEventListener("mouseenter", Card.showCloseButton);
        card.addEventListener("mouseleave", Card.hideCloseButton);
      });
      // создаём форму добавления новой карточки
      form = new AddCard(columns[key]).render();
      columns[key].append(form);

      // сохраняем состояние в локальное хранилище
      Storage.save(this.boardState);
    }
  }

  onMouseClick = (e) => {
    e.preventDefault();
    let target = e.target;

    if (this.storage) {
      this.boardState = BoardState.from(this.storage);            
    }

    // удаляем текст карточки при клике на кнопку "Close"
    if (target.classList.contains("card-close-button")) {
      const columnName = target.closest(".column").firstChild.textContent;
      const card = target.closest(".card");
      const cardText = card.querySelector(".card-text").textContent;

      // удаляем текст карточки из массива
      for (let key in boardList) {
        if (boardList[key] === columnName) {
          const index = this.boardState[key].indexOf(cardText);
          if (index !== -1) {
            this.boardState[key].splice(index, 1);
          }
        }
      }
      card.remove(); // удаляем карточку из DOM

      Storage.save(this.boardState);
    }

    // вызываем методы на кнопках "Add another card" и "Cancel"
    if (target.classList.contains("add-another-card-button")) {
      AddCard.showInput(target.closest(".form"));
    } else if (target.classList.contains("cancel-card-button")) {
      AddCard.hideInput(target.closest(".form"));
    }

    if (this.storage) {
      this.boardState = BoardState.from(this.storage);            
    }
    
    // добавляем новую карточку с текстом при клике на кнопку "Add card"
    if (target.classList.contains("add-card-button")) {
      const form = target.closest(".form");
      const input = form.querySelector(".card-text-input");
      const text = input.value.trim();

      const columnName = form.closest(".column").firstChild.textContent;

      if (text) {
        const card = new Card(text).render();
        form.before(card);
        input.value = "";
        AddCard.hideInput(form);

        // добавляем текст текущей карточки в массив
        for (let key in boardList) {
          if (boardList[key] === columnName) {
            this.boardState[key].push(text);
          }
        }

        card.addEventListener("mouseenter", Card.showCloseButton);
        card.addEventListener("mouseleave", Card.hideCloseButton);

        Storage.save(this.boardState);
      }
    }
  }

  onMouseMove = (e) => {
    if (!this.actualEl)  return;

    // перемещаем карточку при нажатии и перемещении мыши
    this.draggedEl.style.left = e.clientX - this.mousePosition.x + "px";
    this.draggedEl.style.top = e.clientY - this.mousePosition.y + "px";
  }
  
  onMouseUp = (e) => {
    if (!this.draggedEl) return;
    
    // показываем оригинал карточки
    this.actualEl.classList.remove('hidden');
    
    const columnNameBeforeInsert = this.actualEl.closest(".column").firstChild.textContent;
    const cardText = this.actualEl.querySelector(".card-text").textContent;

    // вызываем метод для установки карточки в новую колонку
    this.insert(this.actualEl, e.clientX, e.clientY);
    
    const columnNameAfterInsert = this.actualEl.closest(".column").firstChild.textContent;
    
    if (this.storage) {
      this.boardState = BoardState.from(this.storage);            
    }

    for (let key in boardList) {
      // удаляем текст карточки из колонки до перемещения
      if (boardList[key] === columnNameBeforeInsert) {
        const index = this.boardState[key].indexOf(cardText);
        if (index !== -1) {
          this.boardState[key].splice(index, 1);
        }
      }
      // добавляем текст карточки в новую колонку после перемещения
      if (boardList[key] === columnNameAfterInsert) {
        const nextEl = this.actualEl.nextElementSibling.querySelector(".card-text");
        if (!nextEl) {
          this.boardState[key].push(cardText);
        } else {
          const index = this.boardState[key].indexOf(nextEl.textContent);
          if (index !== -1) {
            this.boardState[key].splice(index, 0, cardText);
          }
        }
      }
    }

    Storage.save(this.boardState);

    // очищаем ссылки
    this.draggedEl.remove();
    this.draggedEl = null;
    this.actualEl = null;

    // отменяем перехватывание событий нажатия и движения мыши
    document.documentElement.removeEventListener("mousemove", this.onMouseMove);
    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
  }

  onMouseDown = (e) => {
    if (e.target.classList.contains("card") || e.target.classList.contains("card-text")) {

      e.preventDefault();

      // находим карточку, на которую нажали и позицию мыши
      this.actualEl = e.target.closest(".card");
      this.mousePosition.x = e.clientX - this.actualEl.offsetLeft;
      this.mousePosition.y = e.clientY - this.actualEl.offsetTop;

      // создаём клон, присваиваем класс, рзамещаем в DOM
      this.draggedEl = this.actualEl.cloneNode(true);
      this.draggedEl.classList.add("dragged");
      document.body.append(this.draggedEl);

      // привязываем к указателю мыши, задаём ширину равную оригиналу
      this.draggedEl.style.left = e.clientX - this.mousePosition.x + "px";
      this.draggedEl.style.top = e.clientY - this.mousePosition.y + "px";
      this.draggedEl.style.width = this.actualEl.offsetWidth + "px";

      // скрываем оригинал карточки
      this.actualEl.classList.add('hidden');

      // перехватываем события нажатия и движения мыши
      document.documentElement.addEventListener("mousemove", this.onMouseMove);
      document.documentElement.addEventListener("mouseup", this.onMouseUp);
    }
  }

  insert(element, x, y) {
    if (!element.closest(".board")) return;

    this.draggedEl.classList.remove("dragged");

    const target = document.elementFromPoint(x, y);
    const {top} = target.getBoundingClientRect();
    const card = target.closest(".card");
    const column = target.closest(".column");

    if (!column) return;

    // перемещаем элемент по DOM-дереву
    if (!card) {
      const elem = card;
      if (elem) {
        column.insertBefore(element, elem.nextElementSibling);
      } else {
        const columnTitle = column.firstChild;
        if (elem === columnTitle) {
          column.insertBefore(element, columnTitle.nextElementSibling);
        } else {
          const form = column.lastChild;
          column.insertBefore(element, form);
        }
      }
    } else {
      if (y > window.scrollY + top + target.offsetHeight / 2) {
        column.insertBefore(element, card.nextElementSibling);
      } else {
        column.insertBefore(element, card);
      }
    }

    this.draggedEl.classList.add("dragged");
  }
}

new App().init();
