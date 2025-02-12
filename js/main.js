function calculMoyenneMatiere(listeNotesDonnee) {
    var moyenneListeDonnee = 0;
    listeNotesDonnee = listeNotesDonnee.slice(0, -1);
    var notes = listeNotesDonnee.split("/");
    for(var note of notes) {
        note = note.slice(0, -1);
        note = note.split(",");
        moyenneListeDonnee += parseFloat(note[0]) * parseFloat(note[1]);
    }
    return (Math.round((moyenneListeDonnee + Number.EPSILON) * 100) / 100).toFixed(2);
}

/* Ajout du CSS principal à la page */
var headPointer = document.head;
headPointer.innerHTML += `<link rel="stylesheet" type="text/css" href="https://eythantournant.github.io/Better-Agora/css/main.css">`



/* Dès que la page finit de charger */
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        setTimeout(function() {
            /* Rend la barre collante par défaut pour éviter les sauts de page */
            barreHaute = document.querySelector("#section0");
            barreHaute.classList.add("fixed-header");

            /* Fait en sorte que le logo renvoie à l'accueil */
            logoUniv = document.querySelector("#header-main > div.logo > a");
            logoUniv.href = "#tab10";
            logoUniv.target = "";
        }, 100); // La page n'est pas chargée directement lorsqu'on y accède, donc on délaie les changements pour s'adapter
    }
}

/* Calcul des moyennes dans les notes de matières finies */
window.navigation.addEventListener("navigate", (event) => {
    setTimeout(function() {
        /* Page des notes */
        if(window.location.href.slice(-6) == "#tab50") {
            setTimeout(function() { // Délai d'une demi seconde pour pallier le temps de chargement
                var listeLignesTabNotes = Array.from(document.querySelectorAll("#listTab_6387972114")[0].children[1].children); // Liste de toutes les lignes du tableau de notes
                var derniereMatiere;
                var listeNotes = new Array;
                var moyenneMatiereActuelle;
                var compteurLignes = 0;

                listeLignesTabNotes.forEach(ligneTabNotes => {
                    compteurLignes++;
                    if(ligneTabNotes.classList.contains("rupture")) { // Si la ligne est un séparateur de matière
                        if(derniereMatiere){ // Si la dernière matière sélectionnée est déjà définie
                            moyenneMatiereActuelle = calculMoyenneMatiere(listeNotes); // On calcule la moyenne de cette matière
                            if(!isNaN(moyenneMatiereActuelle)) derniereMatiere.children[2].firstChild.innerText = moyenneMatiereActuelle; // On affiche la moyenne dans le champ Note de la matière
                            derniereMatiere = ligneTabNotes; // On passe a la prochaine matière en gardant l'adresse de la prochaine ligne séparateur
                            listeNotes = []; // On remet à 0 les ntoes enregistrées
                        } else {
                            derniereMatiere = ligneTabNotes;
                        }
                    } else if(ligneTabNotes.classList.length != 0){ // Si la ligne n'est ni un séparateur de matière ni un séparateur de bloc, on ajoute la note écrite
                        listeNotes += [ligneTabNotes.children[2].innerText.replace(",","."), ligneTabNotes.children[3].innerText.replace(",","."),"/"]; // On enregistre la note en la séparant adéquatement des autres
                    }
                    if(compteurLignes == listeLignesTabNotes.length) { // Dernière ligne du tableau
                        moyenneMatiereActuelle = calculMoyenneMatiere(listeNotes); // On calcule la moyenne de la dernière matière
                        if(!isNaN(moyenneMatiereActuelle)) derniereMatiere.children[2].firstChild.innerText = moyenneMatiereActuelle; // On affiche la moyenne dans le champ Note de la dernière matière
                    }
                });
            }, 512); 
        }
    }, 100);
})

window.navigation.addEventListener("navigate", (event) => {
    setTimeout(function() {
        /* Page des absences */
        if(window.location.href.slice(-6) == "#tab60") {
            setTimeout(function() { // Délai d'une demi seconde pour pallier le temps de chargement
                var listeLignesTabNotes = Array.from(document.querySelectorAll("#listTab_6387973553")[0].children[1].children); // Liste de toutes les lignes du tableau de notes
                var nombreAbsences = 0;
                var nombreJustifiees = 0;
                var nombreHeures = 0;
                listeLignesTabNotes.forEach(ligneTabNotes => {
                    nombreAbsences++;
                    if(ligneTabNotes.children[6].innerText != "") nombreJustifiees++;
                    nombreHeures += parseInt(ligneTabNotes.children[3].innerText);
                });
                if(nombreHeures > 0) {
                    var tabFoot = document.querySelectorAll("#listTab_6387973553")[0].children[2];
                    tabFoot.innerHTML = "<tr><th></th> <th class='dual-row'>Nombre d'heures</th><th></th> <th class='dual-row'>Absences totales</th><th></th> <th class='dual-row'>Absences non justifiées</th><th></th></tr> <tr><th>Total</th> <td class='dual-row'>"+nombreHeures+"h</td><td></td> <td class='dual-row'>"+nombreAbsences+"</td><td></td> <td class='dual-row'>"+(nombreAbsences-nombreJustifiees)+"</td><td></td> </tr>";
                }
            }, 256);
        }
    }, 100);
})