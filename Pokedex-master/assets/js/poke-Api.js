const pokeApi = {};

pokeApi.getPokemons = (offset = 0, limit = 12) => {
    let baseUrl = "https://pokeapi.co/api/v2/pokemon/"
    let finalUrl = `${baseUrl}?offset=${offset}&limit=${limit}`

    return fetch(finalUrl)
        .then((response) => response.json())
        .then((data) => data.results)
        .then(data => data.map(pokeApi.getPokemonDetail))
        .then(detailsRequestsList => Promise.all(detailsRequestsList))
        .catch(e => console.log("Erro! " + e))
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url).then(response => response.json())
    .then(data => pokeApi.convertDetailToPokemon(data));
}

pokeApi.convertDetailToPokemon = (pokemonDetail) =>{
    const pokemon = new Pokemon();
    pokemon.name = pokemonDetail.name;
    pokemon.number = pokemonDetail.id;
    pokemon.types = pokemonDetail.types.map(e => e.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.img = pokemonDetail.sprites.other.dream_world.front_default || 
        pokemonDetail.sprites.other.home.front_default;

    pokemon.stats = {};
    pokemonDetail.stats.forEach(stat => {
        pokemon.stats[stat.stat.name] = stat.base_stat;
    })

    return pokemon;
}