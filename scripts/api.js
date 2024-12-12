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

async function getOrders() {
    return await fetchWrapper(endpoints.orders.get());
}

async function getOrder(id) {
    return await fetchWrapper(endpoints.orders.getOne(id));
}

async function createOrder(order) {
    const json = await fetchWrapper(endpoints.orders.create(), {
        method: 'POST',
        body: order
    });
    return json;
}

async function updateOrder(order) {
    const json = await fetchWrapper(endpoints.orders.update(order.id), {
        method: 'POST',
        body: order
    });
    return json;
}

async function deleteOrder(order) {
    const json = await fetchWrapper(endpoints.orders.update(order.id), {
        method: 'POST',
        body: order
    });
    return json;
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