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


const comboItemName = {
    soup: 'Суп',
    main: 'Главное блюдо',
    salad: 'Салат',
    drink: 'Напиток',
    desert: 'Десерт'
};

const comboItemImg = {
    soup: '../../img/icons/soup.png',
    main: '../../img/icons/main.png',
    salad: '../../img/icons/salad.png',
    drink: '../../img/icons/drink.png',
    desert: '../../img/icons/desert.png'
};

const combo = [
    {
        name: 'complext',
        list: ['soup', 'main', 'salad', 'drink']
    },
    {
        name: 'soup-main',
        list: ['soup', 'main', 'drink']
    },
    {
        name: 'soup-salad',
        list: ['soup', 'salad', 'drink']
    },
    {
        name: 'main-salad',
        list: ['main', 'salad', 'drink']
    },
    {
        name: 'main',
        list: ['main', 'drink']
    },
    {
        name: 'desert',
        list: ['desert'],
        note: '(можно добавить к любому заказу)'
    }
];

function createComboIcon(name, img) {
    return `<div class="icon">
        <img class="icon__img" src="${img}" alt="${name}">
        <p class="icon__text">${name}</p>
    </div>`;
}

function createComboItemContent(list) {
    let children = '<div class="combo__content">';
    for (const item of list) {
        children += createComboIcon(comboItemName[item], comboItemImg[item]);
    }
    children += '</div>';
    return children;
}

function createCombo(combo) {
    const comboNode = document.querySelector('.combo');
    for (const {name, list, note} of combo) {
        const comboItemEl = document.createElement('div');
        comboItemEl.classList.add('combo__item');
        comboItemEl.dataset.name = name;
        let children = createComboItemContent(list);
        
        if (note) {
            children += `<div class="icon__note">${note}</div>`;
        }
        comboItemEl.innerHTML = children;
        comboNode.append(comboItemEl);
    } 
}

function getAlertMessage() {
    const soupValue = document.querySelector('#soups').value;
    const mainCourseValue = document.querySelector('#main-course').value;
    const saladStarterValue = document.querySelector('#salads-starters').value;
    const beverageValue = document.querySelector('#beverages').value;
    const dessertValue = document.querySelector('#desserts').value;

    if (
        !soupValue
        && !mainCourseValue 
        && !saladStarterValue
        && !beverageValue
        && !dessertValue
    ) {
        return 'Ничего не выбрано. Выберите блюда для заказа';
    }

    if (!beverageValue) {
        return 'Выберите напиток';
    }

    if ((beverageValue || dessertValue) && !mainCourseValue) {
        return 'Выберите главное блюдо';
    }

    if (saladStarterValue && (!soupValue || !mainCourseValue)) {
        return 'Выберите суп или главное блюдо';
    }

    if (soupValue && (!mainCourseValue || !saladStarterValue)) {
        return 'Выберите главное блюдо/салат/стартер';
    }
}

document.querySelector('.main').addEventListener('click', (e) => {
    handleSelectingMenuItem(e);
    handleSelectingFilter(e);
});

document.querySelector('.form').addEventListener('submit', (e) => {
    const alertMessage = getAlertMessage();
    console.log(alertMessage);
    if (!alertMessage) {
        return;
    }

    e.preventDefault();
    const alertEl = document.querySelector('.alert');
    alertEl.firstChild.textContent = alertMessage;
    alertEl.classList.remove('hide');
});

displayCards();
createCombo(combo);
