import { deleteOrder, getOrders, updateOrder } from '../../scripts/api.js';
import { formatDDMMYYYYHHMM } from '../../scripts/date.js';
import toast from "../../scripts/toast.js";

let orders = [];
let typeModal = 'view';

const modalStucture = [
    {
        view: 'row',
        label: 'Дата оформления',
        key: 'created_at',
        isViewOnly: true,
    },
    {
        view: 'title',
        label: 'Доставка',
    },
    {
        view: 'row',
        label: 'Имя получателя',
        key: 'full_name',
        inputArgs: {
            type: 'text',
            required: true,
        }
    },
    {
        view: 'row',
        label: 'Адрес доставки',
        key: 'delivery_address',
        inputArgs: {
            type: 'text',
            required: true,
        }
    },
    {
        view: 'radio',
        label: 'Тип доставки',
        key: 'delivery_type',
        variants: [
            {
                label: 'Как можно скорее',
                key: 'now'
            },
            {
                label: 'Ко времени',
                key: 'by_time'
            }
        ]
    },
    {
        view: 'row',
        label: 'Время доставки',
        key: 'delivery_time',
        inputArgs: {
            type: 'time',
            min: '07:00',
            max: '23:00',
            step: '300',
        }
    },
    {
        view: 'row',
        label: 'Телефон',
        key: 'phone',
        inputArgs: {
            type: 'tel',
            required: true,
        }
    },
    {
        view: 'row',
        label: 'Email',
        key: 'email',
        inputArgs: {
            type: 'email',
            required: true,
        }
    },
    {
        view: 'title',
        label: 'Комментарий',
    },
    {
        view: 'textarea',
        key: 'comment'
    },
    {
        view: 'title',
        label: 'Состав заказа',
    },
    {
        view: 'row',
        label: 'Суп',
        mask: '* (*₽)',
        key: ['dishes.soup.name', 'dishes.soup.price'],
        isViewOnly: true,
    },
    {
        view: 'row',
        label: 'Основное блюдо',
        mask: '* (*₽)',
        key: ['dishes.main-course.name', 'dishes.main-course.price'],
        isViewOnly: true,
    },
    {
        view: 'row',
        label: 'Салат',
        mask: '* (*₽)',
        key: ['dishes.salad.name', 'dishes.salad.price'],
        isViewOnly: true,
    },
    {
        view: 'row',
        label: 'Напиток',
        mask: '* (*₽)',
        key: ['dishes.drink.name', 'dishes.drink.price'],
        isViewOnly: true,
    },
    {
        view: 'row',
        label: 'Десерт',
        mask: '* (*₽)',
        key: ['dishes.dessert.name', 'dishes.dessert.price'],
        isViewOnly: true,
    },
    {
        view: 'title',
        label: 'Стоимость',
        mask: ': *₽',
        key: 'price'
    }
];

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countSubstr(str, substr) {
    if (substr === "") return 0; // Обработка пустой подстроки
    const matches = str.match(new RegExp(escapeRegExp(substr), 'g'));
    return matches ? matches.length : 0;
}
  

function dynamicProperty(obj, prop) {
    if (!prop.includes('.')) {
        return obj[prop];
    }
    let value = obj;
    prop.split('.').forEach(lavel => {
        value = value?.[lavel];
    });
    return value;
}

function useMask(properties, mask) {
    if (properties.length !== countSubstr(mask, '*')) return;

    while (mask.includes('*')) {
        mask = mask.replace('*', properties[0]);
        properties = properties.slice(1);
    }
    return mask;
}

function isOpenModal(isOpen) {
    const modal = document.querySelector('.order-modal');
    if (isOpen) {
        modal.classList.remove('order-modal_hide');
    } else {
        modal.classList.add('order-modal_hide');
    }
}


function createModalTextare(value, isView = true, key) {
    if (isView) {
        return `<div class="order-modal__row">${value ?? ''}</div>`;
    } else {
        return `
        <textarea
            class="order-modal__textarea"
            name="${key}"
            >${value ?? ''}</textarea>
        `;
    }
}

function createModalRadio(label, value, key, variants) {
    const inputs = variants.map(variant => {
        return `
            <div class="order-modal__radio">
                <input
                    class="order-modal__input"
                    type="radio"
                    id="${variant.key}"
                    name="${key}"
                    value="${variant.key}"
                    ${value === variant.key && 'checked' }
                >
                <label for="${variant.key}">${variant.label}</label>
            </div>
        `;
    }).join('');
    
    return `
        <div class="order-modal__row">
            <div class="order-modal__col">${label}</div>
            <div class="order-modal__col">
            ${inputs}
            </div>
        </div>
    `;
}

function createModalTitle(title) {
    return `<div class="order-modal__title">${title}</div>`;
}

function createModalRow(label, value, isView = true, key, inputArgs) {
    if (isView) {
        return `
        <div class="order-modal__row">
            <div class="order-modal__col">${label}</div>
            <div class="order-modal__col">${value}</div>
        </div>
        `;
    } else {
        const args = inputArgs ? Object.entries(inputArgs)
            .map(([key, value]) => `${key}=${value}`)
            .join(' ')
            : '';
        return `
        <div class="order-modal__row">
            <label for="${key}">${label}</label>
            <input
                class="order-modal__input"
                id="${key}"
                name="${key}"
                value="${value}"
                ${args}
            >
        </div>
        `;
    }
}

function createUselessBtn(text) {
    const el = document.createElement('button');
    el.className = 'btn btn-reset';
    el.type = 'button';
    el.innerHTML = text;
    el.addEventListener('click', () => {
        isOpenModal(false);
    });
    return el;
}

function createSaveBtn() {
    const el = document.createElement('button');
    el.className = 'btn btn_success btn-reset order-modal__save';
    el.type = 'submit';
    el.textContent = 'Сохранить';
    return el;
}

function createRemoveBtn() {
    const el = document.createElement('button');
    el.className = 'btn btn_danger btn-reset order-modal__remove';
    el.type = 'submit';
    el.textContent = 'Да';
    return el;
}


function openViewChangeModal(id, isView = true) {
    typeModal = isView ? 'view' : 'change';
    document
        .querySelector('.order-modal__form input[name="id"]').value = id;

    document.querySelector('.order-modal__title')
        .textContent = 'Просмотр заказа';

    const main = document.querySelector('.order-modal__main');
    let newMain = '';
    const order = orders.find(item => item.id === id);

    modalStucture.forEach(el => {
        let value = order[el.key];

        switch (el.view) {
        case 'title':
            let label = el.label;
            if (el.mask) {
                label = label + useMask([value], el.mask);
            }
            newMain += createModalTitle(label);
            break;
        case 'row':
            if (value instanceof Date) {
                value = formatDDMMYYYYHHMM(value);
            }
            if (el.mask) {
                const properties = el.key.map((key) => 
                    dynamicProperty(order, key));
                if (properties.includes(undefined)) return;
                value = useMask(properties, el.mask);
            }
            
            newMain += createModalRow(
                el.label,
                value,
                isView || !!el.isViewOnly,
                el.key,
                el.inputArgs
            );
            break;
        case 'radio':
            if (isView) return;
            newMain += createModalRadio(el.label, value, el.key, el.variants);
            break;
        case 'textarea':
            newMain += createModalTextare(value, isView, el.key);
            break;
        }
    });

    main.innerHTML = newMain;

    const btns = document.querySelector('.order-modal__btns');
    btns.innerHTML = '';

    if (isView) {
        btns.append(createUselessBtn('Ok'));
    } else {
        btns.append(createUselessBtn('Отмена'));
        btns.append(createSaveBtn());
    }

    isOpenModal(true);

}

function openRemoveModal(id) {
    typeModal = 'remove';
    document
        .querySelector('.order-modal__form input[name="id"]').value = id;
    document.querySelector('.order-modal__title')
        .textContent = 'Удаление заказа';

    const main = document.querySelector('.order-modal__main');
    main.innerHTML = `
        <div class="order-modal__message">
            Вы уверены, что хотите удалить заказ?
        </div>`;

    const btns = document.querySelector('.order-modal__btns');
    btns.innerHTML = '';
    btns.append(createUselessBtn('Отмена'));
    btns.append(createRemoveBtn());

    document.querySelector('.order-modal__btns');
    isOpenModal(true);
}

function viewOrderBtn(id) {
    const el = document.createElement('button');
    el.className = 'btn-reset btn-s-icon btn-view';
    el.addEventListener('click', () => openViewChangeModal(id));
    return el;
}

function changeOrderBtn(id) {
    const el = document.createElement('button');
    el.className = 'btn-reset btn-s-icon btn-change';
    el.addEventListener('click', () => openViewChangeModal(id, false));
    return el;
}

function removeOrderBtn(id) {
    const el = document.createElement('button');
    el.className = 'btn-reset btn-s-icon btn-remove';
    el.addEventListener('click', () => openRemoveModal(id));
    return el;
}

function createTableRow(item) {
    const el = document.createElement('tr');
    el.innerHTML = `
        <td>${item.id}</td>
        <td>${formatDDMMYYYYHHMM(item.created_at)}</td>
        <td class="text-start">
            ${Object.values(item.dishes).map(dish => dish.name).join(', ')}
        </td>
        <td>${item.price}₽</td>
        <td>${item.delivery_time}</td>
        <td></td>
    `;
    const div = document.createElement('div');
    div.className = 'orders-table__bactions';

    div.append(viewOrderBtn(item.id));
    div.append(changeOrderBtn(item.id));
    div.append(removeOrderBtn(item.id));

    el.lastElementChild.append(div);

    return el;
}

function createTableRowSkeleton() {
    const el = document.createElement('tr');
    el.innerHTML = `
        <td><span class="skeleton-box skeleton__bid"></span></td>
        <td><span class="skeleton-box skeleton__bcreated-at"></span></td>
        <td class="text-start">
        <span class="skeleton-box skeleton__bcomposition"></span>
        </td>
        <td><span class="skeleton-box skeleton__bprice"></span></td>
        <td><span class="skeleton-box skeleton__bdelivery-time"></span></td>
        <td><span class="skeleton-box skeleton__bactions"></span></td>
    `;
    return el;
}


function renderTableSkeleton() {
    const table = document.querySelector('.orders-table tbody');
    table.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        table.append(createTableRowSkeleton());
    }
}

function renderTable(arr) {
    const table = document.querySelector('.orders-table tbody');
    table.innerHTML = '';
    arr.forEach(item => {
        table.append(createTableRow(item));
    });
}

async function loadOrders() {
    renderTableSkeleton();
    orders = await getOrders();
    orders.sort((a, b) => b.created_at - a.created_at);
    renderTable(orders);
}

function attachModalEvents() {
    document.querySelector('.order-modal')
        .addEventListener('click', e => {
            isOpenModal(false);
        });
    document.querySelector('.order-modal__container')
        .addEventListener('click', e => {
            e.stopPropagation();
        });
    document.querySelector('.order-modal__close')
        .addEventListener('click', () => {
            isOpenModal(false);
        });
}

function isLoadingBtn(isLoading, btn, text) {
    if (isLoading) {
        btn.classList.add('btn_icon');
        btn.disable = true;
        btn.innerHTML = `<div class="btn-s-icon btn-loader"></div> ${text}`;
    } else {
        btn.classList.remove('btn_icon');
        btn.disable = false;
        btn.innerHTML = text;
    }
}


async function handleSubmit(e) {
    e.preventDefault();

    let btn;
    if (typeModal === 'remove') {
        btn = document.querySelector('.order-modal__remove');
    } else {
        btn = document.querySelector('.order-modal__save');
    }

    const text = btn.textContent;
    isLoadingBtn(true, btn, text);

    const data = new FormData(e.target);
    const id = data.get('id');

    if (typeModal === 'remove') {
        try {
            await deleteOrder(id);
            isOpenModal(false);
            loadOrders();
            toast('Заказ успешно удален');
        } catch (e) {
            if (!e.message) return;
            toast(`Ошибка: ${e.message}`);
        }
    } else {
        try {
            await updateOrder(id, data);
            isOpenModal(false);
            loadOrders();
            toast('Заказ успешно изменен');
        } catch (e) {  
            if (!e.message) return;
            toast(`Ошибка: ${e.message}`);
        }
    }


    isLoadingBtn(false, btn, text);
}


attachModalEvents();
loadOrders();
document.querySelector('.order-modal__form')
    .addEventListener('submit', handleSubmit);