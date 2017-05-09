import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtemisEditor from './ArtemisEditor';
import ArtemisToolbar from './ArtemisToolbar';
import ArtemisKeypad from './ArtemisKeypad';
import * as ArtemisState from './ArtemisState';
import { View, Text, StyleSheet } from './base-components';

const styles = StyleSheet.create({
  container: {
    margin: 20,
    maxWidth: 800,
  },

});

class App extends PureComponent {
  state = {
    keypad: null,
    artemisState: ArtemisState.empty(),
  };

  render() {
    return (
      <div className="App">
        <View style={styles.container}>
          <div style={{ height: 100 }}>
            <ArtemisToolbar
              onAction={this._applyAction}
            />
          </div>
          <div style={{ overflow: 'scroll', height: '100%' }}>
            <ArtemisEditor
              editorState={this.state.artemisState}
              onChange={this._onArtemisStateChange}
              keypad={this.state.keypad}
            />
          </div>
          <ArtemisKeypad ref={keypad => this.setState({ keypad: keypad })} />
        </View>
      </div>
    );
  }

  _onArtemisStateChange = (newArtemisState) => {
    this.setState({
      artemisState: newArtemisState,
    });
  };

  _applyAction = (a) => {
    this.setState({
      artemisState: ArtemisState.applyAction(this.state.artemisState, a),
    });
  };
}

export default App;
