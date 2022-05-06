/**
 * Récupère url
 * Récupère l'id du produit depuis l'url
 */
let url = document.location;

let id = "";

let urlId = new URL(url);

let search_params = new URLSearchParams(urlId.search);
    if (search_params.has('id')) {
        id = search_params.get('id');
    }
    
/**
 * Fetch api, récupère et affiche le produit sélectionné
 * Gère évènement au clic sur bouton addToCart
 * Gère le localStorage
 * Gère ajout et suppression produit
 * Gère erreur si besoin
 */
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {

            document.querySelector(".item__img").innerHTML = `<img src="${data["imageUrl"]}" alt="${data["altTxt"]}">`;
            document.querySelector("#title").innerHTML = `${data["name"]}`;
            document.querySelector("#price").innerHTML = `${data["price"]}`;
            document.querySelector("#description").innerHTML = `${data["description"]}`;     
            let option = "";
            data.colors.forEach(color =>  {
                option = document.createElement("option");
                document.getElementById('colors').appendChild(option);
                option.setAttribute("value", color);
                option.textContent = color;
            }); 

            // Ecoute évenement au clic sur le bouton addToCart
            let addCart = document.querySelector("#addToCart");
            let colorSelect = document.getElementById('colors');
            let quantitySelect = document.getElementById('quantity');
            addCart.addEventListener('click', () => {
            /**
             * Récupère choix visiteur + data api
             * @param {Objet} productSelect
             * @param {String} productSelect.id 
             * @param {String} productSelect.image
             * @param {String} productSelect.altTxt
             * @param {String} productSelect.name
             * @param {Integer} productSelect.price
             * @param {String} productSelect.color
             * @param {String} productSelect.quantity
             */
            let productSelect = {
                id: id,
                image: data.imageUrl,
                altTxt: data.altTxt,
                name: data.name,
                price: data.price * quantitySelect.value,
                color: colorSelect.value,
                quantity: quantitySelect.value
            }
           
            // Fonction fenêtre de confirmation aller page panier ou revenir page accueil
            let confirmBasket = () => {
                    if(confirm(`Votre panier contient ${productSelect["quantity"]} ${productSelect["name"]} de couleur ${productSelect["color"]}. Pour consulter votre panier cliquez sur OK ou cliquez sur Annuler pour revenir sur la page d'accueil.`)) {
                        document.location.href = "cart.html";
                    } else {
                        document.location.href = "index.html";
                    }
                }
                // Récupérer les données panier du visiteur dans le getItem
                let getBasket = JSON.parse(localStorage.getItem("basket"));

                //Si localStorage vide
                if(getBasket == null) {
                    getBasket = [];
                    getBasket.push(productSelect); 
                    localStorage.setItem("basket", JSON.stringify(getBasket));
                    //confirmBasket();

                // Si localStorage contient kanap même id et même color
                } else if(getBasket != null) {
                    for(let item of getBasket) {
                        if(item.id == productSelect.id && item.color == productSelect.color) {
                            return (
                                item.quantity = parseInt(productSelect.quantity) + parseInt(item.quantity),
                                item.price = productSelect.price + item.price,
                                localStorage.setItem("basket", JSON.stringify(getBasket))
                            );
                        }
                        //confirmBasket();  
                    }

                    // Si même kanap mais pas même color
                    for(let item of getBasket) {
                        if(item.id == productSelect.id && item.color != productSelect.color) {
                            return (
                                getBasket.push(productSelect),
                                localStorage.setItem("basket", JSON.stringify(getBasket)) 
                            );
                        }
                       //confirmBasket();
                    }

                    // Si localStorage ne contient pas ce kanap
                    for(let item of getBasket) {
                        if(item.id != productSelect.id) {
                            return ( 
                                getBasket.push(productSelect),
                                localStorage.setItem("basket", JSON.stringify(getBasket))
                            ); 
                        } 
                        //confirmBasket();
                    }
                }
        })
         
    })
    .catch(erreur => console.log('Erreur: ' + erreur));








