import React, { PureComponent } from 'react';
import ArtemisEditor from './ArtemisEditor';
import ArtemisToolbar from './ArtemisToolbar';
import ArtemisKeypad from './ArtemisKeypad';
import * as ArtemisState from './ArtemisState';
import * as ArtemisWidgets from './ArtemisWidgets';
import { View, StyleSheet } from './base-components';
import './FontAwesome';

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    margin: '16px auto',
  },
  artemisContainer: {
    backgroundColor: '#fff',
    border: `1px solid #aaa`,
  },
  toolbar: {
    borderBottom: `1px solid #aaa`,
    margin: 16,
    marginBottom: 0,
  },
  editor: {
    height: '100%',
    overflow: 'auto',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 42,
    ':before': {
      content: '"\\f19c"',
      display: 'inline-block',
      marginRight: 4,
      fontFamily: 'FontAwesome',
      color: '#ccc',
      verticalAlign: 'text-top',
    }
  },
  subtitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#4FAED1',
    display: 'inline-block',
    marginLeft: 4,
  },


});

class App extends PureComponent {
  state = {
    keypad: null,
    artemisState: ArtemisState.empty(),
  };

  render() {
    return (
      <View style={styles.app}>
        <View style={styles.container}>

          <View style={styles.title}>
            Artemis
            <View style={styles.subtitle}>
              Beta
            </View>
          </View>

          <View style={styles.artemisContainer}>
            <View style={styles.toolbar}>
              <ArtemisToolbar onAction={this._applyAction} />
            </View>

            <View style={styles.editor}>
              <ArtemisEditor
                editorState={this.state.artemisState}
                widgetEditors={ArtemisWidgets.defaultEditors()}
                onChange={this._onArtemisStateChange}
                keypad={this.state.keypad}
                placeholder='Write your question here...'
              />
            </View>
          </View>

          <ArtemisKeypad ref={keypad => this.setState({ keypad: keypad })} />

        </View>
      </View>
    );
  }

  _onArtemisStateChange = newArtemisState => {
    this.setState({
      artemisState: newArtemisState,
    });
  };

  _applyAction = a => {
    this.setState({
      artemisState: ArtemisState.applyAction(this.state.artemisState, a),
    });
  };
}

export default App;
