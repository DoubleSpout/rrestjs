// --------------------------------------------------------------------------------------------------------------------
//
// config-2.js - tests for node-data2xml
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var tap = require("tap"),
    test = tap.test,
    plan = tap.plan;
var data2xml = require('../data2xml');

var declaration = '<?xml version="1.0" encoding="utf-8"?>\n';

// --------------------------------------------------------------------------------------------------------------------

var tests = [
    {
        name : 'one element structure with an xmlns',
        element : 'topelement',
        data : {
            '_attr' : { xmlns : 'http://www.appsattic.com/xml/namespace' },
            second : 'value',
            'undefined' : undefined,
            'null' : null,
        },
        exp1 : declaration + '<topelement xmlns="http://www.appsattic.com/xml/namespace"><second>value</second><undefined></undefined><null/></topelement>',
        exp2 : declaration + '<topelement xmlns="http://www.appsattic.com/xml/namespace"><second>value</second><undefined/><null></null></topelement>'
    },
    {
        name : 'complex 4 element array with some attributes',
        element : 'topelement',
        data : { item : [
            { '_attr' : { type : 'a' }, '_value' : 'val1' },
            { '_attr' : { type : 'b' }, '_value' : 'val2' },
            'val3',
            { '_value' : 'val4' },
        ] },
        exp1 : declaration + '<topelement><item type="a">val1</item><item type="b">val2</item><item>val3</item><item>val4</item></topelement>',
        exp2 : declaration + '<topelement><item type="a">val1</item><item type="b">val2</item><item>val3</item><item>val4</item></topelement>'
    },
];

var convert1 = data2xml({ 'undefined' : 'empty', 'null' : 'closed' });
test("1) some simple xml with undefined or null values", function (t) {
    tests.forEach(function(test) {
        var xml = convert1(test.element, test.data, { attrProp : '@', valProp : '#' });
        t.equal(xml, test.exp1, test.name);
    });

    t.end();
});

var convert2 = data2xml({ 'undefined' : 'closed', 'null' : 'empty' });
test("2) some simple xml with undefined or null values", function (t) {
    tests.forEach(function(test) {
        var xml = convert2(test.element, test.data, { attrProp : '@', valProp : '#' });
        t.equal(xml, test.exp2, test.name);
    });

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
