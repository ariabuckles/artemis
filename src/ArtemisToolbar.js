import React, { Component } from 'react';

import * as ArtemisActions from './ArtemisActions';
import { View, StyleSheet } from './base-components';

import './FontAwesome';

const iconStyles = {
  display: 'block',
  fontFamily: 'FontAwesome',
  textAlign: 'center',
  fontSize: 28,
}

const styles = StyleSheet.create({
  debugContainer: {
    border: `1px dashed #ccc`,
  },
  toolbar: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
  },
  button: {
    boxSizing: 'border-box',
    userSelect: 'none',
    width: 85,
    height: 80,
    flexShrink: 0,
    lineHeight: 1,
    textAlign: 'center',
    padding: 8,
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
      ...iconStyles,
    },
  },
  closeIcon: {
    ':after': {
      content: '"\\f057"',
      ...iconStyles,
    },
  },
  equationIcon: {
    ':after': {
      content: '"\\f12b"',
      ...iconStyles,
    }
  },
  boldIcon: {
    ':after': {
      content: '"\\f032"',
      ...iconStyles,
    }
  },
  tableIcon: {
    ':after': {
      content: '"\\f009"',
      ...iconStyles,
    }
  },
  textIcon: {
    ':after': {
      content: '"\\f031"',
      ...iconStyles,
    }
  },
  numberIcon: {
    ':after': {
      content: '"\\f096"',
      ...iconStyles,
    }
  },
  multipleChoiceIcon: {
    ':after': {
      content: '"\\f0ca"',
      ...iconStyles,
    }
  },
  graphIcon: {
    ':after': {
      content: '"\\f201"',
      ...iconStyles,
    }
  },
  histogramIcon: {
    ':after': {
      content: '"\\f080"',
      ...iconStyles,
    }
  },
  italicsIcon: {
    ':after': {
      content: '"\\f033"',
      ...iconStyles,
    }
  },
  numberLineIcon: {
    ':after': {
      content: '"\\f07e"',
      ...iconStyles,
    }
  },
  imageIcon: {
    ':after': {
      content: '"\\f03e"',
      ...iconStyles,
    }
  },
  widgetsRibbonWrapper: {
    display: 'flex',
  },
  widgetsRibbonWrapperExpanded: {
    background: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  widgetsRibbon: {
    background: '#eee',
    display: 'none',
  },
  widgetsRibbonShowing: {
    display: 'flex',
  },

  widgetsRibbonClose: {
    fontSize: 32,
    padding: 16,
    cursor: 'pointer',
    lineHeight: 1,
    color: '#999',
    ':hover': {
      color: '#4FAED1',
    },
  },

});

export default class ArtemisToolbar extends Component {
  state = {
    showWidgetsRibbon: false,
  }
  insertWidget = (widget) => {
    this.props.onAction(ArtemisActions.insertWidget(widget))
    this.setState({showWidgetsRibbon: false})
  }
  toggleWidgetsRibbon = () => {
    this.setState({showWidgetsRibbon: !this.state.showWidgetsRibbon})
  }
  renderWidgetsRibbon = () => {
    return [
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('numeric-input')}
        key='numeric-input'
      >
        <View style={styles.numberIcon} />
        <View style={styles.buttonCaption}>
          Number
        </View>
      </View>,
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('multiple-choice')}
        key='multiple-choice'
      >
        <View style={styles.multipleChoiceIcon} />
        <View style={styles.buttonCaption}>
          Multiple choice
        </View>
      </View>,
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('expression')}
        key='expression'
      >
        <View style={styles.equationIcon} />
        <View style={styles.buttonCaption}>
          Math Expression
        </View>
      </View>,
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('text-input')}
        key='text-input'
      >
        <View style={styles.textIcon} />
        <View style={styles.buttonCaption}>
          Text
        </View>
      </View>,
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('histogram')}
        key='histogram'
      >
        <View style={styles.histogramIcon} />
        <View style={styles.buttonCaption}>
          Histogram
        </View>
      </View>,
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('number-line')}
        key='number-line'
      >
        <View style={styles.numberLineIcon} />
        <View style={styles.buttonCaption}>
          Number line
        </View>
      </View>,
      <View
        style={[styles.button, styles.widgetsRibbonButton]}
        onClick={() => this.insertWidget('graph')}
        key='graph'
      >
        <View style={styles.graphIcon} />
        <View style={styles.buttonCaption}>
          Graph
        </View>
      </View>
    ];
  }
  render() {
    const {
      showWidgetsRibbon
    } = this.state;
    return (
      <View style={[styles.toolbar, this.props.debug && styles.debugContainer]}>

        <View style={[styles.widgetsRibbonWrapper,
            showWidgetsRibbon && styles.widgetsRibbonWrapperExpanded]}>
          <View
            style={styles.button}
            onClick={this.toggleWidgetsRibbon}
            >
              <View style={!showWidgetsRibbon ? styles.widgetsIcon : styles.closeIcon} />
              <View style={styles.buttonCaption}>
                Answer field
              </View>
            </View>
            <View style={[styles.widgetsRibbon,
                showWidgetsRibbon && styles.widgetsRibbonShowing]}>
              {this.renderWidgetsRibbon()}
            </View>
        </View>

        <View
          style={styles.button}
          onClick={() => console.log('bold')}
        >
          <View style={styles.boldIcon} />
          <View style={styles.buttonCaption}>
            Bold
          </View>
        </View>

        <View
          style={styles.button}
          onClick={() => console.log('italics')}
        >
          <View style={styles.italicsIcon} />
          <View style={styles.buttonCaption}>
            Italics
          </View>
        </View>

        <View
          style={styles.button}
          onClick={() => console.log('image')}
        >
          <View style={styles.imageIcon} />
          <View style={styles.buttonCaption}>
            Image
          </View>
        </View>


        <View
          style={styles.button}
          onClick={() => console.log('table')}
        >
          <View style={styles.tableIcon} />
          <View style={styles.buttonCaption}>
            Table
          </View>
        </View>

        <View
          style={styles.button}
          onClick={() => this.props.onAction(ArtemisActions.newInlineMath())}
        >
          <View style={styles.equationIcon} />
          <View style={styles.buttonCaption}>
            Equation
          </View>
        </View>
      </View>
    );
  }
}
