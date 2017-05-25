import React, { Component } from 'react';

import * as ArtemisActions from './ArtemisActions';
import { View, StyleSheet } from './base-components';

import './FontAwesome';

const styles = StyleSheet.create({
  debugContainer: {
    border: `1px dashed #ccc`,
  },
  toolbar: {
    position: 'relative',
    zIndex: 1,
    display: 'flex'
  },
  button: {
    padding: 8,
    color: '#666',
    cursor: 'pointer',
    ':hover': {
      color: '#4FAED1',
    }
  },
  buttonCaption: {
    marginTop: 8,
    fontSize: '0.9em',
  },
  widgetsIcon: {
    ':after': {
      content: '"\\f044"',
      display: 'block',
      fontFamily: 'FontAwesome',
      textAlign: 'center',
      fontSize: 28,
    },
  },
  equationIcon: {
    ':after': {
      content: '"\\f12b"',
      display: 'block',
      fontFamily: 'FontAwesome',
      textAlign: 'center',
      fontSize: 28,
    }
  },
  widgetsModal: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 2,
    background: 'white',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetsModalClose: {
    position: 'absolute',
    right: 20,
    top: 16,
    fontSize: 32,
    cursor: 'pointer',
    lineHeight: 1,
    color: '#999',
    ':hover': {
      color: '#4FAED1',
    },
  },
  widgetsModalWidget: {
    width: 100,
    height: 100,
    border: `1px solid #ddd`,
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',

    ':hover': {
      color: '#4FAED1',
      borderColor: '#4FAED1',
    },
  },

});

export default class ArtemisToolbar extends Component {
  state = {
    showWidgetsModal: false,
  }
  insertWidget = (widget) => {
    this.props.onAction(ArtemisActions.insertWidget(widget))
    this.setState({showWidgetsModal: false})
  }
  renderWidgetsModal = () => {
    return <View style={styles.widgetsModal}>
      <View
        style={styles.widgetsModalClose}
        onClick={() => this.setState({showWidgetsModal: false})}
      >
        ×
      </View>

      <View
        style={styles.widgetsModalWidget}
        onClick={() => this.insertWidget('numeric-input')}
      >
        Number
      </View>

    </View>
  }
  render() {
    return (
      <View style={this.props.debug && styles.debugContainer}>
        <View style={styles.toolbar}>
          <View
            style={styles.button}
            onClick={() => this.props.onAction(ArtemisActions.newInlineMath())}
          >
            <View style={styles.equationIcon} />
            <View style={styles.buttonCaption}>
              Equation
            </View>
          </View>
          <View
            style={styles.button}
            onClick={() => this.setState({showWidgetsModal: true})}
          >
            <View style={styles.widgetsIcon} />
            <View style={styles.buttonCaption}>
              Answer Field
            </View>
          </View>
        </View>
        {this.state.showWidgetsModal && this.renderWidgetsModal()}
      </View>
    );
  }
}
