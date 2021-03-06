/* global i18n */

const React = require('react');
const _ = require("underscore");

const Renderer = require("../../renderer-stub");
const Util = require("../../util.js");

const BaseRadio = require("./base-radio");


const Radio = React.createClass({
    propTypes: {
        apiOptions: BaseRadio.propTypes.apiOptions,
        choices: BaseRadio.propTypes.choices,

        deselectEnabled: React.PropTypes.bool,
        displayCount: React.PropTypes.any,
        findWidgets: React.PropTypes.func,
        multipleSelect: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired,

        onePerLine: BaseRadio.propTypes.onePerLine,

        questionCompleted: React.PropTypes.bool,
        reviewModeRubric: BaseRadio.propTypes.reviewModeRubric,
        trackInteraction: React.PropTypes.func.isRequired,
        values: React.PropTypes.arrayOf(React.PropTypes.bool),
    },

    getDefaultProps: function() {
        return {
            choices: [{}],
            displayCount: null,
            multipleSelect: false,
            deselectEnabled: false,
        };
    },

    _renderRenderer: function(content) {
        content = content || "";

        // no passage-refs in artemis
        return <Renderer
            key="choiceContentRenderer"
            content={content}
        />;
    },

    focus: function(i) {
        return this.refs.baseRadio.focus(i);
    },

    onCheckedChange: function(checked) {
        this.props.onChange({
            values: checked,
        });
        this.props.trackInteraction();
    },

    getUserInput: function() {
        // Return checked inputs in the form {values: [bool]}. (Dear future
        // timeline implementers: this used to be {value: i} before multiple
        // select was added)
        if (this.props.values) {
            let noneOfTheAboveIndex = null;
            let noneOfTheAboveSelected = false;

            const values = this.props.values.slice();

            for (let i = 0; i < this.props.values.length; i++) {
                const index = this.props.choices[i].originalIndex;
                values[index] = this.props.values[i];

                if (this.props.choices[i].isNoneOfTheAbove) {
                    noneOfTheAboveIndex = index;

                    if (values[i]) {
                        noneOfTheAboveSelected = true;
                    }
                }
            }

            return {
                values: values,
                noneOfTheAboveIndex: noneOfTheAboveIndex,
                noneOfTheAboveSelected: noneOfTheAboveSelected,
            };
        } else {
            // Nothing checked
            return {
                values: _.map(this.props.choices, () => false),
            };
        }
    },

    simpleValidate: function(rubric) {
        return Radio.validate(this.getUserInput(), rubric);
    },

    enforceOrdering: function(choices) {
        const content = _.pluck(choices, "content");
        if (_.isEqual(content, [i18n._("False"), i18n._("True")]) ||
            _.isEqual(content, [i18n._("No"), i18n._("Yes")])) {
            return ([choices[1]]).concat([choices[0]]);
        }
        return choices;
    },

    render: function() {
        let choices = this.props.choices;
        const values = this.props.values || _.map(choices, () => false);

        choices = _.map(choices, (choice, i) => {
            const content = (choice.isNoneOfTheAbove && !choice.content) ?
                // we use i18n._ instead of $_ here because the content
                // sent to a renderer needs to be a string, not a react
                // node (/renderable/fragment).
                i18n._("None of the above") :
                choice.content;
            return {
                content: this._renderRenderer(content),
                checked: values[i],
                correct: this.props.questionCompleted && values[i],
                clue: this._renderRenderer(choice.clue),
                isNoneOfTheAbove: choice.isNoneOfTheAbove,
            };
        });
        choices = this.enforceOrdering(choices);

        return <BaseRadio
            ref="baseRadio"
            labelWrap={true}
            onePerLine={this.props.onePerLine}
            multipleSelect={this.props.multipleSelect}
            choices={choices}
            onCheckedChange={this.onCheckedChange}
            reviewModeRubric={this.props.reviewModeRubric}
            deselectEnabled={this.props.deselectEnabled}
            apiOptions={this.props.apiOptions}
        />;
    },
});

_.extend(Radio, {
    validate: function(state, rubric) {
        const numSelected = _.reduce(state.values, function(sum, selected) {
            return sum + ((selected) ? 1 : 0);
        }, 0);

        if (numSelected === 0) {
            return {
                type: "invalid",
                message: null,
            };
        // If NOTA and some other answer are checked, ...
        } else if (state.noneOfTheAboveSelected && numSelected > 1) {
            return {
                type: "invalid",
                message: i18n._("'None of the above' may not be selected " +
                                    "when other answers are selected."),
            };
        } else {
            /* jshint -W018 */
            const correct = _.all(state.values, function(selected, i) {
                let isCorrect;
                if (state.noneOfTheAboveIndex === i) {
                    isCorrect = _.all(rubric.choices, function(choice, j) {
                        return i === j || !choice.correct;
                    });
                } else {
                    isCorrect = !!rubric.choices[i].correct;
                }
                return isCorrect === selected;
            });
            /* jshint +W018 */

            return {
                type: "points",
                earned: correct ? 1 : 0,
                total: 1,
                message: null,
            };
        }
    },
});

module.exports = Radio;
