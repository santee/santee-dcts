'use strict';

import chai = require('chai');
import {required} from '../index';
import {requiredMetadataKey} from '../src/requiredDecorator';

var expect = chai.expect;

describe("@required()", () => {
    it(`creates '${requiredMetadataKey}' metadata 
        on constructor function prototype with key equals 
        to field name and value equals to true
        when being applied to a field`,
        () => {

            class A {
                @required()
                public foo: string;
            };
            
            var metadata = Reflect.getMetadata(requiredMetadataKey, A.prototype, "foo");
            
            expect(metadata).to.be.true;
        });
        
    it(`creates '${requiredMetadataKey}' metadata on 
        constructor function prototype when being applied to a property`,
        () => {
            
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
            
            expect(metadata).to.be.true;
        }
    );
});