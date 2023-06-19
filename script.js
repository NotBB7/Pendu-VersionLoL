const enLetters = "abcdefghijklmnopqrstuvwxyz\'.&";
const lettersContainer = document.querySelector('.letters');
const guessed = document.querySelector('.guessed');
const categorySpan = document.querySelector('.class span');
const drawing = document.querySelector('.drawing');
const loseAlert = document.querySelector('.lose-alert');
const loseAlertBtn = document.querySelector('.lose-alert button');
const winAlert = document.querySelector('.win-alert');
const winAlertBtn = document.querySelector('.win-alert button');
const attemptsSpansContainer = document.querySelector('.attempts .spans');
const correct = document.querySelector('#correct');
const wrong = document.querySelector('#wrong');
const win = document.querySelector('#win');
const lose = document.querySelector('#lose');
let answerSpan = document.createElement('span');;
let guessedSpans;
let champion;
let attempts = 4;

// Création des tentatives
for (let i = 0; i < attempts; i++) {
    const span = document.createElement('span');
    attemptsSpansContainer.appendChild(span);
}

const attemptsSpans = document.querySelectorAll('.attempts .spans span');

// Obtenir des données et créer des fonctions adaptatives
async function classes() {
    const data = await fetch('./champions.json').then((data) => data.json())
    const categories = Object.keys(data);
    const category = categories[Math.floor(Math.random() * categories.length)]
    champion = data[category][Math.floor(Math.random() * data[category].length)];
    // Spécifier la catégorie sélectionnée sur la page
    categorySpan.appendChild(document.createTextNode(category))
    // Création d'un nombre de portées égal au nombre de lettres du mot
    Array.from(champion).forEach((letter) => {
        if (letter === ' ') {
            // si la lettre est un espace, ajouter la classe "espace"
            const letterSpan = document.createElement('span');
            letterSpan.setAttribute('class', 'space')
            guessed.appendChild(document.createElement('span').appendChild(letterSpan));
        } else {
            const letterSpan = document.createElement('span');
            guessed.appendChild(document.createElement('span').appendChild(letterSpan));
        }
    })
    // Affectation des portées à la variable de portée supposée
    guessedSpans = document.querySelectorAll('.guessed span');
    // Affecter le mot à l'espace de réponse en tant que réponse
    answerSpan.appendChild(document.createTextNode(`Le champion est ${champion}`));
    // console.log(category, champion, Math.floor(Math.random() * data[category].length));
}

classes();
// Création des lettres du clavier à l'écran
Array.from(enLetters).forEach((letter) => {
    let letterSpan = document.createElement('span');
    letterSpan.appendChild(document.createTextNode(letter));
    lettersContainer.appendChild(letterSpan)
});
// Ajout d'un écouteur d'événements au conteneur de lettres qui ne se déclenche que si l'élément cliqué est un de ses enfants
lettersContainer.addEventListener('click', (e) => {
    if (e.target !== lettersContainer) {
        let champArr = Array.from(champion);
        let exists = false;
        let victory = false;
        // Vérifier si les lettres cliquées existent dans le mot pour les ajouter à l'espace approprié.
        for (let i = 0; i < champArr.length; i++) {
            if (champArr[i].toLowerCase() === e.target.innerHTML) {
                guessedSpans[i].innerHTML = e.target.innerHTML;
                exists = true;
            }
        }
        // Si le mot ne contient pas la lettre, réduisez les tentatives de 1 et affichez une partie du dessin.
        if (!exists) {
            attemptsSpans[attempts - 1].setAttribute('class', 'disabled');
            attempts--;
            drawing.classList.add(`attempt-${attempts + 1}`);
            wrong.load();
            wrong.play();
            document.querySelector('.container').classList.add('wrong-flash');
            setTimeout(() => document.querySelector('.container').classList.remove('wrong-flash'), 100);
        } else {
            // Si le mot contient une lettre, celle-ci est désactivée après avoir été cliquée.
            e.target.classList.add('disabled');
            correct.load();
            correct.play();
        }
        // En cas de défaite, afficher la fenêtre de défaite après 0,5 seconde.
        if(attempts === 0) {
            setTimeout(async function() {
                const clearChamp = champion.match(/\w+/gi).join('').toLowerCase()
                const championBG = `./Assets/champions/${clearChamp}`;

                loseAlert.style.display = 'flex';
                document.querySelector('.lose-alert p').after(answerSpan);
                document.querySelector('.container').classList.add('lose-alert-bg');
                document.querySelector('.container .game-content').style.display = 'none';
                document.querySelector('.lose-alert-bg').style.cssText = `background: url(${championBG}.jpg); background-repeat: no-repeat; background-size: cover; background-position: center`;
                lose.load();
                lose.play();
            }, 500);
        }
        // Vérifier si chaque case, des cases supposées contient une lettre, si c'est le cas, c'est une victoire.
        for (span of guessedSpans) {
            if(span.innerHTML !== '' || span.classList.contains('space')) {
                victory = true;
            } else {
                victory = false;
                break;
            }
        }
        // En cas de victoire, afficher l'incrustation de la victoire après 0,5 seconde.
        if(victory) {
            setTimeout(async function() {
                const clearChamp = champion.match(/\w+/gi).join('').toLowerCase()
                const championBG = `./Assets/champions/${clearChamp}`;

                winAlert.style.display = 'flex';
                document.querySelector('.container').classList.add('win-alert-bg');
                document.querySelector('.container .game-content').style.display = 'none';
                document.querySelector('.win-alert-bg').style.cssText = `background: url(${championBG}.jpg); background-repeat: no-repeat; background-size: cover; background-position: center`;
                win.load();
                win.play();
            }, 500)
        }
    }
})

loseAlertBtn.addEventListener('click', () => {
    location.reload() 
})

winAlertBtn.addEventListener('click', () => {
    location.reload() 
})

