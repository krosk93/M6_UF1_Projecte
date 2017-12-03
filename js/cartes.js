(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**************************************************************
  Definició de constants
  * defaultPoints emmagatzema els punts màxims per defecte
  * defaultThrows emmagatzema les tirades màximes per defecte
  * defaultCards emmagatzema el nombre de cartes per defecte
  * minCards emmagatzema el nombre de cartes mínimes
  * maxCards emmagatzema el nombre de cartes màximes
**************************************************************/
var defaultPoints = 30;
var defaultThrows = 5;
var defaultCards = 3;
var minCards = 3;
var maxCards = 5;

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
var elementDefault = 'div';
var classHelpElement = 'helpElement';
var classHelpText = 'helpText';
var classHidden = 'invisible';
var classCard = 'card';

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
var selectorCardContainer = '.playCards';
var selectorCard = selectorCardContainer + ' .' + classCard;
var selectorPlayPoints = '#jugarPunts';
var selectorPlayThrows = '#jugarTirades';
var selectorNumCards = '#numCartes';
var selectorHideable = '.hideable';
var selectorButton = 'button';
var selectorOutput = '#output';
var selectorHideHelp = '#hideHelp';
var selectorHelpDiv = '.help';
var selectorCardNumError = '#cardNumIncorrect';

/**************************************************************
  Definició de texts que s'empren en el codi
  * textShow emmagatzema el text del botó per a mostrar l'ajuda
  * textHide emmagatzema el text del botó per a ocultar l'ajuda
  * textPlayPointsBtn emmagatzema el text del botó per a jugar
    a punts. {0} serà substituit pel valor adecuat.
  * textPlayThrowsBtn emmagatzema el text del botó per a jugar
    a tirades. {0} serà substituit pel valor adecuat.
**************************************************************/
var textShow = 'Mostrar ajuda';
var textHide = 'Ocultar ajuda';
var textPlayPointsBtn = 'Jugar fins a {0} punts';
var textPlayThrowsBtn = 'Jugar fins a {0} tirades';

/**************************************************************
  Definició de les cartes
  * cards emmagatzema les cartes del joc
    Té dos propietats:
    * style: estil CSS a aplicar
    * points: puntuació de la carta
**************************************************************/
var cards = [{
  style: "yellow",
  points: 1
}, {
  style: "blue",
  points: 2
}, {
  style: "green",
  points: 3
}, {
  style: "red",
  points: -2
}, {
  style: "purple",
  points: 5
}];

/**************************************************************
  Contadors de partida
  Emmagatzemen els punts i els tirs actuals.
**************************************************************/
var currpoints = 0;
var currthrows = 0;

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
function $(sel) {
  var multi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (typeof sel == 'function') return window.addEventListener('load', sel);else if (typeof sel == 'string') {
    if (multi || document.querySelectorAll(sel).length > 1) return document.querySelectorAll(sel);else return document.querySelector(sel);
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
  $(selectorHideable, true).forEach(function (el) {
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
  var _el$classList;

  (_el$classList = el.classList).remove.apply(_el$classList, _toConsumableArray(cards.map(function (card) {
    return card.style;
  })));
}

/**************************************************************
  Funció resetCards()
  Executa la funció resetCard(el) sobre tots els elements
  de carta.
**************************************************************/
function resetCards() {
  $(selectorCard, true).forEach(function (card) {
    return resetCard(card);
  });
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
  var el = $(selectorOutput);
  var throwPoints = thrownCards.map(function (thrCard) {
    return thrCard.points;
  });
  el.innerHTML = '<p>Els aleatoris generats en aquesta jugada s\xF3n: ' + randomNumbers.join(', ') + '</p>\n                  <p>Els punts generats en aquesta jugada s\xF3n: ' + throwPoints.join(', ') + '</p>\n                  <p>N\xFAmero de tirades: ' + currthrows + '</p>\n                  <p class="textPoints">PUNTUACI\xD3</p>\n                  <p>Punts tirada: ' + throwPoints.reduce(function (a, b) {
    return a + b;
  }) + '</p>\n                  <p>Punts totals: ' + currpoints + '</p>';
}

/**************************************************************
  Funció endGame()
  Finalitza la partida.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function endGame() {
  var el = $(selectorOutput);
  el.innerHTML += '<h3>PARTIDA FINALITZADA AMB ' + currpoints + ' PUNTS I ' + currthrows + ' TIRADES</h3>';
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
  if (!$(selectorButton + selectorPlayPoints).classList.contains(classHidden) && currpoints >= defaultPoints) endGame();else if (!$(selectorButton + selectorPlayThrows).classList.contains(classHidden) && currthrows >= defaultThrows) endGame();else if (thrownCards.every(function (val, i, arr) {
    return val === arr[0];
  })) endGame();
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
  $(selectorCard, true).forEach(function (el, i) {
    var random = Math.trunc(Math.random() * 1000);
    var card = convertNumberToCard(random);
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
  $(selectorHideable, true).forEach(function (el) {
    if (e.currentTarget !== el) el.classList.add(classHidden);else el.innerHTML = 'Tornar a tirar';
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
  var el = $(selectorCardNumError);
  el.innerHTML = 'El n\xFAmero de cartes ha de ser entre ' + minCards + ' i ' + maxCards;
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
  $(selectorButton + selectorHideable, true).forEach(function (el) {
    el.addEventListener('click', function (e) {
      var numCards = $(selectorNumCards).value;
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
  $(selectorButton + selectorHideHelp).addEventListener('click', function (e) {
    toggleHelpVisibility();
  });
}

/**************************************************************
  Funció renderHelp()
  Crea el text d'ajuda a partir de l'array cards.
  Aquesta funció no accepta cap paràmetre.
**************************************************************/
function renderHelp() {
  $(selectorHelpDiv).innerHTML = '\n    <p>El funcionament del joc \xE9s simple:\n      <ul>\n        <li>Tries un nombre de cartes</li>\n        <li>Prems el bot\xF3 del mode de joc que desitgis</li>\n        <li>Torna a pr\xE9mer el bot\xF3 per a tornar a tirar fins a acabar la partida</li>\n      </ul>\n    </p>\n    <p>Les normes del joc:\n      <ul>\n        <li>Si jugues a tirades, en quant arribis a ' + defaultThrows + ' s\'acabar\xE0 el joc</li>\n        <li>Si jugues a punts, en quant arribis o superis ' + defaultPoints + ' punts s\'acabar\xE0 el joc</li>\n        <li>El joc tamb\xE9 pot acabar si totes les cartes resultants d\'una tirada son iguals</li>\n      </ul>\n    </p>\n    ';
  cards.forEach(function (card) {
    var helpElement = document.createElement(elementDefault);
    helpElement.classList.add('helpElement');
    var cardEl = document.createElement(elementDefault);
    cardEl.classList.add('card');
    cardEl.classList.add(card.style);
    var helpText = document.createElement(elementDefault);
    helpText.classList.add('helpText');
    helpText.appendChild(document.createTextNode('Aquesta carta val ' + card.points + ' punt' + (Math.abs(card.points) === 1 ? '' : 's')));
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
    Array.from($(selectorCardContainer).children).forEach(function (el) {
      return $(selectorCardContainer).removeChild(el);
    });
    for (var i = 0; i < num; i++) {
      var cardEl = document.createElement(elementDefault);
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
$(function () {
  return onLoadPage();
});

},{}]},{},[1]);

//# sourceMappingURL=cartes.js.map
