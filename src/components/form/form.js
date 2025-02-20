import "./form.css";

export default class AddCard {
  constructor(parent) {
    this.parent = parent;
  }

  render() {
    // создаём форму для добавления карточки
    const form = document.createElement("form");
    form.classList.add("form");

    // поле ввода текста карточки
    const formInput = document.createElement("textarea");
    formInput.classList.add("form-text-input", "hidden");
    formInput.placeholder = "Enter a title for this card...";

    // кнопки "Add card", "Cancel" и "...", оборачиваем их в отдельный тег
    const formButtons = document.createElement("div");
    formButtons.classList.add("form-buttons");

    const formAddButton = document.createElement("button");
    formAddButton.classList.add("form-add-button", "hidden");
    formAddButton.type = "button";
    formAddButton.textContent = "Add Card";

    const formCancelButton = document.createElement("button");
    formCancelButton.classList.add("form-cancel-button", "hidden");
    formCancelButton.type = "button";
    formCancelButton.innerHTML = "&times";

    const formMenuButton = document.createElement("button");
    formMenuButton.classList.add("form-menu-button", "menu-button", "hidden");
    formMenuButton.type = "button";
    formMenuButton.innerHTML = "&#8226;&#8226;&#8226;";

    formButtons.append(formAddButton, formCancelButton, formMenuButton);

    // кнопка "Add another card"
    const addAnotherCardButton = document.createElement("button");
    addAnotherCardButton.classList.add("add-another-card-button");
    addAnotherCardButton.type = "button";
    addAnotherCardButton.textContent = "Add another card";

    form.append(formInput, addAnotherCardButton, formButtons);

    return form;
  }

  static showInput(parent) {
    // скрываем кнопку "Add another card" и отображаем "Add card", "Cancel", "..."
    const addAnotherCardButton = parent.querySelector(
      ".add-another-card-button",
    );
    addAnotherCardButton.classList.add("hidden");

    const cardInput = parent.querySelector(".form-text-input");
    cardInput.classList.remove("hidden");

    const formAddButton = parent.querySelector(".form-add-button");
    formAddButton.classList.remove("hidden");

    const formCancelButton = parent.querySelector(".form-cancel-button");
    formCancelButton.classList.remove("hidden");

    const formMenuButton = parent.querySelector(".form-menu-button");
    formMenuButton.classList.remove("hidden");
  }

  static hideInput(parent) {
    // скрываем кнопки "Add card", "Cancel", "..." и отображаем "Add another card"
    const addAnotherCardButton = parent.querySelector(
      ".add-another-card-button",
    );
    addAnotherCardButton.classList.remove("hidden");

    const cardInput = parent.querySelector(".form-text-input");
    cardInput.classList.add("hidden");
    cardInput.value = "";

    const formAddButton = parent.querySelector(".form-add-button");
    formAddButton.classList.add("hidden");

    const formCancelButton = parent.querySelector(".form-cancel-button");
    formCancelButton.classList.add("hidden");

    const formMenuButton = parent.querySelector(".form-menu-button");
    formMenuButton.classList.add("hidden");
  }
}
