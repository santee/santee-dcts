'use strict';

export function isPrimitiveTypeConstructor(targetType: any) {
    return !(targetType instanceof Object
        && targetType !== Number
        && targetType !== Object
        && targetType !== String
        && targetType !== Boolean
        && targetType !== Array);
};

export interface Constraint {
    check(sourceValue: any): void;
} 