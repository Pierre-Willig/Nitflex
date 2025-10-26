// XMLHttpRequest Nitflex

function loadNitFlexJSON(){
    // Nouvel object XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // configuration d'une requête
    // utilisation de la méthode GET pour récupérer les données
    // Nom du fichier à charger
    // - true = requête asynchrone
    xhr.open('GET', './netflop.json', true);

    // Définir le gestionnaire d'évènements pour le chargement
    xhr.onload = function () {
        // Vérifie si la requête réussit
        // Statut 200 = OK (succès)
        if (xhr.status === 200){ 
            let JSONDoc = JSON.parse(xhr.responseText);
            afficherJSON(JSONDoc);
            // console.log(JSONDoc);

        } else {
            console.error("Erreur lors du chargement du fichier JSON.");
            console.error("Status:", xhr.status);
            console.error("Message:", xhr.statusText);
        }
    };

    // Gestion des erreurs réseau
    xhr.onerror = function () {
        console.error("Erreur réseau lors du chargement du fichier JSON.");
        alert("Impossible de charger les données. Vérifiez votre connexion internet.");
    };

    // Envoie la requête
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Le DOM est chargé, lancement de nitflex avec DOMParser...");
    loadNitFlexJSON();
});

/**
 * Fonction pour afficher les films depuis le document JSON
 * @param {Document} JSONDoc Document XLM parsé par DOMParser
 */

function afficherJSON(JSONDoc){

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

    // Récupère tous les éléments <film>, <series>, <documentaire>, <manga>, <anime> du JSON
    // getElementsByTagName() retourne une collection de tous les elements avec ce nom de balise
        let films = JSONDoc.netflop.films.film;
        let series = JSONDoc.netflop.series.serie;
        let documentaire = JSONDoc.netflop.documentaires.documentaire;
        let manga = JSONDoc.netflop.mangas.manga;
        let anime = JSONDoc.netflop.animes.anime;

    // Boucles créant et plaçant les éléments dans leurs emplacements respectifs.
        // Boucle pour les films
        for (let i = 0; i < films.length ; i++) {
            movieList.appendChild(createJSONCard(films[i], "film")); // Pour chaque film dans la liste, créé une carte et la rajoute au HTML
        }
        console.log("Chargement en cours, 20%.");

        // Boucle pour les séries
        for (let i = 0; i < series.length ; i++) {
            seriesList.appendChild(createJSONCard(series[i], "serie")); // Pour les séries
        }
        console.log("Chargement en cours, 40%.");

        // Boucle pour les documentaires
        for (let i = 0; i < documentaire.length ; i++) {
            docsList.appendChild(createJSONCard(documentaire[i], "documentaire")); // Et ainsi de suite.
        }
        console.log("Chargement en cours, 60%.");

        // Boucle pour les mangas
        for (let i = 0; i < manga.length ; i++) {
            animeList.appendChild(createJSONCard(manga[i]), "manga"); // Chaque boucle pourrait être dans une fonction différente
        }
        console.log("Chargement en cours, 80%.");
        
        // Boucle pour les animés
        for (let i = 0; i < anime.length ; i++) {
            animeList.appendChild(createJSONCard(anime[i], "anime")); // Mais pour gagner du temps et de la place, j'ai tout mis au même endroit
        }
        console.log("Chargement en cours, 100%.");
        console.log("... Terminé.");
}

/**
 * Fonction générique pour créer une carte d'affichage à partir d'un élément JSON
 * @param {element} item - élément JSON (film, série, etc)
 * @returns {HTMLElement} - élément div représentant la carte
 */
function createJSONCard(item, type){

    // Extraire les informations du média depuis le JSON
    let nom = item.nom;
    let genre = item.genre;
    let realisateur = item.realisateur;
    let dateSortie = item.dateSortie;
    let synopsis = item.resumer;
    
    // Définition des éléments d'une carte
    let card = document.createElement('div');
    card.className = "card col-lg-3 col-8 bg-dark text-white border border-2 shadow transform scale-10-hover";
    card.id = `${genre}${nom}`;
    
    // Titre de la carte (bootstrap)
    let cardTitle = document.createElement('h3');
    cardTitle.className = "card-title text-center";
    
    // Image de la carte (bootstrap)
    let img = document.createElement('img');
    img.alt = nom;
    img.className = "card-img-top";
    
    // Corps de la carte (bootstrap)
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";

    // Texte interne du corps de la carte (bootstrap)
    let cardP = document.createElement('p');
    cardP.className = "card-text";

    // Footer de la carte (bootstrap)
    let cardFooter = document.createElement('div');
    cardFooter.className = "card-footer text-secondary";
    
    // Attribution des contenus à leurs éléments correspondants
    let url = item.url; // Récupère le chemin de l'image
    img.src = url; // l'attribue à l'attribut src pour que le site aille chercher l'image requise
    img.alt = nom;

    cardTitle.textContent = nom; // Titre du film

    cardP.textContent = synopsis; // Résumé
    
    // Détails sur le réalisateur etc
    cardFooter.innerHTML = `<strong>Genre:</strong> ${genre},<br><strong>Réalisateur:</strong> ${realisateur}<br><strong>Date de sortie:</strong> ${dateSortie}`;
    
    // Imbrication des éléments ensemble
    // D'abord le paragraphe dans le body
    cardBody.appendChild(cardP);
    
    // Ensuite on passe à la carte les éléments dans l'ordre où ils s'afficheront dans la page
    card.appendChild(cardTitle); // Titre
    card.appendChild(img);       // Image
    card.appendChild(cardBody);  // Corps avec synopsis
    card.appendChild(cardFooter);// Footer avec détails
    
    let itemId = item.id; // Récupère l'id correspondant à cette entrée dans le XLM ; par exemple 1
    let itemType = type;// Ainsi que son type ; par exemple Film
    console.log(itemId, itemType); // "1, Film"

    if (itemId && itemType) { // Si les deux éléments existent
        card.onclick = function() { // Rend la carte cliquable
            window.location.href = `./pagedetails.html?id=${itemId}&type=${itemType}`; // Lui permet d'envoyer l'id et le type de film à la page suivante
        }                                          // Tous les éléments suivants le "?" sont des arguments qu'on récupère pour afficher les informations relevantes dans la page suivante
    }

    return card; // On renvoie la carte entière là où on a demandé de la créer. Dans les boucles lignes 108 - 136, donc.
}