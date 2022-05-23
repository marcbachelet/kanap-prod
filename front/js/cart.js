/** 
 * Fetch api pour récupérer les données des produits
 */

fetch('http://localhost:3000/api/products')
    .then (res => res.json())
    .then (data =>  {
        
/**
 * Récupérer les données dans locaStorage
 */

let getBasket = JSON.parse(localStorage.getItem("basket"));

/**
 * Récupérer les données du fetch 
 * Besoin de parcourir getBasket pour avoir donnée localStorage
 * et merge les 2 tableau avec le spread Operator
 */

/**
 * 
 * encapsuler ligne 20 a 59 dans une fonction et actualiser productdata
 */


let mergeArray = (fetch, basket) => basket.map(item => 
    ({...fetch.find((data) => data._id === item.id),...item}));

let productData = mergeArray(data, getBasket);

/**
 * Insert HTML récapitulatif panier avec données tableau productData
 */

let getBasketItems = document.getElementById('cart__items');
let panier = [];

            productData.forEach ((item) => {

                panier += `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                    <div class="cart__item__img">
                            <img src="${item.imageUrl}" alt="${item.altTxt}">
                        </div>
                        <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${item.name}</h2>
                            <p>${item.color}</p>
                            <p>${item.price * item.quantity} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                        </div>
                    </article>`
            });
                        
        getBasketItems.insertAdjacentHTML('beforeend', panier);



/**
 * Actualiser le prix et les quantité 
 */

// Besoin des variables articleId et articleColor dans fonction removeKanap()
// Récuperer id du kanap
let articleId = "";

// Récuperer la couleur du kanap
let articleColor = "";

    let changeQuantityAndPrice = () => {

    // Récuperer les articles dans getBasket 
    let articleData = document.querySelectorAll('article');

    // Récuperer la quantité des articles
    let itemQuantity = document.querySelectorAll('input.itemQuantity');
                
    // Variable prix unitaire
    let articlePrice = "";

    // Variable quantité total par kanap
    let quantityValue = "";

    // récuperer quantity value
        itemQuantity.forEach((itemValue) => {
            itemValue.addEventListener('change', () => {                     
                quantityValue = Number(itemValue.value);                                  
            })
        })

    // Récuperer dataset et prix kanap unitaire
        articleData.forEach((article, i) => {
            article.addEventListener('change', () => {
                articleId = article.dataset.id;
                articleColor = article.dataset.color;

                for(let product of data) {
                    if(product._id == articleId) {
                        articlePrice = product.price;
                    }
                }

                for(i = 0; i < productData.length; i++) {
                    if(productData[i]._id == articleId && productData[i].color == articleColor) {
                        getBasket[i].quantity = quantityValue;
                        productData[i].price = document.querySelectorAll('.cart__item__content__description p:last-child')[i].textContent = articlePrice * quantityValue;
                        localStorage.setItem("basket", JSON.stringify(getBasket));
                        totalOrderPrice();
                        document.getElementById('totalPrice').textContent = finalTotalPrice;
                    }
                }
            })
        })
    };
    changeQuantityAndPrice();

/**
 * Supprime un article et clear localStorage après avoir supprimer le dernier kanap 
 */

let newBasket = [];

            let removeKanap = () => {

                // Récupére tous les p class deletItem
                let deleteKanap = document.querySelectorAll('.deleteItem');
                
                deleteKanap.forEach((kanap, i) => {
                    kanap.addEventListener('click', (e) => {
                        // Récupére articleId et articleColor au click pour comparer avec getBasket
                        articleId = getBasket[i].id;
                        articleColor = getBasket[i].color;
                        if (getBasket.length == 1 || newBasket.length == 1) {
                            if(confirm(`Il n'y a que 1 kanap dans votre panier.\n\nEtes-vous sûr de vouloir vider votre panier ?\n\nPour vider votre panier et être rediriger vers la page d'accueil cliquez sur OK, sinon cliquez sur Annuler pour rester sur la page panier et valider votre commande.`)) {
                            e.target.parentElement.parentElement.parentElement.parentElement.remove();
                            localStorage.clear();
                            location.href = "index.html"
                            } else {
                                document.location;
                            }

                        } else {
                            newBasket = getBasket.filter(el => {
                                if (articleId != el.id || articleColor != el.color) {     
                                    return true;
                                    }
                                })
                                e.target.parentElement.parentElement.parentElement.parentElement.remove();
                                localStorage.setItem("basket", JSON.stringify(newBasket));
                                getBasket = newBasket;
                                totalOrderPrice();
                                document.getElementById('totalPrice').textContent = finalTotalPrice;
                                document.getElementById('totalQuantity').textContent = finalTotalQuantity;
                            }
                    })
                })
            };
            removeKanap();

/**
 * calcul du prix total de la commande
 */

let finalTotalPrice;
let finalTotalQuantity;

            let totalOrderPrice = () => {

                    let tempTotal = 0;
                    productData.map(item => {
                        tempTotal += item.price * item.quantity;
                    })
                    finalTotalPrice = tempTotal;

                    //Nombre d'article dans getBasket
                    finalTotalQuantity = getBasket.length;

            };
            totalOrderPrice();
    
            // Insertion du html div cart_price

                let cartPrice = 
                    `<div class="cart__price">
                    <p>Total (<span id="totalQuantity">${finalTotalQuantity}</span> articles) : <span id="totalPrice">${finalTotalPrice}</span> €</p>
                    </div>`;
                

                getBasketItems.insertAdjacentHTML ('beforeend', cartPrice);


// *************************** Partie formulaire *******************************************

            // Insertion du formulaire
            let formHtml = `<div class="cart__order">
                            <form method="get" class="cart__order__form">
                                <div class="cart__order__form__question">
                                    <label for="firstName">Prénom: </label>
                                    <input type="text" name="firstName" id="firstName" required>
                                    <p id="firstNameErrorMsg">ceci est un message d'erreur</p>
                                </div>
                                <div class="cart__order__form__question">
                                    <label for="lastName">Nom: </label>
                                    <input type="text" name="lastName" id="lastName" required>
                                    <p id="lastNameErrorMsg"></p>
                                </div>
                                <div class="cart__order__form__question">
                                    <label for="address">Adresse: </label>
                                    <input type="text" name="address" id="address" required>
                                    <p id="addressErrorMsg"></p>
                                </div>
                                <div class="cart__order__form__question">
                                    <label for="city">Ville: </label>
                                    <input type="text" name="city" id="city" required>
                                    <p id="cityErrorMsg"></p>
                                </div>
                                <div class="cart__order__form__question">
                                    <label for="email">Email: </label>
                                    <input type="email" name="email" id="email" required>
                                    <p id="emailErrorMsg"></p>
                                </div>
                                <div class="cart__order__form__submit">
                                    <input type="submit" value="Commander !" id="order">
                                </div>
                            </form>
                        </div>`;

                        getBasketItems.insertAdjacentHTML('beforeend', formHtml);


                // Validation formulaire avant envoi

                // Récupere partie input label firstName
                let formFirstName = document.getElementById('firstName');

                // Ecoute evenement change sur label firstName
                formFirstName.addEventListener('change', function() {
                    validFirstName(this);
                });

                // validation firstName
                let testFirstName = "";
                let validFirstName = function(inputFirstName) {
                    let firstNameRegExp = new RegExp("^[a-z]+[ \-]?[[a-z]+[ \-]?]*[a-z]+$", "gi");
                        testFirstName = firstNameRegExp.test(inputFirstName.value);

                // Récupere message erreur label firstName
                let msgErrorFirstName = document.getElementById('firstNameErrorMsg');
                msgErrorFirstName.textContent = " ";

                // Test si firstName valid
                    if(testFirstName) {
                        msgErrorFirstName.textContent = 'Prénom valide';
                    } else {
                        msgErrorFirstName.textContent = 'Veuillez renseigner votre prénom';
                    }
                };


                // Récupere partie input label lastName
                let formLastName = document.getElementById('lastName');

                // Ecoute evenement change sur label lastName
                formLastName.addEventListener('change', function() {
                    validLastName(this);
                });

                // validation lastName
                let testLastName = "";
                let validLastName = function(inputLastName) {
                    let lastNameRegExp = new RegExp("^[a-z]+[ \-]?[[a-z]+[ \-]?]*[a-z]+$", "gi");
                        testLastName = lastNameRegExp.test(inputLastName.value);

                // Récupere message erreur label lastName
                let msgErrorLastName = document.getElementById('lastNameErrorMsg');

                // Test si lastName valid
                if(testLastName) {
                    msgErrorLastName.textContent = 'Nom valide';
                    } else {
                    msgErrorLastName.textContent = 'Veuillez renseigner votre nom';
                    }
                };

                // Récupere partie input label adresse
                let formAdress = document.getElementById('address');

                // Ecoute evenement change sur label adresse
                formAdress.addEventListener('change', function() {
                    validAdress(this);
                });

                // validation adresse
                let testAdress = "";
                let validAdress = function(inputAdress) {
                    let adressRegExp = new RegExp("^[0-9a-zA-Z,-_. ]+$", "gi");
                        testAdress = adressRegExp.test(inputAdress.value);

                // Récupere message erreur label adresse
                let msgErrorAdress = document.getElementById('addressErrorMsg');

                // Test si adresse valid
                    if(testAdress) {
                        msgErrorAdress.textContent = 'Adresse valide';
                    } else {
                        msgErrorAdress.textContent = 'Votre adresse est non valide';
                    }
                };

                // Récupere partie input label ville
                let formCity = document.getElementById('city');

                // Ecoute evenement change sur label ville
                formCity.addEventListener('change', function() {
                    validCity(this);
                });

                // validation ville
                let testCity = "";
                let validCity = function(inputCity) {
                    let cityRegExp = new RegExp("^[a-zA-Z-_. ]+$", "gi");
                        testCity = cityRegExp.test(inputCity.value);

                // Récupere message erreur label city
                let msgErrorCity = document.getElementById('cityErrorMsg');

                // Test si city valid
                    if(testCity) {
                        msgErrorCity.textContent = 'Ville valide';
                    } else {
                        msgErrorCity.textContent = 'Veuillez renseigner le nom de votre ville';
                    }
                };

                // Récupere partie input label email
                let formEmail = document.getElementById('email');

                // Ecoute evenement change sur label email
                formEmail.addEventListener('change', function() {
                    validEmail(this);
                });

                // Validation email
                let testEmail = "";
                let validEmail = function(inputEmail) {
                    let emailRegExp = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$');
                        testEmail = emailRegExp.test(inputEmail.value);

                // Récupere message erreur label email
                let msgErrorEmail = document.getElementById('emailErrorMsg');

                // Test si email valid
                    if(testEmail) {
                        msgErrorEmail.textContent = 'Email valide';
                    } else {
                        msgErrorEmail.textContent = 'Votre Email est non valide';
                    }
                };

                // Requete serveur données visiteur

                // Ecoute bouton Commander
                let order = document.getElementById('order');
                order.addEventListener('click', (e) => {
                    e.preventDefault();

                    if (testFirstName && testLastName && testAdress && testCity && testEmail) {

                    let contact = {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        address: address.value,
                        city: city.value,
                        email: email.value
                    }

                    let products = [];

                    for(let item of getBasket) {
                        products.push(item.id);
                    }

                    // Rassembler les données dans orderData
                    let orderData = {
                        contact: contact,
                        products: products
                    }

                        fetch('http://localhost:3000/api/products/order', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(orderData)
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("J'ai une réponse!");
                            console.log(data);
                            localStorage.clear();
                            location.href = `confirmation.html?orderId=${data.orderId}`;
                        })
                        .catch(erreur => console.log('Erreur: ' + erreur));
                    } else {
                        alert("Veuillez remplir les champs manquant du formulaire pour pouvoir valider votre commande.");
                    }
                    
                })
    })
    .catch(erreur => console.log('Erreur: ' + erreur));






                    

                
            
            

