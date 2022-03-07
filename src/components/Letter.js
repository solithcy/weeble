import {Component} from "react";
import '../resources/letter.css';
import colors from '../resources/colors.json';

class Letter extends Component{
    constructor(props){
        super(props);
        this.state = {
            color: props.color || 'dormant',
            letter: props.letter || "",
            position: props.position
        }
    }
    render(){
        return (
            <div className="letter" id={`letter_${this.state.position}`} style={{background: colors[this.state.color]}}>
                <h1>{this.state.letter}</h1>
            </div>
        );
    }
}

export default Letter;