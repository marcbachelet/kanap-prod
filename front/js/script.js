/**
 * Fait une requête a l'api
 * Récupère tous les produits
 * Affiche tous les produits
 * Gère l'erreur si besoin
 */
fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        let affichage = "";
        for(let product of data) {
            affichage += `<a href="./product.html?id=${product._id}">
             <article>
             <img src="${product.imageUrl}" alt="${product.altTxt}">
             <h3 class="productName">${product.name}</h3>
             <p class="productDescription">${product.description}</p>
             </article>
             </a>`;
        }
        let getItems = document.querySelector('#items');
        getItems.insertAdjacentHTML('beforeend', affichage);
    })
    .catch(erreur => console.log('Erreur: ' + erreur));



    
