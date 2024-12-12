import createCombo from '../../scripts/combo.js';
import { getDishes } from '../../scripts/api.js';
import Dish from '../../scripts/dish.js';
import selectedDishes, { dishes} from '../../scripts/selectedDishes.js';
import { handleFilter } from '../../scripts/filter.js';

function toOrderLunch() {
    window.location.href = '/pages/OrderLunch/index.html';
}

function renderOrderLine() {
    const orderLine = document.querySelector('.order-line');

    const price = selectedDishes.calcPrice();
    if (!price) {
        orderLine.classList.add('hide');
        return;
    }
    orderLine.firstElementChild.textContent = `Итого ${price}₽`;

    const btn = orderLine.lastElementChild;
    const comboMessage = selectedDishes.comboMessage();
    if (comboMessage) {
        btn.disabled = true;
        btn.textContent = comboMessage;
    } else {
        btn.disabled = false;
        btn.textContent = 'Перейти к оформлению';
    }
    orderLine.classList.remove('hide');
}

function handleDishClick() {
    renderOrderLine();
}

async function loadDishes() {
    const res = await getDishes();
    res.sort((a, b) => a.name.localeCompare(b.name));
    res.forEach(item => {
        const dish = new Dish(item);

        const component = dish.createComponent(handleDishClick);
        document.querySelector(`.${dish.category}-section .dishes`)
            .append(component);
            
        dishes.push(dish);
    });
    selectedDishes.loadState();
    renderOrderLine();
}

function filterDishes() {
    const filters = document.querySelectorAll('.filter');

    filters.forEach((filter) => {
        filter.addEventListener('click', handleFilter);
    });
}

createCombo();
loadDishes();
filterDishes();
document.querySelector('.order-line__btn')
    .addEventListener('click', toOrderLunch);
    