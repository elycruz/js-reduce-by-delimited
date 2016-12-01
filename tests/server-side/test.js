/**
 * Created by elyde on 12/1/2016.
 */

'use strict';

describe('name-here', function () {
    let fs = require('fs'),
        sjl = require('./../../src/sjl'),
        chai = require('chai'),
        assert = chai.assert,
        expect = chai.expect,
        expectFunction = sjl.curry(function (fn) {
            expect(fn).to.be.instanceOf(Function);
        }),
        shouldBeAFunction = function (prefix, fn) {
            it (prefix + ' should be a function', function () {
                expectFunction(fn);
            });
        },
        rbd = require('../../index'),
        interfaceNames = [
            'hasOpeningAndClosingDelim',
            'reduceByDelimited',
            'reduceByDelimitedC4',
            'reduceByDelimitedC5',
        ],
        propNames = [
            'fnPlaceHolder',
            '__'
        ];

    // fs.createReadStream('../example-data/example-body-content.html')
    //     .pipe()

    interfaceNames.forEach(function (methodName) {
        shouldBeAFunction('#' + methodName, rbd[methodName]);
    });

});