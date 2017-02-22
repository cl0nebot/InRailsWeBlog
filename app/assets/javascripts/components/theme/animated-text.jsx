'use strict';

const AnimatedText = ({title, subtitle}) => (
    <section className="card-title cd-intro center-align">
        <div className="cd-intro-content mask">
            <h1 data-content={title}>
                <span>
                    {title}
                </span>
            </h1>
            <div className="action-wrapper hide-on-small-and-down">
                <h2>
                    {subtitle}
                </h2>
            </div>
        </div>
    </section>
);

AnimatedText.propTypes = {
    title: React.PropTypes.string.isRequired,
    subtitle: React.PropTypes.string
};

AnimatedText.defaultProps = {
    subtitle: null
};

module.exports = AnimatedText;
