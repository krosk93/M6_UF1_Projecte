/**************************************************************
  Definició de constants
  * defaultPoints emmagatzema els punts màxims per defecte
  * defaultThrows emmagatzema les tirades màximes per defecte
  * defaultCards emmagatzema el nombre de cartes per defecte
  * minCards emmagatzema el nombre de cartes mínimes
  * maxCards emmagatzema el nombre de cartes màximes
**************************************************************/
const defaultPoints = 30;
const defaultThrows = 5;
const defaultCards = 3;
const minCards = 3;
const maxCards = 5;

/**************************************************************
  Definició de classes CSS que s'empren en el codi
  * elementDefault emmagatzema el tipus d'element a crear
    per defecte
  * classHelpElement emmagatzema la classe que s'aplicarà
    als elements generats a l'ajuda
  * classHelpText emmagatzema la classe
  * classHidden emmagatzema la classe que s'aplicarà als
    elements que s'han d'amagar
  * classCard emmagatzema la classe que s'aplicarà a les
    cartes
**************************************************************/
const elementDefault = 'div';
const classHelpElement = 'helpElement';
const classHelpText = 'helpText';
const classHidden = 'invisible';
const classCard = 'card';

/**************************************************************
  Definició de selectors CSS que s'empren al codi
  * selectorCardContainer emmagatzema el selector CSS del
    contenidor de les cartes
  * selectorCard emmagatzema el selector CSS de les cartes
  * selectorPlayPoints emmagatzema el selector CSS del botó
    de jugar a màxim de punts
  * selectorPlayThrows emmagatzema el selector CSS del botó
    de jugar a màxim de tirades
  * selectorNumCards emmagatzema el selector CSS del camp
    del nombre cartes amb les que jugar
  * selectorHideable emmagatzema el selector CSS dels camps
    que son amagables (configuració del joc)
  * selectorButton emmagatzema el selector CSS dels botons
  * selectorOutput emmagatzema el selector CSS del quadre
    on s'imprimeix la sortida
  * selectorHideHelp emmagatzema el selector CSS del botó
    per a mostrar o ocultar l'ajuda
  * selectorHelpDiv emmagatzema el selector CSS del element
    on es mostra l'ajuda
  * selectorCardNumError emmagatzema el selector CSS del
    element a mostrar en cas de que hi hagi un error de
    validació amb el nombre de cartes
**************************************************************/
const selectorCardContainer = '.playCards';
const selectorCard = `${selectorCardContainer} .${classCard}`;
const selectorPlayPoints = '#jugarPunts';
const selectorPlayThrows = '#jugarTirades';
const selectorNumCards = '#numCartes';
const selectorHideable = '.hideable';
const selectorButton = 'button';
const selectorOutput = '#output';
const selectorHideHelp = '#hideHelp';
const selectorHelpDiv = '.help';
const selectorCardNumError = '#cardNumIncorrect';

/**************************************************************
  Definició de texts que s'empren en el codi
  * textShow emmagatzema el text del botó per a mostrar l'ajuda
  * textHide emmagatzema el text del botó per a ocultar l'ajuda
  * textPlayPointsBtn emmagatzema el text del botó per a jugar
    a punts. {0} serà substituit pel valor adecuat.
  * textPlayThrowsBtn emmagatzema el text del botó per a jugar
    a tirades. {0} serà substituit pel valor adecuat.
**************************************************************/
const textShow = 'Mostrar ajuda';
const textHide = 'Ocultar ajuda';
const textPlayPointsBtn = 'Jugar fins a {0} punts';
const textPlayThrowsBtn = 'Jugar fins a {0} tirades';

/**************************************************************
  Definició de les cartes
  * cards emmagatzema les cartes del joc
    Té dos propietats:
    * style: estil CSS a aplicar
    * points: puntuació de la carta
**************************************************************/
const cards = [{
        style: "yellow",
        points: 1
    },
    {
        style: "blue",
        points: 2
    },
    {
        style: "green",
        points: 3
    },
    {
        style: "red",
        points: -2
    },
    {
        style: "purple",
        points: 5
    }
];

/**************************************************************
  Contadors de partida
  Emmagatzemen els punts i els tirs actuals.
**************************************************************/
let currpoints = 0;
let currthrows = 0;


/**************************************************************
  Funció $(sel, multi)
  Helper per a "simular" part del funcionament de jQuery.
  Accepta dos paràmetres, tot i que només un és obligatori:
   * sel és el selector CSS a seleccionar, o una funció
     que es cridarà en l'event 'load' de la pàgina.
   * multi serveix per a forçar l'execució de querySelectorAll.
     Si no es passa el paràmetre o és false, o si es troba
     menys de 2 elements amb el selector passat,
     querySelector és executat, seleccionant només un element.

**************************************************************/
function $(sel, multi = false) {
  if (typeof sel == 'function') return window.addEventListener('load', sel);
  else if (typeof sel == 'string') {
    if (multi || document.querySelectorAll(sel).length > 1) return document.querySelectorAll(sel);
    else return document.querySelector(sel);
  }
}

/**************************************************************
  Funció setDefaultButtonText()
  Configura els texts dels botons per defecte fent ús de
  les constants globals.
**************************************************************/
function setDefaultButtonText() {
    $(selectorPlayPoints).innerHTML = textPlayPointsBtn.replace('{0}', defaultPoints);
    $(selectorPlayThrows).innerHTML = textPlayThrowsBtn.replace('{0}', defaultThrows);
    $(selectorNumCards).min = minCards;
    $(selectorNumCards).max = maxCards;
}

/**************************************************************
  Funció unhideGameOptions()
  Desamaga totes les opcions configurables del joc.
**************************************************************/
function unhideGameOptions() {
    $(selectorHideable, true).forEach(el => {
        el.classList.remove(classHidden);
    });
}

/**************************************************************
  Funció convertNumberToCard(randomNumber)
  Retorna un objecte card a partir d'un número.
  Empra l'array cards. Realitza un mod per a no excedir
  la longitud de l'array.
  Accepta un paràmetre, randomNumber.
**************************************************************/
function convertNumberToCard(randomNumber) {
    return cards[Math.abs(randomNumber) % cards.length];
}

/**************************************************************
  Funció setColor(el, colorNumber)
  Assigna un color de fons a un element d'una carta. També
  el fa visible en cas de que no ho sigui.
  Accepta dos paràmetres:
    el: element DOM de la carta
    colorNumber: número aleatori per a triar-ne el color.
**************************************************************/
function setColor(el, card) {
    resetCard(el);
    el.classList.add(card.style);
}

/**************************************************************
  Funció resetCard(el)
  Elimina els estils d'una carta fent-la invisible.
  Empra la funció map per a crear un array amb només la
  propietat style dels objectes continguts a l'array cards.
  Accepta un paràmetre:
    el: element DOM de la carta
**************************************************************/
function resetCard(el) {
    el.classList.remove(...cards.map(card => card.style));
}

/**************************************************************
  Funció resetCards()
  Executa la funció resetCard(el) sobre tots els elements
  de carta.
**************************************************************/
function resetCards() {
    $(selectorCard, true).forEach(card => resetCard(card));
}

/**************************************************************
  Funció addPoints(card)
  Afegeix punts al contador de punts totals segons la carta
  pasada com a paràmetre.
  Accepta un paràmetre:
    card: objecte de la carta.
**************************************************************/
function addPoints(card) {
    currpoints += card.points;
}

/**************************************************************
  Funció printThrowInfo(thrownCards, randomNumbers)
  Imprimeix els resultats de la tirada.
  Accepta dos paràmetres:
    thrownCards: array de les cartes resultants.
    randomNumbers: Nombres aleatoris generats.
**************************************************************/
function printThrowInfo(thrownCards, randomNumbers) {
    let el = $(selectorOutput);
    let throwPoints = thrownCards.map(thrCard => thrCard.points);
    el.innerHTML = `<p>Els aleatoris generats en aquesta jugada són: ${randomNumbers.join(', ')}</p>
                  <p>Els punts generats en aquesta jugada són: ${throwPoints.join(', ')}</p>
                  <p>Número de tirades: ${currthrows}</p>
                  <p class="textPoints">PUNTUACIÓ</p>
                  <p>Punts tirada: ${throwPoints.reduce((a,b) => a+b)}</p>
                  <p>Punts totals: ${currpoints}</p>`;
}

/**************************************************************
  Funció endGame()
  Finalitza la partida.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function endGame() {
    let el = $(selectorOutput);
    el.innerHTML += `<h3>PARTIDA FINALITZADA AMB ${currpoints} PUNTS I ${currthrows} TIRADES</h3>`;
    restartGame();
}

/**************************************************************
  Funció checkEndGame(throwPoints)
  Comprova si es compleixen les condicions per a finalitzar
  la partida.
  Accepta un paràmetre:
    thrownCards: array de les cartes resultants.
**************************************************************/
function checkEndGame(thrownCards) {
    if (!$(selectorButton + selectorPlayPoints).classList.contains(classHidden) && currpoints >= defaultPoints) endGame();
    else if (!$(selectorButton + selectorPlayThrows).classList.contains(classHidden) && currthrows >= defaultThrows) endGame();
    else if (thrownCards.every((val, i, arr) => val === arr[0])) endGame();
}

/**************************************************************
  Funció throwCards(num)
  Realitza la tirada de cartes.
  Accepta un paràmetre:
    num: número de cartes que es tiren.
**************************************************************/
function throwCards(num) {
    var randomNumbers = [];
    var thrownCards = [];
    $(selectorCard, true).forEach((el, i) => {
        let random = Math.trunc(Math.random() * 1000);
        let card = convertNumberToCard(random);
        setColor(el, card);
        addPoints(card);
        randomNumbers.push(random);
        thrownCards.push(card);
    });
    currthrows++;
    printThrowInfo(thrownCards, randomNumbers);
    checkEndGame(thrownCards);
}

/**************************************************************
  Funció hideOtherButtons(e)
  Amaga tots els elements amb la classe emmagatzemada a
  selectorHideable excepte el element en que s'ha generat
  l'event.
  Accepta un paràmetre:
    e: Event generat
**************************************************************/
function hideOtherButtons(e) {
    $(selectorHideable, true).forEach(el => {
        if (e.currentTarget !== el) el.classList.add(classHidden);
        else el.innerHTML = 'Tornar a tirar';
    });
}

/**************************************************************
  Funció toggleHelpVisibility()
  Mostra o amaga el text d'ajuda.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function toggleHelpVisibility() {
    $(selectorButton + selectorHideHelp).innerHTML = $(selectorHelpDiv).classList.toggle(classHidden) ? textShow : textHide;
}

/**************************************************************
  Funció showNumCardError()
  Mostra un error en cas de que el número de cartes introduït
  sigui incorrecte.
**************************************************************/
function showNumCardError() {
    let el = $(selectorCardNumError);
    el.innerHTML = `El número de cartes ha de ser entre ${minCards} i ${maxCards}`;
    el.classList.remove(classHidden);
}

/**************************************************************
  Funció hideNumCardError()
  Amaga l'error de número de cartes introduït incorrecte.
**************************************************************/
function hideNumCardError() {
    $(selectorCardNumError).classList.add(classHidden);
}

/**************************************************************
  Funció setClickHandler()
  Configura els events de click als botons.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function setClickHandler() {
    $(selectorButton + selectorHideable, true).forEach(el => {
        el.addEventListener('click', e => {
            let numCards = $(selectorNumCards).value;
            if (numCards >= minCards && numCards <= maxCards) {
                renderCards(numCards);
                hideNumCardError();
                hideOtherButtons(e);
                throwCards(numCards);
            } else {
                showNumCardError();
            }
        });
    });
    $(selectorButton + selectorHideHelp).addEventListener('click', e => {
        toggleHelpVisibility();
    });
}

/**************************************************************
  Funció renderHelp()
  Crea el text d'ajuda a partir de l'array cards.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function renderHelp() {
    $(selectorHelpDiv).innerHTML = `
    <p>El funcionament del joc és simple:
      <ul>
        <li>Tries un nombre de cartes</li>
        <li>Prems el botó del mode de joc que desitgis</li>
        <li>Torna a prémer el botó per a tornar a tirar fins a acabar la partida</li>
      </ul>
    </p>
    <p>Les normes del joc:
      <ul>
        <li>Si jugues a tirades, en quant arribis a ${defaultThrows} s'acabarà el joc</li>
        <li>Si jugues a punts, en quant arribis o superis ${defaultPoints} punts s'acabarà el joc</li>
        <li>El joc també pot acabar si totes les cartes resultants d'una tirada son iguals</li>
      </ul>
    </p>
    `;
    cards.forEach(card => {
        let helpElement = document.createElement(elementDefault);
        helpElement.classList.add('helpElement');
        let cardEl = document.createElement(elementDefault);
        cardEl.classList.add('card');
        cardEl.classList.add(card.style);
        let helpText = document.createElement(elementDefault);
        helpText.classList.add('helpText');
        helpText.appendChild(document.createTextNode(`Aquesta carta val ${card.points} punt${Math.abs(card.points) === 1 ? '' : 's'}`));
        helpElement.appendChild(cardEl);
        helpElement.appendChild(helpText);
        $(selectorHelpDiv).appendChild(helpElement);
    });
}

/**************************************************************
  Funció renderCards(num)
  Crea les cartes en blanc a partir de l'array cards
  i el nombre màxim de cartes.
  Accepta un paràmetre:
    num: Número de cartes a generar.
**************************************************************/
function renderCards(num) {
    if ($(selectorCard, true).length != num) {
        Array.from($(selectorCardContainer).children).forEach(el => $(selectorCardContainer).removeChild(el));
        for (let i = 0; i < num; i++) {
            let cardEl = document.createElement(elementDefault);
            cardEl.classList.add(classCard);
            $(selectorCardContainer).appendChild(cardEl);
        }
    }
}

/**************************************************************
  Funció restartGame()
  Reinicia les puntuacions i els botons de joc.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function restartGame() {
    setDefaultButtonText();
    unhideGameOptions();
    currpoints = 0;
    currthrows = 0;
}

/**************************************************************
  Funció onLoadPage()
  Funció que s'executa quan la pàgina ha acabat de carregar.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function onLoadPage() {
    setClickHandler();
    resetCards();
    restartGame();
    renderHelp();
}

/**************************************************************
    Codi a executar-se en finalitzar la càrrega de la pàgina.
**************************************************************/
$(() => onLoadPage());
