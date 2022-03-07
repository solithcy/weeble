import {Component} from "react";
import Key from './Key';

class Keyboard extends Component{
    render() {
        return <div className={"keyboardcont"}>
            <div className={"keyboard"}>
                <div>
                    <Key letter={"q"} />
                    <Key letter={"w"} />
                    <Key letter={"e"} />
                    <Key letter={"r"} />
                    <Key letter={"t"} />
                    <Key letter={"y"} />
                    <Key letter={"u"} />
                    <Key letter={"i"} />
                    <Key letter={"o"} />
                    <Key letter={"p"} />
                </div>
                <div>
                    <Key letter={"a"} />
                    <Key letter={"s"} />
                    <Key letter={"d"} />
                    <Key letter={"f"} />
                    <Key letter={"g"} />
                    <Key letter={"h"} />
                    <Key letter={"j"} />
                    <Key letter={"k"} />
                    <Key letter={"l"} />
                </div>
                <div>
                    <Key letter={"backspace"} />
                    <Key letter={"z"} />
                    <Key letter={"x"} />
                    <Key letter={"c"} />
                    <Key letter={"v"} />
                    <Key letter={"b"} />
                    <Key letter={"n"} />
                    <Key letter={"m"} />
                    <Key letter={"enter"} />
                </div>
            </div>
        </div>
    }
}

export default Keyboard;