'use strict';

import chai = require('chai');
import {required, deserialize, dataMember} from '../index';
import {requiredMetadataKey} from '../src/requiredDecorator';

var expect = chai.expect;

describe("@required()", () => {
    it(`creates '${requiredMetadataKey}' metadata ` +
        `on constructor function prototype with key equals ` +
        `to field name and value equals to true ` +
        `when being applied to a field`, () => {

            class A {
                @required()
                public foo: string;
            };

            var metadata = Reflect.getMetadata(requiredMetadataKey, A.prototype, "foo");

            expect(metadata).to.exist;
        });

    it(`creates '${requiredMetadataKey}' metadata on constructor function prototype when being applied to a property`, () => {

        class A {
            private _foo: string;

            @required()
            get foo() {
                return this._foo;
            }

            set foo(value) {
                this._foo = value;
            }
        }

        var metadata = Reflect.getMetadata(requiredMetadataKey, A.prototype, "foo");

        expect(metadata).to.exist;
    }
    );

    it(`makes deserialize() function to fail if source value (primitive) is undefined`, () => {
        class A {
            @dataMember()
            @required()
            public foo: string;
        }
        
        var source = { bar: "test" };
        
        expect(() => deserialize(source, A)).to.throw(Error);
    });

    it(`makes deserialize() function to fail if source value (object) is undefined`, () => {
        class B {
            @dataMember()
            public foo: string;
        }

        class A {
            @dataMember()
            @required()
            public b: B;
        }
        
        var source = { bar: "test" };
        
        expect(() => deserialize(source, A)).to.throw(Error);
    });

    it(`makes deserialize() function to fail if source value is null`, () => {
        class A {
            @dataMember()
            @required()
            public foo: string;
        }
        
        var source = { foo: <any>null };
        
        expect(() => deserialize(source, A)).to.throw(Error);
    });
});

describe("@required({nullable: true})", () => {
    it(`makes deserialize() function to fail if source value is undefined`, () => {
        class A {
            @dataMember()
            @required({nullable: true})
            public foo: string;
        }
        
        var source = { bar: "test" };
        
        expect(() => deserialize(source, A)).to.throw(Error);
    });


    it(`makes deserialize() function to set value to null`, () => {
        class A {
            @dataMember()
            @required({nullable: true})
            public foo: string;
        }
        
        var source = { foo: <any>null };
        
        var result = deserialize(source, A);
        expect(result.foo).to.be.null;
    });


    it(`does not attempt to deserialize field object which is marked as nullable`, () => {
        class B {
            @dataMember()
            public bar: string;
        }

        class A {
            @dataMember()
            @required({nullable: true})
            public foo: B;
        }

        var source = { foo: <any>null };

        var result = deserialize(source, A);
        expect(result.foo).to.be.null;
    });
});