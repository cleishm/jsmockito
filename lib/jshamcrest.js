/*
 * JsHamcrest v0.5.1
 * http://github.com/danielfm/jshamcrest/tree/master
 *
 * Hamcrest port to JavaScript.
 *
 * Copyright (c) 2009 Daniel Fernandes Martins
 * Licensed under the BSD license.
 *
 * Revision: c3671a65186fb0491530182c768fdbea85a78095
 * Date:     Sat Jul 11 17:30:18 2009 -0300
 */
 
/**
 * @fileOverview Provides the main namespace, along with core abstractions.
 */

/**
 * Main namespace.
 * @namespace
 */
JsHamcrest = {
    /**
     * Library version.
     */
    version: '0.5.1',

    /**
     * Assert method that is capable of handling matchers. If the given matcher
     * fails, this method registers a failed/error'd assertion with the unit
     * test framework being used. Ex: <p>
     *
     * <pre>
     * // Asserts that something is equal to x
     * assertThat(something, equalTo(x));
     * assertThat(something, equalTo(x), "Some description text");
     *
     * // Same here
     * assertThat(something, x);
     * assertThat(something, x, "Some description text");
     *
     * // Asserts that something evaluates to some value considered truth
     * assertThat(something);
     * </pre>
     *
     * @param {object} actual Actual value under test.
     * @param {object} matcher Matcher to assert the correctness of the actual
     * value.
     * @param {string} message Message that describes the assertion, if
     * necessary.
     * @param {function} fail Function to be called when the assertion fails.
     * @param {function} pass Function to be called when the assertion
     * succeeds.
     * @return {JsHamcrest.Description} Test result description.
     */
    assertThat: function(actual, matcher, message, fail, pass) {
        var description = new JsHamcrest.Description();
        var matchers = JsHamcrest.Matchers;

        // Actual value must be any value considered non-null by JavaScript
        if (matcher == null) {
            matcher = matchers.truth();
        }

        // Creates a 'equalTo' matcher if 'matcher' is not a valid matcher
        if (!JsHamcrest.isMatcher(matcher)) {
            matcher = matchers.equalTo(matcher);
        }

        if (message) {
            description.append(message).append('. ');
        }
        description.append('Expected ');
        matcher.describeTo(description);

        if (!matcher.matches(actual)) {
            description.append(' but was ');
            matcher.describeValueTo(actual, description);
            fail(description.get());
        } else {
            description.append(': Success');
            if (pass) {
                pass(description.get());
            }
        }
        return description;
    },

    /**
     * Returns whether the given object is a matcher.
     * @param {object} obj Object.
     * @return {boolean} Whether the given object is a matcher.
     */
    isMatcher: function(obj) {
        return obj instanceof JsHamcrest.SimpleMatcher;
    },

    /**
     * Returns whether the given arrays are equivalent.
     * @param {array} array Array.
     * @param {array} anotherArray Another array.
     * @return {booelan} Whether the given arrays are equivalent.
     */
    isArraysEqual: function(array, anotherArray) {
        if (array instanceof Array || anotherArray instanceof Array) {
            if (array.length != anotherArray.length) {
                return false;
            }

            for (var i = 0; i < array.length; i++) {
                var a = array[i];
                var b = anotherArray[i];

                if (a instanceof Array || b instanceof Array) {
                    return JsHamcrest.isArraysEqual(a, b);
                } else if (a != b) {
                    return false;
                }
            }
            return true;
        } else {
            return array == anotherArray;
        }
    },

    /**
     * Creates a simple matcher.
     * @class Builds a matcher object that uses external functions provided
     * by the caller in order to define the current matching logic.
     * @constructor
     * @param {object} params Configuration object.
     * @param {function} params.matches Matcher logic.
     * @param {function} params.describeTo Self description logic. This
     * function is used to create textual descriptions from matcher objects.
     * @param {function} [params.describeValueTo] This function is used to
     * describe the actual value of a test assertion. If not provided the
     * actual value will be described as a literal.
     */
    SimpleMatcher: function(params) {
        params = params || {};

        /**
         * Checks if this matcher matches the actual value.
         * @function
         * @param {object} actual Actual value.
         * @return {boolean} If they match or not.
         */
        this.matches = params.matches;

        /**
         * Describes this matcher's tasks to the given descriptor.
         * @function
         * @param {object} descriptor Descriptor.
         */
        this.describeTo = params.describeTo;

        // Replace the function to describe the actual value
        if (params.describeValueTo) {
            this.describeValueTo = params.describeValueTo;
        }
    },

    /**
     * Creates a combinable matcher.
     * @class Matcher that provides an easy way to wrap several matchers into
     * one.
     * @param {object} params Configuration object.
     * @param {function} params.matches Matcher logic.
     * @param {function} params.describeTo Self description logic. This
     * function is used to create textual descriptions from matcher objects.
     */
    CombinableMatcher: function(params) {
        // Call superclass' constructor
        JsHamcrest.SimpleMatcher.apply(this, arguments);

        params = params || {};

        /**
         * Wraps this matcher with the given one in such a way that both
         * matchers must match the actual value to be successful.
         * @param {object} anotherMatcher Another matcher.
         * @return {JsHamcrest.CombinableMatcher} Combinable matcher.
         */
        this.and = function(anotherMatcher) {
            var all = JsHamcrest.Matchers.allOf(this, anotherMatcher);
            return new JsHamcrest.CombinableMatcher({
                matches: all.matches,

                describeTo: function(description) {
                    description.appendDescriptionOf(all);
                }
            });
        };

        /**
         * Wraps this matcher with the given one in such a way that at least
         * one of the matchers must match the actual value to be successful.
         * @param {object} anotherMatcher Another matcher.
         * @return {JsHamcrest.CombinableMatcher} Combinable matcher.
         */
        this.or = function(anotherMatcher) {
            var any = JsHamcrest.Matchers.anyOf(this, anotherMatcher);
            return new JsHamcrest.CombinableMatcher({
                matches: any.matches,

                describeTo: function(description) {
                    description.appendDescriptionOf(any);
                }
            });
        };
    },

    /**
     * Creates a description.
     * @class Description is the object that builds assertion error messages.
     * @constructor
     */
    Description: function() {
        /**
         * Current content of this description.
         * @property
         * @type string
         * @private
         */
        var value = '';

        /**
         * Gets the current content of this description.
         * @return {string} Current content of this description.
         */
        this.get = function() {
            return value;
        }

        /**
         * Appends the description a self describing object to this
         * description.
         * @param {object} selfDescribing Any object that have a
         * <code>describeTo</code> method that accepts a description object as
         * argument.
         * @return {JsHamcrest.Description} this.
         */
        this.appendDescriptionOf = function(selfDescribing) {
            if (selfDescribing) {
                selfDescribing.describeTo(this);
            }
            return this;
        };

        /**
         * Appends a text to this description.
         * @param {string} text Text to append.
         * @return {JsHamcrest.Description} this.
         */
        this.append = function(text) {
            if (text != null) {
                value += text;
            }
            return this;
        };

        /**
         * Appends a JavaScript language's literals to this description.
         * @param {object} literal Literal to append.
         * @return {JsHamcrest.Description} this.
         */
        this.appendLiteral = function(literal) {
            if (literal === undefined) {
                this.append('undefined');
            } else if (literal === null) {
                this.append('null');
            } else if (literal instanceof Array) {
                this.appendValueList('[', ', ', ']', literal);
            } else if (typeof literal == 'string') {
                this.append('"' + literal + '"');
            } else if (literal instanceof Function) {
                this.append('Function');
            } else {
                this.append(literal);
            }
            return this;
        }

        /**
         * Appends a list of values to this description.
         * @param {string} start Start string.
         * @param {string} separator Separator string.
         * @param {string} end End string.
         * @param {array} list List of values.
         * @return {JsHamcrest.Description} this.
         */
        this.appendValueList = function(start, separator, end, list) {
            this.append(start);
            for (var i = 0; i < list.length; i++) {
                if (i > 0) {
                    this.append(separator);
                }
                this.appendLiteral(list[i]);
            }
            this.append(end);
            return this;
        };

        /**
         * Appends a list of self describing objects to this description.
         * @param {string} start Start string.
         * @param {string} separator Separator string.
         * @param {string} end End string.
         * @param {array} list List of self describing objects. These objects
         * must that have a <code>describeTo</code> method that accepts a
         * description object as argument.
         * @return {JsHamcrest.Description} this.
         */
        this.appendList = function(start, separator, end, list) {
            this.append(start);
            for (var i = 0; i < list.length; i++) {
                if (i > 0) {
                    this.append(separator);
                }
                this.appendDescriptionOf(list[i]);
            }
            this.append(end);
            return this;
        };
    }
};


/**
 * Describes the actual value to the given descriptor.
 * This method is optional and, if it's not present,
 * the actual value will be described as a JavaScript
 * literal.
 * @param {object} actual Actual value.
 * @param {object} descriptor Descriptor.
 */
JsHamcrest.SimpleMatcher.prototype.describeValueTo = function(actual, description) {
    description.appendLiteral(actual);
};


// CombinableMatcher is a specialization of SimpleMatcher
JsHamcrest.CombinableMatcher.prototype = new JsHamcrest.SimpleMatcher();

/**
 * @fileOverview Provides core matchers.
 */

/**
 * Built-in matchers.
 * @namespace
 */
JsHamcrest.Matchers = {};

/**
 * The actual value must be any value considered truth by the JavaScript
 * engine. Ex: <p>
 *
 * <pre>
 * assertThat(10, truth());
 * assertThat({}, truth());
 * assertThat(0, not(truth()));
 * assertThat('', not(truth()));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'truth' matcher.
 */
JsHamcrest.Matchers.truth = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual;
        },

        describeTo: function(description) {
            description.append('truth');
        }
    });
};

/**
 * Delegate-only matcher frequently used to improve readability. Ex: <p>
 *
 * <pre>
 * assertThat(10, is(10));
 * assertThat(10, is(equalTo(10)));
 * </pre>
 *
 * @param {object} matcher Delegate matcher.
 * @return {JsHamcrest.SimpleMatcher} 'is' matcher.
 */
JsHamcrest.Matchers.is = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsHamcrest.isMatcher(matcher)) {
        matcher = JsHamcrest.Matchers.equalTo(matcher);
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return matcher.matches(actual);
        },

        describeTo: function(description) {
            description.append('is ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * The delegate matcher must not match to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(10, not(20));
 * assertThat(10, not(equalTo(20)));
 * </pre>
 *
 * @param {object} matcher Delegate matcher.
 * @return {JsHamcrest.SimpleMatcher} 'not' matcher.
 */
JsHamcrest.Matchers.not = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsHamcrest.isMatcher(matcher)) {
        matcher = JsHamcrest.Matchers.equalTo(matcher);
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return !matcher.matches(actual);
        },

        describeTo: function(description) {
            description.append('not ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * The actual value must be equal to the given value to be successful.
 * Ex: <p>
 *
 * <pre>
 * assertThat(10, equalTo('10'));
 * </pre>
 *
 * @param {object} expected value.
 * @return {JsHamcrest.SimpleMatcher} 'equalTo' matcher.
 */
JsHamcrest.Matchers.equalTo = function(expected) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            if (expected instanceof Array || actual instanceof Array) {
                return JsHamcrest.isArraysEqual(expected, actual);
            }
            return actual == expected;
        },

        describeTo: function(description) {
            description.append('equal to ').appendLiteral(expected);
        }
    });
};

/**
 * Useless always-match matcher. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, anything());
 * assertThat(null, anything());
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'anything' matcher.
 */
JsHamcrest.Matchers.anything = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return true;
        },

        describeTo: function(description) {
            description.append('anything');
        }
    });
};

/**
 * The actual value must be null (or undefined) to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, nil()); // myObj should be null or undefined
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'nil' matcher.
 */
JsHamcrest.Matchers.nil = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual == null;
        },

        describeTo: function(description) {
            description.appendLiteral(null);
        }
    });
};

/**
 * The actual value must be the same as the given value to be successful.
 * Ex: <p>
 *
 * <pre>
 * assertThat(myObject, sameAs(anotherObj));
 * </pre>
 *
 * @param {object} expected Expected object.
 * @return {JsHamcrest.SimpleMatcher} 'sameAs' matcher.
 */
JsHamcrest.Matchers.sameAs = function(expected) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual === expected;
        },

        describeTo: function(description) {
            description.append('same as ').appendLiteral(expected);
        }
    });
};

/**
 * The actual value is a function and, when invoked, it should thrown an
 * exception with the given name to be successful. Ex: <p>
 *
 * <pre>
 * var MyException = function(message) {
 *   this.name = 'MyException';
 *   this.message = message;
 * };
 * 
 * var myFunction = function() {
 *   // Do something dangerous...
 *   throw new MyException('Unexpected error');
 * }
 *
 * assertThat(myFunction, raises('MyException'));
 * </pre>
 *
 * @param {string} exceptionName Name of the expected exception.
 * @return {JsHamcrest.SimpleMatcher} 'raises' matcher
 */
JsHamcrest.Matchers.raises = function(exceptionName) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actualFunction) {
            try {
                actualFunction();
            } catch (e) {
                if (e.name == exceptionName) {
                    return true;
                } else {
                    throw e;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.append('raises ').append(exceptionName);
        }
    });
}

/**
 * Creates a combinable matcher where the actual value must match all matchers
 * to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(10, both(greaterThan(5)).and(lessThan(20)));
 * </pre>
 *
 * @param {object} matcher Matcher that should be turn into a combinable
 * matcher.
 * @return {JsHamcrest.CombinableMatcher} 'both' matcher.
 */
JsHamcrest.Matchers.both = function(matcher) {
    return new JsHamcrest.CombinableMatcher({
        matches: matcher.matches,
        describeTo: function(description) {
            description.append('both ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * Creates a combinable matcher where the actual value must match at least one
 * matcher to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(10, either(lessThan(20)).or(greaterThan(50)));
 * </pre>
 *
 * @param {object} matcher Matcher that should be turn into a combinable
 * matcher.
 * @return {JsHamcrest.CombinableMatcher} 'either' matcher.
 */
JsHamcrest.Matchers.either = function(matcher) {
    return new JsHamcrest.CombinableMatcher({
        matches: matcher.matches,
        describeTo: function(description) {
            description.append('either ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * All the given values or matchers should match the actual value to be
 * sucessful. This matcher behaves pretty much like the JavaScript &&
 * operator (short-circuiting). Ex: <p>
 *
 * <pre>
 * assertThat(5, allOf([greaterThan(0), lessThan(10)]));
 * assertThat(5, allOf([5, lessThan(10)]));
 * assertThat(5, allOf(greaterThan(0), lessThan(10)));
 * assertThat(5, allOf(5, lessThan(10)));
 * </pre>
 *
 * @param {array} arguments List of delegate matchers.
 * @return {JsHamcrest.SimpleMatcher} 'allOf' matcher.
 */
JsHamcrest.Matchers.allOf = function() {
    var args = arguments;
    if (args[0] instanceof Array) {
        args = args[0];
    }
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            for (var i = 0; i < args.length; i++) {
                var matcher = args[i];
                if (!JsHamcrest.isMatcher(matcher)) {
                    matcher = JsHamcrest.Matchers.equalTo(matcher);
                }
                if (!matcher.matches(actual)) {
                    return false;
                }
            }
            return true;
        },

        describeTo: function(description) {
            description.appendList('(', ' and ', ')', args);
        }
    });
};

/**
 * At least one of the given matchers should match the actual value to be
 * sucessful. This matcher behaves pretty much like the JavaScript ||
 * operator (short-circuiting). Ex: <p>
 *
 * <pre>
 * assertThat(5, not(anyOf(lessThan(0), greaterThan(100))));
 * </pre>
 *
 * @param {array} arguments List of delegate matchers.
 * @return {JsHamcrest.SimpleMatcher} 'anyOf' matcher.
 */
JsHamcrest.Matchers.anyOf = function() {
    var args = arguments;
    if (args[0] instanceof Array) {
        args = args[0];
    }
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            for (var i = 0; i < args.length; i++) {
                var matcher = args[i];
                if (!JsHamcrest.isMatcher(matcher)) {
                    matcher = JsHamcrest.Matchers.equalTo(matcher);
                }
                if (matcher.matches(actual)) {
                    return true;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.appendList('(', ' or ', ')', args);
        }
    });
};

/**
 * @fileOverview Provides number-related matchers.
 */

/**
 * Asserts that the actual number is greater than the given threshold. Ex: <p>
 *
 * <pre>
 * assertThat(10, greaterThan(5));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsHamcrest.SimpleMatcher} 'greaterThan' matcher.
 */
JsHamcrest.Matchers.greaterThan = function(threshold) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual > threshold;
        },

        describeTo: function(description) {
            description.append('greater than ').appendLiteral(threshold);
        }
    });
};

/**
 * Asserts that the actual number is greater than or equal to the given
 * threshold. Ex: <p>
 *
 * <pre>
 * assertThat(10, greaterThanOrEqualTo(5));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsHamcrest.SimpleMatcher} 'greaterThanOrEqualTo' matcher.
 */
JsHamcrest.Matchers.greaterThanOrEqualTo = function(threshold) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual >= threshold;
        },

        describeTo: function(description) {
            description.append('greater than or equal to ')
                    .appendLiteral(threshold);
        }
    });
};

/**
 * Asserts that the actual number is less than the given threshold. Ex: <p>
 *
 * <pre>
 * assertThat(5, lessThan(10));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsHamcrest.SimpleMatcher} 'lessThan' matcher.
 */
JsHamcrest.Matchers.lessThan = function(threshold) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual < threshold;
        },

        describeTo: function(description) {
            description.append('less than ').appendLiteral(threshold);
        }
    });
};

/**
 * Asserts that the actual number is less than or equal to the given threshold.
 * Ex: <p>
 *
 * <pre>
 * assertThat(5, lessThanOrEqualTo(10));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsHamcrest.SimpleMatcher} 'lessThanOrEqualTo' matcher.
 */
JsHamcrest.Matchers.lessThanOrEqualTo = function(threshold) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual <= threshold;
        },

        describeTo: function(description) {
            description.append('less than or equal to ').append(threshold);
        }
    });
};

/**
 * Asserts that the actual value is not a number. Ex: <p>
 *
 * <pre>
 * assertThat(Math.sqrt(-1), notANumber());
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'notANumber' matcher.
 */
JsHamcrest.Matchers.notANumber = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return isNaN(actual);
        },

        describeTo: function(description) {
            description.append('not a number');
        }
    });
};

/**
 * Asserts that the actual value is even. Ex: <p>
 *
 * <pre>
 * assertThat(4, even());
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'even' matcher.
 */
JsHamcrest.Matchers.even = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual % 2 == 0;
        },

        describeTo: function(description) {
            description.append('even');
        }
    });
};

/**
 * Asserts that the actual value is odd. Ex: <p>
 *
 * <pre>
 * assertThat(3, odd());
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'odd' matcher.
 */
JsHamcrest.Matchers.odd = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual % 2 != 0;
        },

        describeTo: function(description) {
            description.append('odd');
        }
    });
};

/**
 * Asserts that the actual number is between a given inclusive range. Ex: <p>
 * 
 * <pre>
 * assertThat(5, between(4).and(7));
 * </pre>
 *
 * @param {number} number Range start.
 * @return {JsHamcrest.RangeMatcherBuilder} 'between' matcher.
 */
JsHamcrest.Matchers.between = function(number) {
    return new JsHamcrest.RangeMatcherBuilder({
        start: number
    });
};

/**
 * Asserts that the actual number is close to the given number, that is, if
 * the actual number is equal to a number within some range of acceptable error.
 * Ex: <p>
 *
 * <pre>
 * assertThat(0.5, closeTo(1.0, 0.5));
 * assertThat(1.0, closeTo(1.0, 0.5));
 * assertThat(1.5, closeTo(1.0, 0.5));
 * assertThat(2.0, not(closeTo(1.0, 0.5)));
 * </pre>
 *
 * @param {number} number Number.
 * @param {number} [delta=0] Acceptable difference range.
 * @return {JsHamcrest.SimpleMatcher} 'closeTo' matcher.
 */
JsHamcrest.Matchers.closeTo = function(number, delta) {
    if (!delta) {
        delta = 0;
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return (Math.abs(actual - number) - delta) <= 0;
        },

        describeTo: function(description) {
            description.append('number within ')
                  .appendLiteral(delta).append(' of ').appendLiteral(number);
        }
    });
};

/**
 * Creates a number range matcher builder.
 * @class Matcher builder that provides an easy way to create matchers for
 * number ranges.
 * @constructor
 * @param {object} param Configuration object.
 * @param {number} param.start Range start.
 */
JsHamcrest.RangeMatcherBuilder = function(params) {
    params = params || {};

    /**
     * Range start.
     * @property
     * @type number
     * @private
     */
    var start = params.start;

    /**
     * Finishes to build the range matcher.
     * @param {number} end Range end.
     * @return {JsHamcrest.SimpleMatcher} Range matcher.
     */
    this.and = function(end) {
        var greater = end;
        var lesser = start;

        if (start > end) {
            greater = start;
            lesser = end;
        }

        return new JsHamcrest.SimpleMatcher({
            matches: function(actual) {
                return actual >= lesser && actual <= greater;
            },

            describeTo: function(description) {
                description.append('between ').appendLiteral(lesser)
                      .append(' and ').appendLiteral(greater);
            }
        });
    }
};

/**
 * @fileOverview Provides string-related matchers.
 */

/**
 * Asserts that the two strings are equals, ignoring case. Ex: <p>
 *
 * <pre>
 * assertThat('str', equalIgnoringCase('Str'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsHamcrest.SimpleMatcher} 'equalIgnoringCase' matcher.
 */
JsHamcrest.Matchers.equalIgnoringCase = function(str) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.toUpperCase() == str.toUpperCase();
        },

        describeTo: function(description) {
            description.append('equal ignoring case "').append(str).append('"');
        }
    });
};

/**
 * Asserts that the actual value have a substring equals to the given string.
 * Ex: <p>
 *
 * <pre>
 * assertThat('string', containsString('tri'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsHamcrest.SimpleMatcher} 'containsString' matcher.
 */
JsHamcrest.Matchers.containsString = function(str) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.indexOf(str) >= 0;
        },

        describeTo: function(description) {
            description.append('contains string "').append(str).append('"');
        }
    });
};

/**
 * Asserts that the actual value starts with the given string. Ex: <p>
 *
 * <pre>
 * assertThat('string', startsWith('str'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsHamcrest.SimpleMatcher} 'startsWith' matcher.
 */
JsHamcrest.Matchers.startsWith = function(str) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.indexOf(str) == 0;
        },

        describeTo: function(description) {
            description.append('starts with ').appendLiteral(str);
        }
    });
};

/**
 * Asserts that the actual value ends with the given string. Ex: <p>
 *
 * <pre>
 * assertThat('string', endsWith('ring'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsHamcrest.SimpleMatcher} 'endsWith' matcher.
 */
JsHamcrest.Matchers.endsWith = function(str) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.lastIndexOf(str) + str.length == actual.length;
        },

        describeTo: function(description) {
            description.append('ends with ').appendLiteral(str);
        }
    });
};

/**
 * Asserts that the actual value matches the given regular expression. Ex: <p>
 *
 * <pre>
 * assertThat('0xa4f2c', matches(/\b0[xX][0-9a-fA-F]+\b/));
 * </pre>
 *
 * @param {RegExp} regex Regular expression literal.
 * @return {JsHamcrest.SimpleMatcher} 'matches' matcher.
 */
JsHamcrest.Matchers.matches = function(regex) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return regex.test(actual);
        },

        describeTo: function(description) {
            description.append('matches ').appendLiteral(regex);
        }
    });
};

/**
 * Asserts that the actual value looks like an email address. Ex: <p>
 *
 * <pre>
 * assertThat('user@domain.com', emailAddress());
 * </pre>
 *
 * <b>Note: this matcher is not fully compliant with RFC2822 due to its
 * complexity.</b>
 *
 * @return {JsHamcrest.SimpleMatcher} 'emailAddress' matcher.
 */
JsHamcrest.Matchers.emailAddress = function() {
    var regex = /^([a-z0-9_\.\-\+])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i;

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return regex.test(actual);
        },

        describeTo: function(description) {
            description.append('email address');
        }
    });
};

/**
 * @fileOverview Provides object-related matchers.
 */


/**
 * Asserts that the actual object contains the given member (variable or
 * function). Ex: <p>
 *
 * <pre>
 * assertThat(myObj, hasMember('name'));
 * </pre>
 *
 * @param {string} memberName Member name.
 * @return {JsHamcrest.SimpleMatcher} 'hasMember' matcher.
 */
JsHamcrest.Matchers.hasMember = function(memberName) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            try {
                return memberName in actual;
            } catch (e) { }
            return false;
        },

        describeTo: function(description) {
            description.append('has member ').appendLiteral(memberName);
        }
    });
};

/**
 * Asserts that the actual object contains the given function. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, hasFunction('getName'));
 * </pre>
 *
 * @param {string} property Property name.
 * @return {JsHamcrest.SimpleMatcher} 'hasFunction' matcher.
 */
JsHamcrest.Matchers.hasFunction = function(functionName) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            try {
                return functionName in actual && 
                        actual[functionName] instanceof Function;
            } catch (e) { }
            return false;
        },

        describeTo: function(description) {
            description.append('has function ').appendLiteral(functionName);
        }
    });
};

/**
 * Asserts that the actual object is instance of the given class. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, instanceOf(Array));
 * </pre>
 *
 * @param {function} clazz Constructor function.
 * @return {JsHamcrest.SimpleMatcher} 'instanceOf' matcher.
 */
JsHamcrest.Matchers.instanceOf = function(clazz) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return !!(actual instanceof clazz);
        },

        describeTo: function(description) {
            var className = clazz.name ? clazz.name : 'a class';
            description.append('instance of ').append(className);
        }
    });
};

/**
 * Asserts that the actual object is of the specified type. Ex: <p>
 *
 * <pre>
 * assertThat("text", typeOf("string"));
 * </pre>
 *
 * @param {function} typeName Type name.
 * @return {JsHamcrest.SimpleMatcher} 'instanceOf' matcher.
 */
JsHamcrest.Matchers.typeOf = function(typeName) {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return (typeof actual == typeName);
        },

        describeTo: function(description) {
            description.append('typeof ').append('"').append(typeName)
                    .append('"');
        }
    });
};

/**
 * Asserts that the actual value is an object. Ex: <p>
 *
 * <pre>
 * assertThat({}, object());
 * assertThat(10, not(object()));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'object' matcher.
 */
JsHamcrest.Matchers.object = function() {
    return new JsHamcrest.Matchers.instanceOf(Object);
};

/**
 * Asserts that the actual value is a string. Ex: <p>
 *
 * <pre>
 * assertThat("text", string());
 * assertThat(10, not(string()));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'string' matcher.
 */
JsHamcrest.Matchers.string = function() {
    return new JsHamcrest.Matchers.typeOf('string');
};

/**
 * Asserts that the actual value is a number. Ex: <p>
 *
 * <pre>
 * assertThat(10, number());
 * assertThat(10.0, number());
 * assertThat("text", not(number()));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'number' matcher.
 */
JsHamcrest.Matchers.number = function() {
    return new JsHamcrest.Matchers.typeOf('number');
};

/**
 * Asserts that the actual value is a boolean. Ex: <p>
 *
 * <pre>
 * assertThat(true, bool());
 * assertThat(false, bool());
 * assertThat("text" not(bool()));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'bool' matcher.
 */
JsHamcrest.Matchers.bool = function() {
    return new JsHamcrest.Matchers.typeOf('boolean');
};

/**
 * Asserts that the actual object is a function. Ex: <p>
 *
 * <pre>
 * assertThat(function() {}, func());
 * assertThat("text", not(func()));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'func' matcher.
 */
JsHamcrest.Matchers.func = function() {
    return new JsHamcrest.Matchers.typeOf('function');
};

/**
 * @fileOverview Provides collection-related matchers.
 */

/**
 * The actual value should be an array and it must contain at least one value
 * that matches the given value or matcher to be successful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], hasItem(3));
 * assertThat([1,2,3], hasItem(equalTo(3)));
 * </pre>
 *
 * @param {array} matcher Number or matcher.
 * @return {JsHamcrest.SimpleMatcher} 'hasItem' matcher.
 */
JsHamcrest.Matchers.hasItem = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsHamcrest.isMatcher(matcher)) {
        matcher = JsHamcrest.Matchers.equalTo(matcher);
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            // Should be an array
            if (!(actual instanceof Array)) {
                return false;
            }

            for (var i = 0; i < actual.length; i++) {
                if (matcher.matches(actual[i])) {
                    return true;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.append('array contains item ')
                    .appendDescriptionOf(matcher);
        }
    });
};

/**
 * The actual value should be an array and the given values or matchers must
 * match at least one item to be sucessful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], hasItems(2, 3));
 * assertThat([1,2,3], hasItems(greaterThan(2)));
 * </pre>
 *
 * @param {object...} arguments Values or matchers.
 * @return {JsHamcrest.SimpleMatcher} 'hasItems' matcher.
 */
JsHamcrest.Matchers.hasItems = function() {
    var items = [];
    for (var i = 0; i < arguments.length; i++) {
        items.push(JsHamcrest.Matchers.hasItem(arguments[i]));
    }
    return JsHamcrest.Matchers.allOf(items);
};

/**
 * The actual value should be an array and the given value or matcher must
 * match all items to be successful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], everyItem(greaterThan(0)));
 * </pre>
 *
 * @param {matcher} matcher Value or matcher.
 * @return {JsHamcrest.SimpleMatcher} 'everyItem' matcher.
 */
JsHamcrest.Matchers.everyItem = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsHamcrest.isMatcher(matcher)) {
        matcher = JsHamcrest.Matchers.equalTo(matcher);
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            // Should be an array
            if (!(actual instanceof Array)) {
                return false;
            }

            for (var i = 0; i < actual.length; i++) {
                if (!matcher.matches(actual[i])) {
                    return false;
                }
            }
            return true;
        },

        describeTo: function(description) {
            description.append('every item ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * The given array must contain the actual value to be successful. Ex: <p>
 * 
 * <pre>
 * assertThat(1, isIn([1,2,3]));
 * assertThat(1, isIn(1,2,3));
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'isIn' matcher.
 */
JsHamcrest.Matchers.isIn = function() {
    var equalTo = JsHamcrest.Matchers.equalTo;

    var args = arguments;
    if (args[0] instanceof Array) {
        args = args[0];
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            for (var i = 0; i < args.length; i++) {
                if (equalTo(args[i]).matches(actual)) {
                    return true;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.append('one of ').appendLiteral(args);
        }
    });
};

/**
 * The given array must contain the actual value to be successful. This is an
 * alias to 'isIn' matcher. Ex: <p>
 * <pre>
 * assertThat(1, oneOf([1,2,3]));
 * assertThat(1, oneOf(1,2,3));
 * </pre>
 *
 * @function
 * @return {JsHamcrest.SimpleMatcher} 'oneOf' matcher.
 */
JsHamcrest.Matchers.oneOf = JsHamcrest.Matchers.isIn;

/**
 * The actual value should be an array and it must be empty to be sucessful.
 * Ex: <p>
 *
 * <pre>
 * assertThat([], empty());
 * </pre>
 *
 * @return {JsHamcrest.SimpleMatcher} 'empty' matcher.
 */
JsHamcrest.Matchers.empty = function() {
    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual instanceof Array && actual.length == 0;
        },

        describeTo: function(description) {
            description.append('empty');
        }
    });
};

/**
 * The actual value should be an array and its size must match the given value
 * or matcher to be sucessful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], hasSize(3));
 * assertThat([1,2,3], hasSize(lessThan(5)));
 * </pre>
 *
 * @param {object} matcher Number or matcher.
 * @return {JsHamcrest.SimpleMatcher} 'hasSize' matcher.
 */
JsHamcrest.Matchers.hasSize = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsHamcrest.isMatcher(matcher)) {
        matcher = JsHamcrest.Matchers.equalTo(matcher);
    }

    return new JsHamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual instanceof Array && matcher.matches(actual.length);
        },

        describeTo: function(description) {
            description.append('has size ').appendDescriptionOf(matcher);
        },

        describeValueTo: function(actual, description) {
            if (actual instanceof Array) {
                description.append(actual.length);
            } else {
                description.appendLiteral(actual);
            }
        }
    });
};

/**
 * @fileOverview Methods to allow integration to major JavaScript testing
 * frameworks.
 */

/**
 * Methods to integrate JsHamcrest to major JavaScript testing frameworks.
 * @namespace
 */
JsHamcrest.Integration = {

    /**
     * Copy all assertion matchers to the given object.
     * @param {object} target Target object.
     * @private
     */
    _copyMatchers: function(target) {
        var source = JsHamcrest.Matchers;
        for (method in source) {
            if (!(method in target)) {
                target[method] = source[method];
            }
        }
    },

    /**
     * JsTestDriver integration. To plug JsHamcrest to JsTestDriver, follow
     * JsTestDriver installation and configuration instructions and then
     * perform the following changes: <p>
     *
     * <ol>
     *     <li>Let's assume your project root directory have a <em>lib</em>
     *     directory to keep your project's dependencies. In this case, copy
     *     the <em>jshamcrest.js</em> file to that directory;</li>
     *
     *     <li>Create a file <em>plugin/jshamcrest-plugin.js</em> in
     *     your project root directory and put the following line inside
     *     it: <p>
     *
     *     <pre>
     * JsHamcrest.Integration.JsTestDriver();
     *     </pre></li>
     *
     *     <li>Finally, edit the <em>jsTestDriver.conf</em> file as
     *     follows: <p>
     *     <pre>
     * load:
     *   - lib/*.js
     *   - &lt;source directory&gt;
     *   - &lt;test cases directory&gt;
     *   - plugin/*.js
     *     </pre></li>
     * </ol>
     *
     * That's it! Your test cases should now have access to JsHamcrest
     * methods: <p>
     *
     * <pre>
     *     CalculatorTest = TestCase("CalculatorTest");
     *
     *     CalculatorTest.prototype.testAdd = function() {
     *         var calc = new MyCalculator();
     *         assertThat(calc.add(2,3), equalTo(5));
     *     };
     * </pre>
     *
     * @param {object} params Configuration object.
     * @param {object} [params.scope=window] Copies all test matcher functions
     * to the given scope.
     */
    JsTestDriver: function(params) {
        params = params ? params : {};
        var target = params.scope || window;

        JsHamcrest.Integration._copyMatchers(target);

        /**
         * Function called when an assertion fails.
         * @ignore
         */
        var _fail = function(message) {
            var exc = new Error(message);
            exc.name = 'AssertError';

            // Removes all jshamcrest-related entries from error stack
            var stack = exc.stack.split('\n');
            var newStack = '';
            for (var i = 0; i < stack.length; i++) {
                if (!/jshamcrest*\.js\:/i.test(stack[i])) {
                    newStack += stack[i] + '\n';
                }
            }
            exc.stack = newStack;
            throw exc;
        };

        /**
         * Assertion method exposed to JsTestDriver.
         * @ignore
         */
        target.assertThat = function (actual, matcher, message) {
            return JsHamcrest.assertThat(actual, matcher, message, _fail);
        };
    },

    /**
     * JsUnitTest integration. To plug JsHamcrest to JsUnitTest, follow
     * JsUnitTest installation and configuration instructions and then edit
     * the test suite HTML file as follows: <p>
     *
     * <pre>
     *     &lt;!-- JsUnitTest and dependencies --&gt;
     *     &lt;script type="text/javascript" src="jsunittest.js"&gt;&lt;/script&gt;
     *
     *     &lt;!-- Don't forget to activate JsUnitTest integration --&gt;
     *     &lt;script type="text/javascript" src="jshamcrest.js"&gt;&lt;/script&gt;
     *     &lt;script type="text/javascript"&gt;
     *         JsHamcrest.Integration.JsUnitTest();
     *     &lt;/script&gt;
     *
     *     &lt;!-- Some code... --&gt;
     *
     *     &lt;script type="text/javascript"&gt;
     *         new Test.Unit.Runner({
     *             setup: function() {
     *             },
     *
     *             tearDown: function() {
     *             },
     *
     *             testAdd: function() { with(this) {
     *                 var calc = new MyCalculator();
     *                 assertThat(calc.add(2,3), equalTo(5));
     *             }},
     *
     *             // More tests here...
     *         }, {'testLog':'myLog'});
     *     &lt;/script&gt;
     * </pre>
     *
     * @param {object} params Configuration object.
     * @param {object} [params.scope=Testcase.prototype] Copies all test
     * matcher functions to the given scope.
     */
    JsUnitTest: function(params) {
        params = params ? params : {};
        var target = params.scope || JsUnitTest.Unit.Testcase.prototype;

        JsHamcrest.Integration._copyMatchers(target);

        /**
         * Assertion method exposed to JsUnitTest.
         * @ignore
         */
        target.assertThat = function (actual, matcher, message) {
            var self = this;

            /**
             * Function called when an assertion executes successfully.
             * @ignore
             */
            var pass = function() {
                self.pass();
            };

            /**
             * Function called when an assertion fails.
             * @ignore
             */
            var fail = function(message) {
                self.fail(message);
            };

            return JsHamcrest.assertThat(actual, matcher, message, fail, pass);
        };
    },

    /**
     * YUITest (Yahoo UI) integration. To plug JsHamcrest to YUITest, follow
     * YUITest installation and configuration instructions and then edit the
     * test suite HTML file as follows: <p>
     * 
     * <pre>
     *     &lt;!-- YUITest and dependencies --&gt;
     *     &lt;script type="text/javascript" src="yahoo-dom-event/yahoo-dom-event.js"&gt;&lt;/script&gt;
     *     &lt;script type="text/javascript" src="yuilogger/logger.js"&gt;&lt;/script&gt;
     *     &lt;script type="text/javascript" src="yuitest/yuitest.js"&gt;&lt;/script&gt;
     *
     *     &lt;!-- Don't forget to activate YUITest integration --&gt;
     *     &lt;script type="text/javascript" src="jshamcrest.js"&gt;&lt;/script&gt;
     *     &lt;script type="text/javascript"&gt;
     *         JsHamcrest.Integration.YUITest();
     *     &lt;/script&gt;
     *
     *     &lt;!-- Some code... --&gt;
     *
     *     &lt;script type="text/javascript"&gt;
     *         CalculatorTestCase = new YAHOO.tool.TestCase({
     *             name: "Calculator test case",
     *
     *             setUp: function() {
     *             },
     *
     *             teardown: function() {
     *             },
     *
     *             // In YUITest, the assertion method is Assert.that(), not assertThat()!
     *             // JsHamcrest tries not to screw with the conventions adopted by the
     *             // unit test framework in use, making the integration feel less
     *             // intrusive and more natural.
     *
     *             testAdd: function() {
     *                 var calc = new MyCalculator();
     *                 Assert.that(calc.add(2,3), equalTo(5));
     *             },
     *
     *             // More tests here...
     *         });
     *     &lt;/script&gt;
     * </pre>
     *
     * @param {object} params Configuration object.
     * @param {object} [params.scope=window] Copies all test matcher functions
     * to the given scope.
     */
    YUITest: function(params) {
        params = params ? params : {};
        var target = params.scope || window;

        JsHamcrest.Integration._copyMatchers(target);
        target.Assert = YAHOO.util.Assert;

        /**
         * Function called when an assertion fails.
         * @ignore
         */
        var fail = function(message) {
            YAHOO.util.Assert.fail(message);
        };

        /**
         * Assertion method exposed to YUITest.
         * @ignore
         */
        YAHOO.util.Assert.that = function(actual, matcher, message) {
            return JsHamcrest.assertThat(actual, matcher, message, fail);
        };
    },

    /**
     * QUnit (JQuery) integration. To plug JsHamcrest to QUnit, follow QUnit
     * installation and configuration instructions and then edit the test
     * suite HTML file as follows: <p>
     *
     * <pre>
     *     &lt;!-- QUnit and dependencies --&gt;
     *     &lt;script type="text/javascript" src="jquery.js"&gt;&lt;/script&gt;
     *
     *     &lt;!-- Don't forget to activate QUnit integration --&gt;
     *     &lt;script type="text/javascript" src="jshamcrest.js"&gt;&lt;/script&gt;
     *     &lt;script&gt;
     *         JsHamcrest.Integration.QUnit();
     *
     *         $(document).ready(function(){
     *             test("Calculator should add two numbers", function() {
     *                 var calc = new MyCalculator();
     *                 assertThat(calc.add(2,3), equalTo(5));
     *             });
     *
     *             // More tests here...
     *         });
     *     &lt;/script&gt;
     *
     *     &lt;!-- Some code... --&gt;
     *
     *     &lt;!-- QUnit and dependencies --&gt;
     *     &lt;script type="text/javascript" src="testrunner.js"&gt;&lt;/script&gt;
     * </pre>
     *
     * @param {object} params Configuration object.
     * @param {object} [params.scope=window] Copies all test matcher functions
     * to the given scope.
     */
    QUnit: function(params) {
        params = params ? params : {};
        var target = params.scope || window;

        JsHamcrest.Integration._copyMatchers(target);

        /**
         * Function called when an assertion executes successfully.
         * @ignore
         */
        var pass = function(message) {
            QUnit.ok(true, message);
        };

        /**
         * Function called when an assertion fails.
         * @ignore
         */
        var fail = function(message) {
            QUnit.ok(false, message);
        };

        /**
         * Assertion method exposed to QUnit.
         * @ignore
         */
        target.assertThat = function(actual, matcher, message) {
            return JsHamcrest.assertThat(actual, matcher, message, fail, pass);
        };
    },

    /**
     * jsUnity integration. To plug JsHamcrest to jsUnity, follow jsUnity
     * installation and configuration instructions and then edit the test
     * suite file as follows: <p>
     *
     * <pre>
     *     // Some test suite
     *     function CalculatorTestSuite() {
     *         function testA() {
     *             var calc = new MyCalculator();
     *             assertThat(calc.add(2,3), equalTo(5));
     *         }
     *
     *         // More tests here...
     *     }
     *
     *     // Don't forget to activate the jsUnity integration
     *     JsHamcrest.Integration.jsUnity();
     *
     *     var results = jsUnity.run(CalculatorTestSuite);
     * </pre>
     *
     * @param {object} params Configuration object.
     * @param {object} [params.scope=jsUnity.env.defaultScope] Copies all test
     * matcher functions to the given scope.
     * @param {object} [params.attachAssertions=false] Whether JsHamcrest
     * should also copy jsUnity's assertion functions to the given scope.
     */
    jsUnity: function(params) {
        params = params ? params : {};
        var target = params.scope || jsUnity.env.defaultScope;
        var assertions = params.attachAssertions || false;

        JsHamcrest.Integration._copyMatchers(target);
        if (assertions) {
            jsUnity.attachAssertions(target);
        }

        /**
         * Function called when an assertion fails.
         * @ignore
         */
        var fail = function(message) {
            throw message;
        };

        /**
         * Assertion method exposed to jsUnity.
         * @ignore
         */
        target.assertThat = function(actual, matcher, message) {
            return JsHamcrest.assertThat(actual, matcher, message, fail);
        };
    },

    /**
     * Screw.Unit integration. To plug JsHamcrest to Screw.Unit, follow
     * Screw.Unit installation and configuration instructions and then edit the
     * spec_helper.js file to include:
     *
     * <pre>
     *     JsHamcrest.Integration.screwunit();
     * </pre>
     *
     * You can then use JsHamcrest in the test suite as follows: <p>
     *
     * <pre>
     *     // Some test suite
     *     Screw.Unit(function() {
     *       describe("MyCalculator", function() {
     *         var calc;
     *         before(function() { calc = new MyCalculator() });
     *
     *         it("should add two numbers", function() {
     *           assertThat(calc.add(2,3), equalTo(5));
     *         }
     *
     *         // More tests here...
     *       }
     *     }
     * </pre>
     *
     * @param {object} params Configuration object.
     * @param {object} [params.scope=Screw.Matchers] Copies all test
     * matcher functions to the given scope.
     */
    screwunit: function(params) {
        params = params ? params : {};
        var target = params.scope || Screw.Matchers;

        JsHamcrest.Integration._copyMatchers(target);

        /**
         * Function called when an assertion fails.
         * @ignore
         */
        var fail = function(message) {
            throw message;
        };

        /**
         * Assertion method exposed to jsUnity.
         * @ignore
         */
        target.assertThat = function(actual, matcher, message) {
            return JsHamcrest.assertThat(actual, matcher, message, fail);
        };
    }
};

