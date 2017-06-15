import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// TODO(aria): are there more things i need to do to this component
// to make it support other widget types?
export default class InlineWidgetPlaceholder extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign(
      this._calculateSpecifiedDimensions(props),
      { widthModifier: 0 }
    );
  }

  _calculateSpecifiedDimensions = props => {
    const { contentState, entityKey } = this.props;
    const entity = contentState.getEntity(entityKey);
    const entityData = entity.getData();

    return {
      specifiedWidth: entityData.width || 40,
      specifiedHeight: entityData.height || 20,
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState(this._calculateSpecifiedDimensions(nextProps));
  }

  // TODO(aria): make a shouldComponentUpdate to make this efficient D:

  render() {
    // This is rendering a single character because we only render InlineMathEditor's
    // with this.props.children as single characters. Draft requires us to
    // render {this.props.children} and only {this.props.children} for cursors to
    // work correctly
    //debugger;

    const { contentState, entityKey } = this.props;

    // the widget info, plus some size info
    // TODO(aria): use WidgetEntityHelpers here to convert this to a true
    // widgetInfo?
    const entityData = contentState.getEntity(entityKey).getData();

    const { specifiedWidth, specifiedHeight, widthModifier } = this.state;

    const style = {
      letterSpacing: specifiedWidth + widthModifier + 2, // 2 from padding (hax)

      // TODO(aria): uhhhh what to put here. mostly affects highlighting
      fontSize: specifiedHeight - 5,
      // Line height doesn't actually make the box the correct height, but it does
      // size the overall line correctly. sorta weird, i know.
      lineHeight: specifiedHeight + 2 + 'px', // 2 from the padding (haxx)

      verticalAlign: 'middle',
    };

    return (
      <span
        style={style}
        data-artemis-id={entityKey}
        data-artemis-widget-info={JSON.stringify(entityData)}
      >
        {this.props.children}
      </span>
    );
  }

  componentDidMount() {
    this._measure();
  }

  componentDidUpdate() {
    this._measure();
  }

  _measure = () => {
    // TODO(aria) remove this.
    // This should no longer be necessary now that we're using the
    // invisible separator character instead of a space or '.'
    // Remove this once we have this stored in git history or
    // when we're confident the invisible separator character hack
    // is working
    const node = ReactDOM.findDOMNode(this);
    const rect = node.getBoundingClientRect();

    const desiredWidth = this.state.specifiedWidth + 2; // 2 from padding
    const errorMargin = desiredWidth + this.state.widthModifier - rect.width;
    if (errorMargin !== this.state.widthModifier) {
      this.setState({ widthModifier: errorMargin });
    }
  };
}
