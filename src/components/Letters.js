import {Component, createRef} from "react";
import '../resources/letters.css';
import Letter from './Letter';
import events from '../ext/events';
import $ from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/selectable.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/effect';
import 'jquery-ui/ui/effects/effect-shake';

class Letters extends Component{
    constructor(props){
        super(props);
        this.references = [];
        this.positions = {
            column: 0,
            row: 0
        }
        this.state = {
            render_game_over: false
        }
        this.correct_answer = props.correct;
        this.allowed_words = props.words;
        this.active_game = true;
        this.history = Array(6).fill([]);
        events.on('letterTyped', this.handleLetter);
    }
    pushHistory = ()=>{
        let history = JSON.parse(window.localStorage.gameHistory || "[]");
        let current = history.find(item=>item.correct.character.id === this.correct_answer.character.id);
        if(current){
            current.game = this.history;
        }else{
            history.push({
                correct: this.correct_answer,
                game: this.history
            });
        }
        window.localStorage.gameHistory = JSON.stringify(history);
    }
    handleLetter = async (letter) => {
        if(this.references.length === 0 || !this.active_game) return;
        if(letter === "backspace"){
            if(this.positions.column !== 0){
                this.positions.column--;
                try{
                    this.references[(this.positions.column) + this.positions.row * 5].current.setState({
                        letter: "",
                        color: "selected"
                    });
                    this.references[(this.positions.column) + this.positions.row * 5 + 1].current.setState({
                        letter: "",
                        color: "dormant"
                    });
                }catch{

                }
            }
            return;
        }else if(letter === "enter"){
            if(this.positions.column < 5){
                return;
            }
            this.active_game = false;
            let targetword = this.correct_answer.word;
            let userword = "";
            let colors = [];
            for(let i=0; i<5; i++){
                let position = (i) + this.positions.row * 5;
                let neededletter = targetword[i];
                let color = "wrong";
                if(this.references[position].current.state.letter === neededletter){
                    color = "correct";
                }else if(targetword.includes(this.references[position].current.state.letter)){
                    color = "close";
                }
                colors.push(color);
                userword += this.references[position].current.state.letter;
            }
            for(let i=0; i<5; i++){
                let position = (i) + this.positions.row * 5;
                if(!this.allowed_words.includes(userword)){
                    $(`#letter_${position}`).effect("shake", {times: 3}, 150);
                    continue;
                }
                this.references[position].current.setState({
                    color: colors[i]
                });
                if(colors[i]==="wrong"){
                    $(`#key_${this.references[position].current.state.letter}`).addClass("inactive");
                }
                await new Promise(resolve=>setTimeout(resolve, 300));
            }
            if(!this.allowed_words.includes(userword)){
                this.history[this.positions.row] = [];
                this.active_game = true;
                return;
            }
            this.history[this.positions.row] = userword.split("");
            this.pushHistory();
            this.active_game = true;
            if(targetword === userword){
                this.active_game = false;
                this.won_game = true;
                return this.gameOver();
            }
            this.positions.column = 0;
            this.positions.row++;
            if(this.positions.row === 6){
                this.active_game = false;
                this.won_game = false;
                return this.gameOver();
            }
            this.references[(this.positions.column) + this.positions.row * 5].current.setState({
                color: "selected"
            });
            return;
        }
        if(this.positions.column >= 5){
            return;
        }
        this.references[(this.positions.column) + this.positions.row * 5].current.setState({
            letter,
            color: "dormant"
        });
        this.positions.column++;
        if(this.positions.column < 5){
            this.references[(this.positions.column) + this.positions.row * 5].current.setState({
                color: "selected"
            });
        }
    }
    componentDidMount() {
        let history = JSON.parse(window.localStorage.gameHistory || "[]");
        let current = history.find(item=>item.correct.character.id === this.correct_answer.character.id);
        if(current){
            this.history = current.game;
            for(const thing of current.game){
                if(thing.length !== 5){
                    break;
                }
                for(const letter of thing){
                    let position = this.positions.row * 5 + this.positions.column;
                    let neededletter = this.correct_answer.word[position % 5];
                    let color = "wrong";
                    if(letter === neededletter){
                        color = "correct";
                    }else if(this.correct_answer.word.includes(letter)){
                        color = "close";
                    }
                    this.references[position].current.setState({
                        letter,
                        color
                    });
                    if(color==="wrong"){
                        $(`#key_${letter}`).addClass("inactive");
                    }
                    this.positions.column++;
                }
                this.positions.column = 0;
                this.positions.row++;
                if(thing.join("") === this.correct_answer.word){
                    this.active_game = false;
                    this.won_game = true;
                    return this.gameOver();
                }
            }
            if(this.positions.row === 6) {
                this.active_game = false;
                this.won_game = false;
                return this.gameOver();
            }else{
                this.references[this.positions.row * 5 + this.positions.column].current.setState({
                    letter: "",
                    color: "selected"
                });
            }
        }
    }

    async gameOver(){
        await new Promise(resolve=>setTimeout(resolve, 500));
        let won = false;
        for(const word of this.history){
            if(word.join("") === this.correct_answer.word){
                won = true;
                break;
            }
        }
        events.dispatch("game_over", {
            correct_answer: {
                ...this.correct_answer,
                wongame: won
            },
            history: this.history,
        });
    }

    render(){
        return [
            <div className={"letters"}>
                {Array(30).fill(0).map((_, i) => {
                    let ref = createRef();
                    this.references.push(ref);
                    return <Letter key={i} position={i} ref={ref} color={i===0 ? "selected" : "dormant"}/>
                })}
            </div>
        ]
    }
}

export default Letters;