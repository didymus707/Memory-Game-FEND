/*
 * Create a list that holds all of your cards
 */

const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('li.card');
const stars = document.querySelector('ul.stars');
const section = document.querySelector('section');
const closeModal = document.querySelector('.closeModal');
const restartButton = document.querySelector('.restart')
const playAgain = document.querySelector('.playAgain')

//new span created with its class attribute and content and then inserted into the DOM
const span = document.createElement('span');
span.setAttribute('class', 'clock');
span.textContent = '0mins:00secs';
section.insertAdjacentElement('afterBegin', span);

let matchedCards = [];
let openCards = 0;
let moves = 0;
let time = 0;
let timerOff = true;
let result;
let timerID;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

shuffleCards();
  

function shuffleCards() {
    const cardsArray = [...cards];
    const shuffledCards = shuffle(cardsArray);
    for (const shuffledCard of shuffledCards) {
    deck.appendChild(shuffledCard);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


deck.addEventListener('click', respondToTheClick);

// all my functions

// opens and shows the card on the deck
function respondToTheClick(evt) {
    if (evt.target.classList.contains('card') && !evt.target.classList.contains('match') && matchedCards.length < 3 && !evt.target.classList.contains('open')) {
        if (matchedCards.length === 0) {
            toggleClass(evt.target);
            matchedCards.push(evt.target);
    } else if (matchedCards.length === 1) {
            toggleClass(evt.target);
            matchedCards.push(evt.target);
            matchedOrNot();
        }
    }   if (timerOff) {
            startTimer();
        timerOff = false;
    }   if (cards.length === openCards) {
            stopTimer();    
            writeStats();   
            toggleModal();  
    }
}

// adds and removes classes 
const toggleClass = function (code) {
    code.classList.toggle('open');
    code.classList.toggle('show');
}

// checks for when card matches or not
const matchedOrNot = function() {
    if (matchedCards.length === 2) {
        if (matchedCards[0].firstElementChild.className === matchedCards[1].firstElementChild.className) {
        matchedCards[0].classList.toggle('match');
        toggleClass(matchedCards[0]);
        matchedCards[1].classList.toggle('match');
        toggleClass(matchedCards[1]);
        openCards += 2;
        movesCounter();
        return matchedCards = [];
    }   else {
            setTimeout(function notaMatch() {
                if (matchedCards[0].firstElementChild.className !== matchedCards[1].firstElementChild.className) {
                    toggleClass(matchedCards[0]);
                    toggleClass(matchedCards[1]);
                    return matchedCards = [];
                }
            }, 800);
            movesCounter();
        }
    }
}

// moves counter
const movesCounter = function() {
    moves ++;
    const counter = document.querySelector('.moves');
    if (moves < 2) {
        counter.innerHTML = `${moves} move`;
    } else if ( moves > 1) {
        counter.innerHTML = `${moves} moves`;
    }
    starRatings();
    
}

//star ratings based on moves made
function starRatings() {
    if (moves === 12) {
        const star1 = stars.firstElementChild;
        stars.removeChild(star1);
        result = stars.innerHTML;
     }  else if (moves === 16) {
        const star2 = stars.firstElementChild;
        stars.removeChild(star2);
        result = stars.innerHTML;
    }
}

// this starts the timer
function startTimer() {
    timerID = setInterval(function() {
        time++;
        displayTimer();
    }, 1000);
}

//this displys the time on the page
function displayTimer() {
    const clockOnPage = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {
        clockOnPage.innerHTML = `${minutes}mins:0${seconds}secs`;
    } else {
        clockOnPage.innerHTML = `${minutes}mins:${seconds}secs`;
    }

}

// stopping and clearing the timer
function stopTimer() {
    clearInterval(timerID);
}

//opening and closig the modal
function toggleModal() {
    const modal = document.querySelector('.modal');
    modal.classList.toggle('hide');
}

//closing the modal
closeModal.addEventListener('click', function() {
    toggleModal();
})

//modal stats

function writeStats() {
    const modalMoves = document.querySelector('.modalMoves');
    const modalTime = document.querySelector('.modalTime');
    const modalStars = document.querySelector('.modalStars');
    const clockOnPage = document.querySelector('.clock').innerHTML;
    stars.style.color = '#FF3E00FF';
    stars.style.listStyle = 'none';
    let ratings = stars.innerHTML;
    modalMoves.innerHTML = `${moves} moves`;
    modalTime.innerHTML = `in ${clockOnPage}`;
    modalStars.innerHTML = `and you deserve ${ratings}`;
}

// clearing the board for a new game

function restartGame() {
    openCards = 0;
    clearTimer();
    clearMoves();
    clearStars();
    clearBoard();
    shuffleCards();

}

//clearing the timer;
function clearTimer() {
    stopTimer();
    timerOff = true;
    time = 0;
    displayTimer();
}

//clearing all moves
function clearMoves() {
    moves = 0;
    const counter = document.querySelector('.moves');
    counter.innerHTML = `${moves} moves`; 
}

// restoring the stars
function clearStars() {
    const gameStars = stars.children.length;
    if (gameStars < 3) {
        for (var i = gameStars; i < 3; i++) {
            const newElement = document.createElement('li');
            const newI = document.createElement('i');
            newI.setAttribute('class', 'fa fa-star');
            const star1 = newElement.appendChild(newI);
            const medal = stars.appendChild(star1);
            stars.style.display = 'inline-block';
    }
    } else if (gameStars < 2) {
        for (var i = gameStars; i < 3; i++) {
            const newElement = document.createElement('li');
            const newI = document.createElement('i');
            newI.setAttribute('class', 'fa fa-star');
            const star2 = newElement.appendChild(newI);
            const medal1 = stars.appendChild(star2);
            stars.style.display = 'inline-block';
    }
    }
}

function clearBoard() {
    const cardsArray = [...cards];
    for (const card of cardsArray) {
        card.className = 'card';
    }
}

// restarting the game
restartButton.addEventListener('click', restartGame);

//replay the game

function replay() {
    restartGame();
    toggleModal();
}

// playing the game again

playAgain.addEventListener('click', replay);

// new game Board

function newGameBoard() {
    openCards = 0;
    clearBoard();
    clearMoves();
    clearTimer();
    clearStars();
    shuffleCards();
}



window.onload = newGameBoard();