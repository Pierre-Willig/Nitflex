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

    console.log("Initialisation des éléments du DOM...")
    //Definition des sections ciblées
    let sectionFilms = document.getElementById("sectionFilms");
    let sectionSeries = document.getElementById("sectionSeries");
    let sectionDoc = document.getElementById("sectionDocumentaires");
    let sectionAnime = document.getElementById("sectionAnime");

    // Titres pour chaque section
    let titre = document.createElement("h2");
    titre.textContent = "Films populaires";
    sectionFilms.appendChild(titre);

    let titreSeries = document.createElement("h2");
    titreSeries.textContent = "Séries populaires";
    sectionSeries.appendChild(titreSeries);

    let titreDoc = document.createElement("h2");
    titreDoc.textContent = "Documentaires populaires";
    sectionDoc.appendChild(titreDoc);

    let titreAnime = document.createElement("h2");
    titreAnime.textContent = "Animes populaires";
    sectionAnime.appendChild(titreAnime);

    // Emplacements où seront générées les cartes
    let movieList = document.createElement('div');
    movieList.className = "row flex-row flex-nowrap gap-1 overflow-scroll";
    sectionFilms.appendChild(movieList);

    let seriesList = document.createElement('div');
    seriesList.className = "row flex-row flex-nowrap gap-1 overflow-scroll";
    sectionSeries.appendChild(seriesList);

    let docsList = document.createElement('div');
    docsList.className = "row flex-row flex-nowrap gap-1 overflow-scroll";
    sectionDoc.appendChild(docsList);

    let animeList = document.createElement('div');
    animeList.className = "row flex-row flex-nowrap gap-1 overflow-scroll";
    sectionAnime.appendChild(animeList);

    // Récupère tous les éléments <film> du XML
    // getElementsByTagName() retourne une collection de tous les elements avec ce nom de balise
    let films = xmlDoc.getElementsByTagName("film");
    let series = xmlDoc.getElementsByTagName("serie");
    let documentaire = xmlDoc.getElementsByTagName("documentaire");
    let manga = xmlDoc.getElementsByTagName("manga");
    let anime = xmlDoc.getElementsByTagName("anime");

    // Boucles créant et plançant les éléments dans leurs emplacements respectifs.
    for (let i = 0; i < films.length ; i++) {
        movieList.appendChild(createXMLCard(films[i]));
    }
    console.log("Chargement en cours, 20%.");

    for (let i = 0; i < series.length ; i++) {
        seriesList.appendChild(createXMLCard(series[i]));
    }
    console.log("Chargement en cours, 40%.");

    for (let i = 0; i < documentaire.length ; i++) {
        docsList.appendChild(createXMLCard(documentaire[i]));
    }
    console.log("Chargement en cours, 60%.");

    for (let i = 0; i < manga.length ; i++) {
        animeList.appendChild(createXMLCard(manga[i]));
    }
    console.log("Chargement en cours, 80%.");
    
    for (let i = 0; i < anime.length ; i++) {
        animeList.appendChild(createXMLCard(anime[i]));
    }
    console.log("Chargement en cours, 100%.");
    console.log("... Terminé.");
}

/**
 * Fonction générique pour créer une carte d'affichage à partir d'un élément XML
 * @param {element} item - élément XML (film, série, etc)
 * @returns {HTMLElement} - élément div représentant la carte
 */
function createXMLCard(item){

    // Extraire du XML
    let nom = item.getElementsByTagName("nom")[0].textContent;
    let genre = item.getElementsByTagName("genre")[0].textContent;
    let realisateur = item.getElementsByTagName("realisateur")[0].textContent;
    let dateSortie = item.getElementsByTagName("dateSortie")[0].textContent;
    let synopsis = item.getElementsByTagName("resumer")[0].textContent.trim();
    
    // Définition des éléments d'une carte
    let card = document.createElement('div');
    card.className = "card col-lg-3 col-8 bg-dark text-white border border-2 shadow transform scale-10-hover";
    card.id = `${genre}${nom}`;
    
    let cardTitle = document.createElement('h3');
    cardTitle.className = "card-title text-center";
    
    let img = document.createElement('img');
    img.alt = nom;
    img.className = "card-img-top";
    
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";

    let cardP = document.createElement('p');
    cardP.className = "card-text";

    let cardFooter = document.createElement('div');
    cardFooter.className = "card-footer text-secondary";
    
    // Attribution des contenus à leurs éléments correspondants
    let url = item.getElementsByTagName('url')[0].textContent;
    img.src = url;
    img.alt = nom;

    cardTitle.textContent = nom;

    cardP.textContent = synopsis;
    
    cardFooter.innerHTML = `<strong>Genre:</strong> ${genre},<br><strong>Réalisateur:</strong> ${realisateur}<br><strong>Date de sortie:</strong> ${dateSortie}`;
    
    // Imbrication des éléments ensemble
    cardBody.appendChild(cardP);
    
    card.appendChild(cardTitle);
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    
    console.log(item)
    let itemId = item.getAttribute("xml:id");
    let itemType = item.tagName.toLowerCase();
    console.log(itemId, itemType);

    if (itemId && itemType) {
        card.onclick = function() {
            window.location.href = `./pagedetails.html?id=${itemId}&type=${itemType}`;
        }
    }

    return card;
}