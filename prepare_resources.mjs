import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import fs from 'fs';
import createDebug from 'debug';
import wordlist from 'wordlist-english';

createDebug.enable("prepare_resources");

const debug = createDebug('prepare_resources');
const malapikey = process.env.MAL_API_KEY;
const animeamount = 250;

async function getCharacters(anime){
    let anime_character = await fetch(`https://www.animecharactersdatabase.com/api_series_characters.php?anime_q=${encodeURIComponent(anime)}`, {
        headers: {
            "User-Agent": "RoseChilds/Weeble"
        }
    });
    let anime_character_json = await anime_character.json();
    if(anime_character.status !== 200){
        debug("Ratelimited, waiting 2 seconds and trying again (anime data)");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return getCharacters(anime);
    }
    if(anime_character_json === -1){
        return {
            characters: [],
            anime_id: undefined
        }
    }
    anime_character = anime_character_json;
    if(!anime_character.search_results){
        return {
            characters: [],
            anime_id: undefined
        }
    }
    let characters = await fetch(anime_character.search_results[0].characters_url, {
        headers: {
            "User-Agent": "RoseChilds/Weeble"
        }
    });
    let characters_json = await characters.json();
    if(characters.status !== 200 || characters_json === -1){
        debug("Ratelimited, waiting 2 seconds and trying again (characters)");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return getCharacters(anime);
    }
    characters = characters_json;
    return {
        characters: characters.characters,
        anime_id: anime_character.search_results[0].anime_id
    };
}

async function getTopAnime(){
    debug(`Fetching top ${animeamount} anime`);
    let topanime = await fetch(`https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=${animeamount}&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,num_episodes,start_season,broadcast,source,average_episode_duration,rating,statistics`, {
        headers: {
            "Content-Type": "application/json",
            "X-MAL-CLIENT-ID": malapikey
        }
    }).then(res => res.json()).then(anime=>anime.data);
    return topanime.map(anime=>{
        return anime.node;
    });
}

let topanime = await getTopAnime();
let animes = {

}
let characters_data = {

}
let weeble_answers = [];
let allowed_words = [];
debug(`Getting characters for ${topanime.length} anime`);
let i = 0;
for(const anime of topanime){
    i++;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${i}/${topanime.length} - ${anime.alternative_titles.en || anime.title} (${anime.id})`);
    let characters = await getCharacters(anime.alternative_titles.en || anime.title);
    if(characters.characters.length===0){
        continue;
    }
    anime.characters = characters.characters;
    animes[characters.anime_id] = anime;
    for(const character of characters.characters){
        let character_name = character.name.split(" ")[0];
        if(character_name.length !== 5 || weeble_answers.includes(character.id)){
            continue
        }
        character.anime_id = characters.anime_id;
        characters_data[character.id] = character;
        allowed_words.push(character_name.toLowerCase());
        weeble_answers.push(character.id);
    }
}
wordlist['english'].forEach(word=>{
    if(word.length===5 && !allowed_words.includes(word) && /^[a-zA-Z]+$/.test(word)){
        allowed_words.push(word);
    }
});
for(let i = weeble_answers.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [weeble_answers[i], weeble_answers[j]] = [weeble_answers[j], weeble_answers[i]];
}
try{
    fs.unlinkSync("./src/resources/data.json");
}catch{}
debug("Writing data to ./src/resources/data.json");
fs.writeFileSync("./src/resources/data.json", JSON.stringify({
    allowed_words,
    animes,
    answers: weeble_answers,
}));

debug(`${weeble_answers.length.toLocaleString()} answers`);