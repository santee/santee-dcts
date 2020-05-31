'use strict';

import chai = require('chai');
import {dataMember, deserialize} from '../index';
import { dataMemberListMetadataKey, dataMemberMetadataKey, dataMemberFieldTypeMetadataKey } from '../src/dataMemberDecorator';

var expect = chai.expect;

describe('@dataMember()', () => {
    it(`creates '${dataMemberListMetadataKey}' metadata with all properties listed`, () => {
        class A {
            @dataMember()
            public foo: string;

            @dataMember({ fieldName: 'bar2' })
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
            @dataMember({ fieldName: 'bar' })
            public foo: string;
        };

        var metadata = Reflect.getMetadata(dataMemberMetadataKey, A.prototype, "foo");
        expect(metadata).to.be.equal("bar");
    });
});


describe(`@dataMember({customDeserializer: fnc})`, () => {
    it(`transforms input to output value`, () => {
        class A {
            @dataMember({ customDeserializer: (x) => new Date(x) })
            public foo: Date;
        }
        var source = { foo: "01.01.2000" };

        var result = deserialize(source, A);

        expect(result.foo.valueOf()).to.equal(new Date(source.foo).valueOf());
    });

    it(`throws an error if types are not compatible`, () => {
        class A {
            @dataMember({ customDeserializer: (x) => "foo" })
            public foo: number;
        }
        var source = { foo: 20 };

        expect(() => deserialize(source, A)).to.throw();
    });
});

describe(`@dataMember({fieldType: Ctor})`, () => {
    it(`creates ${dataMemberFieldTypeMetadataKey} to output value`, () => {
        class A {
            @dataMember({ fieldType: String })
            public foo: string | null;
        }

        var metadata = Reflect.getMetadata(dataMemberFieldTypeMetadataKey, A.prototype, "foo");
        expect(metadata).to.be.equal(String);
    });
});
