'use strict';

import {isPrimitiveTypeConstructor} from './common';
import {anyArrayElementTypeMetadataKey} from './anyArrayDecorator';

export const typedArrayElementTypeMetadataKey = 'sas:validation:typedArrayType';

export function typedArrayDecorator(type: new() => Object): PropertyDecorator {
    return function(target: Object, propertyKey: (string|symbol)){
 
        if (type === undefined) {
            console.warn("TypedArrayDecorator: passed function is undefined, please make sure that it's declared before usage");
        }
 
        if (isPrimitiveTypeConstructor(type) || type === Object) {
            Reflect.defineMetadata(anyArrayElementTypeMetadataKey, true, target, propertyKey);
            return;
        }

        Reflect.defineMetadata(typedArrayElementTypeMetadataKey, type, target, propertyKey);
    };
}