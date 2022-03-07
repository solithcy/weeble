import {Component} from "react";
import '../resources/gameover.css';
import $ from 'jquery';

class GameOver extends Component{
    constructor(props){
        super(props);
        this.state = {
            info: props.info,
            history: props.history
        }
        // get the amount of history elements with more than one thing inside
        let winsneeded = this.state.history.filter(function(e){
            return e.length > 0;
        }).length-1;
        if(!props.info.wongame){
            winsneeded = 6;
        }
        let messages = [
            "Insane!",
            "Incredible!",
            "Impressive!",
            "Great!",
            "Good job!",
            "Nice!",
            "So close :(",
        ]
        this.state.wintext = messages[winsneeded]
    }
    close(){
        $("#gameover").fadeOut(500);
    }
    render() {
        return <div className={"gameover"} id={"gameover"}>
            <div className={"modal"}>
                <h1>{this.state.wintext}</h1>
                <h2>The character was {this.state.info.character.name} from <a rel="noreferrer" href={this.state.info.anime.link} target={"_blank"}>{this.state.info.anime.alternative_titles.en || this.state.info.anime.title}</a></h2>
                <img src={this.state.info.character.character_image} alt=""/>
                <button style={{
                    marginTop: "1rem"
                }} onClick={this.close}>Close</button>
            </div>
        </div>
    }
}

export default GameOver;