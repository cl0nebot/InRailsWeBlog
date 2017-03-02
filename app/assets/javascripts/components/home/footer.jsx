'use strict';

// import {Link} from 'react-router';

const HomeFooter = ({}) => (
    <div className="footer blog-footer">
        <div className="container">
            <div className="row">
                <div className="col l6 s12">
                    <h5 className="white-text">
                        {I18n.t('js.footer.title')}
                    </h5>

                    <p className="grey-text text-lighten-4">
                        {I18n.t('js.footer.description')}
                    </p>
                </div>

                <div className="col l4 offset-l2 s12">
                    <h5 className="white-text">
                        {I18n.t('js.footer.links.title')}
                    </h5>

                    <ul>
                        <li>
                            <a className="grey-text text-lighten-3"
                               href="#">
                                {I18n.t('js.footer.links.about')}
                            </a>
                            <a className="grey-text text-lighten-3"
                               href="#">
                                {I18n.t('js.footer.links.support')}
                            </a>
                            <a className="grey-text text-lighten-3"
                               href={"mailto:" + window.parameters.website_email}>
                                {I18n.t('js.footer.links.contact')}
                            </a>
                        </li>

                    </ul>
                </div>

                <div className="footer-copyright">
                    <div className="container">
                        &copy; {I18n.t('js.footer.copyright')}
                        <a className="grey-text text-lighten-4 right"
                           href={I18n.t('js.footer.links.github_src')}>
                            {I18n.t('js.footer.links.github')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HomeFooter;
