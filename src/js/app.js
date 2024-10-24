import Board from "../components/board/board";
import Column from "../components/column/column";
import Card from "../components/card/card";
import AddCard from "../components/addCard/addCard";

import boardList from "../data/boardList.json";
import cardList from "../data/cardList.json";

import BoardState from "./boardState";
import BoardStorage from "./boardStorage";

class App {
  constructor() {
    this.boardState = new BoardState();
    this.storage = BoardStorage.load();

    this.mouseClick = this.mouseClick.bind(this);
  }

  init() {
    let content;

    if (this.storage) {
      content = BoardState.from(this.storage);
    } else {
      content = cardList;
    }

    this.renderInterface(content);
    document.addEventListener("click", this.mouseClick);
  }

  renderInterface(content) {
    const board = document.body.appendChild(new Board().render());

    let columns = {},
      card,
      form;

    for (let key in boardList) {
      // создаём колонку и добавляем заголовок
      columns[key] = new Column(boardList[key]).render();
      board.appendChild(columns[key]);

      // создаём карточку и добавляем текст
      content[key].forEach((text) => {
        card = new Card(text).render();
        columns[key].appendChild(card);

        // добавляем текст карточки в массив
        this.boardState[key].push(text);

        // отображаем кнопку закрытия карточки
        card.addEventListener("mouseenter", Card.showCloseButton);
        card.addEventListener("mouseleave", Card.hideCloseButton);
      });
      // создаём форму добавления новой карточки
      form = new AddCard(columns[key]).render();
      columns[key].appendChild(form);

      // сохраняем состояние в локальное хранилище
      BoardStorage.save(this.boardState);
    }
  }

  mouseClick = (e) => {
    e.preventDefault();

    // удаляем текст карточки при клике на кнопку "Close"
    if (e.target.classList.contains("card-close-button")) {
      const card = e.target.closest(".card");
      const cardText = card.querySelector(".card-text").textContent;

      // удаляем текст карточки из массива
      for (let key in boardList) {
        const index = this.boardState[key].indexOf(cardText);

        if (index !== -1) {
          this.boardState[key].splice(index, 1);
        }
      }
      card.remove(); // удаляем карточку из DOM

      BoardStorage.save(this.boardState);
    }

    // вызываем методы на кнопках "Add another card" и "Cancel"
    if (e.target.classList.contains("add-another-card-button")) {
      AddCard.showInput(e.target.closest(".form"));
    } else if (e.target.classList.contains("cancel-card-button")) {
      AddCard.cancelInput(e.target.closest(".form"));
    }

    if (e.target.classList.contains("add-card-button")) {
      const parent = e.target.closest(".form");
      const input = parent.querySelector(".card-text-input");
      const text = input.value.trim();

      const columnName = parent
        .closest(".column")
        .querySelector(".column-title").textContent;

      if (text) {
        AddCard.addInput(parent, text);
        AddCard.cancelInput(parent);
        input.value = "";

        // добавляем текст текущей карточки в массив
        for (let key in boardList) {
          if (boardList[key] === columnName) {
            this.boardState[key].push(text);
          }
        }

        BoardStorage.save(this.boardState);
      }
    }
  };
}

new App().init();
