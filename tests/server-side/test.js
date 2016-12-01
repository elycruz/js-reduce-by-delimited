/**
 * Created by elyde on 12/1/2016.
 */
describe('reduce-by-delimited', function () {

    'use strict';

    let fs = require('fs'),
        path = require('path'),
        sjl = require('sjljs'),
        chai = require('chai'),
        assert = chai.assert,
        expect = chai.expect,
        exampleContentDir = path.join(__dirname, '/../example-data/'),
        rbd = require('../../index'),
        __ = rbd.__,
        expectFunction = sjl.curry(function (fn) {
            expect(fn).to.be.instanceOf(Function);
        }),
        expectTrue = function (value) {
            expect(value).to.equal(true);
        },
        expectFalse = function (value) {
            expect(value).to.equal(false);
        },
        shouldBeAFunction = function (prefix, fn) {
            it (prefix + ' should be a function', function () {
                expectFunction(fn);
            });
        },
        interfaceNames = [
            'hasOpeningAndClosingDelim',
            'reduceByDelimited',
            'reduceByDelimitedC4',
            'reduceByDelimitedC5',
        ];

    // Ensure required interface
    interfaceNames.forEach(function (methodName) {
        shouldBeAFunction('#' + methodName, rbd[methodName]);
    });

    // Ensure required properties
    describe ('#fnPlaceHolder && #__', function () {
        it ('should be equal to `sjl._` (sjl\'s placeholder).', function () {
            expect(rbd.fnPlaceholder).to.equal(sjl._);
            expect(rbd.__).to.equal(sjl._);
        });
    });

    describe ('#hasOpeningAndClosingDelim', function () {
        it ('should return a boolean when it has the required args', function () {
            expect(rbd.hasOpeningAndClosingDelim('', '<delim>', '</delim>')).to.equal(false);
            expect(rbd.hasOpeningAndClosingDelim('asdf<delim>asdfasdf</delim>asdfasdf', '<delim>', '</delim>')).to.equal(true);
        });
        it ('should curry up to 3', function () {
            let hasOpenAndCloseDelim = rbd.hasOpeningAndClosingDelim,
                openDelim = '<delim>',
                closeDelim = '</delim>',
                falsyContent = 'helloWorld',
                truthyContent = 'asdf<delim>helloWorld</delim>asdf',
                fn1 = hasOpenAndCloseDelim(),
                fn2 = hasOpenAndCloseDelim(__, openDelim),
                fn3 = hasOpenAndCloseDelim(__, openDelim, closeDelim),
                opArgs = function (expectedOpResult) { return [expectedOpResult ? truthyContent : falsyContent, openDelim, closeDelim]; };

            [fn1, fn2, fn3].forEach(function (fn, index) {
                var truthyArgs = opArgs(true),
                    falsyArgs = opArgs(false),
                    falsySlice = falsyArgs.slice(index + 1),
                    truthySlice = truthyArgs.slice(index + 1);
                expectFunction(fn());
                expectFunction(fn(__));
                expectFunction(fn.apply(null, falsySlice));
                expectFunction(fn.apply(null, truthySlice));
                expectTrue(fn.apply(null, truthyArgs));
                expectFalse(fn.apply(null, falsyArgs));
            });
        });
    });

    describe ('#normalizeAggregator', function () {
        it ('should return an object that contains expected keys ({difference: {String}, extracted: {Array}})', function () {
            let rslt = rbd.normalizeAggregator({});
            expectTrue(sjl.isString(rslt.difference));
            expectTrue(sjl.isArray(rslt.extracted));
        });
        it ('should throw an error when passed value doesn\'t contain a `hasOwnProperty` value.', function () {
            assert.throws(rbd.normalizeAggregator, Error);
        });
        it ('should return passed in value untouched if it already has the required interface.', function () {
            let defaultObj = {difference: 'somevalue', extracted: ['someothervalue']},
                rslt = rbd.normalizeAggregator(defaultObj);
            expect(defaultObj).to.equal(rslt);
            expectTrue(sjl.isString(rslt.difference));
            expectTrue(sjl.isArray(rslt.extracted));
        })
    });

    describe ('#reduceByDelimited', function () {
        it ('should reduce passed in content by delimited content in default configuration (only ' +
            'content and delimiters passed in).', function () {
            var content = fs.readFileSync(path.join(exampleContentDir, '/example-content.html'), 'utf-8'),
                delimitedTags = require(path.join(exampleContentDir, '/example-content'));
            delimitedTags.forEach(function (tagPair) {
                var result = rbd.reduceByDelimited.apply(null, [content].concat(tagPair));
                expectTrue(result.difference.indexOf(tagPair[0]) === -1); // ensure content extracted
                expectTrue(result.difference.indexOf(tagPair[1]) === -1); // ensure content extracted
                expectTrue(result.extracted.length === content.match(tagPair[0]).length);
            });
        });
    });

});
