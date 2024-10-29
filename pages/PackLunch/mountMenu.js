import { menu } from './menuList.js';

const selectedMenuItems = {
    soups: null,
    "main-course": null,
    beverages: null,
};
 
const dishCardTemplate = document.getElementById('dish-card');

const soupsListNode = document.querySelector('.soups-section div.dishes');
const mainCourseListNode = (
    document.querySelector('.main-course-section div.dishes')
);
const beveragesListNode = (
    document.querySelector('.beverages-section div.dishes')
);

menu
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((menuItem) => {
        const menuItemNode = dishCardTemplate.content.cloneNode(true);
        const rootNode = menuItemNode.querySelector('.dish');
        rootNode.dataset.dish = menuItem.keyword;
        const img = menuItemNode.querySelector('.dish__img');
        img.src = menuItem.image;
        img.alt = menuItem.name;
        menuItemNode.querySelector('.dish__price').textContent = menuItem.price;
        menuItemNode.querySelector('.dish__name').textContent = menuItem.name;
        menuItemNode.querySelector('.dish__amount').textContent = (
            menuItem.count
        );

        menuItemNode
            .querySelector('.dish__add')
            .addEventListener('click', (e) => {
                const keywordOfSelectedMenuItem = (
                    e.target.closest('.dish').dataset.dish
                );
                const selectedMenuItem = (
                    menu.find((item) => (
                        item.keyword == keywordOfSelectedMenuItem)
                    )
                );
                selectedMenuItems[selectedMenuItem.category] = selectedMenuItem;

                const menuItemsByCategory = (
                    document
                        .querySelectorAll(
                            `.${selectedMenuItem.category}-section .dish`
                        )
                );
                menuItemsByCategory.forEach((itemNode) => {
                    if (itemNode.dataset.dish === keywordOfSelectedMenuItem) {
                        itemNode.classList.add('dish_selected');
                    } else {
                        itemNode.classList.remove('dish_selected');
                    }
                });
    
                const formBasketMenuItems = (
                    document.querySelector('.form__basket-menu-items')
                );
                const basketMenuItems = (
                    document
                        .getElementById('basket-menu-items')
                        .content
                        .cloneNode(true)
                );

                const basketMenuItemSoups = (
                    basketMenuItems.getElementById('basket-menu-item-soups')
                );
                const basketMenuItemSoupsValue = (
                    selectedMenuItems.soups 
                        ? (
                            `${selectedMenuItems.soups.name} `
                            + `${selectedMenuItems.soups.price}₽`
                        )
                        : 'Суп не выбран'
                );
                basketMenuItemSoups
                    .querySelector('.basket-menu-item__content')
                    .textContent = basketMenuItemSoupsValue;
                document.getElementById('soups').value = (
                    selectedMenuItems.soups 
                        ? selectedMenuItems.soups.keyword 
                        : ""
                );

                const basketMenuItemMainCourse = (
                    basketMenuItems
                        .getElementById('basket-menu-item-main-course')
                );
                const basketMenuItemMainCourseValue = (
                    selectedMenuItems['main-course'] 
                        ? (
                            `${selectedMenuItems['main-course'].name} `
                            + `${selectedMenuItems['main-course'].price}₽` 
                        )
                        : 'Главное блюдо не выбрано'
                );
                basketMenuItemMainCourse
                    .querySelector('.basket-menu-item__content')
                    .textContent = basketMenuItemMainCourseValue;
                document.getElementById('main-course').value = (
                    selectedMenuItems['main-course'] 
                        ? selectedMenuItems['main-course'].keyword 
                        : ""
                );

                const basketMenuItemBeverages = (
                    basketMenuItems
                        .getElementById('basket-menu-item-beverages')
                );
                const basketMenuItemBeveragesValue = (
                    selectedMenuItems.beverages 
                        ? (
                            `${selectedMenuItems.beverages.name} ` 
                            + `${selectedMenuItems.beverages.price}₽`
                        )
                        : 'Напиток не выбран'
                );
                basketMenuItemBeverages
                    .querySelector('.basket-menu-item__content')
                    .textContent = basketMenuItemBeveragesValue;
                document.getElementById('beverages').value = (
                    selectedMenuItems.beverages 
                        ? selectedMenuItems.beverages.keyword 
                        : ""

                );

                const basketMenuItemSum = (
                    basketMenuItems
                        .getElementById('basket-menu-item-sum')
                );
                const basketMenuItemSumValue = (
                    Object
                        .values(selectedMenuItems)
                        .reduce((acc, cur) => cur ? cur.price + acc : acc, 0)
                );
                basketMenuItemSum
                    .querySelector('.basket-menu-item__content')
                    .textContent = `${basketMenuItemSumValue}₽`;

                formBasketMenuItems.innerHTML = '';
                formBasketMenuItems.append(basketMenuItems);
            });

        if (menuItem.category == 'soups') {
            soupsListNode.append(menuItemNode);
        } else if (menuItem.category == 'main-course') {
            mainCourseListNode.append(menuItemNode);
        } else if (menuItem.category == 'beverages') {
            beveragesListNode.append(menuItemNode);
        }
    });
