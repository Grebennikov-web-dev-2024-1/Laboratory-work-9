import Dish from "../../scripts/dish.js";
import selectedDishes, { dishes } from "../../scripts/selectedDishes.js";
import { createOrder, getDish, getDishes } from '../../scripts/api.js';
import toast from "../../scripts/toast.js";
import { renderDisplayBasket } from "../../scripts/basket.js";


document.querySelector('.form')
    .addEventListener('change', (e) => {
        const deliveryTimeInput = document.getElementById('delivery_time');

        if (e.target.getAttribute('id') == 'by_specified_time') {
            deliveryTimeInput.required = true;
        } else {
            deliveryTimeInput.required = false;
        }
    });

function handleDishClick(e) {
    e.target.parentElement.remove();
    renderDisplayBasket();
}

function clearOrder() {
    selectedDishes.clearState();
    renderDisplayBasket();
    document.querySelector('.dishes').innerHTML = '';
}

async function loadDishes() {
    const savedIds = selectedDishes.savedIds();
    if (!savedIds) return;

    const res = await Promise.all(
        Object.values(savedIds)
            .filter(Boolean)
            .map(async (id) => await getDish(id))
    );

    res.sort((a, b) => a.name.localeCompare(b.name));
    res.forEach(item => {
        const dish = new Dish(item);

        const component = dish.createComponent(handleDishClick);
        document.querySelector('.dishes')
            .append(component);
            
        dishes.push(dish);
    });
    selectedDishes.loadState(false);
    renderDisplayBasket();
}

async function handleSubmit(e) {
    e.preventDefault();

    const comboMessage = selectedDishes.comboMessage();
    if (comboMessage) {
        toast(comboMessage);
        return;
    }
    const data = new FormData(e.target);
    data.set(
        "subscribe",
        Number(data.get("subscribe") == "on")
    );

    const chosensDishes = selectedDishes.chosens();
    for (const item in chosensDishes) {
        data.set(item, chosensDishes[item]);
    }

    try {
        await createOrder(data);
        clearOrder();
        e.target.reset();
        toast('Заказ успешно отправлен');
    } catch (e) {
        if (!e.message) return;
        toast(`Ошибка: ${e.message}`);
    }
}


loadDishes();
document.querySelector('.form')
    .addEventListener('submit', handleSubmit);