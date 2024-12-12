import selectedDishes from "./selectedDishes.js";

class Dish {
    constructor(json) {
        this.id = json.id;
        this.name = json.name;
        this.price = json.price;
        this.category = json.category;
        this.count = json.count;
        this.image = json.image;
        this.keyword = json.keyword;
        this.kind = json.kind;
        this.created_at = new Date(json.created_at);
        this.component = null;
        this.isChoosen = false;
    }

    createComponent(onClick) {
        const container = document.createElement('div');
        container.innerHTML = `
            <img class="dish__img" src="${this.image}" alt="${this.name}">
            <p class="dish__price">${this.price}</p>
            <p class="dish__name">${this.name}</p>
            <p class="dish__amount">${this.count}</p>
            <button class="dish__btn">Добавить</button>
        `;
        container.classList.add('dish');
        container.dataset.dish = this.keyword;

        const handleClick = (e) => {
            selectedDishes.handle(this);
            onClick?.(e);
        };

        container.querySelector('.dish__btn')
            .addEventListener('click', handleClick);

        this.component = container;
        return container;
    }

    choose(style = true) {
        if (style) {
            this.component.classList.add('dish_selected');
        } 
        this.component.querySelector('.dish__btn').textContent = 'Удалить';
        this.isChoosen = true;
    }

    reject() {
        this.component.classList.remove('dish_selected');
        this.component.querySelector('.dish__btn').textContent = 'Добавить';
        this.isChoosen = false;
    }

    hide() {
        this.component.classList.add('hide');
    }

    show() {
        this.component.classList.remove('hide');
    }

    toJson() {
        return JSON.stringify(_, (key, value) => 
            key === 'component' ? undefined : value
        );
    }
}

export default Dish;
