const state = {
    score: {
        playerScore:    0,
        computerScore:  0,
        scoreBox:       document.getElementById("score_points"),
    },
    cardSprites: {
        avatar:         document.getElementById("card-image"),
        name:           document.getElementById("card-name"),
        type:           document.getElementById("card-type"),
    },
    fieldCards: {
        player:         document.getElementById("player-field-card"),
        computer:       document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1:        "player-cards",
        player1Box:     document.querySelector("#player-cards"),
        computer:       "computer-cards",
        computerBox:    document.querySelector("#computer-cards"),
    },
    actions: {
        button:         document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id:     0,
        name:   "Dragão Branco de Olhos Azuis",
        type:   "Papel",
        img:    `${pathImages}dragon.png`,
        winOf:  [1],
        loseOf: [2],
    },
    {
        id:     1,
        name:   "Mago Negro",
        type:   "Pedra",
        img:    `${pathImages}magician.png`,
        winOf:  [2],
        loseOf: [0],
    },
    {
        id:     2,
        name:   "Exodia",
        type:   "Tesoura",
        img:    `${pathImages}exodia.png`,
        winOf:  [0],
        loseOf: [1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor( Math.random() * cardData.length );
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("click", () => {
            setCardsField( cardImage.getAttribute("data-id") );
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
    }

    return cardImage;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId                      = await getRandomCardId();

    await showCardFieldsImages(true);
    await hideCardDetails();
    await drawCardsInField(cardId, computerCardId);

    let duelResults                         = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src             = cardData[cardId].img;
    state.fieldCards.computer.src           = cardData[computerCardId].img;
}

async function showCardFieldsImages(value){
    if(value){
        state.fieldCards.player.style.display   = "block";
        state.fieldCards.computer.style.display = "block";
    }else{
        state.fieldCards.player.style.display   = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hideCardDetails(){
    state.cardSprites.avatar.src            = "";
    state.cardSprites.name.innerText        = "";
    state.cardSprites.type.innerText        = "";
}

async function drawButton(text){
    state.actions.button.innerText      = text.toUpperCase();
    state.actions.button.style.display  = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard  = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Ganhou";
        await playAudio(duelResults);
        state.score.playerScore++;
    }else if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages(){
    let { computerBox, player1Box } = state.playerSides;
    let imgElements                 = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements                     = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src        = cardData[index].img;
    state.cardSprites.name.innerText    = cardData[index].name;
    state.cardSprites.type.innerText    = "Atributo: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard  = await getRandomCardId();
        const cardImage     = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src            = "";
    state.actions.button.style.display      = "none";

    state.fieldCards.player.style.display   = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init(){
    showCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    //document.getElementById("bgm").play();
}

init();