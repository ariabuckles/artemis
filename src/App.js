import React, { PureComponent } from 'react';
import { View, StyleSheet } from './base-components';
import * as Artemis from './Artemis';

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
    artemisState: Artemis.State.empty(),
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
              <Artemis.Toolbar onAction={this._applyAction} />
            </View>

            <View style={styles.editor}>
              <Artemis.Editor
                editorState={this.state.artemisState}
                widgetEditors={Artemis.Widgets.defaultEditors()}
                onChange={this._onArtemisStateChange}
                keypad={this.state.keypad}
                placeholder='Write your question here...'
              />
            </View>
          </View>

          <Artemis.Keypad ref={keypad => this.setState({ keypad: keypad })} />

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
      artemisState: Artemis.State.applyAction(this.state.artemisState, a),
    });
  };
}

export default App;
