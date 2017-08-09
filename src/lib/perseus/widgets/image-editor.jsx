/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable no-var, react/jsx-closing-bracket-location, react/sort-comp */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = require("react");
const _ = require("underscore");

const {iconTrash} = require("../icon-paths.js");
const Util        = require("../util.js");

const Changeable    = require("../mixins/changeable");
const EditorJsonify = require("../mixins/editor-jsonify");

const UrlInput     = require("../../../components/UrlInput").default;
const Editor       = require("../editor-stub");
const InfoTip      = require("../components/info-tip");
const InlineIcon   = require("../components/inline-icon");

const defaultBoxSize = 400;
const defaultRange = [0, 10];
const defaultBackgroundImage = {
    url: null,
    width: 0,
    height: 0,
};

// Match any image URL (including "web+graphie" links) that is hosted by KA.
// We're somewhat generous in our AWS URL matching
// ("ka-<something>.s3.amazonaws.com") so that we don't have to update Perseus
// every time we add a new proxied AWS bucket.
const INTERNALLY_HOSTED_DOMAINS = "(" +
    "ka-.*\.s3\.amazonaws\.com|" +
    "(fastly|cdn)\.kastatic\.org|" +
    "khanacademy\.org|" +
    "kasandbox\.org" +
")";
const INTERNALLY_HOSTED_URL_RE = new RegExp(
    "^(https?|web\\+graphie)://[^/]*" + INTERNALLY_HOSTED_DOMAINS);

/**
 * Alignment option for captions, relative to specified coordinates.
 */
var captionAlignments = [
    "center",
    "above",
    "above right",
    "right",
    "below right",
    "below",
    "below left",
    "left",
    "above left",
];

function blankLabel() {
    return {
        content: "",
        coordinates: [0, 0],
        alignment: "center",
    };
}

const ImageEditor = React.createClass({
    propTypes: {
        ...Changeable.propTypes,
    },

    componentDidMount: function() {
        // defer this because it can call a change handler synchronously
        _.defer(() => {
            var url = this.props.backgroundImage.url;
            this.onUrlChange(url, true);
        });
        this._isMounted = true;
    },

    componentWillUnmount: function() {
        this._isMounted = false;
    },

    getDefaultProps: function() {
        return {
            title: "",
            range: [defaultRange, defaultRange],
            box: [defaultBoxSize, defaultBoxSize],
            backgroundImage: defaultBackgroundImage,
            labels: [],
            alt: "",
            caption: "",
        };
    },

    getInitialState: function() {
        return {
            backgroundImageError: "",
        };
    },

    render: function() {
        var backgroundImage = this.props.backgroundImage;

        var imageSettings = <div className="image-settings">
            <div>
                <label>
                    <div>
                        Alt text:
                        <InfoTip>
                            This is important for screenreaders.
                            The content of this alt text will be
                            formatted as markdown (tables, emphasis,
                            etc. are supported).
                        </InfoTip>
                    </div>
                    <Editor
                        apiOptions={this.props.apiOptions}
                        content={this.props.alt}
                        onChange={(props) => {
                            if (props.content != null) {
                                this.change("alt", props.content);
                            }
                        }}
                        widgetEnabled={false}
                    />
                </label>
            </div>
            <div>
                <label>
                    <div>Caption:</div>
                    <Editor
                        apiOptions={this.props.apiOptions}
                        content={this.props.caption}
                        onChange={(props) => {
                            if (props.content != null) {
                                this.change("caption", props.content);
                            }
                        }}
                        widgetEnabled={false}
                    />
                </label>
            </div>
        </div>;

        var advancedSettings = <div className="graph-settings">
            <div>
                <label>
                    <div>
                        Title:
                        <InfoTip>Appears above the image.</InfoTip>
                    </div>
                    <Editor
                        apiOptions={this.props.apiOptions}
                        content={this.props.title}
                        onChange={(props) => {
                            if (props.content != null) {
                                this.change("title", props.content);
                            }
                        }}
                        widgetEnabled={false}
                    />
                </label>
            </div>
        </div>;

        var backgroundImageErrorText = <div className='renderer-widget-error'>
            {this.state.backgroundImageError}
        </div>;

        return <div className="perseus-image-editor">
            <label>
                Image url:
                <InfoTip>Paste an image or graphie image URL.</InfoTip>
                {this.state.backgroundImageError && backgroundImageErrorText}

                <UrlInput
                    autoFocus={true}
                    value={backgroundImage.url || ''}
                    style={{width: 332}}
                    onChange={url => this.onUrlChange(url, false)} />
            </label>

            {backgroundImage.url && imageSettings}
            {backgroundImage.url && advancedSettings}
        </div>;
    },

    change(...args) {
        return Changeable.change.apply(this, args);
    },

    addLabel: function(e) {
        e.preventDefault();
        var labels = this.props.labels.slice();
        var label = blankLabel();
        labels.push(label);
        this.props.onChange({
            labels: labels,
        });
    },

    removeLabel: function(labelIndex, e) {
        e.preventDefault();
        var labels = _(this.props.labels).clone();
        labels.splice(labelIndex, 1);
        this.props.onChange({labels: labels});
    },

    onCoordinateChange: function(labelIndex, newCoordinates) {
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            coordinates: newCoordinates,
        });
        this.props.onChange({labels: labels});
    },

    onContentChange: function(labelIndex, e) {
        var newContent = e.target.value;
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            content: newContent,
        });
        this.props.onChange({labels: labels});
    },

    onAlignmentChange: function(labelIndex, e) {
        var newAlignment = e.target.value;
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            alignment: newAlignment,
        });
        this.props.onChange({labels: labels});
    },

    setUrl: function(url, width, height, silent) {
        // Because this calls into WidgetEditor._handleWidgetChange, which
        // checks for this widget's ref to serialize it.
        //
        // Errors if you switch items before the `Image` from `onUrlChange`
        // loads.
        if (!this._isMounted) {
            return;
        }

        var image = _.clone(this.props.backgroundImage);
        image.url = url;
        image.width = width;
        image.height = height;
        var box = [image.width, image.height];
        this.props.onChange({
            backgroundImage: image,
            box: box,
        },
            null,
            silent
        );
    },

    // silently load the image when the component mounts
    // silently update url and sizes when the image loads
    // noisily load the image in response to the author changing it
    onUrlChange: function(url, silent) {
        // All article content must be KA-owned!
        // NOTE(aria): This restriction is removed for Artemis because
        // we can't rehost images yet. Also we're not KA
        if (false && !INTERNALLY_HOSTED_URL_RE.test(url)) {
            this.setState({
                backgroundImageError: (
                    'Images must be from sites hosted by Khan Academy. ' +
                    'Please input a Khan Academy-owned address, or use the ' +
                    'Add Image tool to rehost an existing image'),
            });
            return;
        } else {
            this.setState({backgroundImageError: ""});
        }

        // We update our background image prop after the image loads below. To
        // avoid weirdness when we change to a very slow URL, then a much
        // faster URL, we keep track of the URL we're trying to change to.
        this._leadingUrl = url;

        if (!url) {
            this.setUrl(url, 0, 0, silent);
            return;
        }

        Util.getImageSize(
            url,
            (width, height) => {
                if (this._leadingUrl !== url) {
                    return;
                }

                this.setUrl(url, width, height, true);
            });
    },

    onRangeChange: function(type, newRange) {
        var range = this.props.range.slice();
        range[type] = newRange;
        this.props.onChange({range: range});
    },

    getSaveWarnings: function() {
        var warnings = [];

        if (this.props.backgroundImage.url && !this.props.alt) {
            warnings.push("No alt text");
        }

        return warnings;
    },

    serialize() {
        return EditorJsonify.serialize.call(this);
    },
});

module.exports = ImageEditor;
