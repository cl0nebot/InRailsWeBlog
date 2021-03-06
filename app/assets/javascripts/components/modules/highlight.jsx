'use strict';

import {
    getDisplayName
} from './common';

import HighlightCode from 'highlight.js/lib/highlight';

import apache from 'highlight.js/lib/languages/apache';
import cpp from 'highlight.js/lib/languages/cpp';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import cmake from 'highlight.js/lib/languages/cmake';
import coffeescript from 'highlight.js/lib/languages/coffeescript';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
// import dart from 'highlight.js/lib/languages/dart';
import diff from 'highlight.js/lib/languages/diff';
import django from 'highlight.js/lib/languages/django';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
// import dust from 'highlight.js/lib/languages/dust';
// import elixir from 'highlight.js/lib/languages/elixir';
import ruby from 'highlight.js/lib/languages/ruby';
import erb from 'highlight.js/lib/languages/erb';
// import erlang from 'highlight.js/lib/languages/erlang';
import excel from 'highlight.js/lib/languages/excel';
// import gradle from 'highlight.js/lib/languages/gradle';
// import groovy from 'highlight.js/lib/languages/groovy';
import haml from 'highlight.js/lib/languages/haml';
import haskell from 'highlight.js/lib/languages/haskell';
import http from 'highlight.js/lib/languages/http';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
// import kotlin from 'highlight.js/lib/languages/kotlin';
import less from 'highlight.js/lib/languages/less';
// import llvm from 'highlight.js/lib/languages/llvm';
// import lua from 'highlight.js/lib/languages/lua';
import makefile from 'highlight.js/lib/languages/makefile';
import perl from 'highlight.js/lib/languages/perl';
import nginx from 'highlight.js/lib/languages/nginx';
import objectivec from 'highlight.js/lib/languages/objectivec';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
// import rust from 'highlight.js/lib/languages/rust';
// import scala from 'highlight.js/lib/languages/scala';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import yaml from 'highlight.js/lib/languages/yaml';
// import tex from 'highlight.js/lib/languages/tex';
import typescript from 'highlight.js/lib/languages/typescript';

HighlightCode.registerLanguage('apache', apache);
HighlightCode.registerLanguage('cpp', cpp);
HighlightCode.registerLanguage('xml', xml);
HighlightCode.registerLanguage('bash', bash);
HighlightCode.registerLanguage('cmake', cmake);
HighlightCode.registerLanguage('coffeescript', coffeescript);
HighlightCode.registerLanguage('css', css);
HighlightCode.registerLanguage('markdown', markdown);
// HighlightCode.registerLanguage('dart', dart);
HighlightCode.registerLanguage('diff', diff);
HighlightCode.registerLanguage('django', django);
HighlightCode.registerLanguage('dockerfile', dockerfile);
// HighlightCode.registerLanguage('dust', dust);
// HighlightCode.registerLanguage('elixir', elixir);
HighlightCode.registerLanguage('ruby', ruby);
HighlightCode.registerLanguage('erb', erb);
// HighlightCode.registerLanguage('erlang', erlang);
HighlightCode.registerLanguage('excel', excel);
// HighlightCode.registerLanguage('gradle', gradle);
// HighlightCode.registerLanguage('groovy', groovy);
HighlightCode.registerLanguage('haml', haml);
HighlightCode.registerLanguage('haskell', haskell);
HighlightCode.registerLanguage('http', http);
HighlightCode.registerLanguage('java', java);
HighlightCode.registerLanguage('javascript', javascript);
HighlightCode.registerLanguage('json', json);
// HighlightCode.registerLanguage('kotlin', kotlin);
HighlightCode.registerLanguage('less', less);
// HighlightCode.registerLanguage('llvm', llvm);
// HighlightCode.registerLanguage('lua', lua);
HighlightCode.registerLanguage('makefile', makefile);
HighlightCode.registerLanguage('perl', perl);
HighlightCode.registerLanguage('nginx', nginx);
HighlightCode.registerLanguage('objectivec', objectivec);
HighlightCode.registerLanguage('php', php);
HighlightCode.registerLanguage('python', python);
// HighlightCode.registerLanguage('rust', rust);
// HighlightCode.registerLanguage('scala', scala);
HighlightCode.registerLanguage('scss', scss);
HighlightCode.registerLanguage('shell', shell);
HighlightCode.registerLanguage('sql', sql);
HighlightCode.registerLanguage('swift', swift);
HighlightCode.registerLanguage('yaml', yaml);
// HighlightCode.registerLanguage('tex', tex);
HighlightCode.registerLanguage('typescript', typescript);

export default function highlight(highlightOnShow = true) {
    return function highlighter(WrappedComponent) {
        return class HighlightComponent extends React.Component {
            static displayName = `HighlightComponent(${getDisplayName(WrappedComponent)})`;

            constructor(props) {
                super(props);

                this._highlightedElements = [];
                this._unmounted = false;
            }

            componentDidMount() {
                HighlightCode.configure({
                    tabReplace: '  ' // 4 spaces
                });

                if (highlightOnShow) {
                    setTimeout(() => this._highlightCode(), 5);
                }
            }

            componentDidUpdate() {
                if (highlightOnShow) {
                    setTimeout(() => this._highlightCode(), 5);
                }
            }

            componentWillUnmount() {
                this._unmounted = true;
            }

            _handleShow = (elementId, force = false) => {
                if (!this._highlightedElements.includes(elementId) || force) {
                    this._highlightedElements.push(elementId);
                    setTimeout(() => this._highlightCode(), 5);
                }
            };

            _highlightCode = () => {
                if (this._unmounted) {
                    return;
                }

                const domNode = ReactDOM.findDOMNode(this);
                const nodes = domNode.querySelectorAll('pre code');
                if (nodes.length > 0) {
                    for (let i = 0; i < nodes.length; i = i + 1) {
                        HighlightCode.highlightBlock(nodes[i]);
                    }
                }
            };

            render() {
                const propsProxy = {
                    ...this.props,
                    onShow: this._handleShow
                };

                return <WrappedComponent {...propsProxy} />;
            }
        }
    }
}
