import {Component} from "react";
import events from '../ext/events';

class Key extends Component{
    constructor(props){
        super(props);
        this.state = {
            key: props.letter || "a"
        }
        this.specialkeys = {
            backspace: <span className="material-icons">backspace</span>,
            enter: <span className="material-icons">keyboard_return</span>
        }
    }

    onClick = () => {
        events.dispatch("letterTyped", this.state.key);
    }

    render() {
        return (
            <div className={"key"} onClick={this.onClick} id={`key_${this.state.key}`}>
                <h1>{this.specialkeys[this.state.key] || this.state.key}</h1>
            </div>
        );
    }
}

export default Key;