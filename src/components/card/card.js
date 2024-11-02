import "./card.css";

export default class Card {
  constructor(text) {
    this.text = text;
  }

  render() {
    // создаём карточку
    const card = document.createElement("div");
    card.classList.add("card");

    // добавляем текст
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = this.text;
    card.append(cardText);

    // добавляем элемент крестика
    const cardCloseButton = document.createElement("button");
    cardCloseButton.classList.add("card-close-button", "hidden");
    cardCloseButton.type = "button";
    cardCloseButton.innerHTML = "&times";
    card.append(cardCloseButton);

    return card;
  }

  static showCloseButton(e) {
    e.target.querySelector(".card-close-button").classList.remove("hidden");
  }

  static hideCloseButton(e) {
    e.target.querySelector(".card-close-button").classList.add("hidden");
  }
}
