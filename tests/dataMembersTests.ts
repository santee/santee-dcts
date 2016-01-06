'use strict';

import chai = require('chai');
import {dataMember} from '../index';

var expect = chai.expect;

describe('@dataMember()', () => {
    it(`creates 'sas:validation:data-member-list' metadata with all properties listed`, () => {
        class A {
            @dataMember()
            public foo: string;

            @dataMember('bar2')
            public bar: number;

            @dataMember()
            public gaz: number;
        }

        var metadata = Reflect.getMetadata('sas:validation:data-member-list', A.prototype);

        expect(metadata).to.deep.equal(['foo', 'bar', 'gaz']);
    });

    it(`creates 'sas:validation:data-member' metadata with property name as a value`, () => {
        class A {
            @dataMember()
            public foo: string;
        }
        
        var metadata = Reflect.getMetadata('sas:validation:data-member', A.prototype, "foo");
        expect(metadata).to.be.equal("foo");
    });
});


describe(`@dataMember('fieldName')`, () => {
    it(`creates 'sas:validation:data-member' metadata with fieldName as a value`, () => {
        class A {
            @dataMember('bar')
            public foo: string;
        }
        
        var metadata = Reflect.getMetadata('sas:validation:data-member', A.prototype, "foo");
        expect(metadata).to.be.equal("bar");
    });
})