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
 * @param {Document} xmlDoc Document XLM parsé par DOMParser
 */

function afficherXML(xmlDoc){

    console.log("Initialisation des éléments du DOM...");

    let params = getUrlParams();
    let searchResult = searchItemByType(xmlDoc, params.id, params.type);

    let infoContainer = document.getElementById("infoContainer");
    
    infoContainer.appendChild(createXMLCard(searchResult));

}

/**
 * Fonction générique pour créer une carte d'affichage à partir d'un élément XML
 * @param {element} item - élément XML (film, série, etc)
 * @returns {HTMLElement} - élément div représentant la carte
 */
function createXMLCard(item){
    
    //Definition de la section ciblée
    let card = document.getElementById("detailsChoix");

    let nom = item.getElementsByTagName("nom")[0].textContent;
    let genre = item.getElementsByTagName("genre")[0].textContent;
    let realisateur = item.getElementsByTagName("realisateur")[0].textContent;
    let dateSortie = item.getElementsByTagName("dateSortie")[0].textContent;
    let synopsis = item.getElementsByTagName("resumer")[0].textContent.trim();

    // Titre
    let titre = document.createElement("h1");
    titre.className = "card-title text-center";
    titre.textContent = nom;
    
    // Image
    let img = document.createElement('img');
    img.alt = nom;
    let url = item.getElementsByTagName('url')[0].textContent;
    img.src = url;
    img.alt = nom;
    img.className = "card-img-top";
    
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";

    let cardP = document.createElement('p');
    cardP.className = "card-text";
    cardP.textContent = synopsis;

    let cardP2 = document.createElement('p');
    cardP2.className = 'card-text';

    let cardFooter = document.createElement('div');
    cardFooter.className = "card-footer text-secondary text-center";
    cardFooter.innerHTML = `<strong>Genre:</strong> ${genre}<br><strong>Réalisateur:</strong> ${realisateur}<br><strong>Date de sortie:</strong> ${dateSortie}<br><span class="text-white"><i class="bi bi-play"></i> Watch now</span>`;

    card.appendChild(titre);
    card.appendChild(img);
    cardBody.appendChild(cardP);
    cardBody.appendChild(cardP2);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    return card;
}

function getUrlParams() {
    let params = new URLSearchParams(window.location.search);
    return {
        id: params.get("id"),
        type: params.get("type")
    }
}

function searchItemByType(xmlDoc, itemId, itemType) {

    let items = xmlDoc.getElementsByTagName(itemType);

    for (let i = 0 ; i < items.length ; i++) {
        if (items[i].hasAttribute("xml:id") && items[i].getAttribute("xml:id") === itemId) {
            return items[i];
        }
    }
    console.error("Erreur: paramètres incorrects. Id undefined, null, ou non trouvé.");
    alert("ERREUR CRITIQUE, EXPLOSION.");
}