function toast(message) {
    const el = document.querySelector('.alert');

    el.firstElementChild.textContent = message;
    el.lastElementChild
        .addEventListener('click', () => {
            el.classList.add('hide');
        });

    el.classList.remove('hide');
}

export default toast;