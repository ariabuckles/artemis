import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ArtemisEditor from "./ArtemisEditor";
import ArtemisToolbar from "./ArtemisToolbar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{ height: 100 }}>
          <ArtemisToolbar onAction={(a) => this._editor.triggerAction(a)}/>
        </div>
        <div style={{ overflow: "scroll", height: "100%" }}>
          <ArtemisEditor ref={(editor) => this._editor = editor} />
        </div>
      </div>
    );
  }
}

export default App;
