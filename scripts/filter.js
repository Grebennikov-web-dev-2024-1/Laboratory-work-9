import { dishes } from "./selectedDishes.js";

function filter(kind, category) {
    dishes.forEach(dish => {
        if (dish.category !== category) return;
        if (dish.kind === kind || kind === 'all') {
            dish.show();
        } else {
            dish.hide();
        }
    });
}

function renderFilter(e, isToggleFilter) {
    if (isToggleFilter) {
        e.target.classList.remove('filter__item_selected');
    } else {
        for (let elem of e.target.parentElement.children) {
            elem.classList.remove("filter__item_selected");
        }
        e.target.classList.add("filter__item_selected");
    }
}

function handleFilter(e) {
    const isFilterBtn = e.target.classList.contains('filter__item');
    if (!isFilterBtn) return;

    const kind = e.target.dataset.kind;
    const category = e.target.parentElement.parentElement
        .classList[1].replace('-section', '');
    
    const isToggleFilter = e.target.classList.contains('filter__item_selected');
    filter(isToggleFilter ? 'all' : kind, category);
    renderFilter(e, isToggleFilter);
}

export { handleFilter };

