/**
 * Récupère url
 * Récupère orderId dans url
 * Insert orderId dans HTML
 */
let url = document.location;

let orderId = "";

let urlId = new URL(url);

let search_params = new URLSearchParams(urlId.search);
    if (search_params.has('orderId')) {
        orderId = search_params.get('orderId');
    }

document.getElementById('orderId').textContent = orderId;
