function calculMoyenneMatiere(listeNotesDonnee) {
    var moyenneListeDonnee = 0;
    for(var note of listeNotesDonnee) {
        moyenneListeDonnee += parseFloat(note[0]) * parseFloat(note[1]);
    }
    return (Math.round((moyenneListeDonnee + Number.EPSILON) * 100) / 100).toFixed(2);
}

function calculMoyenne(listeNotes) {
    var moyenne = 0;
    for(var note of listeNotes) {
        moyenne += parseFloat(note);
    }
    moyenne /= listeNotes.length;
    return (Math.round((moyenne + Number.EPSILON) * 100) / 100).toFixed(2);
}

function affichageMatiere(listeMoyennesDonnee, derniereMatiereSignet, listeNotesDonnee) {
    var moyenneMatiereActuelle = calculMoyenneMatiere(listeNotesDonnee); // On calcule la moyenne de cette matière
    console.log("Calcul moyenne de liste "+listeNotesDonnee+" avec pour resultat "+moyenneMatiereActuelle);
    listeMoyennesDonnee.push(moyenneMatiereActuelle); // On ajoute la moyenne à la liste de moyennes de ce bloc
    if(!isNaN(moyenneMatiereActuelle)) derniereMatiereSignet.children[2].firstChild.innerText = moyenneMatiereActuelle; // On affiche la moyenne dans le champ Note de la matière
    derniereMatiere = null;
}

function affichageBloc(dernierBlocSignet, listeMoyennesDonnee) {
    var moyenneBlocActuel = calculMoyenne(listeMoyennesDonnee);
    if(!isNaN(moyenneBlocActuel)) {
        if(dernierBlocSignet.firstChild.innerHTML.includes("blocNote")) {
            dernierBlocSignet.firstChild.innerHTML.split("<span class='blocNote'>").pop();
            dernierBlocSignet.firstChild.innerHTML += "<span class='blocNote'> Moyenne : "+moyenneBlocActuel+"</span>";
        } else {
            dernierBlocSignet.firstChild.innerHTML += "<span class='blocNote'> Moyenne : "+moyenneBlocActuel+"</span>";
        }
    }
    
    dernierBloc = null;
}
/* Ajout du CSS principal à la page */
var headPointer = document.head;
headPointer.innerHTML += `<link rel="stylesheet" type="text/css" href="https://thatplas.github.io/Better-Agora/css/main.css"><link rel="icon" type="image/x-icon" href="/images/favicon.ico">`



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
                var dernierBloc;
                var listeNotes = new Array;
                var listeMoyennes = new Array;
                var compteurLignes = 0;

                listeLignesTabNotes.forEach(ligneTabNotes => {
                    compteurLignes++;
                    if(ligneTabNotes.attributes.rupture && !ligneTabNotes.classList.contains("rupture")) {
                        if(dernierBloc) {
                            affichageMatiere(listeMoyennes, derniereMatiere, listeNotes);
                            listeNotes = [];
                            derniereMatiere = null;
                            affichageBloc(dernierBloc, listeMoyennes);
                            listeMoyennes = [];
                            dernierBloc = ligneTabNotes; console.log("Définition de nouveau bloc");
                        } else {
                            dernierBloc = ligneTabNotes; console.log("Définition de nouveau bloc");
                        }
                    }
                    else if(ligneTabNotes.classList.contains("rupture") || (ligneTabNotes.attributes.rupture && derniereMatiere)) {
                        if(derniereMatiere) {
                            affichageMatiere(listeMoyennes, derniereMatiere, listeNotes);
                            listeNotes = [];
                            derniereMatiere = ligneTabNotes; console.log("Définition de nouvelle matière")
                        } else {
                            derniereMatiere = ligneTabNotes; console.log("Définition de nouvelle matière")
                        }
                    } else {
                        listeNotes.push([ligneTabNotes.children[2].innerText.replace(",","."), ligneTabNotes.children[3].innerText.replace(",",".")]); // On enregistre la note et son coefficient
                    }
                    if(compteurLignes == listeLignesTabNotes.length) {
                        affichageMatiere(listeMoyennes, derniereMatiere, listeNotes);
                        affichageBloc(dernierBloc, listeMoyennes);
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
                    tabFoot.innerHTML = "<tr><th></th> <th class='dual-row'>Nombre d'heures</th><th></th> <th class='dual-row'>Absences totales</th><th></th> <th class='dual-row'>Absences non justifiées</th><th></th></tr> <tr><th>Total</th> <td class='dual-row'>"+nombreHeures+"</td><td></td> <td class='dual-row'>"+nombreAbsences+"</td><td></td> <td class='dual-row'>"+(nombreAbsences-nombreJustifiees)+"</td><td></td> </tr>";
                }
            }, 256);
        }
    }, 100);
})
