// XMLHttpRequest Nitflex

function loadNitFlexXML(){
    // Nouvel object XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // configuration d'une requête
    // utilisation de la méthode GET pour récupérer les données
    // Nom du fichier à charger
    // - true = requête asynchrone
    xhr.open('GET', './netflop.xml', true);

    // Définir le gestionnaire d'évènements pour le chargement
    xhr.onload = function () {
        // Vérifie si la requête réussit
        // Statut 200 = OK (succès)
        if (xhr.status === 200) {
            // Parse la réponse du serveur
            // Créé une instance DOMParser
            let parser = new DOMParser();

            // Parse le XML reçu et le converti en document XML
            // xhr.responseText → le contenu du fichier XML en texte
            // 'text/xml' = type MIME pour indiquer que c'est du XML
            let xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');

            afficherXML(xmlDoc);
            // console.log(xmlDoc);

        } else {
            console.error("Erreur lors du chargement du fichier XML.");
            console.error("Status:", xhr.status);
            console.error("Message:", xhr.statusText);
        }
    };

    // Gestion des erreurs réseau
    xhr.onerror = function () {
        console.error("Erreur réseau lors du chargement du fichier xml.");
        alert("Impossible de charger les données. Vérifiez votre connexion internet.");
    };

    // Envoie la requête
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Le DOM est chargé, lancement de nitflex avec DOMParser...");
    loadNitFlexXML();
});

/**
 * Fonction pour afficher les films depuis le document XML
 * @param {Document} xmlDoc Document XML parsé par DOMParser
 */

function afficherXML(xmlDoc){

    console.log("Initialisation des éléments du DOM...");

    // On stocke dans une variable le résultat de la fonction qu'on appelle. La fonction est à la ligne 133.
    let params = getUrlParams(); // Récupère l'id et le type passés dans l'URL depuis la page précédente (ligne 209 de script.js)

    // params pourra par exemple avoir comme valeur :
    // {id: 1, type: "documentaire"}
    // Ca sera un objet.

    // Recherche, dans le XML, une entrée qui possède un ID et un type qui correspondent à ce que l'on veut afficher en détail.
    let searchResult = searchItemByType(xmlDoc, params.id, params.type);
        // Exemple:    searchItemByType(xmlDoc, 1, "documentaire");
        // (valeurs des variables remplacées pour clarification.)

    let infoContainer = document.getElementById("infoContainer");

    // Comme pour la génération de carte de la page précédente, on génère une carte en utilisant le résultat de la recherche ci-dessus
    infoContainer.appendChild(createXMLCard(searchResult)); 
}

/**
 * Fonction générique pour créer une carte d'affichage à partir d'un élément XML
 * @param {element} item - élément XML (film, série, etc)
 * @returns {HTMLElement} - élément div représentant la carte
 */
function createXMLCard(item){ // Même fonction que dans script.js, génère une carte. Structure légèrement différente car carte unique et grande.
    
    //Definition de la section ciblée
    let card = document.getElementById("detailsChoix");

    let nom = item.getElementsByTagName("nom")[0].textContent;
    let genre = item.getElementsByTagName("genre")[0].textContent;
    let realisateur = item.getElementsByTagName("realisateur")[0].textContent;
    let dateSortie = item.getElementsByTagName("dateSortie")[0].textContent;
    let synopsis = item.getElementsByTagName("resumer")[0].textContent.trim();
    let url = item.getElementsByTagName('url')[0].textContent;

    // Titre
    let titre = document.createElement("h1");
    titre.className = "card-title text-center";
    titre.textContent = nom;
    
    // Image
    let img = document.createElement('img');
    img.alt = nom;
    img.src = url;
    img.className = "card-img-top";
    
    // Corps de carte
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";

    // Premier paragraphe du corps
    let cardP = document.createElement('p');
    cardP.className = "card-text";
    cardP.textContent = synopsis;

    // Second
    let cardP2 = document.createElement('p');
    cardP2.className = 'card-text';

    // Footer de la carte
    let cardFooter = document.createElement('div');
    cardFooter.className = "card-footer text-secondary text-center";
    cardFooter.innerHTML = `<strong>Genre:</strong> ${genre}<br><strong>Réalisateur:</strong> ${realisateur}<br><strong>Date de sortie:</strong> ${dateSortie}<br><span class="text-white"><i class="bi bi-play"></i> Watch now</span>`;

    // Imbrication des éléments ensemble.
    card.appendChild(titre);
    card.appendChild(img);
    cardBody.appendChild(cardP);
    cardBody.appendChild(cardP2);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    return card;
}

/**
 * Fonction qui récupère les paramètres se trouvant après le "?" dans l'URL
 * Dans ce cas, il s'agit de l'id du film ou de la série, tel qu'il apapraît dans le XML
 * ainsi que son type (film, série, manga, etc)
 */
function getUrlParams() {
    let params = new URLSearchParams(window.location.search); // Utilise une fonction prédéfinie de JS qui récupère les paramètres pour nous
    return {
        // Renvoie ces paramètres. Il est préférable de les stocker dans une variable.
        id: params.get("id"),
        type: params.get("type")
    }
}

/**
 * Fonction qui parcours le XML.
 * Elle récupère l'ensemble des éléments dans le XML qui ont le même type que celui demandé. (Par exemple: films)
 * Ensuite, elle recherche l'élément parmi ceux-ci qui a l'id qu'on lui demande. (Par exemple, 3)
 * Le film avec l'id 3, par exemple, sera Insidious.
 */
function searchItemByType(xmlDoc, itemId, itemType) {

    // Créé un tableau content uniquement les entrées du XML du type qu'on recherche.
    let items = xmlDoc.getElementsByTagName(itemType);

    // Parcours le tableau
    for (let i = 0 ; i < items.length ; i++) {
        // Est-ce que l'attribut ID existe, et est-ce qu'il correspond à notre recherche ?
        if (items[i].hasAttribute("xml:id") && items[i].getAttribute("xml:id") === itemId) {
            // S'il correspond, on a trouvé notre film. On envoie comme résultat de cette fonction
            // l'entrée du film ou de la série dans le XML.
            return items[i];
        }
    }

    // Si on arrive ici, c'est qu'aucun résultat n'a été trouvé. Soit l'id ne correspondait à aucune de nos entrées dans le XML,
    // soit il était non définit. 
    console.error("Erreur: paramètres incorrects. Id undefined, null, ou non trouvé.");
    alert("ERREUR CRITIQUE, EXPLOSION.");
}