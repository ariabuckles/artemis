/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable no-var, object-curly-spacing */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

// TODO(kevindangoor) fix these lint errors
/*eslint-disable react/sort-comp, react/jsx-indent-props, react/prop-types,
    react/jsx-closing-bracket-location
*/

var classNames = require("classnames");
const { StyleSheet, css } = require("aphrodite");
var React = require("react");
var _ = require("underscore");

var apiOptions   = require("../api-options-stub");
const { baseUnitPx } = require("../styles/constants.js");
var Changeable    = require("../mixins/changeable");
const mediaQueries = require("../styles/media-queries.js");
var SvgImage     = require("../components/svg-image");

var defaultBoxSize = 400;
var defaultRange = [0, 10];
var defaultBackgroundImage = {
    url: null,
    width: 0,
    height: 0,
};

// NOTE(david): 2016-07-20: This widget supports the 4 alignments specified
//     below, but we want to phase out the floating alignments in the next few
//     weeks. So, we remove the float options from the editor interface.
const supportedAlignments = ["block", "float-left", "float-right",
    "full-width"];
const editorAlignments = ["block", "full-width"];

const DEFAULT_ALIGNMENT = "block";

var ImageWidget = React.createClass({
    propTypes: {
        ...Changeable.propTypes,
        alignment: React.PropTypes.oneOf(supportedAlignments),
        alt: React.PropTypes.string,
        // TODO(alex): Rename to something else, e.g. "image", perhaps flatten
        backgroundImage: React.PropTypes.shape({
            url: React.PropTypes.string,
            width: React.PropTypes.number,
            height: React.PropTypes.number,
        }),

        box: React.PropTypes.arrayOf(React.PropTypes.number),

        caption: React.PropTypes.string,

        // TODO(alex): Convert uses of this widget's labeling functionality to
        // SvgImage wherever possible (almost certainly requires a backfill)
        labels: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                content: React.PropTypes.string,
                coordinates: React.PropTypes.arrayOf(React.PropTypes.number),
                alignment: React.PropTypes.string,
            })
        ),

        range: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(React.PropTypes.number)
        ),

        title: React.PropTypes.string,
        trackInteraction: React.PropTypes.func,
    },

    statics: {
        styles: StyleSheet.create({
            caption: {
                display: "inline-block",
                marginTop: baseUnitPx,
                maxWidth: 640,

                [mediaQueries.lgOrSmaller]: {
                    // TODO(david): This maxWidth is not being used because
                    //     it's overriden by the 512px max-width we have on
                    //     paragraphs.
                    maxWidth: 540,
                },

                [mediaQueries.smOrSmaller]: {
                    maxWidth: 450,
                },
            },
        }),
    },

    getDefaultProps: function() {
        return {
            alignment: DEFAULT_ALIGNMENT,
            title: "",
            range: [defaultRange, defaultRange],
            box: [defaultBoxSize, defaultBoxSize],
            backgroundImage: defaultBackgroundImage,
            labels: [],
            alt: "",
            caption: "",
            apiOptions: apiOptions,
        };
    },

    render: function() {
        var image;
        var {apiOptions} = this.props;

        var backgroundImage = this.props.backgroundImage;

        if (backgroundImage.url) {
            var width = backgroundImage.width;
            var height = backgroundImage.height;
            var box = this.props.box;

            image = <SvgImage
                        src={backgroundImage.url}
                        alt={
                            /* NOTE(aria): canonically this should be in a renderer,
                             * but artemis doesn't have a perseus renderer to spare,
                             * so here it is, unformatted ;_; */
                            this.props.alt || undefined
                        }
                        width={width}
                        height={height}
                        preloader={apiOptions.imagePreloader}
                        extraGraphie={{
                            box: box,
                            range: this.props.range,
                            labels: this.props.labels,
                        }}
                        trackInteraction={this.props.trackInteraction}
                        zoomToFullSizeOnMobile={apiOptions.isMobile}
                        constrainHeight={apiOptions.isMobile}
                        allowFullBleed={apiOptions.isMobile}
                        responsive={this.props.responsive}
            />;
        }

        // For mobile we combine an image's title and caption.
        if (apiOptions.isMobile) {
            var titleAndCaption;

            if (this.props.title || this.props.caption) {
                let title = this.props.title;

                // Bold the title, and make it the first sentence of the
                // caption.
                if (title) {
                    // We add a period to separate the title from the caption
                    // (if it exists), unless the title already ends with a
                    // punctuation symbol (whitespace ignored). Copied from
                    // webapp: https://github.com/Khan/webapp/blob/6e930637edb65696d0749ea0f7558214aee32b4e/javascript/tutorial-shared-package/components/content-description.jsx#L80
                    // TODO(charlie): Internationalize this check, and the
                    // delimiter that is being inserted.
                    if (this.props.caption && !/[.?!"']\s*$/.test(title)) {
                        title += ".";
                    }

                    title = `**${title}** `;
                }

                const className = classNames({
                    "perseus-image-caption": true,
                    "has-title": !!title,
                });

                // Caption is left-aligned within a container that's centered
                // below the image, with these width constraints:
                //
                // 1. Size caption to width of the image on-screen.
                // 2. ... but constrain its width to a range based on the
                //    device to optimize readability - e.g. [320px, 450px] for
                //    phones.
                // 3. ... unless the image is floated, in which case we don't
                //    want the caption to overflow the image size.
                //
                // TODO(david): If caption is only 1 line long, center-align
                //     the text.
                const alignment = this.props.alignment;
                const isImageFullWidth = (
                    alignment === "block" || alignment === "full-width");

                // This minWidth takes precedence over minWidth applied via
                // Aphrodite.
                const minWidth = isImageFullWidth ? null : '0 !important';

                titleAndCaption = <div className={className}>
                    <div
                        className={css(ImageWidget.styles.caption)}
                        style={{
                            minWidth: minWidth,
                        }}
                    >
                        <div>
                            {title + this.props.caption}
                        </div>
                    </div>
                </div>;
            }

            return <div className="perseus-image-widget">
                {image}
                {titleAndCaption}
            </div>;

        } else {
            var title;
            var caption;

            if (this.props.title) {
                title = <div className="perseus-image-title">
                    {this.props.title}
                </div>;
            }

            if (this.props.caption) {
                caption = <div className="perseus-image-caption">
                    {this.props.caption}
                </div>;
            }

            return <div className="perseus-image-widget">
                {title}
                {image}
                {caption}
            </div>;
        }
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    getUserInput: function() {
        return null;
    },

    simpleValidate: function(rubric) {
        return ImageWidget.validate(this.getUserInput(), rubric);
    },

    focus: () => null,
});

_.extend(ImageWidget, {
    validate: function(state, rubric) {
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null,
        };
    },
});

module.exports = {
    name: "image",
    // This widget's accessibility depends on its contents: if the image has
    // has a background but no alt text, it is not accessible
    accessible: (props) => {
        var bgImage = props.backgroundImage;
        return !(bgImage && bgImage.url && !props.alt);
    },
    defaultAlignment: DEFAULT_ALIGNMENT,
    supportedAlignments: editorAlignments,
    displayName: "Image",
    widget: ImageWidget,
};
