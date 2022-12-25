let pokemonsList = document.getElementById("pokemonsList");
const loadMoreButton = document.getElementById("loadMoreButton");

const limit = 12;
const typeColor = {
    normal: "a6a877",
    grass: "00a54e",
    fire: "ee7f30",
    water: "678fee",
    electric: "f7cf2e",
    ice: "98d5d7",
    ground: "dfbf69",
    flying: "a98ff0",
    poison: "a040a0",
    fighting: "bf3029",
    psychic: "f65687",
    dark: "725847",
    rock: "b8a137",
    bug: "a8b720",
    ghost: "6e5896",
    steel: "b9b7cf",
    dragon: "6f38f6",
    fairy: "f9aec7",
}
let pokemonState = [];

let offset = 0;
const maxResults = 898;
let inPagePokemons = [];

loadPokemons(offset, limit);

//________________________________________________

function loadPokemons() {
    if (offset + limit > maxResults) {
        limit = maxResults - offset;
        loadMoreButton.parentElement.remove(loadMoreButton);
    }

    pokeApi.getPokemons(offset, limit)
        .then(data => {
            pokemonsList = document.getElementById("pokemonsList");
            inPagePokemons = [].concat(inPagePokemons, data);
            pokemonsList.innerHTML += data.map(convertPokemonHTML).join("")
        });
    offset += limit;
}

function convertPokemonHTML(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" id="${pokemon.number}" onClick="openCard(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ul class="types">
                    ${pokemon.types.map(e => "<li class=\"type " + e + "\">" + e + "</li>").join("")}
                </ul>
                <img src=${pokemon.img} alt=${pokemon.name}>
            </div>
        </li>
    `
}

function openCard(id) {
    let pokemon = inPagePokemons.find(e => e.number == id);
    let contentPage = document.getElementById("contentPage");
    document.getElementById("pokemonsList").style.visibility = "hidden";

    contentPage.style.backgroundColor = "transparent";

    contentPage.innerHTML += `
        <div class="card ${pokemon.type}" id="card"> 
            <div class="cardMain"> 
                <div class="cardButtons">
                    <button class="backButton" onClick="back(${id})"><img src="assets\\img\\back.png"/></button> 
                    <button class="likeButton"><img src="assets\\img\\hearth.png"/></button> 
                </div>
                <span class="name">${pokemon.name}</span>
                <ul class="types">
                    ${pokemon.types.map(e => "<li class=\"type " + e + "\">" + e + "</li>").join("")}
                </ul>
                <img class="cardImg" src=${pokemon.img} alt=${pokemon.name} style="${getImgShadowEffect(pokemon.type)}">
            </div>
            <div class="cardDetail">
                <ul class="stats">
                    ${Object.keys(pokemon.stats).map(stat => {
                        return `<li class="stat"> ${stat} </li>
                         <li><div class="statsContainer"><div class="statsBar" style="width : ${pokemon.stats[stat]*100/255}% ;"></div></div></li>
                        `}).join("")}
                </ul>
                <div class="statsNumber">
                    ${Object.keys(pokemon.stats).map(stat => `<span class="statNumber">${pokemon.stats[stat]}</span>`).join("")}
                </div>
            </div>
        </div>
    `
    document.getElementById("card").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

function back(id){
    let contentPage = document.getElementById("contentPage");

    contentPage.removeChild(document.getElementById("card"));
    contentPage.style.backgroundColor = "#add8e6";

    document.getElementById("pokemonsList").style.visibility = "visible";
    document.getElementById(id).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
}

function getImgShadowEffect(pokemonType){

    let color = typeColor[pokemonType];

    color = parseInt(color, 16) + 2000;
    color = color.toString(16);
    
    return `-webkit-filter: drop-shadow(10px 10px 10px #${color});
    filter: drop-shadow(10px 10px 10px #${color});`
}