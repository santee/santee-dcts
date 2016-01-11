'use strict';

import {isPrimitiveTypeConstructor} from './common';

export var typedArrayElementTypeMetadataKey = 'sas:validation:typedArrayType';

export function typedArrayDecorator(type: new() => Object): PropertyDecorator {
    return function(target: Object, propertyKey: (string|symbol)){
 
        if (type === undefined) {
            console.warn("TypedArrayDecorator: passed function is undefined, please make sure that it's declared before usage");
        }
 
        if (isPrimitiveTypeConstructor(type) || type === Object) {
            return;
        }

        Reflect.defineMetadata(typedArrayElementTypeMetadataKey, type, target, propertyKey);
    };
}