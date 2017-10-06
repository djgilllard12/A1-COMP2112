// App code here
console.log('App working');
// games array
let games = [
    {'publisher' : 'Namco', 'avatar' : 'https://archive.org/services/img/msdos_Pac-Man_1983', 'subject' : 'Pac-Man', 'body' : 'Pac-Man stars a little, yellow dot-muncher who works his way around to clear a maze of the dots.', 'date' : '1983', 'ifrmSrc' : 'https://archive.org/embed/msdos_Pac-Man_1983'},

    {'publisher' : 'Broderbund', 'avatar' : 'https://archive.org/services/img/msdos_Where_in_the_World_is_Carmen_Sandiego_1985', 'subject' : 'Where in the World is Carmen Sandiego', 'body' : 'Capture the thief that stole the artifact using clues dealing with your knowledge of geography.', 'date' : '1985', 'ifrmSrc' : 'https://archive.org/embed/msdos_Where_in_the_World_is_Carmen_Sandiego_1985'},

    {'publisher' : 'Ingenuity', 'avatar' : 'https://archive.org/services/img/msdos_Crosscountry_Canada_1991', 'subject' : 'Crosscountry Canada', 'body' : 'Drive an 18-wheel truck picking up and delivering a variety of commodities with typed-in commands.', 'date' : '1991', 'ifrmSrc' : 'https://archive.org/embed/msdos_Crosscountry_Canada_1991'},
];
// variables
let gameSelected = 0;
let trashLink = document.getElementById('trash');
let gameListLink = document.getElementById('gamesList');
let composeLink = document.getElementById('compose');

// setting up event listeners for all my side nav functionality
trashLink.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('trash clicked');
  let filtered = games.filter(games => games.deleted);
  selectedGame = 0;
  render(filtered);
});

gameListLink.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('games clicked');
  let gamesBody = games.filter(games => games.deleted);
  selectedGame = 0;
  render(gamesBody);
});

composeLink.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('compose clicked');
  composeForm();
});
// functions
function composeForm() {
  // injecting the proper html for the compose panel
  let composeHtml = `
  <form id="newgame" class="pure-form pure-form-aligned">
    <fieldset>
        <div class="pure-control-group">
            <label for="publisher">Publisher</label>
            <input id="publisher" type="text" placeholder="Publisher">
            <span class="pure-form-message-inline">This is a required field.</span>
        </div>
        <div class="pure-control-group">
            <label for="game">Game</label>
            <input id="game" type="text" placeholder="game">
        </div>
        <div class="pure-control-group">
            <label for="body">Body</label>
            <input id="body" type="text" placeholder="body">
        </div>
        <div class="pure-control-group">
            <label for="date">Date</label>
            <input id="date" type="text" placeholder="Enter something here...">
        </div>
        <div class="pure-controls">
            <button type="submit" id="send" class="pure-button pure-button-primary">Submit</button>
        </div>
    </fieldset>
</form>
  `;
  let body = document.getElementById('main');
  body.innerHTML = composeHtml;
  // saving the inputted data into the local storage
  let send = document.getElementById('newgame');
  send.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Send clicked');
    let objNewGame = {
      publisher : document.forms.newgame.publisher.value,
      game : document.forms.newgame.game.value,
      body : document.forms.newgame.body.value,
      date : document.forms.newgame.date.value,
      avatar : 'http://via.placeholder.com/350x150'
    }
    console.log(objNewGame);
    games.unshift(objNewGame);
    console.table(games);
    setLocalStorage();
    // updating text acccording to whether the email is deleted or not
    gamesListLink.click();
  });
}


// function to fill list column with games
function render(games) {
  let gamesDisplaySnippet = `
    ${games.map( (games, index) => `
      <div class="email-item pure-g" data-id="${index}">
        <div class="pure-u">
          <img width="64" height="64" alt="Game Title" class="email-avatar" src="${games.avatar}">
        </div>
        <div class="pure-u-3-4">
          <h5 class="email-name">${games.publisher}</h5>
          <h4 class="email-subject">${games.subject}</h4>
          <p class="email-desc">
            ${games.body.length > 100 ? `${games.body.substr(0,99)}...`: games.body}
          </p>
        </div><!-- end indivual list item-->
      </div> <!-- end list container -->
      `).join('')}
  `;
  let list = document.getElementById('list');
  list.innerHTML = gamesDisplaySnippet;

  initialize(games);

}

function initialize(games) {
    // adding event listeners to make games column clickable
  let gamesColumn = [...(document.querySelectorAll('{data-id}'))];
  gamesColumn.map((games, index) => games.addEventListener('click', function (e) {
    // remove selected class
    gamesColumn[selectedGame].classList.remove('email-item-selected');
    games.classList.add('email-item-selected');
    selectedGame = index;
    showGameBody(selectedGame, games);
  }));

  // select first game on load
  if(games.length){
    gamesColumn[selectedGame].classList.add('email-item-selected');
    showGameBody(selectedGame, games);
    console.log('email selected')
  } else{
      let body = document.getElementById('main');
      body.innerHTML = '<h1>Trash Empty</h1>'
  }
}
// function to show the content of the game that the user has selected
function showGameBody(idx, games) {
  let displayGameBody = `
  <div class="email-content">
            <div class="email-content-header pure-g">
                <div class="pure-u-1-2">
                    <h1 class="email-content-title">${games[idx].subject}</h1>
                    <p class="email-content-subtitle">
                        From <a>${games[idx].publisher}</a> at <span>${games[idx].date}</span>
                    </p>
                </div>

                <div class="email-content-controls pure-u-1-2">
                    <button id="delete" data-id="${idx}" class="secondary-button pure-button">${games[idx].deleted ? 'Deleted' : 'Delete' }</button>
                    <button class="secondary-button pure-button">Forward</button>
                    <button class="secondary-button pure-button">Move to</button>
                </div>
            </div>

            <div class="email-content-body">
                <p>
                  ${games[idx].body}
                </p>
            </div>
        </div>
  `;

  let body = document.getElementById('main');
  body.innerHTML = displayGameBody;

  let btn_delete = document.getElementById('delete');
  btn_delete.addEventListener('click', () => deleteGame(btn_delete.dataset.id, games));
}
// function to deleting a game
function deleteGame(index, games) {
  if (!games[index].deleted == true){
    console.log('delete clicked');
    games[index].deleted = true;
    // local storage setup
    setLocalStorage();
    // updating text acccording to whether the email is deleted or not
    btn_delete.textContent = 'deleted';
    let gamesBody = games.filter(games => games.deleted);
    selectedGame = 0;
    render(gamesBody);
  } else{
      delete games[index].deleted;
      let filtered = games.filter(games => games.deleted);
      selectedGame = 0;
      render(filtered);
  }
}
// local storage set up
function setLocalStorage() {
  localStorage.setItem('items', JSON.stringify(games));
}

if (localStorage.getItem('item')){
  emails = JSON.parse(localStorage.getItem('items'));
  let filtered = games.filter(game => !game.deleted);
  render(filtered)
}else{
  render(games);
}
render(games);