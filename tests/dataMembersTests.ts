'use strict';

import chai = require('chai');
import {dataMember} from '../index';
import {dataMemberListMetadataKey, dataMemberMetadataKey} from '../src/dataMemberDecorator';

var expect = chai.expect;

describe('@dataMember()', () => {
    it(`creates '${dataMemberListMetadataKey}' metadata with all properties listed`, () => {
        class A {
            @dataMember()
            public foo: string;

            @dataMember({fieldName: 'bar2'})
            public bar: number;

            @dataMember()
            public gaz: number;
        };

        var metadata = Reflect.getMetadata(dataMemberListMetadataKey, A.prototype);

        expect(metadata).to.deep.equal(['foo', 'bar', 'gaz']);
    });

    it(`creates '${dataMemberMetadataKey}' metadata with property name as a value`, () => {
        class A {
            @dataMember()
            public foo: string;
        };

        var metadata = Reflect.getMetadata(dataMemberMetadataKey, A.prototype, "foo");
        expect(metadata).to.be.equal("foo");
    });
});


describe(`@dataMember({fieldName: 'fieldName'})`, () => {
    it(`creates '${dataMemberMetadataKey}' metadata with fieldName as a value`, () => {
        class A {
            @dataMember({fieldName: 'bar'})
            public foo: string;
        };

        var metadata = Reflect.getMetadata(dataMemberMetadataKey, A.prototype, "foo");
        expect(metadata).to.be.equal("bar");
    });
});


describe(`PropertiesMapper`, () => {
});