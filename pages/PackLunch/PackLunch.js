const form = document.querySelector('.form');
form.addEventListener('change', (e) => {
    const deliveryTimeInput = document.getElementById('delivery_time');

    if (e.target.getAttribute('id') == 'by_specified_time') {
        deliveryTimeInput.required = true;
    } else {
        deliveryTimeInput.required = false;
    }
});
