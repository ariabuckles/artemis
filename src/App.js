import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import ArtemisEditor from './ArtemisEditor';
import ArtemisToolbar from './ArtemisToolbar';
import ArtemisKeypad from './ArtemisKeypad';
import { View, Text, StyleSheet } from './base-components';

const styles = StyleSheet.create({
  container: {
    margin: 20,
    maxWidth: 800,
  },

});

class App extends PureComponent {
  state = {
    editor: null,
    keypad: null,
  };

  render() {
    return (
      <div className="App">
        <View style={styles.container}>
          <div style={{ height: 100 }}>
            <ArtemisToolbar
              onAction={a =>
                this.state.editor && this.state.editor.triggerAction(a)}
            />
          </div>
          <div style={{ overflow: 'scroll', height: '100%' }}>
            <ArtemisEditor
              ref={editor => this.setState({ editor: editor })}
              keypad={this.state.keypad}
            />
          </div>
          <ArtemisKeypad ref={keypad => this.setState({ keypad: keypad })} />
        </View>
      </div>
    );
  }
}

export default App;
