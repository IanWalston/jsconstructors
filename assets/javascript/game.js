//making pathways to the image files
const images = {
    box: "assets/images/box.png",
    bob: "assets/images/bob.png",
    tai: "assets/images/tai.png",
    dogo: "assets/images/dogo.png",
}

//function for the battle log
function battleLog(msg) {
    document.getElementById("battleLog").innerHTML = msg + document.getElementById("battleLog").innerHTML
}

//function for dying
function lose() {
    document.getElementById("battleScreen").innerHTML = ""
    document.getElementById("endScreen").innerHTML = "<h1>You have been destroyed</h1>"
}

//function for winning
function win() {
    document.getElementById("battleScreen").innerHTML = ""
    document.getElementById("endScreen").innerHTML = "<h1>You Win</h1>"
}

//Character constructor
function Character(title, health, attack, specialattack, counterattack, description) {
    this.title = title
    this.health = health
    this.attack = attack
    this.specialattack = specialattack
    this.counterattack = counterattack
    this.description = description
    this.enemiesDestroyed = 0
    this.hit = (target) => {

        ////HITTING A TARGET
        //deal damage
        target.health -= this.attack
        battleLog(`<p>${target.title} took ${this.attack} damage. </p>`)

        //gain attack 
        this.attack += (attack / 3)

        //get damaged
        this.health -= target.attack
        battleLog(`<p>${this.title} took ${target.attack} damage. </p>`)

        //if enemy is dead
        if (target.health <= 0) {
        battleLog(`<p>${target.title} Has been destroyed. </p>`)
        battleLog(target.title)
        document.getElementById(target.title).onclick = ""
        document.getElementById(target.title).src = `assets/images/${target.title}dead.png`
        document.getElementById(`${target.title}info`).innerHTML = ""
        this.enemiesDestroyed++
        if (this.enemiesDestroyed>=3) {
            setTimeout(()=>win(), 2000)
        }
        }

        //if player is dead
        if (this.health <= 0) {
            battleLog(`<p>${this.title} Has been destroyed. </p>`)
            setTimeout(()=>lose(), 2000)
        }

        //update health displays 
        document.getElementById(`${target.title}info`).innerHTML = `HP:${target.health}`
        document.getElementById(`${this.title}info`).innerHTML = `Your HP:${this.health}<br/>
        Your Attack:${this.attack}
        `

        //sound        
        if (this.health <= 0) {
            let audioElement = document.createElement("audio")
            audioElement.setAttribute("src", 'assets/sounds/die.wav')
            audioElement.play()
        }
        else if (target.health <= 0) {
            let audioElement = document.createElement("audio")
            audioElement.setAttribute("src", 'assets/sounds/kill.wav')
            audioElement.play()
        }
        else {
            let audioElement = document.createElement("audio")
            audioElement.setAttribute("src", 'assets/sounds/hit.wav')
            audioElement.play()
        }
    }
}

//an object where each property has a character object for it's value
var characters = {}

//creating characters        (title, hp, attack, special attack, counter attack, description)
characters.tai = new Character("tai", 133, 6, 200, 9, "The More You Learn, The More You Earn.")
characters.box = new Character("box", 199, 3, 200, 11, "In awe of this lad's armor.")
characters.dogo = new Character("dogo", 87, 12, 200, 18, "Much damage. So impress.")
characters.bob = new Character("bob", 108, 9, 200, 14, "i'M rEaDiNg ThE fLaVoUr TeXt!")

//a character object that the player has chosen
var playerCharacter = {}

//an array of character objects that are now enemies for the player character to fight
var enemyCharacters = {}


////CHOOSE CHARACTER SCREEN
//show character description and stats when you click on character image
var showDescription = (character) => {
    document.getElementById("characterDescription").innerHTML =
        `${character.title}<br/>
    HP:${character.health}<br/>
    Attack:${character.attack}<br/>
    Attack as Enemy:${character.counterattack}<br/>
    <br>
    ${character.description}<br/>
    <br>
    <button type="button" class="btn btn-primary" onclick="chooseCharacter(characters.${character.title})">Choose ${character.title}</button>`

    //sounds
    audioElement = document.createElement("audio")
    audioElement.setAttribute("src", 'assets/sounds/tick.wav')
    audioElement.play()
}

////BATTLE SCREEN
//choose character when you click the button after opening character description. this also erases the select character html and builds html elements for the battle screen.
var chooseCharacter = (character) => {
    playerCharacter = character

    //sound
    audioElement = document.createElement("audio")
    audioElement.setAttribute("src", 'assets/sounds/select.wav')
    audioElement.play()

    //puts player stats 
    document.getElementById("characterSelectionScreen").innerHTML = ""
    document.getElementById("playerCharacter").src = `${images[playerCharacter.title]}`
    document.getElementById("playerDiv").innerHTML += `
        <p id="${playerCharacter.title}info">
               Your HP:${playerCharacter.health} <br>
                Your Attack:${playerCharacter.attack}
        </p>`

    //puts enemy characters into the enemyChracters object
    Object.keys(characters).forEach((character) => {
        if (!(character == playerCharacter.title)) {
            enemyCharacters[character] = characters[character]
        }
    })

    //puts enemies and enemy info into the enemydiv html
    Object.keys(enemyCharacters).forEach((enemy) => {
        console.log(images[enemy])
        document.getElementById("enemyDiv").innerHTML += (
            `<div class="row">
                <img width="100%" class="img-fluid" id=${enemy} src=${images[enemy]} onclick="playerCharacter.hit(enemyCharacters.${enemy})">
                <div id=${enemy}info>HP:${enemyCharacters[enemy].health}</div>
             </div>
            `
        )
    })
}