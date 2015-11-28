/**
 * Super simple wysiwyg editor v0.7.0
 * http://summernote.org/
 *
 * summernote.js
 * Copyright 2013-2015 Alan Hong. and other contributors
 * summernote may be freely distributed under the MIT license./
 *
 * Date: 2015-11-13T01:45Z
 */
(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], function ($) {
            return (root.returnExportsGlobal = factory($));
        });
    } else {
        // Global Variables
        root.returnExportsGlobal = factory(root.$);
    }
}(this, function ($) {
    'use strict';


    /**
     * @class core.func
     *
     * func utils (for high-order func's arg)
     *
     * @singleton
     * @alternateClassName func
     */
    var func = (function () {
        var eq = function (itemA) {
            return function (itemB) {
                return itemA === itemB;
            };
        };

        var eq2 = function (itemA, itemB) {
            return itemA === itemB;
        };

        var peq2 = function (propName) {
            return function (itemA, itemB) {
                return itemA[propName] === itemB[propName];
            };
        };

        var ok = function () {
            return true;
        };

        var fail = function () {
            return false;
        };

        var not = function (f) {
            return function () {
                return !f.apply(f, arguments);
            };
        };

        var and = function (fA, fB) {
            return function (item) {
                return fA(item) && fB(item);
            };
        };

        var self = function (a) {
            return a;
        };

        var idCounter = 0;

        /**
         * generate a globally-unique id
         *
         * @param {String} [prefix]
         */
        var uniqueId = function (prefix) {
            var id = ++idCounter + '';
            return prefix ? prefix + id : id;
        };

        /**
         * returns bnd (bounds) from rect
         *
         * - IE Compatability Issue: http://goo.gl/sRLOAo
         * - Scroll Issue: http://goo.gl/sNjUc
         *
         * @param {Rect} rect
         * @return {Object} bounds
         * @return {Number} bounds.top
         * @return {Number} bounds.left
         * @return {Number} bounds.width
         * @return {Number} bounds.height
         */
        var rect2bnd = function (rect) {
            var $document = $(document);
            return {
                top: rect.top + $document.scrollTop(),
                left: rect.left + $document.scrollLeft(),
                width: rect.right - rect.left,
                height: rect.bottom - rect.top
            };
        };

        /**
         * returns a copy of the object where the keys have become the values and the values the keys.
         * @param {Object} obj
         * @return {Object}
         */
        var invertObject = function (obj) {
            var inverted = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    inverted[obj[key]] = key;
                }
            }
            return inverted;
        };

        /**
         * @param {String} namespace
         * @param {String} [prefix]
         * @return {String}
         */
        var namespaceToCamel = function (namespace, prefix) {
            prefix = prefix || '';
            return prefix + namespace.split('.').map(function (name) {
                    return name.substring(0, 1).toUpperCase() + name.substring(1);
                }).join('');
        };

        return {
            eq: eq,
            eq2: eq2,
            peq2: peq2,
            ok: ok,
            fail: fail,
            self: self,
            not: not,
            and: and,
            uniqueId: uniqueId,
            rect2bnd: rect2bnd,
            invertObject: invertObject,
            namespaceToCamel: namespaceToCamel
        };
    })();

    /**
     * @class core.list
     *
     * list utils
     *
     * @singleton
     * @alternateClassName list
     */
    var list = (function () {
        /**
         * returns the first item of an array.
         *
         * @param {Array} array
         */
        var head = function (array) {
            return array[0];
        };

        /**
         * returns the last item of an array.
         *
         * @param {Array} array
         */
        var last = function (array) {
            return array[array.length - 1];
        };

        /**
         * returns everything but the last entry of the array.
         *
         * @param {Array} array
         */
        var initial = function (array) {
            return array.slice(0, array.length - 1);
        };

        /**
         * returns the rest of the items in an array.
         *
         * @param {Array} array
         */
        var tail = function (array) {
            return array.slice(1);
        };

        /**
         * returns item of array
         */
        var find = function (array, pred) {
            for (var idx = 0, len = array.length; idx < len; idx++) {
                var item = array[idx];
                if (pred(item)) {
                    return item;
                }
            }
        };

        /**
         * returns true if all of the values in the array pass the predicate truth test.
         */
        var all = function (array, pred) {
            for (var idx = 0, len = array.length; idx < len; idx++) {
                if (!pred(array[idx])) {
                    return false;
                }
            }
            return true;
        };

        /**
         * returns index of item
         */
        var indexOf = function (array, item) {
            return $.inArray(item, array);
        };

        /**
         * returns true if the value is present in the list.
         */
        var contains = function (array, item) {
            return indexOf(array, item) !== -1;
        };

        /**
         * get sum from a list
         *
         * @param {Array} array - array
         * @param {Function} fn - iterator
         */
        var sum = function (array, fn) {
            fn = fn || func.self;
            return array.reduce(function (memo, v) {
                return memo + fn(v);
            }, 0);
        };

        /**
         * returns a copy of the collection with array type.
         * @param {Collection} collection - collection eg) node.childNodes, ...
         */
        var from = function (collection) {
            var result = [], idx = -1, length = collection.length;
            while (++idx < length) {
                result[idx] = collection[idx];
            }
            return result;
        };

        /**
         * returns whether list is empty or not
         */
        var isEmpty = function (array) {
            return !array || !array.length;
        };

        /**
         * cluster elements by predicate function.
         *
         * @param {Array} array - array
         * @param {Function} fn - predicate function for cluster rule
         * @param {Array[]}
         */
        var clusterBy = function (array, fn) {
            if (!array.length) {
                return [];
            }
            var aTail = tail(array);
            return aTail.reduce(function (memo, v) {
                var aLast = last(memo);
                if (fn(last(aLast), v)) {
                    aLast[aLast.length] = v;
                } else {
                    memo[memo.length] = [v];
                }
                return memo;
            }, [[head(array)]]);
        };

        /**
         * returns a copy of the array with all falsy values removed
         *
         * @param {Array} array - array
         * @param {Function} fn - predicate function for cluster rule
         */
        var compact = function (array) {
            var aResult = [];
            for (var idx = 0, len = array.length; idx < len; idx++) {
                if (array[idx]) {
                    aResult.push(array[idx]);
                }
            }
            return aResult;
        };

        /**
         * produces a duplicate-free version of the array
         *
         * @param {Array} array
         */
        var unique = function (array) {
            var results = [];

            for (var idx = 0, len = array.length; idx < len; idx++) {
                if (!contains(results, array[idx])) {
                    results.push(array[idx]);
                }
            }

            return results;
        };

        /**
         * returns next item.
         * @param {Array} array
         */
        var next = function (array, item) {
            var idx = indexOf(array, item);
            if (idx === -1) {
                return null;
            }

            return array[idx + 1];
        };

        /**
         * returns prev item.
         * @param {Array} array
         */
        var prev = function (array, item) {
            var idx = indexOf(array, item);
            if (idx === -1) {
                return null;
            }

            return array[idx - 1];
        };

        return {
            head: head, last: last, initial: initial, tail: tail,
            prev: prev, next: next, find: find, contains: contains,
            all: all, sum: sum, from: from, isEmpty: isEmpty,
            clusterBy: clusterBy, compact: compact, unique: unique
        };
    })();

    var isSupportAmd = typeof define === 'function' && define.amd;

    /**
     * returns whether font is installed or not.
     *
     * @param {String} fontName
     * @return {Boolean}
     */
    var isFontInstalled = function (fontName) {
        var testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
        var $tester = $('<div>').css({
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            fontSize: '200px'
        }).text('mmmmmmmmmwwwwwww').appendTo(document.body);

        var originalWidth = $tester.css('fontFamily', testFontName).width();
        var width = $tester.css('fontFamily', fontName + ',' + testFontName).width();

        $tester.remove();

        return originalWidth !== width;
    };

    var userAgent = navigator.userAgent;
    var isMSIE = /MSIE|Trident/i.test(userAgent);
    var browserVersion;
    if (isMSIE) {
        var matches = /MSIE (\d+[.]\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = parseFloat(matches[1]);
        }
        matches = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(userAgent);
        if (matches) {
            browserVersion = parseFloat(matches[1]);
        }
    }

    /**
     * @class core.agent
     *
     * Object which check platform and agent
     *
     * @singleton
     * @alternateClassName agent
     */
    var agent = {
        isMac: navigator.appVersion.indexOf('Mac') > -1,
        isMSIE: isMSIE,
        isFF: /firefox/i.test(userAgent),
        isWebkit: /webkit/i.test(userAgent),
        isSafari: /safari/i.test(userAgent),
        browserVersion: browserVersion,
        jqueryVersion: parseFloat($.fn.jquery),
        isSupportAmd: isSupportAmd,
        hasCodeMirror: isSupportAmd ? require.cache[require.resolveWeak('codemirror')] : !!window.CodeMirror,
        isFontInstalled: isFontInstalled,
        isW3CRangeSupport: !!document.createRange
    };


    var NBSP_CHAR = String.fromCharCode(160);
    var ZERO_WIDTH_NBSP_CHAR = '\ufeff';

    /**
     * @class core.dom
     *
     * Dom functions
     *
     * @singleton
     * @alternateClassName dom
     */
    var dom = (function () {
        /**
         * @method isEditable
         *
         * returns whether node is `note-editable` or not.
         *
         * @param {Node} node
         * @return {Boolean}
         */
        var isEditable = function (node) {
            return node && $(node).hasClass('note-editable');
        };

        /**
         * @method isControlSizing
         *
         * returns whether node is `note-control-sizing` or not.
         *
         * @param {Node} node
         * @return {Boolean}
         */
        var isControlSizing = function (node) {
            return node && $(node).hasClass('note-control-sizing');
        };

        /**
         * @method makePredByNodeName
         *
         * returns predicate which judge whether nodeName is same
         *
         * @param {String} nodeName
         * @return {Function}
         */
        var makePredByNodeName = function (nodeName) {
            nodeName = nodeName.toUpperCase();
            return function (node) {
                return node && node.nodeName.toUpperCase() === nodeName;
            };
        };

        /**
         * @method isText
         *
         *
         *
         * @param {Node} node
         * @return {Boolean} true if node's type is text(3)
         */
        var isText = function (node) {
            return node && node.nodeType === 3;
        };

        /**
         * @method isElement
         *
         *
         *
         * @param {Node} node
         * @return {Boolean} true if node's type is element(1)
         */
        var isElement = function (node) {
            return node && node.nodeType === 1;
        };

        /**
         * ex) br, col, embed, hr, img, input, ...
         * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
         */
        var isVoid = function (node) {
            return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON/.test(node.nodeName.toUpperCase());
        };

        var isPara = function (node) {
            if (isEditable(node)) {
                return false;
            }

            // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
            return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
        };

        var isHeading = function (node) {
            return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
        };

        var isLi = makePredByNodeName('LI');

        var isPurePara = function (node) {
            return isPara(node) && !isLi(node);
        };

        var isTable = makePredByNodeName('TABLE');

        var isInline = function (node) {
            return !isBodyContainer(node) && !isList(node) && !isHr(node) && !isPara(node) && !isTable(node) && !isBlockquote(node);
        };

        var isList = function (node) {
            return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
        };

        var isHr = makePredByNodeName('HR');

        var isCell = function (node) {
            return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
        };

        var isBlockquote = makePredByNodeName('BLOCKQUOTE');

        var isBodyContainer = function (node) {
            return isCell(node) || isBlockquote(node) || isEditable(node);
        };

        var isAnchor = makePredByNodeName('A');

        var isParaInline = function (node) {
            return isInline(node) && !!ancestor(node, isPara);
        };

        var isBodyInline = function (node) {
            return isInline(node) && !ancestor(node, isPara);
        };

        var isBody = makePredByNodeName('BODY');

        /**
         * returns whether nodeB is closest sibling of nodeA
         *
         * @param {Node} nodeA
         * @param {Node} nodeB
         * @return {Boolean}
         */
        var isClosestSibling = function (nodeA, nodeB) {
            return nodeA.nextSibling === nodeB ||
                nodeA.previousSibling === nodeB;
        };

        /**
         * returns array of closest siblings with node
         *
         * @param {Node} node
         * @param {function} [pred] - predicate function
         * @return {Node[]}
         */
        var withClosestSiblings = function (node, pred) {
            pred = pred || func.ok;

            var siblings = [];
            if (node.previousSibling && pred(node.previousSibling)) {
                siblings.push(node.previousSibling);
            }
            siblings.push(node);
            if (node.nextSibling && pred(node.nextSibling)) {
                siblings.push(node.nextSibling);
            }
            return siblings;
        };

        /**
         * blank HTML for cursor position
         * - [workaround] old IE only works with &nbsp;
         * - [workaround] IE11 and other browser works with bogus br
         */
        var blankHTML = agent.isMSIE && agent.browserVersion < 11 ? '&nbsp;' : '<br>';

        /**
         * @method nodeLength
         *
         * returns #text's text size or element's childNodes size
         *
         * @param {Node} node
         */
        var nodeLength = function (node) {
            if (isText(node)) {
                return node.nodeValue.length;
            }

            return node.childNodes.length;
        };

        /**
         * returns whether node is empty or not.
         *
         * @param {Node} node
         * @return {Boolean}
         */
        var isEmpty = function (node) {
            var len = nodeLength(node);

            if (len === 0) {
                return true;
            } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
                // ex) <p><br></p>, <span><br></span>
                return true;
            } else if (list.all(node.childNodes, isText) && node.innerHTML === '') {
                // ex) <p></p>, <span></span>
                return true;
            }

            return false;
        };

        /**
         * padding blankHTML if node is empty (for cursor position)
         */
        var paddingBlankHTML = function (node) {
            if (!isVoid(node) && !nodeLength(node)) {
                node.innerHTML = blankHTML;
            }
        };

        /**
         * find nearest ancestor predicate hit
         *
         * @param {Node} node
         * @param {Function} pred - predicate function
         */
        var ancestor = function (node, pred) {
            while (node) {
                if (pred(node)) {
                    return node;
                }
                if (isEditable(node)) {
                    break;
                }

                node = node.parentNode;
            }
            return null;
        };

        /**
         * find nearest ancestor only single child blood line and predicate hit
         *
         * @param {Node} node
         * @param {Function} pred - predicate function
         */
        var singleChildAncestor = function (node, pred) {
            node = node.parentNode;

            while (node) {
                if (nodeLength(node) !== 1) {
                    break;
                }
                if (pred(node)) {
                    return node;
                }
                if (isEditable(node)) {
                    break;
                }

                node = node.parentNode;
            }
            return null;
        };

        /**
         * returns new array of ancestor nodes (until predicate hit).
         *
         * @param {Node} node
         * @param {Function} [optional] pred - predicate function
         */
        var listAncestor = function (node, pred) {
            pred = pred || func.fail;

            var ancestors = [];
            ancestor(node, function (el) {
                if (!isEditable(el)) {
                    ancestors.push(el);
                }

                return pred(el);
            });
            return ancestors;
        };

        /**
         * find farthest ancestor predicate hit
         */
        var lastAncestor = function (node, pred) {
            var ancestors = listAncestor(node);
            return list.last(ancestors.filter(pred));
        };

        /**
         * returns common ancestor node between two nodes.
         *
         * @param {Node} nodeA
         * @param {Node} nodeB
         */
        var commonAncestor = function (nodeA, nodeB) {
            var ancestors = listAncestor(nodeA);
            for (var n = nodeB; n; n = n.parentNode) {
                if ($.inArray(n, ancestors) > -1) {
                    return n;
                }
            }
            return null; // difference document area
        };

        /**
         * listing all previous siblings (until predicate hit).
         *
         * @param {Node} node
         * @param {Function} [optional] pred - predicate function
         */
        var listPrev = function (node, pred) {
            pred = pred || func.fail;

            var nodes = [];
            while (node) {
                if (pred(node)) {
                    break;
                }
                nodes.push(node);
                node = node.previousSibling;
            }
            return nodes;
        };

        /**
         * listing next siblings (until predicate hit).
         *
         * @param {Node} node
         * @param {Function} [pred] - predicate function
         */
        var listNext = function (node, pred) {
            pred = pred || func.fail;

            var nodes = [];
            while (node) {
                if (pred(node)) {
                    break;
                }
                nodes.push(node);
                node = node.nextSibling;
            }
            return nodes;
        };

        /**
         * listing descendant nodes
         *
         * @param {Node} node
         * @param {Function} [pred] - predicate function
         */
        var listDescendant = function (node, pred) {
            var descendents = [];
            pred = pred || func.ok;

            // start DFS(depth first search) with node
            (function fnWalk(current) {
                if (node !== current && pred(current)) {
                    descendents.push(current);
                }
                for (var idx = 0, len = current.childNodes.length; idx < len; idx++) {
                    fnWalk(current.childNodes[idx]);
                }
            })(node);

            return descendents;
        };

        /**
         * wrap node with new tag.
         *
         * @param {Node} node
         * @param {Node} tagName of wrapper
         * @return {Node} - wrapper
         */
        var wrap = function (node, wrapperName) {
            var parent = node.parentNode;
            var wrapper = $('<' + wrapperName + '>')[0];

            parent.insertBefore(wrapper, node);
            wrapper.appendChild(node);

            return wrapper;
        };

        /**
         * insert node after preceding
         *
         * @param {Node} node
         * @param {Node} preceding - predicate function
         */
        var insertAfter = function (node, preceding) {
            var next = preceding.nextSibling, parent = preceding.parentNode;
            if (next) {
                parent.insertBefore(node, next);
            } else {
                parent.appendChild(node);
            }
            return node;
        };

        /**
         * append elements.
         *
         * @param {Node} node
         * @param {Collection} aChild
         */
        var appendChildNodes = function (node, aChild) {
            $.each(aChild, function (idx, child) {
                node.appendChild(child);
            });
            return node;
        };

        /**
         * returns whether boundaryPoint is left edge or not.
         *
         * @param {BoundaryPoint} point
         * @return {Boolean}
         */
        var isLeftEdgePoint = function (point) {
            return point.offset === 0;
        };

        /**
         * returns whether boundaryPoint is right edge or not.
         *
         * @param {BoundaryPoint} point
         * @return {Boolean}
         */
        var isRightEdgePoint = function (point) {
            return point.offset === nodeLength(point.node);
        };

        /**
         * returns whether boundaryPoint is edge or not.
         *
         * @param {BoundaryPoint} point
         * @return {Boolean}
         */
        var isEdgePoint = function (point) {
            return isLeftEdgePoint(point) || isRightEdgePoint(point);
        };

        /**
         * returns wheter node is left edge of ancestor or not.
         *
         * @param {Node} node
         * @param {Node} ancestor
         * @return {Boolean}
         */
        var isLeftEdgeOf = function (node, ancestor) {
            while (node && node !== ancestor) {
                if (position(node) !== 0) {
                    return false;
                }
                node = node.parentNode;
            }

            return true;
        };

        /**
         * returns whether node is right edge of ancestor or not.
         *
         * @param {Node} node
         * @param {Node} ancestor
         * @return {Boolean}
         */
        var isRightEdgeOf = function (node, ancestor) {
            while (node && node !== ancestor) {
                if (position(node) !== nodeLength(node.parentNode) - 1) {
                    return false;
                }
                node = node.parentNode;
            }

            return true;
        };

        /**
         * returns whether point is left edge of ancestor or not.
         * @param {BoundaryPoint} point
         * @param {Node} ancestor
         * @return {Boolean}
         */
        var isLeftEdgePointOf = function (point, ancestor) {
            return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
        };

        /**
         * returns whether point is right edge of ancestor or not.
         * @param {BoundaryPoint} point
         * @param {Node} ancestor
         * @return {Boolean}
         */
        var isRightEdgePointOf = function (point, ancestor) {
            return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
        };

        /**
         * returns offset from parent.
         *
         * @param {Node} node
         */
        var position = function (node) {
            var offset = 0;
            while ((node = node.previousSibling)) {
                offset += 1;
            }
            return offset;
        };

        var hasChildren = function (node) {
            return !!(node && node.childNodes && node.childNodes.length);
        };

        /**
         * returns previous boundaryPoint
         *
         * @param {BoundaryPoint} point
         * @param {Boolean} isSkipInnerOffset
         * @return {BoundaryPoint}
         */
        var prevPoint = function (point, isSkipInnerOffset) {
            var node, offset;

            if (point.offset === 0) {
                if (isEditable(point.node)) {
                    return null;
                }

                node = point.node.parentNode;
                offset = position(point.node);
            } else if (hasChildren(point.node)) {
                node = point.node.childNodes[point.offset - 1];
                offset = nodeLength(node);
            } else {
                node = point.node;
                offset = isSkipInnerOffset ? 0 : point.offset - 1;
            }

            return {
                node: node,
                offset: offset
            };
        };

        /**
         * returns next boundaryPoint
         *
         * @param {BoundaryPoint} point
         * @param {Boolean} isSkipInnerOffset
         * @return {BoundaryPoint}
         */
        var nextPoint = function (point, isSkipInnerOffset) {
            var node, offset;

            if (nodeLength(point.node) === point.offset) {
                if (isEditable(point.node)) {
                    return null;
                }

                node = point.node.parentNode;
                offset = position(point.node) + 1;
            } else if (hasChildren(point.node)) {
                node = point.node.childNodes[point.offset];
                offset = 0;
            } else {
                node = point.node;
                offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
            }

            return {
                node: node,
                offset: offset
            };
        };

        /**
         * returns whether pointA and pointB is same or not.
         *
         * @param {BoundaryPoint} pointA
         * @param {BoundaryPoint} pointB
         * @return {Boolean}
         */
        var isSamePoint = function (pointA, pointB) {
            return pointA.node === pointB.node && pointA.offset === pointB.offset;
        };

        /**
         * returns whether point is visible (can set cursor) or not.
         *
         * @param {BoundaryPoint} point
         * @return {Boolean}
         */
        var isVisiblePoint = function (point) {
            if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) {
                return true;
            }

            var leftNode = point.node.childNodes[point.offset - 1];
            var rightNode = point.node.childNodes[point.offset];
            if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
                return true;
            }

            return false;
        };

        /**
         * @method prevPointUtil
         *
         * @param {BoundaryPoint} point
         * @param {Function} pred
         * @return {BoundaryPoint}
         */
        var prevPointUntil = function (point, pred) {
            while (point) {
                if (pred(point)) {
                    return point;
                }

                point = prevPoint(point);
            }

            return null;
        };

        /**
         * @method nextPointUntil
         *
         * @param {BoundaryPoint} point
         * @param {Function} pred
         * @return {BoundaryPoint}
         */
        var nextPointUntil = function (point, pred) {
            while (point) {
                if (pred(point)) {
                    return point;
                }

                point = nextPoint(point);
            }

            return null;
        };

        /**
         * returns whether point has character or not.
         *
         * @param {Point} point
         * @return {Boolean}
         */
        var isCharPoint = function (point) {
            if (!isText(point.node)) {
                return false;
            }

            var ch = point.node.nodeValue.charAt(point.offset - 1);
            return ch && (ch !== ' ' && ch !== NBSP_CHAR);
        };

        /**
         * @method walkPoint
         *
         * @param {BoundaryPoint} startPoint
         * @param {BoundaryPoint} endPoint
         * @param {Function} handler
         * @param {Boolean} isSkipInnerOffset
         */
        var walkPoint = function (startPoint, endPoint, handler, isSkipInnerOffset) {
            var point = startPoint;

            while (point) {
                handler(point);

                if (isSamePoint(point, endPoint)) {
                    break;
                }

                var isSkipOffset = isSkipInnerOffset &&
                    startPoint.node !== point.node &&
                    endPoint.node !== point.node;
                point = nextPoint(point, isSkipOffset);
            }
        };

        /**
         * @method makeOffsetPath
         *
         * return offsetPath(array of offset) from ancestor
         *
         * @param {Node} ancestor - ancestor node
         * @param {Node} node
         */
        var makeOffsetPath = function (ancestor, node) {
            var ancestors = listAncestor(node, func.eq(ancestor));
            return ancestors.map(position).reverse();
        };

        /**
         * @method fromOffsetPath
         *
         * return element from offsetPath(array of offset)
         *
         * @param {Node} ancestor - ancestor node
         * @param {array} offsets - offsetPath
         */
        var fromOffsetPath = function (ancestor, offsets) {
            if (!ancestor) {
                return;
            }

            var current = ancestor;
            for (var i = 0, len = offsets.length; i < len; i++) {
                if (current.childNodes.length <= offsets[i]) {
                    current = current.childNodes[current.childNodes.length - 1];
                } else {
                    current = current.childNodes[offsets[i]];
                }
                if (!current) {
                    return ancestor;
                }
            }
            return current;
        };

        /**
         * @method splitNode
         *
         * split element or #text
         *
         * @param {BoundaryPoint} point
         * @param {Object} [options]
         * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
         * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
         * @return {Node} right node of boundaryPoint
         */
        var splitNode = function (point, options) {
            var isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
            var isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;

            // edge case
            if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
                if (isLeftEdgePoint(point)) {
                    return point.node;
                } else if (isRightEdgePoint(point)) {
                    return point.node.nextSibling;
                }
            }

            // split #text
            if (isText(point.node)) {
                return point.node.splitText(point.offset);
            } else {
                var childNode = point.node.childNodes[point.offset];
                var clone = insertAfter(point.node.cloneNode(false), point.node);
                appendChildNodes(clone, listNext(childNode));

                if (!isSkipPaddingBlankHTML) {
                    paddingBlankHTML(point.node);
                    paddingBlankHTML(clone);
                }

                return clone;
            }
        };

        /**
         * @method splitTree
         *
         * split tree by point
         *
         * @param {Node} root - split root
         * @param {BoundaryPoint} point
         * @param {Object} [options]
         * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
         * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
         * @return {Node} right node of boundaryPoint
         */
        var splitTree = function (root, point, options) {
            // ex) [#text, <span>, <p>]
            var ancestors = listAncestor(point.node, func.eq(root));

            if (!ancestors.length) {
                return null;
            } else if (ancestors.length === 1) {
                return splitNode(point, options);
            }

            return ancestors.reduce(function (node, parent) {
                if (node === point.node) {
                    node = splitNode(point, options);
                }

                return splitNode({
                    node: parent,
                    offset: node ? dom.position(node) : nodeLength(parent)
                }, options);
            });
        };

        /**
         * split point
         *
         * @param {Point} point
         * @param {Boolean} isInline
         * @return {Object}
         */
        var splitPoint = function (point, isInline) {
            // find splitRoot, container
            //  - inline: splitRoot is a child of paragraph
            //  - block: splitRoot is a child of bodyContainer
            var pred = isInline ? isPara : isBodyContainer;
            var ancestors = listAncestor(point.node, pred);
            var topAncestor = list.last(ancestors) || point.node;

            var splitRoot, container;
            if (pred(topAncestor)) {
                splitRoot = ancestors[ancestors.length - 2];
                container = topAncestor;
            } else {
                splitRoot = topAncestor;
                container = splitRoot.parentNode;
            }

            // if splitRoot is exists, split with splitTree
            var pivot = splitRoot && splitTree(splitRoot, point, {
                    isSkipPaddingBlankHTML: isInline,
                    isNotSplitEdgePoint: isInline
                });

            // if container is point.node, find pivot with point.offset
            if (!pivot && container === point.node) {
                pivot = point.node.childNodes[point.offset];
            }

            return {
                rightNode: pivot,
                container: container
            };
        };

        var create = function (nodeName) {
            return document.createElement(nodeName);
        };

        var createText = function (text) {
            return document.createTextNode(text);
        };

        /**
         * @method remove
         *
         * remove node, (isRemoveChild: remove child or not)
         *
         * @param {Node} node
         * @param {Boolean} isRemoveChild
         */
        var remove = function (node, isRemoveChild) {
            if (!node || !node.parentNode) {
                return;
            }
            if (node.removeNode) {
                return node.removeNode(isRemoveChild);
            }

            var parent = node.parentNode;
            if (!isRemoveChild) {
                var nodes = [];
                var i, len;
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    nodes.push(node.childNodes[i]);
                }

                for (i = 0, len = nodes.length; i < len; i++) {
                    parent.insertBefore(nodes[i], node);
                }
            }

            parent.removeChild(node);
        };

        /**
         * @method removeWhile
         *
         * @param {Node} node
         * @param {Function} pred
         */
        var removeWhile = function (node, pred) {
            while (node) {
                if (isEditable(node) || !pred(node)) {
                    break;
                }

                var parent = node.parentNode;
                remove(node);
                node = parent;
            }
        };

        /**
         * @method replace
         *
         * replace node with provided nodeName
         *
         * @param {Node} node
         * @param {String} nodeName
         * @return {Node} - new node
         */
        var replace = function (node, nodeName) {
            if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
                return node;
            }

            var newNode = create(nodeName);

            if (node.style.cssText) {
                newNode.style.cssText = node.style.cssText;
            }

            appendChildNodes(newNode, list.from(node.childNodes));
            insertAfter(newNode, node);
            remove(node);

            return newNode;
        };

        var isTextarea = makePredByNodeName('TEXTAREA');

        /**
         * @param {jQuery} $node
         * @param {Boolean} [stripLinebreaks] - default: false
         */
        var value = function ($node, stripLinebreaks) {
            var val = isTextarea($node[0]) ? $node.val() : $node.html();
            if (stripLinebreaks) {
                return val.replace(/[\n\r]/g, '');
            }
            return val;
        };

        /**
         * @method html
         *
         * get the HTML contents of node
         *
         * @param {jQuery} $node
         * @param {Boolean} [isNewlineOnBlock]
         */
        var html = function ($node, isNewlineOnBlock) {
            var markup = value($node);

            if (isNewlineOnBlock) {
                var regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
                markup = markup.replace(regexTag, function (match, endSlash, name) {
                    name = name.toUpperCase();
                    var isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) && !!endSlash;
                    var isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);

                    return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
                });
                markup = $.trim(markup);
            }

            return markup;
        };

        var posFromPlaceholder = function (placeholder) {
            var $placeholder = $(placeholder);
            var pos = $placeholder.position();
            var height = $placeholder.outerHeight(true); // include margin

            return {
                left: pos.left,
                top: pos.top,
                bottom: pos.top + height
            };
        };

        var attachEvents = function ($node, events) {
            Object.keys(events).forEach(function (key) {
                $node.on(key, events[key]);
            });
        };

        var detachEvents = function ($node, events) {
            Object.keys(events).forEach(function (key) {
                $node.off(key, events[key]);
            });
        };

        return {
            /** @property {String} NBSP_CHAR */
            NBSP_CHAR: NBSP_CHAR,
            /** @property {String} ZERO_WIDTH_NBSP_CHAR */
            ZERO_WIDTH_NBSP_CHAR: ZERO_WIDTH_NBSP_CHAR,
            /** @property {String} blank */
            blank: blankHTML,
            /** @property {String} emptyPara */
            emptyPara: '<p>' + blankHTML + '</p>',
            makePredByNodeName: makePredByNodeName,
            isEditable: isEditable,
            isControlSizing: isControlSizing,
            isText: isText,
            isElement: isElement,
            isVoid: isVoid,
            isPara: isPara,
            isPurePara: isPurePara,
            isHeading: isHeading,
            isInline: isInline,
            isBlock: func.not(isInline),
            isBodyInline: isBodyInline,
            isBody: isBody,
            isParaInline: isParaInline,
            isList: isList,
            isTable: isTable,
            isCell: isCell,
            isBlockquote: isBlockquote,
            isBodyContainer: isBodyContainer,
            isAnchor: isAnchor,
            isDiv: makePredByNodeName('DIV'),
            isLi: isLi,
            isBR: makePredByNodeName('BR'),
            isSpan: makePredByNodeName('SPAN'),
            isB: makePredByNodeName('B'),
            isU: makePredByNodeName('U'),
            isS: makePredByNodeName('S'),
            isI: makePredByNodeName('I'),
            isImg: makePredByNodeName('IMG'),
            isTextarea: isTextarea,
            isEmpty: isEmpty,
            isEmptyAnchor: func.and(isAnchor, isEmpty),
            isClosestSibling: isClosestSibling,
            withClosestSiblings: withClosestSiblings,
            nodeLength: nodeLength,
            isLeftEdgePoint: isLeftEdgePoint,
            isRightEdgePoint: isRightEdgePoint,
            isEdgePoint: isEdgePoint,
            isLeftEdgeOf: isLeftEdgeOf,
            isRightEdgeOf: isRightEdgeOf,
            isLeftEdgePointOf: isLeftEdgePointOf,
            isRightEdgePointOf: isRightEdgePointOf,
            prevPoint: prevPoint,
            nextPoint: nextPoint,
            isSamePoint: isSamePoint,
            isVisiblePoint: isVisiblePoint,
            prevPointUntil: prevPointUntil,
            nextPointUntil: nextPointUntil,
            isCharPoint: isCharPoint,
            walkPoint: walkPoint,
            ancestor: ancestor,
            singleChildAncestor: singleChildAncestor,
            listAncestor: listAncestor,
            lastAncestor: lastAncestor,
            listNext: listNext,
            listPrev: listPrev,
            listDescendant: listDescendant,
            commonAncestor: commonAncestor,
            wrap: wrap,
            insertAfter: insertAfter,
            appendChildNodes: appendChildNodes,
            position: position,
            hasChildren: hasChildren,
            makeOffsetPath: makeOffsetPath,
            fromOffsetPath: fromOffsetPath,
            splitTree: splitTree,
            splitPoint: splitPoint,
            create: create,
            createText: createText,
            remove: remove,
            removeWhile: removeWhile,
            replace: replace,
            html: html,
            value: value,
            posFromPlaceholder: posFromPlaceholder,
            attachEvents: attachEvents,
            detachEvents: detachEvents
        };
    })();

    /**
     * @param {jQuery} $note
     * @param {Object} options
     * @return {Context}
     */
    var Context = function ($note, options) {
        var self = this;

        var ui = $.summernote.ui;
        this.memos = {};
        this.modules = {};
        this.layoutInfo = {};
        this.options = options;

        this.initialize = function () {
            // create layout info
            this.layoutInfo = ui.createLayout($note, options);

            // add optional buttons
            var buttons = $.extend({}, this.options.buttons);
            Object.keys(buttons).forEach(function (key) {
                self.memo('button.' + key, buttons[key]);
            });

            var modules = $.extend({}, this.options.modules, $.summernote.plugins || {});

            // add module
            Object.keys(modules).forEach(function (key) {
                self.module(key, modules[key], true);
            });

            Object.keys(this.modules).forEach(function (key) {
                self.initializeModule(key);
            });

            $note.hide();
            return this;
        };

        this.destroy = function () {
            Object.keys(this.modules).forEach(function (key) {
                self.removeModule(key);
            });

            Object.keys(this.memos).forEach(function (key) {
                self.removeMemo(key);
            });

            $note.removeData('summernote');

            ui.removeLayout($note, this.layoutInfo);
        };

        this.code = function (html) {
            var isActivated = this.invoke('codeview.isActivated');

            if (html === undefined) {
                this.invoke('codeview.sync');
                return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
            } else {
                if (isActivated) {
                    this.layoutInfo.codable.val(html);
                } else {
                    this.layoutInfo.editable.html(html);
                }
            }
        };

        this.triggerEvent = function () {
            var namespace = list.head(arguments);
            var args = list.tail(list.from(arguments));

            var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
            if (callback) {
                callback.apply($note[0], args);
            }
            $note.trigger('summernote.' + namespace, args);
        };

        this.initializeModule = function (key) {
            var module = this.modules[key];
            module.shouldInitialize = module.shouldInitialize || func.ok;
            if (!module.shouldInitialize()) {
                return;
            }

            // initialize module
            if (module.initialize) {
                module.initialize();
            }

            // attach events
            if (module.events) {
                dom.attachEvents($note, module.events);
            }
        };

        this.module = function (key, ModuleClass, withoutIntialize) {
            if (arguments.length === 1) {
                return this.modules[key];
            }

            this.modules[key] = new ModuleClass(this);

            if (!withoutIntialize) {
                this.initializeModule(key);
            }
        };

        this.removeModule = function (key) {
            var module = this.modules[key];
            if (module.shouldInitialize()) {
                if (module.events) {
                    dom.detachEvents($note, module.events);
                }

                if (module.destroy) {
                    module.destroy();
                }
            }

            delete this.modules[key];
            this.modules[key] = null;
        };

        this.memo = function (key, obj) {
            if (arguments.length === 1) {
                return this.memos[key];
            }
            this.memos[key] = obj;
        };

        this.removeMemo = function (key) {
            if (this.memos[key] && this.memos[key].destroy) {
                this.memos[key].destroy();
            }

            delete this.memos[key];
            this.memos[key] = null;
        };

        this.createInvokeHandler = function (namespace, value) {
            return function (event) {
                event.preventDefault();
                self.invoke(namespace, value || $(event.target).data('value') || $(event.currentTarget).data('value'));
            };
        };

        this.invoke = function () {
            var namespace = list.head(arguments);
            var args = list.tail(list.from(arguments));

            var splits = namespace.split('.');
            var hasSeparator = splits.length > 1;
            var moduleName = hasSeparator && list.head(splits);
            var methodName = hasSeparator ? list.last(splits) : list.head(splits);

            var module = this.modules[moduleName || 'editor'];
            if (!moduleName && this[methodName]) {
                return this[methodName].apply(this, args);
            } else if (module && module[methodName] && module.shouldInitialize()) {
                return module[methodName].apply(module, args);
            }
        };

        return this.initialize();
    };

    $.summernote = $.summernote || {
            lang: {}
        };

    $.fn.extend({
        /**
         * Summernote API
         *
         * @param {Object|String}
         * @return {this}
         */
        summernote: function () {
            var type = $.type(list.head(arguments));
            var isExternalAPICalled = type === 'string';
            var hasInitOptions = type === 'object';

            var options = hasInitOptions ? list.head(arguments) : {};

            options = $.extend({}, $.summernote.options, options);
            options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

            this.each(function (idx, note) {
                var $note = $(note);
                if (!$note.data('summernote')) {
                    $note.data('summernote', new Context($note, options));
                    $note.data('summernote').triggerEvent('init');
                }

                // Dropdown
                var toolbar;
                var tabs;
                var tabContainer;
                var editor;

                if (options.airMode) {
                    editor = $note.next('.note-air-editor').find('.note-air-popover');
                    toolbar = editor.find('.popover-content button.dropdown');

                    //    var id = $note.attr('id');
                    //    if (id) id = id.substring(id.lastIndexOf('-') + 1, id.length);
                    //
                    //    editor = $('#note-popover-' + id).find('.note-air-popover');
                } else {
                    editor = $note.next('.note-editor');
                    toolbar = editor.find('.note-toolbar button.dropdown');
                }

                tabContainer = editor.find('ul.tabs');
                tabs = editor.find('li.tab a');

                tabContainer.tabs();
            });

            $('.dropdown-button').dropdown();

            var $note = this.first();
            if (isExternalAPICalled && $note.length) {
                var context = $note.data('summernote');
                return context.invoke.apply(context, list.from(arguments));
            } else {
                return this;
            }
        }
    });


    var Renderer = function (markup, children, options, callback) {
        this.render = function ($parent) {
            var $node = $(markup);

            if (options && options.contents) {
                $node.html(options.contents);
            }

            if (options && options.className) {
                $node.addClass(options.className);
            }

            if (options && options.data) {
                $.each(options.data, function (k, v) {
                    $node.attr('data-' + k, v);
                });
            }

            if (options && options.click) {
                $node.on('mousedown', options.click);
            }

            if (children) {
                var $container = $node.find('.note-children-container');
                children.forEach(function (child) {
                    child.render($container.length ? $container : $node);
                });
            }

            if (callback) {
                callback($node, options);
            }

            if (options && options.callback) {
                options.callback($node);
            }

            if ($parent) {
                $parent.append($node);
            }

            return $node;
        };
    };

    var renderer = {
        create: function (markup, callback) {
            return function () {
                var children = $.isArray(arguments[0]) ? arguments[0] : [];
                var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
                if (options && options.children) {
                    children = options.children;
                }
                return new Renderer(markup, children, options, callback);
            };
        }
    };

    var editorMaterialize = renderer.create('<div class="note-editor note-frame"/>');
    var toolbarMaterialize = renderer.create('<div class="note-toolbar btn-toolbar"/>');
    var editingAreaMaterialize = renderer.create('<div class="note-editing-area"/>');
    var codableMaterialize = renderer.create('<textarea class="note-codable"/>');
    var editableMaterialize = renderer.create('<div class="note-editable" contentEditable="true"/>');
    var statusbarMaterialize = renderer.create('<div class="note-statusbar"><div class="note-resizebar"><div class="note-icon-bar"/><div class="note-icon-bar"/><div class="note-icon-bar"/></div></div>');

    var airEditorMaterialize = renderer.create('<div class="note-editor note-air-editor"/>');
    var airEditableMaterialize = renderer.create('<div class="note-editable" contentEditable="true"/>');

    var buttonGroupMaterialize = renderer.create('<div class="note-btn-group btn-group">');
    var buttonMaterialize = renderer.create('<button type="button" class="note-btn waves-effect waves-light btn">', function ($node, options) {
        if (options && options.tooltip) {
            $node.attr({
                'data-tooltip': options.tooltip,
                'data-position': "bottom"
            }).tooltip();
        }
    });

    var dropdownMaterialize = renderer.create('<ul class="dropdown-content">', function ($node, options) {
        var markup = $.isArray(options.items) ? options.items.map(function (item) {
            var innerItem = item;
            if (options.lang) {
                var label = options.lang[item === 'p' ? 'normal' : item];
                innerItem = ((item === 'p' || item === 'pre') ? label : '<' + item + ' data-value="' + item + '">' + label + '</' + item + '>');
            }

            return '<li class="' + item + '"><button type="button" data-value="' + item + '" class="' + item + '">' + innerItem + '</button></li>';
        }).join('') : options.items;

        $node.attr('id', options.id);

        $node.html(markup);
    });

    var dropdownCheckMaterialize = renderer.create('<ul class="dropdown-content note-check">', function ($node, options) {
        var markup = $.isArray(options.items) ? options.items.map(function (item) {
            return '<li><button type="button" data-value="' + item + '"><i class="material-icons">check</i> ' + item + '</button></li>';
        }).join('') : options.items;

        $node.attr('id', options.id);

        $node.html(markup);
    });

    var paletteMaterialize = renderer.create('<div class="note-color-palette"/>', function ($node, options) {
        var colorInfo = options.colors;
        var colorTitles = options.colorTitles;

        var eventName = $node.attr('data-event');
        var paletteContents = [];

        for (var row = 0, lenRow = colorInfo.length; row < lenRow; row++) {
            var colors = colorInfo[row];
            var titles = colorTitles[row];
            var buttons = [];

            for (var col = 0, lenCol = colors.length; col < lenCol; col++) {
                var color = colors[col];
                var title = titles[col];

                buttons.push(['<button type="button" class="note-color-btn" style="background-color:', color,
                    ';" data-event="', eventName,
                    '" data-value="', color,
                    '" data-tooltip="', title,
                    '" data-description="', title,
                    '" data-toggle="button" tabindex="-1"></button>'].join(''));
            }
            paletteContents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
        }

        $node.html(paletteContents.join(''));

        $node.find('.note-color-btn').tooltip();
    });

    var dialogMaterialize = renderer.create('<div class="modal modal-fixed-footer"/>', function ($node, options) {
        $node.html([
            '<div class="modal-content">',
            (options.title ? '<h4>' + options.title + '</h4>' : ''),
            '<p>' + options.body + '</p>',
            '</div>',
            (options.footer ? '<div class="modal-footer">' + options.footer + '</div>' : ''),
        ].join(''));
    });

    var popoverMaterialize = renderer.create([
        '<div class="note-popover popover bottom in">',
        '<div class="arrow"/>',
        '<div class="popover-content note-children-container"/>',
        '</div>'
    ].join(''));


    var MaterializeUI = {
        editor: editorMaterialize,
        toolbar: toolbarMaterialize,
        editingArea: editingAreaMaterialize,
        codable: codableMaterialize,
        editable: editableMaterialize,
        statusbar: statusbarMaterialize,
        airEditor: airEditorMaterialize,
        airEditable: airEditableMaterialize,
        buttonGroup: buttonGroupMaterialize,
        button: buttonMaterialize,
        dropdown: dropdownMaterialize,
        dropdownCheck: dropdownCheckMaterialize,
        palette: paletteMaterialize,
        dialog: dialogMaterialize,
        popover: popoverMaterialize,

        toggleBtn: function ($btn, isEnable) {
            $btn.toggleClass('disabled', !isEnable);
            $btn.attr('disabled', !isEnable);
        },

        toggleBtnActive: function ($btn, isActive) {
            $btn.toggleClass('active', isActive);
        },

        showDialog: function ($dialog, onOpenHandler, onCloseHandler) {
            $dialog.openModal({
                ready: onOpenHandler,
                complete: onCloseHandler
            });
        },

        hideDialog: function ($dialog) {
            $dialog.closeModal();
        },

        followingToolbar: function ($editor, options) {
            $(window).scroll(function () {
                var isFullscreen = $editor.hasClass('fullscreen');
                if (isFullscreen) {
                    return false;
                }

                var toolbar = $editor.children('.note-toolbar');
                var toolbarHeight = toolbar.outerHeight();
                var editable = $editor.children('.note-editing-area');
                var editableHeight = editable.outerHeight();
                var editorWidth = $editor.width;
                var toolbarOffset, editorOffsetTop, editorOffsetBottom;
                var activateOffset, deactivateOffsetTop, deactivateOffsetBottom;
                var currentOffset;
                var relativeOffset;
                var otherBarHeight;

                // check if the web app is currently using another static bar
                otherBarHeight = $("." + options.otherStaticBarClass).outerHeight() - 1;
                if (!otherBarHeight) otherBarHeight = 0;

                currentOffset = $(document).scrollTop();
                toolbarOffset = toolbar.offset().top;
                editorOffsetTop = $editor.offset().top;
                editorOffsetBottom = editorOffsetTop + editableHeight;
                activateOffset = toolbarOffset - otherBarHeight;
                deactivateOffsetBottom = editorOffsetBottom - otherBarHeight;
                deactivateOffsetTop = editorOffsetTop - otherBarHeight;

                if ((currentOffset > activateOffset) && (currentOffset < deactivateOffsetBottom)) {
                    relativeOffset = currentOffset - $editor.offset().top + otherBarHeight;
                    toolbar.css({'top': relativeOffset + 'px'});
                } else {
                    if ((currentOffset < toolbarOffset) && (currentOffset < deactivateOffsetBottom)) {
                        toolbar.css({'top': 0});

                        if (currentOffset > deactivateOffsetTop) {
                            relativeOffset = currentOffset - $editor.offset().top + otherBarHeight;
                            toolbar.css({'top': relativeOffset + 'px'});
                        }
                    }
                }
            });
        },

        createLayout: function ($note, options) {
            var $editor = (options.airMode ? MaterializeUI.airEditor([
                MaterializeUI.editingArea([
                    MaterializeUI.airEditable()
                ])
            ]) : MaterializeUI.editor([
                MaterializeUI.toolbar(),
                MaterializeUI.editingArea([
                    MaterializeUI.codable(),
                    MaterializeUI.editable()
                ]),
                MaterializeUI.statusbar()
            ])).render();

            $editor.insertAfter($note);

            if (options.followingToolbar && !options.airMode) {
                MaterializeUI.followingToolbar($editor, options);
            }

            return {
                note: $note,
                editor: $editor,
                toolbar: $editor.find('.note-toolbar'),
                editingArea: $editor.find('.note-editing-area'),
                editable: $editor.find('.note-editable'),
                codable: $editor.find('.note-codable'),
                statusbar: $editor.find('.note-statusbar')
            };
        },

        removeLayout: function ($note, layoutInfo) {
            $note.html(layoutInfo.editable.html());
            layoutInfo.editor.remove();
            $note.show();
        }
    };

    /**
     * @class core.key
     *
     * Object for keycodes.
     *
     * @singleton
     * @alternateClassName key
     */
    var key = (function () {
        var keyMap = {
            'BACKSPACE': 8,
            'TAB': 9,
            'ENTER': 13,
            'SPACE': 32,

            // Arrow
            'LEFT': 37,
            'UP': 38,
            'RIGHT': 39,
            'DOWN': 40,

            // Number: 0-9
            'NUM0': 48,
            'NUM1': 49,
            'NUM2': 50,
            'NUM3': 51,
            'NUM4': 52,
            'NUM5': 53,
            'NUM6': 54,
            'NUM7': 55,
            'NUM8': 56,

            // Alphabet: a-z
            'B': 66,
            'E': 69,
            'I': 73,
            'J': 74,
            'K': 75,
            'L': 76,
            'R': 82,
            'S': 83,
            'U': 85,
            'V': 86,
            'Y': 89,
            'Z': 90,

            'SLASH': 191,
            'LEFTBRACKET': 219,
            'BACKSLASH': 220,
            'RIGHTBRACKET': 221
        };

        return {
            /**
             * @method isEdit
             *
             * @param {Number} keyCode
             * @return {Boolean}
             */
            isEdit: function (keyCode) {
                return list.contains([
                    keyMap.BACKSPACE,
                    keyMap.TAB,
                    keyMap.ENTER,
                    keyMap.SPACE
                ], keyCode);
            },
            /**
             * @method isMove
             *
             * @param {Number} keyCode
             * @return {Boolean}
             */
            isMove: function (keyCode) {
                return list.contains([
                    keyMap.LEFT,
                    keyMap.UP,
                    keyMap.RIGHT,
                    keyMap.DOWN
                ], keyCode);
            },
            /**
             * @property {Object} nameFromCode
             * @property {String} nameFromCode.8 "BACKSPACE"
             */
            nameFromCode: func.invertObject(keyMap),
            code: keyMap
        };
    })();

    var range = (function () {

        /**
         * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
         *
         * @param {TextRange} textRange
         * @param {Boolean} isStart
         * @return {BoundaryPoint}
         *
         * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
         */
        var textRangeToPoint = function (textRange, isStart) {
            var container = textRange.parentElement(), offset;

            var tester = document.body.createTextRange(), prevContainer;
            var childNodes = list.from(container.childNodes);
            for (offset = 0; offset < childNodes.length; offset++) {
                if (dom.isText(childNodes[offset])) {
                    continue;
                }
                tester.moveToElementText(childNodes[offset]);
                if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
                    break;
                }
                prevContainer = childNodes[offset];
            }

            if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
                var textRangeStart = document.body.createTextRange(), curTextNode = null;
                textRangeStart.moveToElementText(prevContainer || container);
                textRangeStart.collapse(!prevContainer);
                curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;

                var pointTester = textRange.duplicate();
                pointTester.setEndPoint('StartToStart', textRangeStart);
                var textCount = pointTester.text.replace(/[\r\n]/g, '').length;

                while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
                    textCount -= curTextNode.nodeValue.length;
                    curTextNode = curTextNode.nextSibling;
                }

                /* jshint ignore:start */
                var dummy = curTextNode.nodeValue; // enforce IE to re-reference curTextNode, hack
                /* jshint ignore:end */

                if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) &&
                    textCount === curTextNode.nodeValue.length) {
                    textCount -= curTextNode.nodeValue.length;
                    curTextNode = curTextNode.nextSibling;
                }

                container = curTextNode;
                offset = textCount;
            }

            return {
                cont: container,
                offset: offset
            };
        };

        /**
         * return TextRange from boundary point (inspired by google closure-library)
         * @param {BoundaryPoint} point
         * @return {TextRange}
         */
        var pointToTextRange = function (point) {
            var textRangeInfo = function (container, offset) {
                var node, isCollapseToStart;

                if (dom.isText(container)) {
                    var prevTextNodes = dom.listPrev(container, func.not(dom.isText));
                    var prevContainer = list.last(prevTextNodes).previousSibling;
                    node = prevContainer || container.parentNode;
                    offset += list.sum(list.tail(prevTextNodes), dom.nodeLength);
                    isCollapseToStart = !prevContainer;
                } else {
                    node = container.childNodes[offset] || container;
                    if (dom.isText(node)) {
                        return textRangeInfo(node, 0);
                    }

                    offset = 0;
                    isCollapseToStart = false;
                }

                return {
                    node: node,
                    collapseToStart: isCollapseToStart,
                    offset: offset
                };
            };

            var textRange = document.body.createTextRange();
            var info = textRangeInfo(point.node, point.offset);

            textRange.moveToElementText(info.node);
            textRange.collapse(info.collapseToStart);
            textRange.moveStart('character', info.offset);
            return textRange;
        };

        /**
         * Wrapped Range
         *
         * @constructor
         * @param {Node} sc - start container
         * @param {Number} so - start offset
         * @param {Node} ec - end container
         * @param {Number} eo - end offset
         */
        var WrappedRange = function (sc, so, ec, eo) {
            this.sc = sc;
            this.so = so;
            this.ec = ec;
            this.eo = eo;

            // nativeRange: get nativeRange from sc, so, ec, eo
            var nativeRange = function () {
                if (agent.isW3CRangeSupport) {
                    var w3cRange = document.createRange();
                    w3cRange.setStart(sc, so);
                    w3cRange.setEnd(ec, eo);

                    return w3cRange;
                } else {
                    var textRange = pointToTextRange({
                        node: sc,
                        offset: so
                    });

                    textRange.setEndPoint('EndToEnd', pointToTextRange({
                        node: ec,
                        offset: eo
                    }));

                    return textRange;
                }
            };

            this.getPoints = function () {
                return {
                    sc: sc,
                    so: so,
                    ec: ec,
                    eo: eo
                };
            };

            this.getStartPoint = function () {
                return {
                    node: sc,
                    offset: so
                };
            };

            this.getEndPoint = function () {
                return {
                    node: ec,
                    offset: eo
                };
            };

            /**
             * select update visible range
             */
            this.select = function () {
                var nativeRng = nativeRange();
                if (agent.isW3CRangeSupport) {
                    var selection = document.getSelection();
                    if (selection.rangeCount > 0) {
                        selection.removeAllRanges();
                    }
                    selection.addRange(nativeRng);
                } else {
                    nativeRng.select();
                }

                return this;
            };

            /**
             * @return {WrappedRange}
             */
            this.normalize = function () {

                /**
                 * @param {BoundaryPoint} point
                 * @param {Boolean} isLeftToRight
                 * @return {BoundaryPoint}
                 */
                var getVisiblePoint = function (point, isLeftToRight) {
                    if ((dom.isVisiblePoint(point) && !dom.isEdgePoint(point)) ||
                        (dom.isVisiblePoint(point) && dom.isRightEdgePoint(point) && !isLeftToRight) ||
                        (dom.isVisiblePoint(point) && dom.isLeftEdgePoint(point) && isLeftToRight) ||
                        (dom.isVisiblePoint(point) && dom.isBlock(point.node) && dom.isEmpty(point.node))) {
                        return point;
                    }

                    // point on block's edge
                    var block = dom.ancestor(point.node, dom.isBlock);
                    if (((dom.isLeftEdgePointOf(point, block) || dom.isVoid(dom.prevPoint(point).node)) && !isLeftToRight) ||
                        ((dom.isRightEdgePointOf(point, block) || dom.isVoid(dom.nextPoint(point).node)) && isLeftToRight)) {

                        // returns point already on visible point
                        if (dom.isVisiblePoint(point)) {
                            return point;
                        }
                        // reverse direction
                        isLeftToRight = !isLeftToRight;
                    }

                    var nextPoint = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint) :
                        dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
                    return nextPoint || point;
                };

                var endPoint = getVisiblePoint(this.getEndPoint(), false);
                var startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);

                return new WrappedRange(
                    startPoint.node,
                    startPoint.offset,
                    endPoint.node,
                    endPoint.offset
                );
            };

            /**
             * returns matched nodes on range
             *
             * @param {Function} [pred] - predicate function
             * @param {Object} [options]
             * @param {Boolean} [options.includeAncestor]
             * @param {Boolean} [options.fullyContains]
             * @return {Node[]}
             */
            this.nodes = function (pred, options) {
                pred = pred || func.ok;

                var includeAncestor = options && options.includeAncestor;
                var fullyContains = options && options.fullyContains;

                // TODO compare points and sort
                var startPoint = this.getStartPoint();
                var endPoint = this.getEndPoint();

                var nodes = [];
                var leftEdgeNodes = [];

                dom.walkPoint(startPoint, endPoint, function (point) {
                    if (dom.isEditable(point.node)) {
                        return;
                    }

                    var node;
                    if (fullyContains) {
                        if (dom.isLeftEdgePoint(point)) {
                            leftEdgeNodes.push(point.node);
                        }
                        if (dom.isRightEdgePoint(point) && list.contains(leftEdgeNodes, point.node)) {
                            node = point.node;
                        }
                    } else if (includeAncestor) {
                        node = dom.ancestor(point.node, pred);
                    } else {
                        node = point.node;
                    }

                    if (node && pred(node)) {
                        nodes.push(node);
                    }
                }, true);

                return list.unique(nodes);
            };

            /**
             * returns commonAncestor of range
             * @return {Element} - commonAncestor
             */
            this.commonAncestor = function () {
                return dom.commonAncestor(sc, ec);
            };

            /**
             * returns expanded range by pred
             *
             * @param {Function} pred - predicate function
             * @return {WrappedRange}
             */
            this.expand = function (pred) {
                var startAncestor = dom.ancestor(sc, pred);
                var endAncestor = dom.ancestor(ec, pred);

                if (!startAncestor && !endAncestor) {
                    return new WrappedRange(sc, so, ec, eo);
                }

                var boundaryPoints = this.getPoints();

                if (startAncestor) {
                    boundaryPoints.sc = startAncestor;
                    boundaryPoints.so = 0;
                }

                if (endAncestor) {
                    boundaryPoints.ec = endAncestor;
                    boundaryPoints.eo = dom.nodeLength(endAncestor);
                }

                return new WrappedRange(
                    boundaryPoints.sc,
                    boundaryPoints.so,
                    boundaryPoints.ec,
                    boundaryPoints.eo
                );
            };

            /**
             * @param {Boolean} isCollapseToStart
             * @return {WrappedRange}
             */
            this.collapse = function (isCollapseToStart) {
                if (isCollapseToStart) {
                    return new WrappedRange(sc, so, sc, so);
                } else {
                    return new WrappedRange(ec, eo, ec, eo);
                }
            };

            /**
             * splitText on range
             */
            this.splitText = function () {
                var isSameContainer = sc === ec;
                var boundaryPoints = this.getPoints();

                if (dom.isText(ec) && !dom.isEdgePoint(this.getEndPoint())) {
                    ec.splitText(eo);
                }

                if (dom.isText(sc) && !dom.isEdgePoint(this.getStartPoint())) {
                    boundaryPoints.sc = sc.splitText(so);
                    boundaryPoints.so = 0;

                    if (isSameContainer) {
                        boundaryPoints.ec = boundaryPoints.sc;
                        boundaryPoints.eo = eo - so;
                    }
                }

                return new WrappedRange(
                    boundaryPoints.sc,
                    boundaryPoints.so,
                    boundaryPoints.ec,
                    boundaryPoints.eo
                );
            };

            /**
             * delete contents on range
             * @return {WrappedRange}
             */
            this.deleteContents = function () {
                if (this.isCollapsed()) {
                    return this;
                }

                var rng = this.splitText();
                var nodes = rng.nodes(null, {
                    fullyContains: true
                });

                // find new cursor point
                var point = dom.prevPointUntil(rng.getStartPoint(), function (point) {
                    return !list.contains(nodes, point.node);
                });

                var emptyParents = [];
                $.each(nodes, function (idx, node) {
                    // find empty parents
                    var parent = node.parentNode;
                    if (point.node !== parent && dom.nodeLength(parent) === 1) {
                        emptyParents.push(parent);
                    }
                    dom.remove(node, false);
                });

                // remove empty parents
                $.each(emptyParents, function (idx, node) {
                    dom.remove(node, false);
                });

                return new WrappedRange(
                    point.node,
                    point.offset,
                    point.node,
                    point.offset
                ).normalize();
            };

            /**
             * makeIsOn: return isOn(pred) function
             */
            var makeIsOn = function (pred) {
                return function () {
                    var ancestor = dom.ancestor(sc, pred);
                    return !!ancestor && (ancestor === dom.ancestor(ec, pred));
                };
            };

            // isOnEditable: judge whether range is on editable or not
            this.isOnEditable = makeIsOn(dom.isEditable);
            // isOnList: judge whether range is on list node or not
            this.isOnList = makeIsOn(dom.isList);
            // isOnAnchor: judge whether range is on anchor node or not
            this.isOnAnchor = makeIsOn(dom.isAnchor);
            // isOnAnchor: judge whether range is on cell node or not
            this.isOnCell = makeIsOn(dom.isCell);

            /**
             * @param {Function} pred
             * @return {Boolean}
             */
            this.isLeftEdgeOf = function (pred) {
                if (!dom.isLeftEdgePoint(this.getStartPoint())) {
                    return false;
                }

                var node = dom.ancestor(this.sc, pred);
                return node && dom.isLeftEdgeOf(this.sc, node);
            };

            /**
             * returns whether range was collapsed or not
             */
            this.isCollapsed = function () {
                return sc === ec && so === eo;
            };

            /**
             * wrap inline nodes which children of body with paragraph
             *
             * @return {WrappedRange}
             */
            this.wrapBodyInlineWithPara = function () {
                if (dom.isBodyContainer(sc) && dom.isEmpty(sc)) {
                    sc.innerHTML = dom.emptyPara;
                    return new WrappedRange(sc.firstChild, 0, sc.firstChild, 0);
                }

                /**
                 * [workaround] firefox often create range on not visible point. so normalize here.
                 *  - firefox: |<p>text</p>|
                 *  - chrome: <p>|text|</p>
                 */
                var rng = this.normalize();
                if (dom.isParaInline(sc) || dom.isPara(sc)) {
                    return rng;
                }

                // find inline top ancestor
                var topAncestor;
                if (dom.isInline(rng.sc)) {
                    var ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
                    topAncestor = list.last(ancestors);
                    if (!dom.isInline(topAncestor)) {
                        topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
                    }
                } else {
                    topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
                }

                // siblings not in paragraph
                var inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
                inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline));

                // wrap with paragraph
                if (inlineSiblings.length) {
                    var para = dom.wrap(list.head(inlineSiblings), 'p');
                    dom.appendChildNodes(para, list.tail(inlineSiblings));
                }

                return this.normalize();
            };

            /**
             * insert node at current cursor
             *
             * @param {Node} node
             * @return {Node}
             */
            this.insertNode = function (node) {
                var rng = this.wrapBodyInlineWithPara().deleteContents();
                var info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));

                if (info.rightNode) {
                    info.rightNode.parentNode.insertBefore(node, info.rightNode);
                } else {
                    info.container.appendChild(node);
                }

                return node;
            };

            /**
             * insert html at current cursor
             */
            this.pasteHTML = function (markup) {
                var contentsContainer = $('<div></div>').html(markup)[0];
                var childNodes = list.from(contentsContainer.childNodes);

                var rng = this.wrapBodyInlineWithPara().deleteContents();

                return childNodes.reverse().map(function (childNode) {
                    return rng.insertNode(childNode);
                }).reverse();
            };

            /**
             * returns text in range
             *
             * @return {String}
             */
            this.toString = function () {
                var nativeRng = nativeRange();
                return agent.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
            };

            /**
             * returns range for word before cursor
             *
             * @param {Boolean} [findAfter] - find after cursor, default: false
             * @return {WrappedRange}
             */
            this.getWordRange = function (findAfter) {
                var endPoint = this.getEndPoint();

                if (!dom.isCharPoint(endPoint)) {
                    return this;
                }

                var startPoint = dom.prevPointUntil(endPoint, function (point) {
                    return !dom.isCharPoint(point);
                });

                if (findAfter) {
                    endPoint = dom.nextPointUntil(endPoint, function (point) {
                        return !dom.isCharPoint(point);
                    });
                }

                return new WrappedRange(
                    startPoint.node,
                    startPoint.offset,
                    endPoint.node,
                    endPoint.offset
                );
            };

            /**
             * create offsetPath bookmark
             *
             * @param {Node} editable
             */
            this.bookmark = function (editable) {
                return {
                    s: {
                        path: dom.makeOffsetPath(editable, sc),
                        offset: so
                    },
                    e: {
                        path: dom.makeOffsetPath(editable, ec),
                        offset: eo
                    }
                };
            };

            /**
             * create offsetPath bookmark base on paragraph
             *
             * @param {Node[]} paras
             */
            this.paraBookmark = function (paras) {
                return {
                    s: {
                        path: list.tail(dom.makeOffsetPath(list.head(paras), sc)),
                        offset: so
                    },
                    e: {
                        path: list.tail(dom.makeOffsetPath(list.last(paras), ec)),
                        offset: eo
                    }
                };
            };

            /**
             * getClientRects
             * @return {Rect[]}
             */
            this.getClientRects = function () {
                var nativeRng = nativeRange();
                return nativeRng.getClientRects();
            };
        };

        /**
         * @class core.range
         *
         * Data structure
         *  * BoundaryPoint: a point of dom tree
         *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
         *
         * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
         *
         * @singleton
         * @alternateClassName range
         */
        return {
            /**
             * @method
             *
             * create Range Object From arguments or Browser Selection
             *
             * @param {Node} sc - start container
             * @param {Number} so - start offset
             * @param {Node} ec - end container
             * @param {Number} eo - end offset
             * @return {WrappedRange}
             */
            create: function (sc, so, ec, eo) {
                if (!arguments.length) { // from Browser Selection
                    if (agent.isW3CRangeSupport) {
                        var selection = document.getSelection();
                        if (!selection || selection.rangeCount === 0) {
                            return null;
                        } else if (dom.isBody(selection.anchorNode)) {
                            // Firefox: returns entire body as range on initialization. We won't never need it.
                            return null;
                        }

                        var nativeRng = selection.getRangeAt(0);
                        sc = nativeRng.startContainer;
                        so = nativeRng.startOffset;
                        ec = nativeRng.endContainer;
                        eo = nativeRng.endOffset;
                    } else { // IE8: TextRange
                        var textRange = document.selection.createRange();
                        var textRangeEnd = textRange.duplicate();
                        textRangeEnd.collapse(false);
                        var textRangeStart = textRange;
                        textRangeStart.collapse(true);

                        var startPoint = textRangeToPoint(textRangeStart, true),
                            endPoint = textRangeToPoint(textRangeEnd, false);

                        // same visible point case: range was collapsed.
                        if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) &&
                            dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) &&
                            endPoint.node.nextSibling === startPoint.node) {
                            startPoint = endPoint;
                        }

                        sc = startPoint.cont;
                        so = startPoint.offset;
                        ec = endPoint.cont;
                        eo = endPoint.offset;
                    }
                } else if (arguments.length === 2) { //collapsed
                    ec = sc;
                    eo = so;
                }
                return new WrappedRange(sc, so, ec, eo);
            },

            /**
             * @method
             *
             * create WrappedRange from node
             *
             * @param {Node} node
             * @return {WrappedRange}
             */
            createFromNode: function (node) {
                var sc = node;
                var so = 0;
                var ec = node;
                var eo = dom.nodeLength(ec);

                // browsers can't target a picture or void node
                if (dom.isVoid(sc)) {
                    so = dom.listPrev(sc).length - 1;
                    sc = sc.parentNode;
                }
                if (dom.isBR(ec)) {
                    eo = dom.listPrev(ec).length - 1;
                    ec = ec.parentNode;
                } else if (dom.isVoid(ec)) {
                    eo = dom.listPrev(ec).length;
                    ec = ec.parentNode;
                }

                return this.create(sc, so, ec, eo);
            },

            /**
             * create WrappedRange from node after position
             *
             * @param {Node} node
             * @return {WrappedRange}
             */
            createFromNodeBefore: function (node) {
                return this.createFromNode(node).collapse(true);
            },

            /**
             * create WrappedRange from node after position
             *
             * @param {Node} node
             * @return {WrappedRange}
             */
            createFromNodeAfter: function (node) {
                return this.createFromNode(node).collapse();
            },

            /**
             * @method
             *
             * create WrappedRange from bookmark
             *
             * @param {Node} editable
             * @param {Object} bookmark
             * @return {WrappedRange}
             */
            createFromBookmark: function (editable, bookmark) {
                var sc = dom.fromOffsetPath(editable, bookmark.s.path);
                var so = bookmark.s.offset;
                var ec = dom.fromOffsetPath(editable, bookmark.e.path);
                var eo = bookmark.e.offset;
                return new WrappedRange(sc, so, ec, eo);
            },

            /**
             * @method
             *
             * create WrappedRange from paraBookmark
             *
             * @param {Object} bookmark
             * @param {Node[]} paras
             * @return {WrappedRange}
             */
            createFromParaBookmark: function (bookmark, paras) {
                var so = bookmark.s.offset;
                var eo = bookmark.e.offset;
                var sc = dom.fromOffsetPath(list.head(paras), bookmark.s.path);
                var ec = dom.fromOffsetPath(list.last(paras), bookmark.e.path);

                return new WrappedRange(sc, so, ec, eo);
            }
        };
    })();

    /**
     * @class core.async
     *
     * Async functions which returns `Promise`
     *
     * @singleton
     * @alternateClassName async
     */
    var async = (function () {
        /**
         * @method readFileAsDataURL
         *
         * read contents of file as representing URL
         *
         * @param {File} file
         * @return {Promise} - then: dataUrl
         */
        var readFileAsDataURL = function (file) {
            return $.Deferred(function (deferred) {
                $.extend(new FileReader(), {
                    onload: function (e) {
                        var dataURL = e.target.result;
                        deferred.resolve(dataURL);
                    },
                    onerror: function () {
                        deferred.reject(this);
                    }
                }).readAsDataURL(file);
            }).promise();
        };

        /**
         * @method createImage
         *
         * create `<image>` from url string
         *
         * @param {String} sUrl
         * @param {String} filename
         * @return {Promise} - then: $image
         */
        var createImage = function (sUrl, filename) {
            return $.Deferred(function (deferred) {
                var $img = $('<img>');

                $img.one('load', function () {
                    $img.off('error abort');
                    deferred.resolve($img);
                }).one('error abort', function () {
                    $img.off('load').detach();
                    deferred.reject($img);
                }).css({
                    display: 'none'
                }).appendTo(document.body).attr({
                    'src': sUrl,
                    'data-filename': filename
                });
            }).promise();
        };

        return {
            readFileAsDataURL: readFileAsDataURL,
            createImage: createImage
        };
    })();

    /**
     * @class editing.History
     *
     * Editor History
     *
     */
    var History = function ($editable) {
        var stack = [], stackOffset = -1;
        var editable = $editable[0];

        var makeSnapshot = function () {
            var rng = range.create();
            var emptyBookmark = {s: {path: [], offset: 0}, e: {path: [], offset: 0}};

            return {
                contents: $editable.html(),
                bookmark: (rng ? rng.bookmark(editable) : emptyBookmark)
            };
        };

        var applySnapshot = function (snapshot) {
            if (snapshot.contents !== null) {
                $editable.html(snapshot.contents);
            }
            if (snapshot.bookmark !== null) {
                range.createFromBookmark(editable, snapshot.bookmark).select();
            }
        };

        /**
         * @method rewind
         * Rewinds the history stack back to the first snapshot taken.
         * Leaves the stack intact, so that "Redo" can still be used.
         */
        this.rewind = function () {

            // Create snap shot if not yet recorded
            if ($editable.html() !== stack[stackOffset].contents) {
                this.recordUndo();
            }

            // Return to the first available snapshot.
            stackOffset = 0;

            // Apply that snapshot.
            applySnapshot(stack[stackOffset]);

        };


        /**
         * @method reset
         * Resets the history stack completely; reverting to an empty editor.
         */
        this.reset = function () {

            // Clear the stack.
            stack = [];

            // Restore stackOffset to its original value.
            stackOffset = -1;

            // Clear the editable area.
            $editable.html('');

            // Record our first snapshot (of nothing).
            this.recordUndo();

        };

        /**
         * undo
         */
        this.undo = function () {
            // Create snap shot if not yet recorded
            if ($editable.html() !== stack[stackOffset].contents) {
                this.recordUndo();
            }

            if (0 < stackOffset) {
                stackOffset--;
                applySnapshot(stack[stackOffset]);
            }
        };

        /**
         * redo
         */
        this.redo = function () {
            if (stack.length - 1 > stackOffset) {
                stackOffset++;
                applySnapshot(stack[stackOffset]);
            }
        };

        /**
         * recorded undo
         */
        this.recordUndo = function () {
            stackOffset++;

            // Wash out stack after stackOffset
            if (stack.length > stackOffset) {
                stack = stack.slice(0, stackOffset);
            }

            // Create new snapshot and push it to the end
            stack.push(makeSnapshot());
        };
    };

    /**
     * @class editing.Style
     *
     * Style
     *
     */
    var Style = function () {
        /**
         * @method jQueryCSS
         *
         * [workaround] for old jQuery
         * passing an array of style properties to .css()
         * will result in an object of property-value pairs.
         * (compability with version < 1.9)
         *
         * @private
         * @param  {jQuery} $obj
         * @param  {Array} propertyNames - An array of one or more CSS properties.
         * @return {Object}
         */
        var jQueryCSS = function ($obj, propertyNames) {
            if (agent.jqueryVersion < 1.9) {
                var result = {};
                $.each(propertyNames, function (idx, propertyName) {
                    result[propertyName] = $obj.css(propertyName);
                });
                return result;
            }
            return $obj.css.call($obj, propertyNames);
        };

        /**
         * returns style object from node
         *
         * @param {jQuery} $node
         * @return {Object}
         */
        this.fromNode = function ($node) {
            var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
            var styleInfo = jQueryCSS($node, properties) || {};
            styleInfo['font-size'] = parseInt(styleInfo['font-size'], 10);
            return styleInfo;
        };

        /**
         * paragraph level style
         *
         * @param {WrappedRange} rng
         * @param {Object} styleInfo
         */
        this.stylePara = function (rng, styleInfo) {
            $.each(rng.nodes(dom.isPara, {
                includeAncestor: true
            }), function (idx, para) {
                $(para).css(styleInfo);
            });
        };

        /**
         * insert and returns styleNodes on range.
         *
         * @param {WrappedRange} rng
         * @param {Object} [options] - options for styleNodes
         * @param {String} [options.nodeName] - default: `SPAN`
         * @param {Boolean} [options.expandClosestSibling] - default: `false`
         * @param {Boolean} [options.onlyPartialContains] - default: `false`
         * @return {Node[]}
         */
        this.styleNodes = function (rng, options) {
            rng = rng.splitText();

            var nodeName = options && options.nodeName || 'SPAN';
            var expandClosestSibling = !!(options && options.expandClosestSibling);
            var onlyPartialContains = !!(options && options.onlyPartialContains);

            if (rng.isCollapsed()) {
                return [rng.insertNode(dom.create(nodeName))];
            }

            var pred = dom.makePredByNodeName(nodeName);
            var nodes = rng.nodes(dom.isText, {
                fullyContains: true
            }).map(function (text) {
                return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
            });

            if (expandClosestSibling) {
                if (onlyPartialContains) {
                    var nodesInRange = rng.nodes();
                    // compose with partial contains predication
                    pred = func.and(pred, function (node) {
                        return list.contains(nodesInRange, node);
                    });
                }

                return nodes.map(function (node) {
                    var siblings = dom.withClosestSiblings(node, pred);
                    var head = list.head(siblings);
                    var tails = list.tail(siblings);
                    $.each(tails, function (idx, elem) {
                        dom.appendChildNodes(head, elem.childNodes);
                        dom.remove(elem);
                    });
                    return list.head(siblings);
                });
            } else {
                return nodes;
            }
        };

        /**
         * get current style on cursor
         *
         * @param {WrappedRange} rng
         * @return {Object} - object contains style properties.
         */
        this.current = function (rng) {
            var $cont = $(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
            var styleInfo = this.fromNode($cont);

            // document.queryCommandState for toggle state
            // [workaround] prevent Firefox nsresult: "0x80004005 (NS_ERROR_FAILURE)"
            try {
                styleInfo = $.extend(styleInfo, {
                    'font-bold': document.queryCommandState('bold') ? 'bold' : 'normal',
                    'font-italic': document.queryCommandState('italic') ? 'italic' : 'normal',
                    'font-underline': document.queryCommandState('underline') ? 'underline' : 'normal',
                    'font-subscript': document.queryCommandState('subscript') ? 'subscript' : 'normal',
                    'font-superscript': document.queryCommandState('superscript') ? 'superscript' : 'normal',
                    'font-strikethrough': document.queryCommandState('strikeThrough') ? 'strikethrough' : 'normal'
                });
            } catch (e) {
            }

            // list-style-type to list-style(unordered, ordered)
            if (!rng.isOnList()) {
                styleInfo['list-style'] = 'none';
            } else {
                var orderedTypes = ['circle', 'disc', 'disc-leading-zero', 'square'];
                var isUnordered = $.inArray(styleInfo['list-style-type'], orderedTypes) > -1;
                styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
            }

            var para = dom.ancestor(rng.sc, dom.isPara);
            if (para && para.style['line-height']) {
                styleInfo['line-height'] = para.style.lineHeight;
            } else {
                var lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
                styleInfo['line-height'] = lineHeight.toFixed(1);
            }

            styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
            styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
            styleInfo.range = rng;

            return styleInfo;
        };
    };


    /**
     * @class editing.Bullet
     *
     * @alternateClassName Bullet
     */
    var Bullet = function () {
        /**
         * @method insertOrderedList
         *
         * toggle ordered list
         *
         * @type command
         */
        this.insertOrderedList = function () {
            this.toggleList('OL');
        };

        /**
         * @method insertUnorderedList
         *
         * toggle unordered list
         *
         * @type command
         */
        this.insertUnorderedList = function () {
            this.toggleList('UL');
        };

        /**
         * @method indent
         *
         * indent
         *
         * @type command
         */
        this.indent = function () {
            var self = this;
            var rng = range.create().wrapBodyInlineWithPara();

            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

            $.each(clustereds, function (idx, paras) {
                var head = list.head(paras);
                if (dom.isLi(head)) {
                    self.wrapList(paras, head.parentNode.nodeName);
                } else {
                    $.each(paras, function (idx, para) {
                        $(para).css('marginLeft', function (idx, val) {
                            return (parseInt(val, 10) || 0) + 25;
                        });
                    });
                }
            });

            rng.select();
        };

        /**
         * @method outdent
         *
         * outdent
         *
         * @type command
         */
        this.outdent = function () {
            var self = this;
            var rng = range.create().wrapBodyInlineWithPara();

            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

            $.each(clustereds, function (idx, paras) {
                var head = list.head(paras);
                if (dom.isLi(head)) {
                    self.releaseList([paras]);
                } else {
                    $.each(paras, function (idx, para) {
                        $(para).css('marginLeft', function (idx, val) {
                            val = (parseInt(val, 10) || 0);
                            return val > 25 ? val - 25 : '';
                        });
                    });
                }
            });

            rng.select();
        };

        /**
         * @method toggleList
         *
         * toggle list
         *
         * @param {String} listName - OL or UL
         */
        this.toggleList = function (listName) {
            var self = this;
            var rng = range.create().wrapBodyInlineWithPara();

            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var bookmark = rng.paraBookmark(paras);
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

            // paragraph to list
            if (list.find(paras, dom.isPurePara)) {
                var wrappedParas = [];
                $.each(clustereds, function (idx, paras) {
                    wrappedParas = wrappedParas.concat(self.wrapList(paras, listName));
                });
                paras = wrappedParas;
                // list to paragraph or change list style
            } else {
                var diffLists = rng.nodes(dom.isList, {
                    includeAncestor: true
                }).filter(function (listNode) {
                    return !$.nodeName(listNode, listName);
                });

                if (diffLists.length) {
                    $.each(diffLists, function (idx, listNode) {
                        dom.replace(listNode, listName);
                    });
                } else {
                    paras = this.releaseList(clustereds, true);
                }
            }

            range.createFromParaBookmark(bookmark, paras).select();
        };

        /**
         * @method wrapList
         *
         * @param {Node[]} paras
         * @param {String} listName
         * @return {Node[]}
         */
        this.wrapList = function (paras, listName) {
            var head = list.head(paras);
            var last = list.last(paras);

            var prevList = dom.isList(head.previousSibling) && head.previousSibling;
            var nextList = dom.isList(last.nextSibling) && last.nextSibling;

            var listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last);

            // P to LI
            paras = paras.map(function (para) {
                return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
            });

            // append to list(<ul>, <ol>)
            dom.appendChildNodes(listNode, paras);

            if (nextList) {
                dom.appendChildNodes(listNode, list.from(nextList.childNodes));
                dom.remove(nextList);
            }

            return paras;
        };

        /**
         * @method releaseList
         *
         * @param {Array[]} clustereds
         * @param {Boolean} isEscapseToBody
         * @return {Node[]}
         */
        this.releaseList = function (clustereds, isEscapseToBody) {
            var releasedParas = [];

            $.each(clustereds, function (idx, paras) {
                var head = list.head(paras);
                var last = list.last(paras);

                var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) :
                    head.parentNode;
                var lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, {
                    node: last.parentNode,
                    offset: dom.position(last) + 1
                }, {
                    isSkipPaddingBlankHTML: true
                }) : null;

                var middleList = dom.splitTree(headList, {
                    node: head.parentNode,
                    offset: dom.position(head)
                }, {
                    isSkipPaddingBlankHTML: true
                });

                paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) :
                    list.from(middleList.childNodes).filter(dom.isLi);

                // LI to P
                if (isEscapseToBody || !dom.isList(headList.parentNode)) {
                    paras = paras.map(function (para) {
                        return dom.replace(para, 'P');
                    });
                }

                $.each(list.from(paras).reverse(), function (idx, para) {
                    dom.insertAfter(para, headList);
                });

                // remove empty lists
                var rootLists = list.compact([headList, middleList, lastList]);
                $.each(rootLists, function (idx, rootList) {
                    var listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
                    $.each(listNodes.reverse(), function (idx, listNode) {
                        if (!dom.nodeLength(listNode)) {
                            dom.remove(listNode, true);
                        }
                    });
                });

                releasedParas = releasedParas.concat(paras);
            });

            return releasedParas;
        };
    };


    /**
     * @class editing.Typing
     *
     * Typing
     *
     */
    var Typing = function () {

        // a Bullet instance to toggle lists off
        var bullet = new Bullet();

        /**
         * insert tab
         *
         * @param {jQuery} $editable
         * @param {WrappedRange} rng
         * @param {Number} tabsize
         */
        this.insertTab = function ($editable, rng, tabsize) {
            var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
            rng = rng.deleteContents();
            rng.insertNode(tab, true);

            rng = range.create(tab, tabsize);
            rng.select();
        };

        /**
         * insert paragraph
         */
        this.insertParagraph = function () {
            var rng = range.create();

            // deleteContents on range.
            rng = rng.deleteContents();

            // Wrap range if it needs to be wrapped by paragraph
            rng = rng.wrapBodyInlineWithPara();

            // finding paragraph
            var splitRoot = dom.ancestor(rng.sc, dom.isPara);

            var nextPara;
            // on paragraph: split paragraph
            if (splitRoot) {
                // if it is an empty line with li
                if (dom.isEmpty(splitRoot) && dom.isLi(splitRoot)) {
                    // toogle UL/OL and escape
                    bullet.toggleList(splitRoot.parentNode.nodeName);
                    return;
                    // if it is an empty line with para on blockquote
                } else if (dom.isEmpty(splitRoot) && dom.isPara(splitRoot) && dom.isBlockquote(splitRoot.parentNode)) {
                    // escape blockquote
                    dom.insertAfter(splitRoot, splitRoot.parentNode);
                    nextPara = splitRoot;
                    // if new line has content (not a line break)
                } else {
                    nextPara = dom.splitTree(splitRoot, rng.getStartPoint());

                    var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
                    emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));

                    $.each(emptyAnchors, function (idx, anchor) {
                        dom.remove(anchor);
                    });

                    // replace empty heading with P tag
                    if (dom.isHeading(nextPara) && dom.isEmpty(nextPara)) {
                        nextPara = dom.replace(nextPara, 'p');
                    }
                }
                // no paragraph: insert empty paragraph
            } else {
                var next = rng.sc.childNodes[rng.so];
                nextPara = $(dom.emptyPara)[0];
                if (next) {
                    rng.sc.insertBefore(nextPara, next);
                } else {
                    rng.sc.appendChild(nextPara);
                }
            }

            range.create(nextPara, 0).normalize().select();
        };

    };

    /**
     * @class editing.Table
     *
     * Table
     *
     */
    var Table = function () {
        /**
         * handle tab key
         *
         * @param {WrappedRange} rng
         * @param {Boolean} isShift
         */
        this.tab = function (rng, isShift) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var table = dom.ancestor(cell, dom.isTable);
            var cells = dom.listDescendant(table, dom.isCell);

            var nextCell = list[isShift ? 'prev' : 'next'](cells, cell);
            if (nextCell) {
                range.create(nextCell, 0).select();
            }
        };

        /**
         * create empty table element
         *
         * @param {Number} rowCount
         * @param {Number} colCount
         * @return {Node}
         */
        this.createTable = function (colCount, rowCount, options) {
            var tds = [], tdHTML;
            for (var idxCol = 0; idxCol < colCount; idxCol++) {
                tds.push('<td>' + dom.blank + '</td>');
            }
            tdHTML = tds.join('');

            var trs = [], trHTML;
            for (var idxRow = 0; idxRow < rowCount; idxRow++) {
                trs.push('<tr>' + tdHTML + '</tr>');
            }
            trHTML = trs.join('');
            var $table = $('<table>' + trHTML + '</table>');
            if (options && options.tableClassName) {
                $table.addClass(options.tableClassName);
            }

            return $table[0];
        };
    };


    var KEY_BOGUS = 'bogus';

    /**
     * @class Editor
     */
    var Editor = function (context) {
        var self = this;

        var $note = context.layoutInfo.note;
        var $editor = context.layoutInfo.editor;
        var $editable = context.layoutInfo.editable;
        var options = context.options;

        var style = new Style();
        var table = new Table();
        var typing = new Typing();
        var bullet = new Bullet();
        var history = new History($editable);

        this.initialize = function () {
            // bind custom events
            $editable.on('keydown', function (event) {
                if (event.keyCode === key.code.ENTER) {
                    context.triggerEvent('enter', event);
                }
                context.triggerEvent('keydown', event);
            }).on('keyup', function (event) {
                context.triggerEvent('keyup', event);
            }).on('focus', function (event) {
                context.triggerEvent('focus', event);
            }).on('blur', function (event) {
                context.triggerEvent('blur', event);
            }).on('mousedown', function (event) {
                context.triggerEvent('mousedown', event);
            }).on('mouseup', function (event) {
                context.triggerEvent('mouseup', event);
            }).on('input', function (event) {
                context.triggerEvent('change', event);
            }).on('scroll', function (event) {
                context.triggerEvent('scroll', event);
            }).on('paste', function (event) {
                context.triggerEvent('paste', event);
            });

            $editor.on('focusin', function (event) {
                context.triggerEvent('focusin', event);
            }).on('focusout', function (event) {
                context.triggerEvent('focusout', event);
            });

            // bind keymap
            if (options.shortcuts) {
                this.bindKeyMap();
            }

            if (!options.airMode && options.height) {
                $editable.outerHeight(options.height);
            }

            $editable.html($note.html());
            history.recordUndo();
        };

        this.destroy = function () {
            $editable.off();
        };

        this.bindKeyMap = function () {
            var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];
            $editable.on('keydown', function (event) {
                var keys = [];

                if (event.metaKey) {
                    keys.push('CMD');
                }
                if (event.ctrlKey && !event.altKey) {
                    keys.push('CTRL');
                }
                if (event.shiftKey) {
                    keys.push('SHIFT');
                }

                var keyName = key.nameFromCode[event.keyCode];
                if (keyName) {
                    keys.push(keyName);
                }

                var eventName = keyMap[keys.join('+')];
                if (eventName) {
                    event.preventDefault();
                    context.invoke(eventName);
                } else if (key.isEdit(event.keyCode)) {
                    self.afterCommand();
                }
            });
        };

        /**
         * createRange
         *
         * create range
         * @return {WrappedRange}
         */
        this.createRange = function () {
            this.focus();
            return range.create();
        };

        /**
         * saveRange
         *
         * save current range
         *
         * @param {Boolean} [thenCollapse=false]
         */
        this.saveRange = function (thenCollapse) {
            this.focus();
            $editable.data('range', range.create());
            if (thenCollapse) {
                range.create().collapse().select();
            }
        };

        /**
         * restoreRange
         *
         * restore lately range
         */
        this.restoreRange = function () {
            var rng = $editable.data('range');
            if (rng) {
                rng.select();
                this.focus();
            }
        };

        this.saveTarget = function (node) {
            $editable.data('target', node);
        };

        this.clearTarget = function () {
            $editable.removeData('target');
        };

        this.restoreTarget = function () {
            return $editable.data('target');
        };

        /**
         * currentStyle
         *
         * current style
         * @return {Object|Boolean} unfocus
         */
        this.currentStyle = function () {
            var rng = range.create();
            if (rng) {
                rng = rng.normalize();
            }
            return rng ? style.current(rng) : style.fromNode($editable);
        };

        /**
         * style from node
         *
         * @param {jQuery} $node
         * @return {Object}
         */
        this.styleFromNode = function ($node) {
            return style.fromNode($node);
        };

        /**
         * undo
         */
        this.undo = function () {
            context.triggerEvent('before.command', $editable.html());
            history.undo();
            context.triggerEvent('change', $editable.html());
        };
        context.memo('help.undo', options.langInfo.help.undo);

        /**
         * redo
         */
        this.redo = function () {
            context.triggerEvent('before.command', $editable.html());
            history.redo();
            context.triggerEvent('change', $editable.html());
        };
        context.memo('help.redo', options.langInfo.help.redo);

        this.reset = function () {
            context.triggerEvent('before.command', $editable.html());
            history.reset();
            context.triggerEvent('change', $editable.html());
        };

        this.rewind = function () {
            context.triggerEvent('before.command', $editable.html());
            history.rewind();
            context.triggerEvent('change', $editable.html());
        };

        /**
         * beforeCommand
         * before command
         */
        var beforeCommand = this.beforeCommand = function () {
            context.triggerEvent('before.command', $editable.html());
            // keep focus on editable before command execution
            self.focus();
        };

        /**
         * afterCommand
         * after command
         * @param {Boolean} isPreventTrigger
         */
        var afterCommand = this.afterCommand = function (isPreventTrigger) {
            history.recordUndo();
            if (!isPreventTrigger) {
                context.triggerEvent('change', $editable.html());
            }
        };

        /* jshint ignore:start */
        // native commands(with execCommand), generate function for execCommand
        var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
            'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'formatBlock', 'formatSpecialBlock', 'removeFormat',
            'backColor', 'foreColor', 'fontName'];

        for (var idx = 0, len = commands.length; idx < len; idx++) {
            this[commands[idx]] = (function (sCmd) {
                return function (value) {
                    beforeCommand();
                    document.execCommand(sCmd, false, value);
                    afterCommand(true);
                };
            })(commands[idx]);
            context.memo('help.' + commands[idx], options.langInfo.help[commands[idx]]);
        }
        /* jshint ignore:end */

        /**
         * tab
         *
         * handle tab key
         */
        this.tab = function () {
            var rng = this.createRange();
            if (rng.isCollapsed() && rng.isOnCell()) {
                table.tab(rng);
            } else {
                beforeCommand();
                typing.insertTab($editable, rng, options.tabSize);
                afterCommand();
            }
        };
        context.memo('help.tab', options.langInfo.help.tab);

        /**
         * untab
         *
         * handle shift+tab key
         *
         */
        this.untab = function () {
            var rng = this.createRange();
            if (rng.isCollapsed() && rng.isOnCell()) {
                table.tab(rng, true);
            }
        };
        context.memo('help.untab', options.langInfo.help.untab);

        /**
         * wrapCommand
         *
         * run given function between beforeCommand and afterCommand
         */
        this.wrapCommand = function (fn) {
            return function () {
                beforeCommand();
                fn.apply(self, arguments);
                afterCommand();
            };
        };

        /**
         * insertParagraph
         *
         * insert paragraph
         */
        this.insertParagraph = this.wrapCommand(function () {
            typing.insertParagraph($editable);
        });
        context.memo('help.insertParagraph', options.langInfo.help.insertParagraph);

        /**
         * insertOrderedList
         */
        this.insertOrderedList = this.wrapCommand(function () {
            bullet.insertOrderedList($editable);
        });
        context.memo('help.insertOrderedList', options.langInfo.help.insertOrderedList);

        this.insertUnorderedList = this.wrapCommand(function () {
            bullet.insertUnorderedList($editable);
        });
        context.memo('help.insertUnorderedList', options.langInfo.help.insertUnorderedList);

        this.indent = this.wrapCommand(function () {
            bullet.indent($editable);
        });
        context.memo('help.indent', options.langInfo.help.indent);

        this.outdent = this.wrapCommand(function () {
            bullet.outdent($editable);
        });
        context.memo('help.outdent', options.langInfo.help.outdent);

        /**
         * insert image
         *
         * @param {String} sUrl
         */
        this.insertImage = function (sUrl, filename) {
            async.createImage(sUrl, filename).then(function ($image) {
                beforeCommand();
                $image.css({
                    display: '',
                    width: Math.min($editable.width(), $image.width())
                });
                range.create().insertNode($image[0]);
                range.createFromNodeAfter($image[0]).select();
                afterCommand();
            }).fail(function () {
                context.triggerEvent('image.upload.error');
            });
        };

        /**
         * insertNode
         * insert node
         * @param {Node} node
         */
        this.insertNode = this.wrapCommand(function (node) {
            range.create().insertNode(node);
            range.createFromNodeAfter(node).select();
        });

        /**
         * insert text
         * @param {String} text
         */
        this.insertText = this.wrapCommand(function (text) {
            var textNode = range.create().insertNode(dom.createText(text));
            range.create(textNode, dom.nodeLength(textNode)).select();
        });

        /**
         * return selected plain text
         * @return {String} text
         */
        this.getSelectedText = function () {
            var rng = this.createRange();

            // if range on anchor, expand range with anchor
            if (rng.isOnAnchor()) {
                rng = range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
            }

            return rng.toString();
        };

        /**
         * paste HTML
         * @param {String} markup
         */
        this.pasteHTML = this.wrapCommand(function (markup) {
            var contents = range.create().pasteHTML(markup);
            range.createFromNodeAfter(list.last(contents)).select();
        });

        /**
         * formatBlock
         *
         * @param {String} tagName
         */
        this.formatBlock = this.wrapCommand(function (tagName) {
            // [workaround] for MSIE, IE need `<`
            tagName = agent.isMSIE ? '<' + tagName + '>' : tagName;
            document.execCommand('FormatBlock', false, tagName);
        });

        this.formatSpecialBlock = this.wrapCommand(function (tagName) {
            var rngSelected = range.create();
            var rng = rngSelected.wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));

            var className = '';
            if (tagName !== 'normal') {
                className = tagName;
            }

            beforeCommand();
            $.each(rng.nodes(dom.isPara, {
                includeAncestor: true
            }), function (idx, para) {
                $(para).removeClass().addClass(className);
            });
            afterCommand();
        });

        this.formatPara = function () {
            this.formatBlock('P');
        };
        context.memo('help.formatPara', options.langInfo.help.formatPara);

        /* jshint ignore:start */
        for (var idx = 1; idx <= 4; idx++) {
            this['formatH' + idx] = function (idx) {
                return function () {
                    this.formatBlock('H' + idx);
                };
            }(idx);
            context.memo('help.formatH' + idx, options.langInfo.help['formatH' + idx]);
        }
        ;
        /* jshint ignore:end */

        /**
         * fontSize
         *
         * @param {String} value - px
         */
        this.fontSize = function (value) {
            var rng = range.create();

            if (rng.isCollapsed()) {
                var spans = style.styleNodes(rng);
                var firstSpan = list.head(spans);

                $(spans).css({
                    'font-size': value + 'px'
                });

                // [workaround] added styled bogus span for style
                //  - also bogus character needed for cursor position
                if (firstSpan && !dom.nodeLength(firstSpan)) {
                    firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
                    range.createFromNodeAfter(firstSpan.firstChild).select();
                    $editable.data(KEY_BOGUS, firstSpan);
                }
            } else {
                beforeCommand();
                $(style.styleNodes(rng)).css({
                    'font-size': value + 'px'
                });
                afterCommand();
            }
        };

        /**
         * insert horizontal rule
         */
        this.insertHorizontalRule = this.wrapCommand(function () {
            var rng = range.create();
            var hrNode = rng.insertNode($('<HR/>')[0]);
            if (hrNode.nextSibling) {
                range.create(hrNode.nextSibling, 0).normalize().select();
            }
        });
        context.memo('help.insertHorizontalRule', options.langInfo.help.insertHorizontalRule);


        /**
         * remove bogus node and character
         */
        this.removeBogus = function () {
            var bogusNode = $editable.data(KEY_BOGUS);
            if (!bogusNode) {
                return;
            }

            var textNode = list.find(list.from(bogusNode.childNodes), dom.isText);

            var bogusCharIdx = textNode.nodeValue.indexOf(dom.ZERO_WIDTH_NBSP_CHAR);
            if (bogusCharIdx !== -1) {
                textNode.deleteData(bogusCharIdx, 1);
            }

            if (dom.isEmpty(bogusNode)) {
                dom.remove(bogusNode);
            }

            $editable.removeData(KEY_BOGUS);
        };

        /**
         * lineHeight
         * @param {String} value
         */
        this.lineHeight = this.wrapCommand(function (value) {
            style.stylePara(range.create(), {
                lineHeight: value
            });
        });

        /**
         * unlink
         *
         * @type command
         */
        this.unlink = function () {
            var rng = this.createRange();
            if (rng.isOnAnchor()) {
                var anchor = dom.ancestor(rng.sc, dom.isAnchor);
                rng = range.createFromNode(anchor);
                rng.select();

                beforeCommand();
                document.execCommand('unlink');
                afterCommand();
            }
        };

        /**
         * create link (command)
         *
         * @param {Object} linkInfo
         */
        this.createLink = this.wrapCommand(function (linkInfo) {
            var linkUrl = linkInfo.url;
            var linkText = linkInfo.text;
            var isNewWindow = linkInfo.isNewWindow;
            var rng = linkInfo.range || this.createRange();
            var isTextChanged = rng.toString() !== linkText;

            if (options.onCreateLink) {
                linkUrl = options.onCreateLink(linkUrl);
            }

            var anchors = [];
            if (isTextChanged) {
                // Create a new link when text changed.
                var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
                anchors.push(anchor);
            } else {
                anchors = style.styleNodes(rng, {
                    nodeName: 'A',
                    expandClosestSibling: true,
                    onlyPartialContains: true
                });
            }

            $.each(anchors, function (idx, anchor) {
                $(anchor).attr('href', linkUrl);
                if (isNewWindow) {
                    $(anchor).attr('target', '_blank');
                } else {
                    $(anchor).removeAttr('target');
                }
            });

            var startRange = range.createFromNodeBefore(list.head(anchors));
            var startPoint = startRange.getStartPoint();
            var endRange = range.createFromNodeAfter(list.last(anchors));
            var endPoint = endRange.getEndPoint();

            range.create(
                startPoint.node,
                startPoint.offset,
                endPoint.node,
                endPoint.offset
            ).select();
        });

        /**
         * returns link info
         *
         * @return {Object}
         * @return {WrappedRange} return.range
         * @return {String} return.text
         * @return {Boolean} [return.isNewWindow=true]
         * @return {String} [return.url=""]
         */
        this.getLinkInfo = function () {
            this.focus();

            var rng = range.create().expand(dom.isAnchor);

            // Get the first anchor on range(for edit).
            var $anchor = $(list.head(rng.nodes(dom.isAnchor)));

            return {
                range: rng,
                text: rng.toString(),
                isNewWindow: $anchor.length ? $anchor.attr('target') === '_blank' : false,
                url: $anchor.length ? $anchor.attr('href') : ''
            };
        };

        /**
         * setting color
         *
         * @param {Object} sObjColor  color code
         * @param {String} sObjColor.foreColor foreground color
         * @param {String} sObjColor.backColor background color
         */
        this.color = this.wrapCommand(function (colorInfo) {
            var foreColor = colorInfo.foreColor;
            var backColor = colorInfo.backColor;

            if (foreColor) {
                document.execCommand('foreColor', false, foreColor);
            }
            if (backColor) {
                document.execCommand('backColor', false, backColor);
            }
        });

        /**
         * insert Table
         *
         * @param {String} sDim dimension of table (ex : "5x5")
         */
        this.insertTable = this.wrapCommand(function (sDim) {
            var dimension = sDim.split('x');

            var rng = range.create().deleteContents();
            rng.insertNode(table.createTable(dimension[0], dimension[1], options));
        });

        /**
         * float me
         *
         * @param {String} value
         */
        this.floatMe = this.wrapCommand(function (value) {
            var $target = $(this.restoreTarget());
            $target.css('float', value);
        });

        /**
         * resize overlay element
         * @param {String} value
         */
        this.resize = this.wrapCommand(function (value) {
            var $target = $(this.restoreTarget());
            $target.css({
                width: value * 100 + '%',
                height: ''
            });
        });

        /**
         * @param {Position} pos
         * @param {jQuery} $target - target element
         * @param {Boolean} [bKeepRatio] - keep ratio
         */
        this.resizeTo = function (pos, $target, bKeepRatio) {
            var imageSize;
            if (bKeepRatio) {
                var newRatio = pos.y / pos.x;
                var ratio = $target.data('ratio');
                imageSize = {
                    width: ratio > newRatio ? pos.x : pos.y / ratio,
                    height: ratio > newRatio ? pos.x * ratio : pos.y
                };
            } else {
                imageSize = {
                    width: pos.x,
                    height: pos.y
                };
            }

            $target.css(imageSize);
        };

        /**
         * remove media object
         */
        this.removeMedia = this.wrapCommand(function () {
            var $target = $(this.restoreTarget()).detach();
            context.triggerEvent('media.delete', $target, $editable);
        });

        /**
         * set focus
         */
        this.focus = function () {
            // [workaround] Screen will move when page is scolled in IE.
            //  - do focus when not focused
            if (!$editable.is(':focus')) {
                $editable.focus();

                // [workaround] for firefox bug http://goo.gl/lVfAaI
                if (agent.isFF) {
                    var rng = range.create();
                    if (!rng || rng.isOnEditable()) {
                        return;
                    }

                    range.createFromNode($editable[0])
                        .normalize()
                        .collapse()
                        .select();
                }
            }
        };

        /**
         * returns whether contents is empty or not.
         * @return {Boolean}
         */
        this.isEmpty = function () {
            return dom.isEmpty($editable[0]) || dom.emptyPara === $editable.html();
        };
    };

    var Clipboard = function (context) {
        var self = this;

        var $editable = context.layoutInfo.editable;

        var SanitizePaste = require('./sanitizePaste');

        this.events = {
            'summernote.keydown': function (we, e) {
                if (self.needKeydownHook()) {
                    if ((e.ctrlKey || e.metaKey) && e.keyCode === key.code.V) {
                        context.invoke('editor.saveRange');
                        self.$paste.focus();

                        setTimeout(function () {
                            self.pasteByHook();
                        }, 0);
                    }
                }
            }
        };

        this.needKeydownHook = function () {
            return (agent.isMSIE && agent.browserVersion > 10) || agent.isFF;
        };

        this.initialize = function () {
            // [workaround] getting image from clipboard
            //  - IE11 and Firefox: CTRL+v hook
            //  - Webkit: event.clipboardData
            if (this.needKeydownHook()) {
                this.$paste = $('<div />').attr('contenteditable', true).css({
                    position: 'absolute',
                    left: -100000,
                    opacity: 0
                });
                $editable.before(this.$paste);

                this.$paste.on('paste', function (event) {
                    context.triggerEvent('paste', event);
                });
            } else {
                $editable.on('paste', this.pasteByEvent);
            }
        };

        this.destroy = function () {
            if (this.needKeydownHook()) {
                this.$paste.remove();
                this.$paste = null;
            }
        };

        this.pasteByHook = function () {
            var node = this.$paste[0].firstChild;

            if (dom.isImg(node)) {
                var dataURI = node.src;
                var decodedData = atob(dataURI.split(',')[1]);
                var array = new Uint8Array(decodedData.length);
                for (var i = 0; i < decodedData.length; i++) {
                    array[i] = decodedData.charCodeAt(i);
                }

                var blob = new Blob([array], {type: 'image/png'});
                blob.name = 'clipboard.png';

                context.invoke('editor.restoreRange');
                context.invoke('editor.focus');
                context.invoke('imageDialog.insertImages', [blob]);
            } else {
                var pasteContent = $('<div />').html(this.$paste.html()).html();
                pasteContent = SanitizePaste.parse(pasteContent, agent);
                context.invoke('editor.restoreRange');
                context.invoke('editor.focus');

                if (pasteContent) {
                    context.invoke('editor.pasteHTML', pasteContent);
                }
            }

            this.$paste.empty();
        };

        /**
         * paste by clipboard event
         *
         * @param {Event} event
         */
        this.pasteByEvent = function (event) {
            var clipboardData = event.originalEvent.clipboardData;
            if (clipboardData && clipboardData.items && clipboardData.items.length) {
                var item = list.head(clipboardData.items);
                if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                    context.invoke('imageDialog.insertImages', [item.getAsFile()]);
                }
                context.invoke('editor.afterCommand');
            }
        };
    };

    var Dropzone = function (context) {
        var $document = $(document);
        var $editor = context.layoutInfo.editor;
        var $editable = context.layoutInfo.editable;
        var options = context.options;
        var lang = options.langInfo;

        var $dropzone = $([
            '<div class="note-dropzone">',
            '  <div class="note-dropzone-message"/>',
            '</div>'
        ].join('')).prependTo($editor);

        /**
         * attach Drag and Drop Events
         */
        this.initialize = function () {
            if (options.disableDragAndDrop) {
                // prevent default drop event
                $document.on('drop', function (e) {
                    e.preventDefault();
                });
            } else {
                this.attachDragAndDropEvent();
            }
        };

        /**
         * attach Drag and Drop Events
         */
        this.attachDragAndDropEvent = function () {
            var collection = $(),
                $dropzoneMessage = $dropzone.find('.note-dropzone-message');

            // show dropzone on dragenter when dragging a object to document
            // -but only if the editor is visible, i.e. has a positive width and height
            $document.on('dragenter', function (e) {
                var isCodeview = context.invoke('codeview.isActivated');
                var hasEditorSize = $editor.width() > 0 && $editor.height() > 0;
                if (!isCodeview && !collection.length && hasEditorSize) {
                    $editor.addClass('dragover');
                    $dropzone.width($editor.width());
                    $dropzone.height($editor.height());
                    $dropzoneMessage.text(lang.image.dragImageHere);
                }
                collection = collection.add(e.target);
            }).on('dragleave', function (e) {
                collection = collection.not(e.target);
                if (!collection.length) {
                    $editor.removeClass('dragover');
                }
            }).on('drop', function () {
                collection = $();
                $editor.removeClass('dragover');
            });

            // change dropzone's message on hover.
            $dropzone.on('dragenter', function () {
                $dropzone.addClass('hover');
                $dropzoneMessage.text(lang.image.dropImage);
            }).on('dragleave', function () {
                $dropzone.removeClass('hover');
                $dropzoneMessage.text(lang.image.dragImageHere);
            });

            // attach dropImage
            $dropzone.on('drop', function (event) {
                var dataTransfer = event.originalEvent.dataTransfer;

                if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                    event.preventDefault();
                    $editable.focus();
                    context.invoke('imageDialog.insertImages', dataTransfer.files);
                } else {
                    $.each(dataTransfer.types, function (idx, type) {
                        var content = dataTransfer.getData(type);

                        if (type.toLowerCase().indexOf('text') > -1) {
                            context.invoke('editor.pasteHTML', content);
                        } else {
                            $(content).each(function () {
                                context.invoke('editor.insertNode', this);
                            });
                        }
                    });
                }
            }).on('dragover', false); // prevent default dragover event
        };
    };


    var CodeMirror;
    if (agent.hasCodeMirror) {
        if (agent.isSupportAmd) {
            require(['codemirror'], function (cm) {
                CodeMirror = cm;
            });
        } else {
            CodeMirror = window.CodeMirror;
        }
    }

    /**
     * @class Codeview
     */
    var Codeview = function (context) {
        var $editor = context.layoutInfo.editor;
        var $editable = context.layoutInfo.editable;
        var $codable = context.layoutInfo.codable;
        var options = context.options;

        this.sync = function () {
            var isCodeview = this.isActivated();
            if (isCodeview && agent.hasCodeMirror) {
                $codable.data('cmEditor').save();
            }
        };

        /**
         * @return {Boolean}
         */
        this.isActivated = function () {
            return $editor.hasClass('codeview');
        };

        /**
         * toggle codeview
         */
        this.toggle = function () {
            if (this.isActivated()) {
                this.deactivate();
            } else {
                this.activate();
            }
        };

        /**
         * activate code view
         */
        this.activate = function () {
            $codable.val(dom.html($editable, options.prettifyHtml));
            $codable.height($editable.height());

            context.invoke('toolbar.updateCodeview', true);
            $editor.addClass('codeview');
            $codable.focus();

            // activate CodeMirror as codable
            if (agent.hasCodeMirror) {
                var cmEditor = CodeMirror.fromTextArea($codable[0], options.codemirror);

                // CodeMirror TernServer
                if (options.codemirror.tern) {
                    var server = new CodeMirror.TernServer(options.codemirror.tern);
                    cmEditor.ternServer = server;
                    cmEditor.on('cursorActivity', function (cm) {
                        server.updateArgHints(cm);
                    });
                }

                // CodeMirror hasn't Padding.
                cmEditor.setSize(null, $editable.outerHeight());
                $codable.data('cmEditor', cmEditor);
            }
        };

        /**
         * deactivate code view
         */
        this.deactivate = function () {
            // deactivate CodeMirror as codable
            if (agent.hasCodeMirror) {
                var cmEditor = $codable.data('cmEditor');
                $codable.val(cmEditor.getValue());
                cmEditor.toTextArea();
            }

            var value = dom.value($codable, options.prettifyHtml) || dom.emptyPara;
            var isChange = $editable.html() !== value;

            $editable.html(value);
            $editable.height(options.height ? $codable.height() : 'auto');
            $editor.removeClass('codeview');

            if (isChange) {
                context.triggerEvent('change', $editable.html(), $editable);
            }

            $editable.focus();

            context.invoke('toolbar.updateCodeview', false);
        };
    };

    var EDITABLE_PADDING = 24;

    var Statusbar = function (context) {
        var $document = $(document);
        var $statusbar = context.layoutInfo.statusbar;
        var $editable = context.layoutInfo.editable;
        var options = context.options;

        this.initialize = function () {
            if (options.airMode || options.disableResizeEditor) {
                return;
            }

            $statusbar.on('mousedown', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var editableTop = $editable.offset().top - $document.scrollTop();

                $document.on('mousemove', function (event) {
                    var height = event.clientY - (editableTop + EDITABLE_PADDING);

                    height = (options.minheight > 0) ? Math.max(height, options.minheight) : height;
                    height = (options.maxHeight > 0) ? Math.min(height, options.maxHeight) : height;

                    $editable.height(height);
                }).one('mouseup', function () {
                    $document.off('mousemove');
                });
            });
        };

        this.destroy = function () {
            $statusbar.off();
        };
    };

    var Fullscreen = function (context) {
        var $editor = context.layoutInfo.editor;
        var $toolbar = context.layoutInfo.toolbar;
        var $editable = context.layoutInfo.editable;
        var $codable = context.layoutInfo.codable;

        var options = context.options;
        var otherBarHeight = $("." + options.otherStaticBarClass).outerHeight() - 1;
        if (!otherBarHeight) otherBarHeight = 0;

        var $window = $(window);
        var $scrollbar = $('html, body');

        /**
         * toggle fullscreen
         */
        this.toggle = function () {
            var resize = function (size) {
                $editable.css('height', size.h);
                $codable.css('height', size.h);
                if ($codable.data('cmeditor')) {
                    $codable.data('cmeditor').setsize(null, size.h);
                }
            };

            $editor.toggleClass('fullscreen');
            var isFullscreen = $editor.hasClass('fullscreen');
            if (isFullscreen) {
                $editable.data('orgHeight', $editable.css('height'));

                $window.on('resize', function () {
                    resize({
                        h: $window.height() - $toolbar.outerHeight()
                    });
                }).trigger('resize');

                $scrollbar.css('overflow', 'hidden');
                $editor.css({'top': otherBarHeight + 'px'});
            } else {
                $window.off('resize');
                resize({
                    h: $editable.data('orgHeight')
                });
                $scrollbar.css('overflow', 'visible');
            }

            context.invoke('toolbar.updateFullscreen', isFullscreen);
        };
    };

    var Handle = function (context) {
        var self = this;

        var $document = $(document);

        var $editingArea = context.layoutInfo.editingArea;
        var options = context.options;

        this.events = {
            'summernote.mousedown': function (we, e) {
                if (self.update(e.target)) {
                    e.preventDefault();
                }
            },
            'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': function () {
                self.update();
            }
        };

        this.initialize = function () {
            this.$handle = $([
                '<div class="note-handle">',
                '<div class="note-control-selection">',
                '<div class="note-control-selection-bg"></div>',
                '<div class="note-control-holder note-control-nw"></div>',
                '<div class="note-control-holder note-control-ne"></div>',
                '<div class="note-control-holder note-control-sw"></div>',
                '<div class="',
                (options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
                ' note-control-se"></div>',
                (options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
                '</div>',
                '</div>'
            ].join('')).prependTo($editingArea);

            this.$handle.on('mousedown', function (event) {
                if (dom.isControlSizing(event.target)) {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = self.$handle.find('.note-control-selection').data('target'),
                        posStart = $target.offset(),
                        scrollTop = $document.scrollTop();

                    $document.on('mousemove', function (event) {
                        context.invoke('editor.resizeTo', {
                            x: event.clientX - posStart.left,
                            y: event.clientY - (posStart.top - scrollTop)
                        }, $target, !event.shiftKey);

                        self.update($target[0]);
                    }).one('mouseup', function (e) {
                        e.preventDefault();
                        $document.off('mousemove');
                        context.invoke('editor.afterCommand');
                    });

                    if (!$target.data('ratio')) { // original ratio.
                        $target.data('ratio', $target.height() / $target.width());
                    }
                }
            });
        };

        this.destroy = function () {
            this.$handle.remove();
        };

        this.update = function (target) {
            var isImage = dom.isImg(target);
            var $selection = this.$handle.find('.note-control-selection');

            context.invoke('imagePopover.update', target);

            if (isImage) {
                var $image = $(target);
                var pos = $image.position();

                // include margin
                var imageSize = {
                    w: $image.outerWidth(true),
                    h: $image.outerHeight(true)
                };

                $selection.css({
                    display: 'block',
                    left: pos.left,
                    top: pos.top,
                    width: imageSize.w,
                    height: imageSize.h
                }).data('target', $image); // save current image element.

                var sizingText = imageSize.w + 'x' + imageSize.h;
                $selection.find('.note-control-selection-info').text(sizingText);
                context.invoke('editor.saveTarget', target);
            } else {
                this.hide();
            }

            return isImage;
        };

        /**
         * hide
         *
         * @param {jQuery} $handle
         */
        this.hide = function () {
            context.invoke('editor.clearTarget');
            this.$handle.children().hide();
        };
    };

    var AutoLink = function (context) {
        var self = this;

        var linkPattern = /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+-]+@)(.+)$/i;

        this.events = {
            'summernote.keyup': function (we, e) {
                self.handleKeyup(e);
            },
            'summernote.keydown': function (we, e) {
                self.handleKeydown(e);
            }
        };

        this.initialize = function () {
            this.lastWordRange = null;
        };

        this.destroy = function () {
            this.lastWordRange = null;
        };

        this.replace = function () {
            if (!this.lastWordRange) {
                return;
            }

            var keyword = this.lastWordRange.toString();

            if (linkPattern.test(keyword)) {
                var node = this.nodeFromKeyword(keyword);

                this.lastWordRange.insertNode(node);
                this.lastWordRange = null;
                context.invoke('editor.focus');
            }

        };

        this.nodeFromKeyword = function (keyword) {
            return $('<a />').html(keyword).attr('href', keyword)[0];
        };

        this.handleKeydown = function (e) {
            if (list.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) {
                var wordRange = context.invoke('editor.createRange').getWordRange();
                this.lastWordRange = wordRange;
            }
        };

        this.handleKeyup = function (e) {
            if (list.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) {
                this.replace();
            }
        };
    };

    /**
     * textarea auto sync.
     */
    var AutoSync = function (context) {
        var $note = context.layoutInfo.note;

        this.events = {
            'summernote.change': function () {
                $note.val(context.invoke('code'));
            }
        };

        this.shouldInitialize = function () {
            return dom.isTextarea($note[0]);
        };
    };

    var ButtonMaterialize = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $toolbar = context.layoutInfo.toolbar;
        var options = context.options;
        var lang = options.langInfo;

        var invertedKeyMap = func.invertObject(options.keyMap[agent.isMac ? 'mac' : 'pc']);

        var representShortcut = this.representShortcut = function (editorMethod) {
            var shortcut = invertedKeyMap[editorMethod];
            if (!shortcut) {
                return '';
            }

            if (agent.isMac) {
                shortcut = shortcut.replace('CMD', '⌘').replace('SHIFT', '⇧');
            }

            shortcut = shortcut.replace('BACKSLASH', '\\')
                .replace('SLASH', '/')
                .replace('LEFTBRACKET', '[')
                .replace('RIGHTBRACKET', ']');

            return ' (' + shortcut + ')';
        };

        this.initialize = function () {
            this.addToolbarButtons();
            this.addImagePopoverButtons();
            this.addLinkPopoverButtons();
        };

        this.addToolbarButtons = function () {
            context.memo('button.style', function () {
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<i class="material-icons">border_color</i> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.style.style,
                        data: {
                            activates: 'dropdown-style',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdown({
                        id: 'dropdown-style',
                        items: context.options.styleTags,
                        lang: context.options.langInfo.style,
                        click: context.createInvokeHandler('editor.formatBlock')
                    })
                ]).render();
            });

            context.memo('button.specialStyle', function () {
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<i class="material-icons">insert_comment</i> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.style.specialStyle,
                        data: {
                            activates: 'dropdown-specialStyle',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdown({
                        id: 'dropdown-specialStyle',
                        items: context.options.specialStyleTags,
                        lang: context.options.langInfo.specialStyle,
                        click: context.createInvokeHandler('editor.formatSpecialBlock')
                    })
                ]).render();
            });

            context.memo('button.bold', function () {
                return ui.button({
                    className: 'note-btn-bold',
                    contents: '<i class="material-icons">format_bold</i>',
                    tooltip: lang.font.bold + representShortcut('bold'),
                    click: context.createInvokeHandler('editor.bold')
                }).render();
            });

            context.memo('button.italic', function () {
                return ui.button({
                    className: 'note-btn-italic',
                    contents: '<i class="material-icons">format_italic</i>',
                    tooltip: lang.font.italic + representShortcut('italic'),
                    click: context.createInvokeHandler('editor.italic')
                }).render();
            });

            context.memo('button.underline', function () {
                return ui.button({
                    className: 'note-btn-underline',
                    contents: '<i class="material-icons">format_underlined</i>',
                    tooltip: lang.font.underline + representShortcut('underline'),
                    click: context.createInvokeHandler('editor.underline')
                }).render();
            });

            context.memo('button.strikethrough', function () {
                return ui.button({
                    className: 'note-btn-strikethrough',
                    contents: '<i class="material-icons">strikethrough_s</i>',
                    tooltip: lang.font.strikethrough + representShortcut('strikethrough'),
                    click: context.createInvokeHandler('editor.strikethrough')
                }).render();
            });

            context.memo('button.subscript', function () {
                return ui.button({
                    className: 'note-btn-subscript',
                    contents: '<i class="material-icons">vertical_align_bottom</i>',
                    tooltip: lang.font.subscript + representShortcut('subscript'),
                    click: context.createInvokeHandler('editor.subscript')
                }).render();
            });

            context.memo('button.superscript', function () {
                return ui.button({
                    className: 'note-btn-superscript',
                    contents: '<i class="material-icons">vertical_align_top</i>',
                    tooltip: lang.font.superscript + representShortcut('superscript'),
                    click: context.createInvokeHandler('editor.superscript')
                }).render();
            });

            context.memo('button.clear', function () {
                return ui.button({
                    contents: '<i class="material-icons">clear</i>',
                    tooltip: lang.font.clear + representShortcut('removeFormat'),
                    click: context.createInvokeHandler('editor.removeFormat')
                }).render();
            });

            context.memo('button.fontname', function () {
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<span class="note-current-fontname"/> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.font.name,
                        data: {
                            activates: 'dropdown-fontname',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdownCheck({
                        id: 'dropdown-fontname',
                        className: 'dropdown-fontname',
                        items: options.fontNames.filter(function (name) {
                            return agent.isFontInstalled(name) ||
                                list.contains(options.fontNamesIgnoreCheck, name);
                        }),
                        click: context.createInvokeHandler('editor.fontName')
                    })
                ]).render();
            });

            context.memo('button.fontsize', function () {
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<span class="note-current-fontsize"/> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.font.size,
                        data: {
                            activates: 'dropdown-fontsize',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdownCheck({
                        id: 'dropdown-fontsize',
                        className: 'dropdown-fontsize',
                        items: options.fontSizes,
                        click: context.createInvokeHandler('editor.fontSize')
                    })
                ]).render();
            });

            context.memo('button.color', function () {

                var tabUniqueId = func.uniqueId('color-tab');

                return ui.buttonGroup({
                    className: 'note-color',
                    children: [
                        ui.button({
                            className: 'note-current-color-button',
                            contents: '<i class="material-icons">format_color_text</i>',
                            tooltip: lang.color.recent,
                            click: context.createInvokeHandler('editor.color'),
                            callback: function ($button) {
                                var $recentColor = $button.find('.note-recent-color');
                                $recentColor.css({
                                    'background-color': 'yellow'
                                });

                                $button.data('value', {
                                    backColor: 'yellow'
                                });
                            }
                        }),
                        ui.button({
                            className: 'dropdown-button btn',
                            contents: '<i class="material-icons left">arrow_drop_down</i>',
                            tooltip: lang.color.more,
                            data: {
                                activates: 'dropdown-color',
                                constrainwidth: false
                            }
                        }),
                        ui.dropdown({
                            id: 'dropdown-color',
                            className: 'dropdown-color',
                            items: [
                                '<li>',
                                '<div class="col s12">',
                                '<ul class="tabs">',
                                '<li class="tab col s6"><a href="#' + tabUniqueId + '-foreColor" class="active">' + lang.color.foreground + '</a></li>',
                                '<li class="tab col s6"><a href="#' + tabUniqueId + '-backColor">' + lang.color.background + '</a></li>',
                                '</ul>',
                                '</div>',
                                '<div class="col s12 colorTable">',
                                '<div id="' + tabUniqueId + '-foreColor">',
                                '<div class="note-color-reset waves-effect waves-light btn" data-event="foreColor" data-value="' + options.defaultTextColor + '" title="' + lang.color.reset + '">',
                                lang.color.resetToDefault,
                                '</div>',
                                '<div class="colorName"></div>',
                                '<div class="note-holder" data-event="foreColor"></div>',
                                '</div>',
                                '<div id="' + tabUniqueId + '-backColor">',
                                '<div class="note-color-reset waves-effect waves-light btn" data-event="backColor"' + ' data-value="' + options.defaultBackColor + '" title="' + lang.color.transparent + '">',
                                lang.color.setTransparent,
                                '</div>',
                                '<div class="colorName"></div>',
                                '<div class="note-holder" data-event="backColor"></div>',
                                '</div>',
                                '</div>',
                                '</li>'
                            ].join(''),
                            callback: function ($dropdown) {
                                $dropdown.find('.note-holder').each(function () {
                                    var $holder = $(this);
                                    $holder.append(ui.palette({
                                        colors: options.colors,
                                        colorTitles: options.colorTitles,
                                        eventName: $holder.data('event')
                                    }).render());
                                });
                            },
                            click: function (event) {
                                var $button = $(event.target);
                                var eventName = $button.data('event');
                                var value = $button.data('value');

                                if (eventName && value) {
                                    var key = eventName === 'backColor' ? 'background-color' : 'color';
                                    var $color = $button.closest('.note-color').find('.note-recent-color');
                                    var $currentButton = $button.closest('.note-color').find('.note-current-color-button');

                                    var colorInfo = $currentButton.data('value');
                                    colorInfo[eventName] = value;
                                    $color.css(key, value);
                                    $currentButton.data('value', colorInfo);

                                    context.invoke('editor.' + eventName, value);
                                }
                            }
                        })
                    ]
                }).render();
            });

            context.memo('button.ol', function () {
                return ui.button({
                    contents: '<i class="material-icons">format_list_bulleted</i>',
                    tooltip: lang.lists.unordered + representShortcut('insertUnorderedList'),
                    click: context.createInvokeHandler('editor.insertUnorderedList')
                }).render();
            });

            context.memo('button.ul', function () {
                return ui.button({
                    contents: '<i class="material-icons">format_list_numbered</i>',
                    tooltip: lang.lists.ordered + representShortcut('insertOrderedList'),
                    click: context.createInvokeHandler('editor.insertOrderedList')
                }).render();
            });

            context.memo('button.paragraph', function () {
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<i class="material-icons">format_textdirection_l_to_r</i> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.paragraph.paragraph,
                        data: {
                            activates: 'dropdown-align',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdown([
                        ui.buttonGroup({
                            id: 'dropdown-align',
                            className: 'dropdown-align',
                            children: [
                                ui.button({
                                    contents: '<i class="material-icons">format_align_left</i>',
                                    tooltip: lang.paragraph.left + representShortcut('justifyLeft'),
                                    click: context.createInvokeHandler('editor.justifyLeft')
                                }),
                                ui.button({
                                    contents: '<i class="material-icons">format_align_center</i>',
                                    tooltip: lang.paragraph.center + representShortcut('justifyCenter'),
                                    click: context.createInvokeHandler('editor.justifyCenter')
                                }),
                                ui.button({
                                    contents: '<i class="material-icons">format_align_right</i>',
                                    tooltip: lang.paragraph.right + representShortcut('justifyRight'),
                                    click: context.createInvokeHandler('editor.justifyRight')
                                }),
                                ui.button({
                                    contents: '<i class="material-icons">format_align_justify</i>',
                                    tooltip: lang.paragraph.justify + representShortcut('justifyFull'),
                                    click: context.createInvokeHandler('editor.justifyFull')
                                })
                            ]
                        }),
                        ui.buttonGroup({
                            className: 'note-list',
                            children: [
                                ui.button({
                                    contents: '<i class="material-icons">format_indent_decrease</i>',
                                    tooltip: lang.paragraph.outdent + representShortcut('outdent'),
                                    click: context.createInvokeHandler('editor.outdent')
                                }),
                                ui.button({
                                    contents: '<i class="material-icons">format_indent_increase</i>',
                                    tooltip: lang.paragraph.indent + representShortcut('indent'),
                                    click: context.createInvokeHandler('editor.indent')
                                })
                            ]
                        })
                    ])
                ]).render();
            });

            context.memo('button.height', function () {
                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<i class="material-icons">format_size</i> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.font.height,
                        data: {
                            activates: 'dropdown-line-height',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdownCheck({
                        id: 'dropdown-line-height',
                        className: 'dropdown-line-height',
                        items: options.lineHeights,
                        click: context.createInvokeHandler('editor.lineHeight')
                    })
                ]).render();
            });


            context.memo('button.undo', function () {
                return ui.button({
                    contents: '<i class="material-icons">undo</i>',
                    tooltip: lang.lists.undo + representShortcut('undo'),
                    click: context.createInvokeHandler('editor.undo')
                }).render();
            });

            context.memo('button.redo', function () {
                return ui.button({
                    contents: '<i class="material-icons">redo</i>',
                    tooltip: lang.lists.redo + representShortcut('redo'),
                    click: context.createInvokeHandler('editor.redo')
                }).render();
            });

            context.memo('button.table', function () {
                var labelUniqueId = func.uniqueId('table-label');

                return ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-button btn',
                        contents: '<i class="material-icons">border_all</i> <i class="material-icons left">arrow_drop_down</i>',
                        tooltip: lang.table.table,
                        data: {
                            activates: 'dropdown-table',
                            constrainwidth: false
                        }
                    }),
                    ui.dropdown({
                        id: 'dropdown-table',
                        className: 'dropdown-table',
                        items: [
                            '<div class="row">',
                            '<div class="col s6 preventDropClose"><input type="checkbox" id="' + labelUniqueId + '-bordered" checked="checked" /><label for="' + labelUniqueId + '-bordered">' + lang.table.bordered + '</label></div>',
                            '<div class="col s6 preventDropClose"><input type="checkbox" id="' + labelUniqueId + '-striped" checked="checked" /><label for="' + labelUniqueId + '-striped">' + lang.table.striped + '</label></div>',
                            '</div>',
                            '<div class="row">',
                            '<div class="col s6 preventDropClose"><input type="checkbox" id="' + labelUniqueId + '-hoverable" checked="checked" /><label for="' + labelUniqueId + '-hoverable">' + lang.table.hoverable + '</label></div>',
                            '<div class="col s6 preventDropClose"><input type="checkbox" id="' + labelUniqueId + '-responsive" checked="checked" /><label for="' + labelUniqueId + '-responsive">' + lang.table.responsive + '</label></div>',
                            '</div>',
                            '<div class="note-dimension-picker">',
                            '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>',
                            '<div class="note-dimension-picker-highlighted"></div>',
                            '<div class="note-dimension-picker-unhighlighted"></div>',
                            '</div>',
                            '<div class="note-dimension-display"> 1 x 1 </div>',
                        ].join('')
                    })
                ], {
                    callback: function ($node) {
                        var $catcher = $node.find('.note-dimension-picker-mousecatcher');
                        $catcher.css({
                            width: options.insertTableMaxSize.col + 'em',
                            height: options.insertTableMaxSize.row + 'em'
                        }).click(context.createInvokeHandler('editor.insertTable'))
                            .on('mousemove', self.tableMoveHandler);
                    }
                }).render();
            });

            context.memo('button.link', function () {
                return ui.button({
                    contents: '<i class="material-icons">insert_link</i>',
                    tooltip: lang.link.link,
                    click: context.createInvokeHandler('linkDialog.show')
                }).render();
            });

            context.memo('button.picture', function () {
                return ui.button({
                    contents: '<i class="material-icons">insert_photo</i>',
                    tooltip: lang.image.image,
                    click: context.createInvokeHandler('imageDialog.show')
                }).render();
            });

            context.memo('button.video', function () {
                return ui.button({
                    contents: '<i class="material-icons">ondemand_video</i>',
                    tooltip: lang.video.video,
                    click: context.createInvokeHandler('videoDialog.show')
                }).render();
            });

            context.memo('button.hr', function () {
                return ui.button({
                    contents: '<i class="material-icons">vertical_align_center</i>',
                    tooltip: lang.hr.insert + representShortcut('insertHorizontalRule'),
                    click: context.createInvokeHandler('editor.insertHorizontalRule')
                }).render();
            });

            context.memo('button.fullscreen', function () {
                return ui.button({
                    className: 'btn-fullscreen',
                    contents: '<i class="material-icons">settings_overscan</i>',
                    tooltip: lang.options.fullscreen,
                    click: context.createInvokeHandler('fullscreen.toggle')
                }).render();
            });

            context.memo('button.codeview', function () {
                return ui.button({
                    className: 'btn-codeview',
                    contents: '<i class="material-icons">code</i>',
                    tooltip: lang.options.codeview,
                    click: context.createInvokeHandler('codeview.toggle')
                }).render();
            });

            context.memo('button.help', function () {
                return ui.button({
                    contents: '<i class="material-icons">help</i>',
                    tooltip: lang.options.help,
                    click: context.createInvokeHandler('helpDialog.show')
                }).render();
            });

            context.memo('button.specialchar', function () {
                return ui.button({
                    contents: '<i class="material-icons">translate</i>',
                    tooltip: lang.specialChar.specialChar,
                    click: context.createInvokeHandler('specialCharDialog.show')
                }).render();
            });
        };

        /**
         *  image : [
         ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
         ['float', ['floatLeft', 'floatRight', 'floatNone' ]],
         ['remove', ['removeMedia']]
         ],
         */
        this.addImagePopoverButtons = function () {
            // Image Size Buttons
            context.memo('button.imageSize100', function (context) {
                return ui.button({
                    contents: '<span class="note-fontsize-10">100%</span>',
                    tooltip: lang.image.resizeFull,
                    click: context.createInvokeHandler('editor.resize', '1')
                }).render();
            });
            context.memo('button.imageSize50', function (context) {
                return ui.button({
                    contents: '<span class="note-fontsize-10">50%</span>',
                    tooltip: lang.image.resizeHalf,
                    click: context.createInvokeHandler('editor.resize', '0.5')
                }).render();
            });
            context.memo('button.imageSize25', function (context) {
                return ui.button({
                    contents: '<span class="note-fontsize-10">25%</span>',
                    tooltip: lang.image.resizeQuarter,
                    click: context.createInvokeHandler('editor.resize', '0.25')
                }).render();
            });

            // Float Buttons
            context.memo('button.floatLeft', function (context) {
                return ui.button({
                    contents: '<i class="material-icons">format_align_left</i>',
                    tooltip: lang.image.floatLeft,
                    click: context.createInvokeHandler('editor.floatMe', 'left')
                }).render();
            });

            context.memo('button.floatRight', function (context) {
                return ui.button({
                    contents: '<i class="material-icons">format_align_right</i>',
                    tooltip: lang.image.floatRight,
                    click: context.createInvokeHandler('editor.floatMe', 'right')
                }).render();
            });

            context.memo('button.floatNone', function (context) {
                return ui.button({
                    contents: '<i class="material-icons">format_align_justify</i>',
                    tooltip: lang.image.floatNone,
                    click: context.createInvokeHandler('editor.floatMe', 'none')
                }).render();
            });

            // Remove Buttons
            context.memo('button.removeMedia', function (context) {
                return ui.button({
                    contents: '<i class="material-icons">delete</i>',
                    tooltip: lang.image.remove,
                    click: context.createInvokeHandler('editor.removeMedia')
                }).render();
            });
        };

        this.addLinkPopoverButtons = function () {
            context.memo('button.linkDialogShow', function (context) {
                return ui.button({
                    contents: '<i class="material-icons">create</i>',
                    tooltip: lang.link.edit,
                    click: context.createInvokeHandler('linkDialog.show')
                }).render();
            });

            context.memo('button.unlink', function (context) {
                return ui.button({
                    contents: '<i class="material-icons">clear</i>',
                    tooltip: lang.link.unlink,
                    click: context.createInvokeHandler('editor.unlink')
                }).render();
            });
        };

        this.build = function ($container, groups) {
            for (var groupIdx = 0, groupLen = groups.length; groupIdx < groupLen; groupIdx++) {
                var group = groups[groupIdx];
                var groupName = group[0];
                var buttons = group[1];

                var $group = ui.buttonGroup({
                    className: 'note-' + groupName
                }).render();

                for (var idx = 0, len = buttons.length; idx < len; idx++) {
                    var button = context.memo('button.' + buttons[idx]);
                    if (button) {
                        $group.append(typeof button === 'function' ? button(context) : button);
                    }
                }
                $group.appendTo($container);
            }
        };

        this.updateCurrentStyle = function () {
            var styleInfo = context.invoke('editor.currentStyle');
            this.updateBtnStates({
                '.note-btn-bold': function () {
                    return styleInfo['font-bold'] === 'bold';
                },
                '.note-btn-italic': function () {
                    return styleInfo['font-italic'] === 'italic';
                },
                '.note-btn-underline': function () {
                    return styleInfo['font-underline'] === 'underline';
                }
            });

            if (styleInfo['font-family']) {
                var fontNames = styleInfo['font-family'].split(',').map(function (name) {
                    return name.replace(/[\'\"]/g, '')
                        .replace(/\s+$/, '')
                        .replace(/^\s+/, '');
                });
                var fontName = list.find(fontNames, function (name) {
                    return agent.isFontInstalled(name) ||
                        list.contains(options.fontNamesIgnoreCheck, name);
                });

                $toolbar.find('.dropdown-fontname li a').each(function () {
                    // always compare string to avoid creating another func.
                    var isChecked = ($(this).data('value') + '') === (fontName + '');
                    this.className = isChecked ? 'checked' : '';
                });
                $toolbar.find('.note-current-fontname').text(fontName);
            }

            if (styleInfo['font-size']) {
                var fontSize = styleInfo['font-size'];
                $toolbar.find('.dropdown-fontsize li a').each(function () {
                    // always compare with string to avoid creating another func.
                    var isChecked = ($(this).data('value') + '') === (fontSize + '');
                    this.className = isChecked ? 'checked' : '';
                });
                $toolbar.find('.note-current-fontsize').text(fontSize);
            }

            if (styleInfo['line-height']) {
                var lineHeight = styleInfo['line-height'];
                $toolbar.find('.dropdown-line-height li a').each(function () {
                    // always compare with string to avoid creating another func.
                    var isChecked = ($(this).data('value') + '') === (lineHeight + '');
                    this.className = isChecked ? 'checked' : '';
                });
            }
        };

        this.updateBtnStates = function (infos) {
            $.each(infos, function (selector, pred) {
                ui.toggleBtnActive($toolbar.find(selector), pred());
            });
        };

        this.tableMoveHandler = function (event) {
            var PX_PER_EM = 18;
            var $picker = $(event.target.parentNode); // target is mousecatcher
            var $dimensionDisplay = $picker.next();
            var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
            var $highlighted = $picker.find('.note-dimension-picker-highlighted');
            var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');

            var posOffset;
            // HTML5 with jQuery - e.offsetX is undefined in Firefox
            if (event.offsetX === undefined) {
                var posCatcher = $(event.target).offset();
                posOffset = {
                    x: event.pageX - posCatcher.left,
                    y: event.pageY - posCatcher.top
                };
            } else {
                posOffset = {
                    x: event.offsetX,
                    y: event.offsetY
                };
            }

            var dim = {
                c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
                r: Math.ceil(posOffset.y / PX_PER_EM) || 1
            };

            $highlighted.css({width: dim.c + 'em', height: dim.r + 'em'});
            $catcher.data('value', dim.c + 'x' + dim.r);

            if (3 < dim.c && dim.c < options.insertTableMaxSize.col) {
                $unhighlighted.css({width: dim.c + 1 + 'em'});
            }

            if (3 < dim.r && dim.r < options.insertTableMaxSize.row) {
                $unhighlighted.css({height: dim.r + 1 + 'em'});
            }

            $dimensionDisplay.html(dim.c + ' x ' + dim.r);
        };
    };

    var Toolbar = function (context) {
        var ui = $.summernote.ui;

        var $note = context.layoutInfo.note;
        var $toolbar = context.layoutInfo.toolbar;
        var options = context.options;

        this.shouldInitialize = function () {
            return !options.airMode;
        };

        this.initialize = function () {
            if (options.airMode) {
                return;
            }

            options.toolbar = options.toolbar || [];

            if (!options.toolbar.length) {
                $toolbar.hide();
            } else {
                context.invoke('buttons.build', $toolbar, options.toolbar);
            }

            // Utility ? Extremely slow down editor !
            //$note.on('summernote.keyup summernote.mouseup summernote.change', function () {
            //    context.invoke('buttons.updateCurrentStyle');
            //});

            context.invoke('buttons.updateCurrentStyle');
        };

        this.destroy = function () {
            $toolbar.children().remove();
        };

        this.updateFullscreen = function (isFullscreen) {
            ui.toggleBtnActive($toolbar.find('.btn-fullscreen'), isFullscreen);
        };

        this.updateCodeview = function (isCodeview) {
            ui.toggleBtnActive($toolbar.find('.btn-codeview'), isCodeview);
            if (isCodeview) {
                this.deactivate();
            } else {
                this.activate();
            }
        };

        this.activate = function () {
            var $btn = $toolbar.find('button').not('.btn-codeview');
            ui.toggleBtn($btn, true);
        };

        this.deactivate = function () {
            var $btn = $toolbar.find('button').not('.btn-codeview');
            ui.toggleBtn($btn, false);
        };
    };

    var LinkDialog = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;

        this.initialize = function () {
            var $container = options.dialogsInBody ? $(document.body) : $editor;

            var checkboxUniqueId = func.uniqueId('link-checkbox');

            var body = '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input class="note-link-text" type="text" />' +
                '<label>' + lang.link.textToDisplay + '</label>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input class="note-link-url" type="text" value="http://" />' +
                '<label class="active">' + lang.link.url + '</label>' +
                '</div>' +
                '</div>' +
                (!options.disableLinkTarget ?
                '<div class="row">' +
                '<div class="col s12">' +
                '<input type="checkbox" id="' + checkboxUniqueId + '-noteInsertLinkNewWindow" checked="checked" />' +
                '<label for="' + checkboxUniqueId + '-noteInsertLinkNewWindow">' + lang.link.openInNewWindow + '</label>' +
                '</div>' +
                '</div>'
                    : '');

            var footer = '<button href="#" class="waves-effect waves-light btn note-link-btn disabled" disabled>' + lang.link.insert + '</button>' +
                '<button class="waves-effect waves-light btn btn-close">' + lang.shortcut.close + '</button>';

            this.$dialog = ui.dialog({
                className: 'link-dialog',
                title: lang.link.insert,
                body: body,
                footer: footer
            }).render().appendTo($container);
        };

        this.destroy = function () {
            ui.hideDialog(this.$dialog);
            this.$dialog.remove();
        };

        this.bindEnterKey = function ($input, $btn) {
            $input.on('keypress', function (event) {
                if (event.keyCode === key.code.ENTER) {
                    $btn.trigger('click');
                }
            });
        };

        /**
         * Show link dialog and set event handlers on dialog controls.
         *
         * @param {Object} linkInfo
         * @return {Promise}
         */
        this.showLinkDialog = function (linkInfo) {
            return $.Deferred(function (deferred) {
                var $linkDialog = self.$dialog.find('.note-link-dialog'),
                    $linkText = self.$dialog.find('.note-link-text'),
                    $linkUrl = self.$dialog.find('.note-link-url'),
                    $linkBtn = self.$dialog.find('.note-link-btn'),
                    $linkTextLabel = $linkText.next('label'),
                    $openInNewWindow = self.$dialog.find('input[type=checkbox]'),
                    $closeBtn = self.$dialog.find('.btn-close');

                var onOpenDialog = function () {
                    $linkText.val(linkInfo.text);

                    if (linkInfo.text.length > 0) $linkTextLabel.addClass('active');

                    $linkText.on('keyup', function () {
                        ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
                        // if linktext was modified by keyup,
                        // stop cloning text from linkUrl
                        linkInfo.text = $linkText.val();
                    });

                    // if no url was given, copy text to url
                    if (!linkInfo.url) {
                        linkInfo.url = linkInfo.text || 'http://';
                        ui.toggleBtn($linkBtn, linkInfo.text);
                    }

                    $linkUrl.on('keyup', function () {
                        ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
                        // display same link on `Text to display` input
                        // when create a new link
                        if (!linkInfo.text) {
                            $linkTextLabel.addClass('active');
                            $linkText.val($linkUrl.val());
                        }
                    }).val(linkInfo.url).trigger('focus').trigger('select');

                    $closeBtn.click(function (event) {
                        event.preventDefault();

                        self.$dialog.closeModal();
                    });

                    self.bindEnterKey($linkUrl, $linkBtn);
                    self.bindEnterKey($linkText, $linkBtn);

                    $openInNewWindow.prop('checked', linkInfo.isNewWindow);

                    $linkBtn.one('click', function (event) {
                        event.preventDefault();

                        deferred.resolve({
                            range: linkInfo.range,
                            url: $linkUrl.val(),
                            text: $linkText.val(),
                            isNewWindow: $openInNewWindow.is(':checked')
                        });
                        self.$dialog.closeModal();
                    });
                };

                //ui.onDialogHidden(self.$dialog, function () {
                var onCloseDialog = function () {
                    // detach events
                    $linkText.off('input keypress');
                    $linkUrl.off('input keypress');
                    $linkBtn.off('click');

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                };

                ui.showDialog(self.$dialog, onOpenDialog, onCloseDialog);
            }).promise();
        };

        /**
         * @param {Object} layoutInfo
         */
        this.show = function () {
            var linkInfo = context.invoke('editor.getLinkInfo');

            context.invoke('editor.saveRange');
            this.showLinkDialog(linkInfo).then(function (linkInfo) {
                context.invoke('editor.restoreRange');
                context.invoke('editor.createLink', linkInfo);
            }).fail(function () {
                context.invoke('editor.restoreRange');
            });
        };
        context.memo('help.linkDialog.show', options.langInfo.help['linkDialog.show']);
    };

    var LinkPopover = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editingArea = context.layoutInfo.editingArea;
        var options = context.options;

        this.events = {
            'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function () {
                self.update();
            },
            'summernote.dialog.shown': function () {
                self.hide();
            }
        };

        this.shouldInitialize = function () {
            return !list.isEmpty(options.popover.link);
        };

        this.initialize = function () {
            this.$popover = ui.popover({
                className: 'note-link-popover',
                callback: function ($node) {
                    var $content = $node.find('.popover-content');
                    $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
                }
            }).render().appendTo($editingArea);

            var $content = this.$popover.find('.popover-content');

            context.invoke('buttons.build', $content, options.popover.link);
        };

        this.destroy = function () {
            this.$popover.remove();
        };

        this.update = function () {
            var rng = context.invoke('editor.createRange');
            if (rng.isCollapsed() && rng.isOnAnchor()) {
                var anchor = dom.ancestor(rng.sc, dom.isAnchor);
                var href = $(anchor).attr('href');
                this.$popover.find('a').attr('href', href).html(href);

                var pos = dom.posFromPlaceholder(anchor);
                this.$popover.css({
                    display: 'block',
                    left: pos.left,
                    top: pos.bottom
                });
            } else {
                this.hide();
            }
        };

        this.hide = function () {
            this.$popover.hide();
        };
    };

    var ImageDialog = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;

        this.initialize = function () {
            var $container = options.dialogsInBody ? $(document.body) : $editor;

            var imageLimitation = '';
            if (options.maximumImageFileSize) {
                var unit = Math.floor(Math.log(options.maximumImageFileSize) / Math.log(1024));
                var readableSize = (options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 +
                    ' ' + ' KMGTP'[unit] + 'B';
                imageLimitation = '<small>' + lang.image.maximumFileSize + ' : ' + readableSize + '</small>';
            }

            var body = '<div class="row">' +
                '<div class="col s12">' +
                '<div class="file-field input-field">' +
                '<div class="btn">' +
                '<span>' + lang.image.image + '</span>' +
                '<input class="note-image-input" name="files" type="file" />' +
                '</div>' +
                '<div class="file-path-wrapper">' +
                '<input class="file-path" type="text" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input class="note-image-url" type="text" />' +
                '<label>' + lang.image.url + '</label>' +
                '</div>' +
                '</div>';

            var footer = '<button href="#" class="waves-effect waves-light btn note-image-btn disabled" disabled>' + lang.image.insert + '</button>' +
                '<button class="waves-effect waves-light btn btn-close">' + lang.shortcut.close + '</button>';

            this.$dialog = ui.dialog({
                title: lang.image.insert,
                body: body,
                footer: footer
            }).render().appendTo($container);
        };

        this.destroy = function () {
            ui.hideDialog(this.$dialog);
            this.$dialog.remove();
        };

        this.bindEnterKey = function ($input, $btn) {
            $input.on('keypress', function (event) {
                if (event.keyCode === key.code.ENTER) {
                    $btn.trigger('click');
                }
            });
        };

        this.insertImages = function (files) {
            var callbacks = options.callbacks;

            // If onImageUpload options setted
            if (callbacks.onImageUpload) {
                context.triggerEvent('image.upload', files);
                // else insert Image as dataURL
            } else {
                $.each(files, function (idx, file) {
                    var filename = file.name;
                    if (options.maximumImageFileSize && options.maximumImageFileSize < file.size) {
                        context.triggerEvent('image.upload.error', lang.image.maximumFileSizeError);
                    } else {
                        async.readFileAsDataURL(file).then(function (dataURL) {
                            context.invoke('editor.insertImage', dataURL, filename);
                        }).fail(function () {
                            context.triggerEvent('image.upload.error');
                        });
                    }
                });
            }
        };

        this.show = function () {
            context.invoke('editor.saveRange');
            this.showImageDialog().then(function (data) {
                // [workaround] hide dialog before restore range for IE range focus
                ui.hideDialog(self.$dialog);
                context.invoke('editor.restoreRange');

                if (typeof data === 'string') {
                    // image url
                    context.invoke('editor.insertImage', data);
                } else {
                    // array of files
                    self.insertImages(data);
                }
            }).fail(function () {
                context.invoke('editor.restoreRange');
            });
        };

        /**
         * show image dialog
         *
         * @param {jQuery} $dialog
         * @return {Promise}
         */
        this.showImageDialog = function () {
            return $.Deferred(function (deferred) {
                var $imageInput = self.$dialog.find('.note-image-input'),
                    $imageUrl = self.$dialog.find('.note-image-url'),
                    $imageBtn = self.$dialog.find('.note-image-btn'),
                    $closeBtn = self.$dialog.find('.btn-close');

                var onOpenDialog = function () {
                    // Cloning imageInput to clear element.
                    $imageInput.replaceWith($imageInput.clone()
                        .on('change', function () {
                            deferred.resolve(this.files || this.value);
                            $imageUrl.val('');
                            ui.hideDialog(self.$dialog);
                        })
                        .val('')
                    );

                    $imageBtn.click(function (event) {
                        event.preventDefault();

                        deferred.resolve($imageUrl.val());
                        $imageUrl.val('');
                        ui.hideDialog(self.$dialog);
                    });

                    $closeBtn.click(function (event) {
                        event.preventDefault();

                        ui.hideDialog(self.$dialog);
                    });

                    $imageUrl.on('keyup paste', function (event) {
                        var url;

                        if (event.type === 'paste') {
                            url = event.originalEvent.clipboardData.getData('text');
                        } else {
                            url = $imageUrl.val();
                        }

                        ui.toggleBtn($imageBtn, url);
                    }).val('').trigger('focus');
                    self.bindEnterKey($imageUrl, $imageBtn);
                };

                var onCloseDialog = function () {
                    $imageInput.off('change');
                    $imageUrl.off('keyup paste keypress');
                    $imageBtn.off('click');

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                };

                ui.showDialog(self.$dialog, onOpenDialog, onCloseDialog);
            });
        };
    };

    var ImagePopover = function (context) {
        var ui = $.summernote.ui;

        var $editingArea = context.layoutInfo.editingArea;
        var options = context.options;

        this.shouldInitialize = function () {
            return !list.isEmpty(options.popover.image);
        };

        this.initialize = function () {
            this.$popover = ui.popover({
                className: 'note-image-popover'
            }).render().appendTo($editingArea);
            var $content = this.$popover.find('.popover-content');

            context.invoke('buttons.build', $content, options.popover.image);
        };

        this.destroy = function () {
            this.$popover.remove();
        };

        this.update = function (target) {
            if (dom.isImg(target)) {
                var pos = dom.posFromPlaceholder(target);
                this.$popover.css({
                    display: 'block',
                    left: pos.left,
                    top: pos.top
                });
            } else {
                this.hide();
            }
        };

        this.hide = function () {
            this.$popover.hide();
        };
    };

    var VideoDialog = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;

        this.getTextOnRange = function () {
            var rng = context.invoke('editor.createRange');

            // if range on anchor, expand range with anchor
            if (rng.isOnAnchor()) {
                var anchor = dom.ancestor(rng.sc, dom.isAnchor);
                rng = range.createFromNode(anchor);
            }

            return rng.toString();
        };

        this.initialize = function () {
            var $container = options.dialogsInBody ? $(document.body) : $editor;

            var body = '<div class="row">' +
                '<div class="input-field col s12">' +
                '<input class="note-video-url" type="text" placeholder="' + lang.video.providers + '"/>' +
                '<label class="active">' + lang.video.url + '</label>' +
                '</div>' +
                '</div>';

            var footer = '<button href="#" class="waves-effect waves-light btn note-video-btn disabled" disabled>' + lang.video.insert + '</button>' + '<button class="waves-effect waves-light btn btn-close">' + lang.shortcut.close + '</button>';

            this.$dialog = ui.dialog({
                title: lang.video.insert,
                body: body,
                footer: footer
            }).render().appendTo($container);
        };

        this.destroy = function () {
            ui.hideDialog(this.$dialog);
            this.$dialog.remove();
        };

        this.bindEnterKey = function ($input, $btn) {
            $input.on('keypress', function (event) {
                if (event.keyCode === key.code.ENTER) {
                    $btn.trigger('click');
                }
            });
        };

        this.createVideoNode = function (url) {
            // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
            var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            var ytMatch = url.match(ytRegExp);

            var igRegExp = /\/\/instagram.com\/p\/(.[a-zA-Z0-9_-]*)/;
            var igMatch = url.match(igRegExp);

            var vRegExp = /\/\/vine.co\/v\/(.[a-zA-Z0-9]*)/;
            var vMatch = url.match(vRegExp);

            var vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
            var vimMatch = url.match(vimRegExp);

            var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
            var dmMatch = url.match(dmRegExp);

            var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
            var youkuMatch = url.match(youkuRegExp);

            var mp4RegExp = /^.+.(mp4|m4v)$/;
            var mp4Match = url.match(mp4RegExp);

            var oggRegExp = /^.+.(ogg|ogv)$/;
            var oggMatch = url.match(oggRegExp);

            var webmRegExp = /^.+.(webm)$/;
            var webmMatch = url.match(webmRegExp);

            var $video;
            if (ytMatch && ytMatch[1].length === 11) {
                var youtubeId = ytMatch[1];
                $video = $('<iframe>')
                    .attr('frameborder', 0)
                    .attr('src', '//www.youtube.com/embed/' + youtubeId)
                    .attr('width', '640').attr('height', '360');
            } else if (igMatch && igMatch[0].length) {
                $video = $('<iframe>')
                    .attr('frameborder', 0)
                    .attr('src', igMatch[0] + '/embed/')
                    .attr('width', '612').attr('height', '710')
                    .attr('scrolling', 'no')
                    .attr('allowtransparency', 'true');
            } else if (vMatch && vMatch[0].length) {
                $video = $('<iframe>')
                    .attr('frameborder', 0)
                    .attr('src', vMatch[0] + '/embed/simple')
                    .attr('width', '600').attr('height', '600')
                    .attr('class', 'vine-embed');
            } else if (vimMatch && vimMatch[3].length) {
                $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                    .attr('frameborder', 0)
                    .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
                    .attr('width', '640').attr('height', '360');
            } else if (dmMatch && dmMatch[2].length) {
                $video = $('<iframe>')
                    .attr('frameborder', 0)
                    .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
                    .attr('width', '640').attr('height', '360');
            } else if (youkuMatch && youkuMatch[1].length) {
                $video = $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                    .attr('frameborder', 0)
                    .attr('height', '498')
                    .attr('width', '510')
                    .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
            } else if (mp4Match || oggMatch || webmMatch) {
                $video = $('<video controls>')
                    .attr('src', url)
                    .attr('width', '640').attr('height', '360');
            } else {
                // this is not a known video link. Now what, Cat? Now what?
                return false;
            }

            $video.addClass('note-video-clip');

            return $video[0];
        };


        this.show = function () {
            var text = context.invoke('editor.getSelectedText');
            context.invoke('editor.saveRange');
            this.showVideoDialog(text).then(function (url) {
                // [workaround] hide dialog before restore range for IE range focus
                ui.hideDialog(self.$dialog);
                context.invoke('editor.restoreRange');

                // build node
                var $node = self.createVideoNode(url);

                if ($node) {
                    // insert video node
                    context.invoke('editor.insertNode', $node);
                }
            }).fail(function () {
                context.invoke('editor.restoreRange');
            });
        };

        /**
         * show image dialog
         *
         * @param {jQuery} $dialog
         * @return {Promise}
         */
        this.showVideoDialog = function (text) {
            return $.Deferred(function (deferred) {
                var $videoUrl = self.$dialog.find('.note-video-url'),
                    $videoBtn = self.$dialog.find('.note-video-btn'),
                    $closeBtn = self.$dialog.find('.btn-close');

                var onOpenDialog = function () {
                    $videoUrl.val(text).on('keyup', function () {
                        ui.toggleBtn($videoBtn, $videoUrl.val());
                    }).trigger('focus');

                    $videoBtn.click(function (event) {
                        event.preventDefault();

                        deferred.resolve($videoUrl.val());
                        ui.hideDialog(self.$dialog);
                    });

                    $closeBtn.click(function (event) {
                        event.preventDefault();

                        ui.hideDialog(self.$dialog);
                    });

                    self.bindEnterKey($videoUrl, $videoBtn);
                };

                var onCloseDialog = function () {
                    $videoUrl.off('input');
                    $videoBtn.off('click');

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                };

                ui.showDialog(self.$dialog, onOpenDialog, onCloseDialog);
            });
        };
    };

    var HelpDialog = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;

        this.createShortCutList = function () {
            var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];

            var $list = $('<div />');

            Object.keys(keyMap).forEach(function (keyString) {
                var $row = $('<div class="help-list-item note-shortcut row"/>');

                var command = keyMap[keyString];
                var str = context.memo('help.' + command) ? context.memo('help.' + command) : command;
                var $keyString = $('<label class="note-shortcut-title col s6"/>').html(keyString);
                var $description = $('<span class="note-shortcut-key col s6"/>').html(str);

                $row.html($keyString).append($description);

                $list.append($row);
            });

            return $list.html();
        };

        this.initialize = function () {
            var $container = options.dialogsInBody ? $(document.body) : $editor;

            this.$dialog = ui.dialog({
                className: 'note-help-dialog',
                title: lang.options.help,
                body: this.createShortCutList(),
                footer: '<button href="#" class="waves-effect waves-light btn modal-close">' + lang.shortcut.close + '</button>'
            }).render().appendTo($container);
        };

        this.destroy = function () {
            ui.hideDialog(this.$dialog);
            this.$dialog.remove();
        };

        /**
         * show help dialog
         *
         * @return {Promise}
         */
        this.showHelpDialog = function () {
            return $.Deferred(function (deferred) {
                var onCloseDialog = function () {
                    deferred.resolve();
                };
                ui.showDialog(self.$dialog, null, onCloseDialog);

            }).promise();
        };

        this.show = function () {
            context.invoke('editor.saveRange');
            this.showHelpDialog().then(function () {
                context.invoke('editor.restoreRange');
            });
        };
    };

    var AirPopover = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editingArea = context.layoutInfo.editingArea;
        var options = context.options;

        var AIR_MODE_POPOVER_X_OFFSET = 20;

        this.events = {
            'summernote.keyup summernote.mouseup summernote.scroll': function () {
                self.update();
            },
            'summernote.change summernote.dialog.shown': function () {
                self.hide();
            },
            //'summernote.focusout': function (we, e) {
            //    if (!$('.dropdown').is(':focus') && (!e.relatedTarget || !dom.ancestor(e.relatedTarget, func.eq($editingArea[0])))) {
            //        self.hide();
            //    }
            //}
        };

        this.shouldInitialize = function () {
            return options.airMode && !list.isEmpty(options.popover.air);
        };

        this.initialize = function () {
            this.$popover = ui.popover({
                className: 'note-air-popover'
            }).render().appendTo($editingArea);
            var $content = this.$popover.find('.popover-content');

            context.invoke('buttons.build', $content, options.popover.air);
        };

        this.destroy = function () {
            if (!options.airMode) {
                return;
            }

            this.$popover.remove();
        };

        this.update = function () {
            var styleInfo = context.invoke('editor.currentStyle');
            if (styleInfo.range && !styleInfo.range.isCollapsed()) {
                var rect = list.last(styleInfo.range.getClientRects());
                if (rect) {
                    var bnd = func.rect2bnd(rect);
                    var posEditingArea = $editingArea.offset();

                    var toolbarPosition = Math.max(bnd.left + bnd.width / 2, 0) - posEditingArea.left
                    var $arrow = this.$popover.find('.arrow');

                    if (toolbarPosition > ($editingArea.width() - this.$popover.width())) {
                        this.$popover.css({
                            display: 'block',
                            left: 'auto',
                            right: $editingArea.width() - toolbarPosition - AIR_MODE_POPOVER_X_OFFSET,
                            top: bnd.top + bnd.height - posEditingArea.top
                        });
                        $arrow.css({
                            left: this.$popover.width() - AIR_MODE_POPOVER_X_OFFSET
                        });
                    } else {
                        this.$popover.css({
                            display: 'block',
                            left: toolbarPosition - AIR_MODE_POPOVER_X_OFFSET,
                            right: 'auto',
                            top: bnd.top + bnd.height - posEditingArea.top
                        });
                        $arrow.css({
                            left: 0
                        });
                    }
                }
            } else {
                this.hide();
            }
        };

        this.hide = function () {
            this.$popover.hide();
        };
    };

    var HintPopover = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var hint = context.options.hint || [];
        var hints = $.isArray(hint) ? hint : [hint];

        this.events = {
            'summernote.keyup': function (we, e) {
                self.handleKeyup(e);
            },
            'summernote.keydown': function (we, e) {
                self.handleKeydown(e);
            },
            'summernote.dialog.shown': function () {
                self.hide();
            }
        };

        this.shouldInitialize = function () {
            return hints.length > 0;
        };

        this.initialize = function () {
            this.lastWordRange = null;
            this.$popover = ui.popover({
                className: 'note-hint-popover'
            }).render().appendTo('body');

            this.$content = this.$popover.find('.popover-content');

            this.$content.on('click', '.note-hint-item', function () {
                self.$content.find('.active').removeClass('active');
                $(this).addClass('active');
                self.replace();
            });
        };

        this.destroy = function () {
            this.$popover.remove();
        };

        this.selectItem = function ($item) {
            this.$content.find('.active').removeClass('active');
            $item.addClass('active');

            this.$content[0].scrollTop = $item[0].offsetTop - (this.$content.innerHeight() / 2);
        };

        this.moveDown = function () {
            var $current = this.$content.find('.note-hint-item.active');
            var $next = $current.next();

            if ($next.length) {
                this.selectItem($next);
            } else {
                var $nextGroup = $current.parent().next();

                if (!$nextGroup.length) {
                    $nextGroup = this.$content.find('.note-hint-group').first();
                }

                this.selectItem($nextGroup.find('.note-hint-item').first());
            }
        };

        this.moveUp = function () {
            var $current = this.$content.find('.note-hint-item.active');
            var $prev = $current.prev();

            if ($prev.length) {
                this.selectItem($prev);
            } else {
                var $prevGroup = $current.parent().prev();

                if (!$prevGroup.length) {
                    $prevGroup = this.$content.find('.note-hint-group').last();
                }

                this.selectItem($prevGroup.find('.note-hint-item').last());
            }
        };

        this.replace = function () {
            var $item = this.$content.find('.note-hint-item.active');
            var node = this.nodeFromItem($item);
            this.lastWordRange.insertNode(node);
            range.createFromNode(node).collapse().select();

            this.lastWordRange = null;
            this.hide();
            context.invoke('editor.focus');
        };

        this.nodeFromItem = function ($item) {
            var hint = hints[$item.data('index')];
            var item = $item.data('item');
            var node = hint.content ? hint.content(item) : item;
            if (typeof node === 'string') {
                node = dom.createText(node);
            }
            return node;
        };

        this.createItemTemplates = function (hintIdx, items) {
            var hint = hints[hintIdx];
            return items.map(function (item, idx) {
                var $item = $('<div class="note-hint-item"/>');
                $item.append(hint.template ? hint.template(item) : item + '');
                $item.data({
                    'index': hintIdx,
                    'item': item
                });

                if (hintIdx === 0 && idx === 0) {
                    $item.addClass('active');
                }
                return $item;
            });
        };

        this.handleKeydown = function (e) {
            if (!this.$popover.is(':visible')) {
                return;
            }

            if (e.keyCode === key.code.ENTER) {
                e.preventDefault();
                this.replace();
            } else if (e.keyCode === key.code.UP) {
                e.preventDefault();
                this.moveUp();
            } else if (e.keyCode === key.code.DOWN) {
                e.preventDefault();
                this.moveDown();
            }
        };

        this.searchKeyword = function (index, keyword, callback) {
            var hint = hints[index];
            if (hint && hint.match.test(keyword) && hint.search) {
                var matches = hint.match.exec(keyword);
                hint.search(matches[1], callback);
            } else {
                callback();
            }
        };

        this.createGroup = function (idx, keyword) {
            var $group = $('<div class="note-hint-group note-hint-group-' + idx + '"/>');
            this.searchKeyword(idx, keyword, function (items) {
                items = items || [];
                if (items.length) {
                    $group.html(self.createItemTemplates(idx, items));
                    self.show();
                }
            });

            return $group;
        };

        this.handleKeyup = function (e) {
            if (list.contains([key.code.ENTER, key.code.UP, key.code.DOWN], e.keyCode)) {
                if (e.keyCode === key.code.ENTER) {
                    if (this.$popover.is(':visible')) {
                        return;
                    }
                }
            } else {
                var wordRange = context.invoke('editor.createRange').getWordRange();
                var keyword = wordRange.toString();
                if (hints.length && keyword) {
                    this.$content.empty();

                    var bnd = func.rect2bnd(list.last(wordRange.getClientRects()));
                    if (bnd) {
                        this.$popover.css({
                            left: bnd.left,
                            top: bnd.top + bnd.height
                        }).hide();

                        this.lastWordRange = wordRange;

                        hints.forEach(function (hint, idx) {
                            if (hint.match.test(keyword)) {
                                self.createGroup(idx, keyword).appendTo(self.$content);
                            }
                        });
                    }
                } else {
                    this.hide();
                }
            }
        };

        this.show = function () {
            this.$popover.show();
        };

        this.hide = function () {
            this.$popover.hide();
        };
    };

    var SpecialCharDialog = function (context) {
        var self = this;
        var ui = $.summernote.ui;

        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;

        var KEY = {
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            ENTER: 13
        };
        var COLUMN_LENGTH = 15;
        var COLUMN_WIDTH = 35;

        var currentColumn, currentRow, totalColumn, totalRow = 0;

        // special characters data set
        var specialCharDataSet = [
            '&quot;',   // "
            '&amp;',    // &
            '&lt;',     // <
            '&gt;',     // >
            '&iexcl;',
            '&cent;',
            '&pound;',
            '&curren;',
            '&yen;',
            '&brvbar;',
            '&sect;',
            '&uml;',
            '&copy;',
            '&ordf;',
            '&laquo;',
            '&not;',
            //'&shy;',
            '&reg;',
            '&macr;',
            '&deg;',
            '&plusmn;',
            '&sup2;',
            '&sup3;',
            '&acute;',
            '&micro;',
            '&para;',
            '&middot;',
            '&cedil;',
            '&sup1;',
            '&ordm;',
            '&raquo;',
            '&frac14;',
            '&frac12;',
            '&frac34;',
            '&iquest;',
            '&times;',
            '&divide;',
            '&fnof;',
            '&circ;',
            '&tilde;',
            /*'&ensp;',
             '&emsp;',
             '&thinsp;',
             '&zwnj;',
             '&zwj;',
             '&lrm;',
             '&rlm;',*/
            '&ndash;',
            '&mdash;',
            '&lsquo;',
            '&rsquo;',
            '&sbquo;',
            '&ldquo;',
            '&rdquo;',
            '&bdquo;',
            '&dagger;',
            '&Dagger;',
            '&bull;',
            '&hellip;',
            '&permil;',
            '&prime;',
            '&Prime;',
            '&lsaquo;',
            '&rsaquo;',
            '&oline;',
            '&frasl;',
            '&euro;',
            '&image;',
            '&weierp;',
            '&real;',
            '&trade;',
            '&alefsym;',
            '&larr;',
            '&uarr;',
            '&rarr;',
            '&darr;',
            '&harr;',
            '&crarr;',
            '&lArr;',
            '&uArr;',
            '&rArr;',
            '&dArr;',
            '&hArr;',
            '&forall;',
            '&part;',
            '&exist;',
            '&empty;',
            '&nabla;',
            '&isin;',
            '&notin;',
            '&ni;',
            '&prod;',
            '&sum;',
            '&minus;',
            '&lowast;',
            '&radic;',
            '&prop;',
            '&infin;',
            '&ang;',
            '&and;',
            '&or;',
            '&cap;',
            '&cup;',
            '&int;',
            '&there4;',
            '&sim;',
            '&cong;',
            '&asymp;',
            '&ne;',
            '&equiv;',
            '&le;',
            '&ge;',
            '&sub;',
            '&sup;',
            '&nsub;',
            '&sube;',
            '&supe;',
            '&oplus;',
            '&otimes;',
            '&perp;',
            '&sdot;',
            '&lceil;',
            '&rceil;',
            '&lfloor;',
            '&rfloor;',
            //'&lang;',
            //'&rang;',
            '&loz;',
            '&spades;',
            '&clubs;',
            '&hearts;',
            '&diams;'
        ];

        this.getTextOnRange = function () {
            var rng = context.invoke('editor.createRange');

            // if range on anchor, expand range with anchor
            if (rng.isOnAnchor()) {
                var anchor = dom.ancestor(rng.sc, dom.isAnchor);
                rng = range.createFromNode(anchor);
            }

            return rng.toString();
        };

        /**
         * Make Special Characters Table
         *
         * @member plugin.specialChar
         * @private
         * @return {jQuery}
         */
        this.makeSpecialCharSetTable = function () {
            var $table = $('<table/>');
            $.each(specialCharDataSet, function (idx, text) {
                var $td = $('<td/>').addClass('note-specialchar-node');
                var $tr = (idx % COLUMN_LENGTH === 0) ? $('<tr/>') : $table.find('tr').last();

                var $button = ui.button({
                    callback: function ($node) {
                        $node.html(text);
                        $node.attr('title', text);
                        $node.attr('data-value', encodeURIComponent(text));
                        $node.css({
                            width: COLUMN_WIDTH,
                            'margin-right': '2px',
                            'margin-bottom': '2px'
                        });
                    }
                }).render();

                $td.append($button);

                $tr.append($td);
                if (idx % COLUMN_LENGTH === 0) {
                    $table.append($tr);
                }
            });

            totalRow = $table.find('tr').length;
            totalColumn = COLUMN_LENGTH;

            return $table;
        };

        this.initialize = function () {
            var $container = options.dialogsInBody ? $(document.body) : $editor;

            var body = '<div class="form-group row-fluid">' + this.makeSpecialCharSetTable()[0].outerHTML + '</div>';

            this.$dialog = ui.dialog({
                title: lang.specialChar.select,
                body: body
            }).render().appendTo($container);
        };

        this.show = function () {
            var text = this.getTextOnRange();
            context.invoke('editor.saveRange');
            this.showSpecialCharDialog(text).then(function (selectChar) {
                context.invoke('editor.restoreRange');

                // build node
                var $node = $('<span></span>').html(selectChar)[0];

                if ($node) {
                    // insert video node
                    context.invoke('editor.insertNode', $node);
                }
            }).fail(function () {
                context.invoke('editor.restoreRange');
            });
        };

        /**
         * show image dialog
         *
         * @param {jQuery} $dialog
         * @return {Promise}
         */
        this.showSpecialCharDialog = function (text) {
            return $.Deferred(function (deferred) {
                var $specialCharDialog = self.$dialog;
                var $specialCharNode = $specialCharDialog.find('.note-specialchar-node');
                var $selectedNode = null;
                var ARROW_KEYS = [KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT];
                var ENTER_KEY = KEY.ENTER;

                function addActiveClass($target) {
                    if (!$target) {
                        return;
                    }
                    $target.find('button').addClass('active');
                    $selectedNode = $target;
                }

                function removeActiveClass($target) {
                    $target.find('button').removeClass('active');
                    $selectedNode = null;
                }

                // find next node
                function findNextNode(row, column) {
                    var findNode = null;
                    $.each($specialCharNode, function (idx, $node) {
                        var findRow = Math.ceil((idx + 1) / COLUMN_LENGTH);
                        var findColumn = ((idx + 1) % COLUMN_LENGTH === 0) ? COLUMN_LENGTH : (idx + 1) % COLUMN_LENGTH;
                        if (findRow === row && findColumn === column) {
                            findNode = $node;
                            return false;
                        }
                    });
                    return $(findNode);
                }

                function arrowKeyHandler(keyCode) {
                    // left, right, up, down key
                    var $nextNode;
                    var lastRowColumnLength = $specialCharNode.length % totalColumn;

                    if (KEY.LEFT === keyCode) {

                        if (currentColumn > 1) {
                            currentColumn = currentColumn - 1;
                        } else if (currentRow === 1 && currentColumn === 1) {
                            currentColumn = lastRowColumnLength;
                            currentRow = totalRow;
                        } else {
                            currentColumn = totalColumn;
                            currentRow = currentRow - 1;
                        }

                    } else if (KEY.RIGHT === keyCode) {

                        if (currentRow === totalRow && lastRowColumnLength === currentColumn) {
                            currentColumn = 1;
                            currentRow = 1;
                        } else if (currentColumn < totalColumn) {
                            currentColumn = currentColumn + 1;
                        } else {
                            currentColumn = 1;
                            currentRow = currentRow + 1;
                        }

                    } else if (KEY.UP === keyCode) {
                        if (currentRow === 1 && lastRowColumnLength < currentColumn) {
                            currentRow = totalRow - 1;
                        } else {
                            currentRow = currentRow - 1;
                        }
                    } else if (KEY.DOWN === keyCode) {
                        currentRow = currentRow + 1;
                    }

                    if (currentRow === totalRow && currentColumn > lastRowColumnLength) {
                        currentRow = 1;
                    } else if (currentRow > totalRow) {
                        currentRow = 1;
                    } else if (currentRow < 1) {
                        currentRow = totalRow;
                    }

                    $nextNode = findNextNode(currentRow, currentColumn);

                    if ($nextNode) {
                        removeActiveClass($selectedNode);
                        addActiveClass($nextNode);
                    }
                }

                function enterKeyHandler() {
                    if (!$selectedNode) {
                        return;
                    }

                    deferred.resolve(decodeURIComponent($selectedNode.find('button').data('value')));
                    $specialCharDialog.closeModal();
                }

                function keyDownEventHandler(event) {
                    event.preventDefault();
                    var keyCode = event.keyCode;
                    if (keyCode === undefined || keyCode === null) {
                        return;
                    }
                    // check arrowKeys match
                    if (ARROW_KEYS.indexOf(keyCode) > -1) {
                        if ($selectedNode === null) {
                            addActiveClass($specialCharNode.eq(0));
                            currentColumn = 1;
                            currentRow = 1;
                            return;
                        }
                        arrowKeyHandler(keyCode);
                    } else if (keyCode === ENTER_KEY) {
                        enterKeyHandler();
                    }
                    return false;
                }

                // remove class
                removeActiveClass($specialCharNode);

                // find selected node
                if (text) {
                    for (var i = 0; i < $specialCharNode.length; i++) {
                        var $checkNode = $($specialCharNode[i]);
                        if ($checkNode.text() === text) {
                            addActiveClass($checkNode);
                            currentRow = Math.ceil((i + 1) / COLUMN_LENGTH);
                            currentColumn = (i + 1) % COLUMN_LENGTH;
                        }
                    }
                }

                var onOpenDialog = function () {

                    $(document).on('keydown', keyDownEventHandler);

                    self.$dialog.find('button').tooltip();

                    $specialCharNode.on('click', function (event) {
                        event.preventDefault();
                        deferred.resolve(decodeURIComponent($(event.currentTarget).find('button').data('value')));
                        ui.hideDialog(self.$dialog);
                    });


                };

                var onCloseDialog = function () {
                    $specialCharNode.off('click');

                    self.$dialog.find('button').tooltip('destroy');

                    $(document).off('keydown', keyDownEventHandler);

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                };

                ui.showDialog(self.$dialog, onOpenDialog, onCloseDialog);

            });
        };
    };


    $.summernote = $.extend($.summernote, {
        version: '0.7.0',
        ui: MaterializeUI,

        plugins: {},

        options: {
            modules: {
                'editor': Editor,
                'clipboard': Clipboard,
                'dropzone': Dropzone,
                'codeview': Codeview,
                'statusbar': Statusbar,
                'fullscreen': Fullscreen,
                'handle': Handle,
                'autoLink': AutoLink,
                'autoSync': AutoSync,
                'buttons': ButtonMaterialize,
                'toolbar': Toolbar,
                'linkDialog': LinkDialog,
                'linkPopover': LinkPopover,
                'imageDialog': ImageDialog,
                'imagePopover': ImagePopover,
                'videoDialog': VideoDialog,
                'helpDialog': HelpDialog,
                'airPopover': AirPopover,
                'hintPopover': HintPopover,
                'specialCharDialog': SpecialCharDialog
            },

            buttons: {},

            lang: 'en-US',

            // toolbar
            toolbar: [
                ['style', ['style']],
                ['specialStyle', ['specialStyle']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr', 'specialchar']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ],

            // popover
            popover: {
                image: [
                    ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']]
                ],
                link: [
                    ['link', ['linkDialogShow', 'unlink']]
                ],
                air: [
                    ['style', ['style', 'bold', 'italic', 'underline']],
                    ['undo', ['undo', 'redo']],
                    ['view', ['fullscreen', 'codeview']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link', 'picture', 'video']]
                ]
            },

            followingToolbar: true,            // make the toolbar follow on window scroll
            otherStaticBarClass: "staticTop",  // default class for other static bars eventually used on webapp

            // air mode: inline editor
            airMode: false,

            width: null,
            height: null,

            focus: false,
            tabSize: 4,
            styleWithSpan: true,
            shortcuts: true,
            textareaAutoSync: true,
            direction: null,

            disableLinkTarget: false,     // hide link Target Checkbox
            disableDragAndDrop: false,    // disable drag and drop event
            disableResizeEditor: false,   // disable resizing editor

            styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4'],

            specialStyleTags: ['normal', 'secret', 'advice', 'deadend'],

            fontNames: [
                'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
                'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
                'Roboto', 'Tahoma', 'Times New Roman', 'Verdana'
            ],

            fontSizes: ['8', '9', '10', '11', '12', '14', '15', '18', '24', '36'],

            // pallete colors(n x n)
            colors: [//grey      brown      dpurple    purple     indigo     blue       cyan       green      lgreen     yellow     amber      orange     dorange    red        pink
                ['#fafafa', '#efebe9', '#7e57c2', '#ab47bc', '#5c6bc0', '#42a5f5', '#26c6da', '#66bb6a', '#9ccc65', '#ffee58', '#ffca28', '#ffa726', '#ff7043', '#ef5350', '#ec407a'],
                ['#f5f5f5', '#d7ccc8', '#673ab7', '#9c27b0', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#8bc34a', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63'],
                ['#eeeeee', '#bcaaa4', '#5e35b1', '#8e24aa', '#3949ab', '#1e88e5', '#00acc1', '#43a047', '#7cb342', '#fdd835', '#ffb300', '#fb8c00', '#f4511e', '#e53935', '#d81b60'],
                ['#e0e0e0', '#a1887f', '#512da8', '#7b1fa2', '#303f9f', '#1976d2', '#0097a7', '#388e3c', '#689f38', '#fbc02d', '#ffa000', '#f57c00', '#e64a19', '#d32f2f', '#c2185b'],
                ['#bdbdbd', '#8d6e63', '#4527a0', '#6a1b9a', '#283593', '#1565c0', '#00838f', '#2e7d32', '#558b2f', '#f9a825', '#ff8f00', '#ef6c00', '#d84315', '#c62828', '#ad1457'],
                ['#9e9e9e', '#795548', '#311b92', '#4a148c', '#1a237e', '#0d47a1', '#006064', '#1b5e20', '#33691e', '#f57f17', '#ff6f00', '#e65100', '#bf360c', '#b71c1c', '#880e4f'],
                ['#757575', '#6d4c41', '#b388ff', '#ea80fc', '#8c9eff', '#82b1ff', '#84ffff', '#b9f6ca', '#ccff90', '#ffff8d', '#ffe57f', '#ffd180', '#ff9e80', '#ff8a80', '#ff80ab'],
                ['#616161', '#5d4037', '#7c4dff', '#e040fb', '#536dfe', '#448aff', '#18ffff', '#69f0ae', '#b2ff59', '#ffff00', '#ffd740', '#ffab40', '#ff6e40', '#ff5252', '#ff4081'],
                ['#424242', '#4e342e', '#651fff', '#d500f9', '#3d5afe', '#2979ff', '#00e5ff', '#00e676', '#76ff03', '#ffea00', '#ffc400', '#ff9100', '#ff3d00', '#ff1744', '#f50057'],
                ['#212121', '#3e2723', '#6200ea', '#aa00ff', '#304ffe', '#2962ff', '#00b8d4', '#00c853', '#64dd17', '#ffd600', '#ffab00', '#ff6d00', '#dd2c00', '#d50000', '#c51162'],
            ],
            // pallete colors(n x n)
            colorTitles: [
                //grey            brown             dpurple                 purple             indigo             blue             cyan             green             lgreen                  yellow             amber             orange             dorange                 red             pink
                ['grey lighten5', 'brown lighten5', 'deep-purple lighten1', 'purple lighten1', 'indigo lighten1', 'blue lighten1', 'cyan lighten1', 'green lighten1', 'light-green lighten1', 'yellow lighten1', 'amber lighten1', 'orange lighten1', 'deep-orange lighten1', 'red lighten1', 'pink lighten1'],
                ['grey lighten4', 'brown lighten4', 'deep-purple', 'purple', 'indigo', 'blue', 'cyan', 'green', 'light-green', 'yellow', 'amber', 'orange', 'deep-orange', 'red', 'pink'],
                ['grey lighten3', 'brown lighten3', 'deep-purple darken1', 'purple darken1', 'indigo darken1', 'blue darken1', 'cyan darken1', 'green darken1', 'light-green darken1', 'yellow darken1', 'amber darken1', 'orange darken1', 'deep-orange darken1', 'red darken1', 'pink darken1'],
                ['grey lighten2', 'brown lighten2', 'deep-purple darken2', 'purple darken2', 'indigo darken2', 'blue darken2', 'cyan darken2', 'green darken2', 'light-green darken2', 'yellow darken2', 'amber darken2', 'orange darken2', 'deep-orange darken2', 'red darken2', 'pink darken2'],
                ['grey lighten1', 'brown lighten1', 'deep-purple darken3', 'purple darken3', 'indigo darken3', 'blue darken3', 'cyan darken3', 'green darken3', 'light-green darken3', 'yellow darken3', 'amber darken3', 'orange darken3', 'deep-orange darken3', 'red darken3', 'pink darken3'],
                ['grey', 'brown', 'deep-purple darken4', 'purple darken4', 'indigo darken4', 'blue darken4', 'cyan darken4', 'green darken4', 'light-green darken4', 'yellow darken4', 'amber darken4', 'orange darken4', 'deep-orange darken4', 'red darken4', 'pink darken4'],
                ['grey darken1', 'brown darken1', 'deep-purple accent1', 'purple accent1', 'indigo accent1', 'blue accent1', 'cyan accent1', 'green accent1', 'light-green accent1', 'yellow accent1', 'amber accent1', 'orange accent1', 'deep-orange accent1', 'red accent1', 'pink accent1'],
                ['grey darken2', 'brown darken2', 'deep-purple accent2', 'purple accent2', 'indigo accent2', 'blue accent2', 'cyan accent2', 'green accent2', 'light-green accent2', 'yellow accent2', 'amber accent2', 'orange accent2', 'deep-orange accent2', 'red accent2', 'pink accent2'],
                ['grey darken3', 'brown darken3', 'deep-purple accent3', 'purple accent3', 'indigo accent3', 'blue accent3', 'cyan accent3', 'green accent3', 'light-green accent3', 'yellow accent3', 'amber accent3', 'orange accent3', 'deep-orange accent3', 'red accent3', 'pink accent3'],
                ['grey darken4', 'brown darken4', 'deep-purple accent4', 'purple accent4', 'indigo accent4', 'blue accent4', 'cyan accent4', 'green accent4', 'light-green accent4', 'yellow accent4', 'amber accent4', 'orange accent4', 'deep-orange accent4', 'red accent4', 'pink accent4'],
            ],

            lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],

            tableClassName: 'table table-bordered',

            insertTableMaxSize: {
                col: 10,
                row: 10
            },

            dialogsInBody: false,

            maximumImageFileSize: null,

            callbacks: {
                onInit: null,
                onFocus: null,
                onBlur: null,
                onEnter: null,
                onKeyup: null,
                onKeydown: null,
                onSubmit: null,
                onImageUpload: null,
                onImageUploadError: null
            },

            codemirror: {
                mode: 'text/html',
                htmlMode: true,
                lineNumbers: true
            },

            keyMap: {
                pc: {
                    'ENTER': 'insertParagraph',
                    'CTRL+Z': 'undo',
                    'CTRL+Y': 'redo',
                    'TAB': 'tab',
                    'SHIFT+TAB': 'untab',
                    'CTRL+B': 'bold',
                    'CTRL+I': 'italic',
                    'CTRL+U': 'underline',
                    'CTRL+SHIFT+S': 'strikethrough',
                    'CTRL+BACKSLASH': 'removeFormat',
                    'CTRL+SHIFT+L': 'justifyLeft',
                    'CTRL+SHIFT+E': 'justifyCenter',
                    'CTRL+SHIFT+R': 'justifyRight',
                    'CTRL+SHIFT+J': 'justifyFull',
                    'CTRL+SHIFT+NUM7': 'insertUnorderedList',
                    'CTRL+SHIFT+NUM8': 'insertOrderedList',
                    'CTRL+LEFTBRACKET': 'outdent',
                    'CTRL+RIGHTBRACKET': 'indent',
                    'CTRL+NUM0': 'formatPara',
                    'CTRL+NUM1': 'formatH1',
                    'CTRL+NUM2': 'formatH2',
                    'CTRL+NUM3': 'formatH3',
                    'CTRL+NUM4': 'formatH4',
                    'CTRL+NUM5': 'formatH5',
                    'CTRL+NUM6': 'formatH6',
                    'CTRL+ENTER': 'insertHorizontalRule',
                    'CTRL+K': 'linkDialog.show'
                },

                mac: {
                    'ENTER': 'insertParagraph',
                    'CMD+Z': 'undo',
                    'CMD+SHIFT+Z': 'redo',
                    'TAB': 'tab',
                    'SHIFT+TAB': 'untab',
                    'CMD+B': 'bold',
                    'CMD+I': 'italic',
                    'CMD+U': 'underline',
                    'CMD+SHIFT+S': 'strikethrough',
                    'CMD+BACKSLASH': 'removeFormat',
                    'CMD+SHIFT+L': 'justifyLeft',
                    'CMD+SHIFT+E': 'justifyCenter',
                    'CMD+SHIFT+R': 'justifyRight',
                    'CMD+SHIFT+J': 'justifyFull',
                    'CMD+SHIFT+NUM7': 'insertUnorderedList',
                    'CMD+SHIFT+NUM8': 'insertOrderedList',
                    'CMD+LEFTBRACKET': 'outdent',
                    'CMD+RIGHTBRACKET': 'indent',
                    'CMD+NUM0': 'formatPara',
                    'CMD+NUM1': 'formatH1',
                    'CMD+NUM2': 'formatH2',
                    'CMD+NUM3': 'formatH3',
                    'CMD+NUM4': 'formatH4',
                    'CMD+NUM5': 'formatH5',
                    'CMD+NUM6': 'formatH6',
                    'CMD+ENTER': 'insertHorizontalRule',
                    'CMD+K': 'linkDialog.show'
                }
            }
        }
    });
}));