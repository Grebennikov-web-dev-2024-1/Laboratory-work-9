import { getDish } from "./api.js";

const LOCAL_STORAGE_KEY_STATE = 'selected-dishes';

export const dishes = [];

class SelectedDishes {
    constructor() {
        this.state = {
            "soup": null,
            "main-course": null,
            "salad": null,
            "drink": null,
            "dessert": null,
        };
    }

    savedIds() {
        let state = localStorage.getItem(LOCAL_STORAGE_KEY_STATE);
        if (!state) return;

        return JSON.parse(state);
    }

    loadState(style = true) {
        let state = localStorage.getItem(LOCAL_STORAGE_KEY_STATE);
        if (!state) return;

        state = JSON.parse(state);

        Object.entries(state).forEach(([category, id]) => {
            if (id === null) return;

            const dish = dishes.find(item => item.id === id);
            this.state[category] = dish;
            dish.choose(style);
        });
    }

    saveState() {
        const state = {};
        Object.keys(this.state).forEach(category => {
            state[category] = this.state[category]?.id ?? null;
        });
        localStorage.setItem(
            LOCAL_STORAGE_KEY_STATE,
            JSON.stringify(state)
        );
    }

    clearState() {
        Object.keys(this.state).forEach(category => {
            this.state[category] = null;
        });
        localStorage.setItem(
            LOCAL_STORAGE_KEY_STATE,
            JSON.stringify(this.state)
        );
    }

    handle(dish) {
        if (dish.isChoosen) {
            this.reject(dish);
        } else {
            this.choose(dish);
        }
        this.saveState();
    }

    choose(dish, style = true) {
        const prevDish = this.state[dish.category];
        if (prevDish !== null) {
            prevDish.reject();
        }

        this.state[dish.category] = dish;
        dish.choose(style);
    }

    reject(dish) {
        const prevDish = this.state[dish.category];
        if (prevDish !== null) {
            prevDish.reject();
        }
        this.state[dish.category] = null;
    }

    calcPrice() {
        return Object.values(this.state)
            .reduce((acc, curr) => acc + (curr?.price || 0), 0);
    }

    chosens() {
        const obj = {};
        if (this.state.soup) obj['soup_id'] = this.state.soup.id;
        if (this.state["main-course"]) {
            obj['main_course_id'] = this.state["main-course"].id;
        }
        if (this.state.salad) obj['salad_id'] = this.state.salad.id;
        if (this.state.drink) obj['drink_id'] = this.state.drink.id;
        if (this.state.dessert) obj['dessert_id'] = this.state.dessert.id;

        return obj;
    }

    comboMessage() {
        if (
            !this.state.soup
            && !this.state["main-course"] 
            && !this.state.salad
            && !this.state.drink
            && !this.state.dessert
        ) {
            return 'Ничего не выбрано. Выберите блюда для заказа';
        }
    
        if (!this.state.drink) {
            return 'Выберите напиток';
        }
    
        if ((this.state.drink || this.state.dessert)
             && !this.state["main-course"]) {
            return 'Выберите главное блюдо';
        }
    
        if (this.state.salad 
            && (!this.state.soup || !this.state["main-course"])) {
            return 'Выберите суп или главное блюдо';
        }
    
        if (this.soup && 
            (!this.state["main-course"] || !this.state.salad)) {
            return 'Выберите главное блюдо/салат/стартер';
        }
    }
}

const selectedDishes = new SelectedDishes();

export default selectedDishes;
