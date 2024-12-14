const comboItemName = {
    soup: 'Суп',
    main: 'Главное блюдо',
    salad: 'Салат',
    drink: 'Напиток',
    desert: 'Десерт'
};

const comboItemImg = {
    soup: '../../assets/icons/combo/soup.png',
    main: '../../assets/icons/combo/main.png',
    salad: '../../assets/icons/combo/salad.png',
    drink: '../../assets/icons/combo/drink.png',
    desert: '../../assets/icons/combo/desert.png'
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

function createCombo() {
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

export default createCombo;
