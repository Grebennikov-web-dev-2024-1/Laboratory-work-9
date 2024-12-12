import selectedDishes from "./selectedDishes.js";

const textBasketMenuItem = {
    "soup": {
        title: "Суп",
        default: "Суп не выбран"
    },
    "main-course": {
        title: "Главное блюдо",
        default: "Главное блюдо не выбрано"
    },
    "salad": {
        title: "Салат/стартер",
        default: "Салат/стартер не выбран"
    },
    "drink": {
        title: "Напиток",
        default: "Напиток не выбран"
    },
    "dessert": {
        title: "Десерт",
        default: "Десерт не выбран"
    },
};

const createBasketMenuItem = (title, content) => {
    return `
    <div class="basket-menu-item">
        <p class="basket-menu-item__title">${title}</p>
        <p class="basket-menu-item__content">${content}</p>
    </div>
    `;
};

const renderDisplayBasket = () => {
    const getBasketItemContent = (item) => {
        return `${item.name} ${item.price}₽`;
    };

    const sum = selectedDishes.calcPrice();

    if (!sum) {
        document.querySelector('.form__basket-message')
            .innerHTML = `Ничего не выбрано.
             Чтобы добавить блюда в заказ, перейдите на страницу 
             <a 
                class="basket-message__link"
                href="/pages/PackLunch/index.html"
             >
             Собрать ланч
             </a>.`;
        document.querySelector('.form__basket-items').textContent = '';
        return;
    }

    document.querySelector('.form__basket-message').textContent = '';

    let newBasktet = '';
    for (let key in selectedDishes.state) {
        const value = selectedDishes.state[key];
        const title = textBasketMenuItem[key].title;
        const content = (
            selectedDishes.state[key]
                ? getBasketItemContent(value) 
                : textBasketMenuItem[key].default
        );
        newBasktet += createBasketMenuItem(title, content);
    }
    newBasktet += createBasketMenuItem('Стоимость заказа', `${sum}₽`);

    document.querySelector('.form__basket-items').innerHTML = newBasktet;
};

export { renderDisplayBasket };