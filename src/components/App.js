import '../resources/App.css';
import Letters from './Letters';
import data from '../resources/data.json';
import events from "../ext/events";
import {Component} from "react";
import GameOver from "./GameOver";
import Keyboard from "./Keyboard";

const STARTING_DATE = new Date(1645608603000);
let CURRENT_DATE = new Date();
let DAY_DIFFERENCE = Math.max(0, Math.floor((CURRENT_DATE - STARTING_DATE) / (1000 * 60 * 60 * 24)));
let weeble_answers = data.answers;
let characters = [];
Object.entries(data.animes).forEach((anime_data) => {
    let key = anime_data[0];
    let anime = anime_data[1];
    anime.characters.forEach(character => {
        character.anime_id = key;
        characters.push(character);
    });
});
let correct_answer = {
    character: characters.find(character => {
        return character.id === weeble_answers[DAY_DIFFERENCE % weeble_answers.length];
    })
}
correct_answer.anime = data.animes[correct_answer.character.anime_id.toString()];
correct_answer.anime.link = `https://myanimelist.net/anime/${correct_answer.anime.id}`;
correct_answer.word = correct_answer.character.name.split(" ")[0].toLowerCase();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display_game_over: false,
        }
    }

    componentDidMount() {
        events.on("game_over", (info) => {
            this.setState({
                game_over: info,
                display_game_over: true
            });
        });
    }

    render() {
        return [
            <div className="App">
                <div className={"header"}>
                    <h1>Weeble</h1>
                </div>
                <div className={"letterbody"}>
                    <div className={"animeCont"}>
                        <h2>Anime: <span className={"animetitle link"} onClick={()=>{
                            window.open(correct_answer.anime.link)
                        }}>{correct_answer.anime.alternative_titles.en || correct_answer.anime.title}</span></h2>
                        <img className={"animeimage"} src={correct_answer.anime.main_picture.large} alt=""/>
                    </div>
                    <div className={"letterkeyboard"}>
                        <Letters correct={correct_answer} words={data.allowed_words}/>
                        <Keyboard/>
                    </div>
                </div>
            </div>,
            this.state.display_game_over &&
            <GameOver info={this.state.game_over.correct_answer} history={this.state.game_over.history}/>
        ];
    }
}

export default App;
