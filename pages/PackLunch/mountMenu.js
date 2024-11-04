import { menu } from './menuList.js';

const selectedMenuItems = {
    "soups": null,
    "main-course": null,
    "salads-starters": null,
    "beverages": null,
    "desserts": null,
};

const textBasketMenuItem = {
    "soups": {
        title: "Суп",
        default: "Суп не выбран"
    },
    "main-course": {
        title: "Главное блюдо",
        default: "Главное блюдо не выбрано"
    },
    "salads-starters": {
        title: "Салат/стартер",
        default: "Салат/стартер не выбран"
    },
    "beverages": {
        title: "Напиток",
        default: "Напиток не выбран"
    },
    "desserts": {
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


const changeDisplaySelectedMenuItem = (keyword, category) => {
    const menuItemsByCategory = (
        document.querySelectorAll(`.${category}-section .dish`)
    );
    menuItemsByCategory.forEach((itemNode) => {
        if (itemNode.dataset.dish === keyword) {
            itemNode.classList.add('dish_selected');
        } else {
            itemNode.classList.remove('dish_selected');
        }
    });
};

const changeDisplayBasket = () => {
    const getBasketItemContent = (item) => {
        return `${item.name} ${item.price}₽`;
    };

    let newBasktet = '';
    let sum = 0;
    for (let key in selectedMenuItems) {
        const value = selectedMenuItems[key];
        const title = textBasketMenuItem[key].title;
        const content = (
            selectedMenuItems[key] 
                ? getBasketItemContent(value) 
                : textBasketMenuItem[key].default
        );
        sum += value ? value.price : 0;
        newBasktet += createBasketMenuItem(title, content);
    }
    newBasktet += createBasketMenuItem('Стоимость заказа', `${sum}₽`);

    document.querySelector('.form__basket-menu-items').innerHTML = newBasktet;
};

const handleSelectingMenuItem = (e) => {
    const isDishButton = e.target.classList.contains('dish__add');
    if (!isDishButton) {
        return;
    }

    const keyword = e.target.closest('.dish').dataset.dish;
    const selectedMenuItem = menu.find(item => item.keyword === keyword);
    selectedMenuItems[selectedMenuItem.category] = selectedMenuItem;

    changeDisplaySelectedMenuItem(keyword, selectedMenuItem.category);
    document.getElementById(selectedMenuItem.category).value = keyword;
    changeDisplayBasket();
};

const createCard = (card, isHide = false) => {
    const hideClass = isHide ? 'hide' : '';
    return `
    <div class="dish ${hideClass}" data-dish="${card.keyword}">
        <img class="dish__img" src="${card.image}" alt="${card.name}">
        <p class="dish__price">${card.price}</p>
        <p class="dish__name">${card.name}</p>
        <p class="dish__amount">${card.count}</p>
        <button class="dish__add">Добавить</button>
    </div>
    `;
};

const displayCards = () => {
    const menuItemsNodes = {};
    Object.assign(menuItemsNodes, selectedMenuItems);

    menu
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((menuItem) => {
            if (!menuItemsNodes[menuItem.category]) {
                menuItemsNodes[menuItem.category] = '';
            }
            menuItemsNodes[menuItem.category] += createCard(menuItem);
        });

    for (let key in menuItemsNodes) {
        const value = menuItemsNodes[key];
        document.querySelector(`.${key}-section .dishes`).innerHTML = value;
    }
};

const changeDisplayCardSection = (kind, category) => {
    const disheNodes = document.querySelectorAll(`.${category}-section .dish`);
    disheNodes.forEach((dishNode) => {
        const keyword = dishNode.dataset.dish;
        const dishKind = menu.find(item => item.keyword === keyword).kind;

        if ((dishKind === kind) || (kind === 'all')) {
            dishNode.classList.remove('hide');
        } else {
            dishNode.classList.add('hide');
        }
    });
};

const handleSelectingFilter = (e) => {
    const isFilterItem = e.target.classList.contains('filter__item');
    if (!isFilterItem) {
        return;
    }

    const kind = e.target.dataset.kind;
    const category = e.target.closest('.section')
        .classList[1]
        .replace('-section', '');
    const isToggleFilter = e.target.classList.contains('filter__item_selected');

    if (isToggleFilter) {
        e.target.classList.remove('filter__item_selected');
        changeDisplayCardSection('all', category);
    } else {
        const filterItemNodes = (
            document.querySelectorAll(`.${category}-section .filter__item`)
        );
        filterItemNodes.forEach((node) => {
            node.classList.remove('filter__item_selected');
        });
        e.target.classList.add('filter__item_selected');
        changeDisplayCardSection(kind, category);
    }
};

document.querySelector('.main').addEventListener('click', (e) => {
    handleSelectingMenuItem(e);
    handleSelectingFilter(e);
});

displayCards();