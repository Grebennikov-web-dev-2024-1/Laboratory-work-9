import { formatDDMMYYYYHHMM } from "./date.js";

const API_ENTRY_POINT = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const API_ACCESS_KEY = '98d750c8-b62b-4631-801a-ea217f56febd';

const endpoints = {
    dishes: {
        get: () => `${API_ENTRY_POINT}/dishes`,
        getOne: (id) => 
            `${API_ENTRY_POINT}/dishes/${id}?api_key=${API_ACCESS_KEY}`,
    },
    orders: {
        get: () => 
            `${API_ENTRY_POINT}/orders?api_key=${API_ACCESS_KEY}`,
        getOne: (id) => 
            `${API_ENTRY_POINT}/orders/${id}?api_key=${API_ACCESS_KEY}`,
        create: () => 
            `${API_ENTRY_POINT}/orders?api_key=${API_ACCESS_KEY}`,
        update: (id) => 
            `${API_ENTRY_POINT}/orders/${id}?api_key=${API_ACCESS_KEY}`,
        delete: (id) => 
            `${API_ENTRY_POINT}/orders/${id}?api_key=${API_ACCESS_KEY}`,
    }
};

const categories = ['soup_id', 'main_course_id',
    'salad_id', 'dessert_id', 'drink_id'];

async function fetchWrapper(url, args) {
    const method = args?.method ?? "GET";
    const body = args?.body;
    
    const res = await fetch(url, {
        method: method,
        body
    });

    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(`Ошибка HTTP ${res.status}: ${res.error}`);
    }
}

async function getDishes() {
    return await fetchWrapper(endpoints.dishes.get());
}

async function getDish(id) {
    return await fetchWrapper(endpoints.dishes.getOne(id));
}

async function normalizeOrder(order) {
    const reqDishes = [];
    categories.forEach(category => {
        if (order[category] === null) return;
        reqDishes.push(getDish(order[category]));
    });

    order.created_at = new Date(order.created_at);

    const dishes = await Promise.all(reqDishes);
    order['price'] = dishes.reduce((acc, cur) => 
        acc + (cur?.price ?? 0), 0);
    order['dishes'] = dishes.reduce((acc, cur) => {
        acc[cur.category] = cur;
        return acc;
    }, {});
    if (order.delivery_type === 'now') {
        order.delivery_time = 'Как можно скорее (с 07:00 до 23:00)';
    } else {
        order.delivery_time = order.delivery_time.slice(0, 5);
    }

    return order;
}

async function getOrders() {
    const orders = await fetchWrapper(endpoints.orders.get());
    return await Promise.all(
        orders.map(async order => {
            return await normalizeOrder(order);
        })
    );
}

async function getOrder(id) {
    const order = await fetchWrapper(endpoints.orders.getOne(id));
    return await normalizeOrder(order);
}

async function createOrder(order) {
    const json = await fetchWrapper(endpoints.orders.create(), {
        method: 'POST',
        body: order
    });
    return json;
}

async function updateOrder(id, order) {
    await fetchWrapper(endpoints.orders.update(id), {
        method: 'PUT',
        body: order
    });
}

async function deleteOrder(id) {
    await fetchWrapper(endpoints.orders.delete(id), {
        method: 'DELETE',
    });
}

export {
    getDishes,
    getDish,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
};