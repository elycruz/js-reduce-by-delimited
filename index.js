/**
 * Created by elyde on 12/1/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined' && global,
        sjl = isNodeEnv ? require('sjljs') : window.sjl, __ = sjl._,
        valueOrDefault = sjl.valueOrDefault,

        hasOpeningAndClosingDelim = sjl.curry3(function (content, openDelim, closingDelim, minDelimitedContentLen) {
            minDelimitedContentLen = valueOrDefault(minDelimitedContentLen, 1, Number);
            return (content.indexOf(openDelim) > -1 ||
            content.indexOf(closingDelim) > (openDelim.length + minDelimitedContentLen));
        }),

        normalizeAggregator = function (aggregator) {
            if (!aggregator.hasOwnProperty('difference')) {
                aggregator.difference = '';
            }
            if (!aggregator.hasOwnProperty('extracted')) {
                aggregator.extracted = [];
            }
            return aggregator;
        },

        reduceByDelimitedContent = sjl.curry3(function (content, openingDelimiter, closingDelimiter, keepDelimInExtracted, minDelimitedContentLen, aggregatorLike) {
            keepDelimInExtracted = valueOrDefault(keepDelimInExtracted, false),
            minDelimitedContentLen = valueOrDefault(minDelimitedContentLen, 1, Number);
            var aggregator = normalizeAggregator(valueOrDefault(aggregatorLike, {})),
                argsForRemainingCalls;

            // If no opening or closing delimiter return untouched contents
            if (!hasOpeningAndClosingDelim(content, openingDelimiter, closingDelimiter)) {
                aggregator.difference = content;
                return aggregator;
            }

            // Start processing content
            let openingMatch = (new RegExp('(' + openingDelimiter + ')', 'gim')).exec(content),
                closingMatch = (new RegExp('(' + closingDelimiter + ')', 'gim')).exec(content),
                extractPointStart = !keepDelimInExtracted ? openingMatch.index + openingDelimiter.length : openingMatch.index,
                extractPointEnd = !keepDelimInExtracted ? closingMatch.index : closingMatch.index + closingDelimiter.length,
                extractedContent = content.slice(extractPointStart, extractPointEnd),
                remainingContent = content.slice(0, openingMatch.index) +
                    content.substring(closingMatch.index + closingDelimiter.length, content.length);

            // Push extracted content
            aggregator.difference = remainingContent;
            aggregator.extracted.push(extractedContent);

            // Prepare for further calls
            argsForRemainingCalls = [remainingContent, openingDelimiter, closingDelimiter, keepDelimInExtracted, minDelimitedContentLen, aggregator];

            // If content can still be reduced further do so
            if (hasOpeningAndClosingDelim.apply(null, argsForRemainingCalls)) {
                return reduceByDelimitedContent.apply(null, argsForRemainingCalls);
            }

            // Returned reduced and extracted content
            return aggregator;
        }),

        reduceByDelimited = {
            hasOpeningAndClosingDelim: hasOpeningAndClosingDelim,
            normalizeAggregator: normalizeAggregator,
            reduceByDelimited: reduceByDelimitedContent,
            reduceByDelimitedC4: sjl.curry4(function () {
                return reduceByDelimitedContent.apply(null, arguments);
            }),
            reduceByDelimitedC5: sjl.curry5(function () {
                return reduceByDelimitedContent.apply(null, arguments);
            }),
            fnPlaceholder: __, // placeholder for currying
            __: __ // ""
        };

    if (isNodeEnv) {
        module.exports = reduceByDelimited;
    }
    else if (sjl.isAmd) {
        return reduceByDelimited;
    }
    else {
        window.reduceByDelimited = reduceByDelimitedContent;
    }

}());
