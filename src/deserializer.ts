'use strict';

import {RequiredMetadataConstraint} from './requiredDecorator';
import {TypeSafetyConstraint} from './typesSafety';

import {MetadataAccessor} from './common';

export function deserialize<T extends Object>(source: Object, constructorFunction: new () => T) {
    if (!constructorFunction) {
        throw new Error("constructorFunction must be specified");
    }

    if (source instanceof Object) {
        var target = new constructorFunction();

        assignPropertyValues(source, target);

        return target;
    } else {
        throw new Error("source object must be an object");
    }
}

export function deserializeArray<T extends Object>(source: Object[], constructorFunction: new () => T) {
    if (!constructorFunction) {
        throw new Error("constructorFunction must be specified");
    }

    if (!Array.isArray(source)) {
        throw new Error("source object must be an array");
    }

    return source.map((x) => deserialize(x, constructorFunction));
}

export function assignPropertyValues<T extends Object>(source: Object, target: T) {

    var metadataAccessor = new MetadataAccessor(target);
    var allProperties = metadataAccessor.getAllProperties();
    for (let targetPropertyName of allProperties) {
        
        let targetType = metadataAccessor.getPropertyType(targetPropertyName);
        let constraints = [new RequiredMetadataConstraint(target, targetPropertyName), new TypeSafetyConstraint(targetPropertyName, targetType)];
        
        let sourcePropertyName = metadataAccessor.getSourcePropertyName(targetPropertyName);

        let sourceValue = (<any>source)[sourcePropertyName];

        let assignmentFunction = simpleAssignment;
        
        for (let constraint of constraints) {
            constraint.check(sourceValue);
        }
        
        if (targetType && sourceValue !== null && sourceValue !== undefined) {

            var targetTypeIsObjectFunction = targetType instanceof Object
                && targetType !== Number
                && targetType !== Object
                && targetType !== String
                && targetType !== Boolean
                && targetType !== Array;

            if (sourceValue instanceof Object) {
                assignmentFunction = deepCopyAssignment;
            }

            if (targetTypeIsObjectFunction && targetType !== Object) {
                assignmentFunction = deserializeAssignment(targetType);
            }
        }

        assignmentFunction(target, targetPropertyName, sourceValue);
    }
}

function simpleAssignment(target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = sourceValue;
}

function deepCopyAssignment(target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = (JSON.parse(JSON.stringify(sourceValue)));
}

function deserializeAssignment(constructorFunction: new () => any) {
    return function(target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
        var deserializedValue: any = deserialize(sourceValue, constructorFunction);
        (<any>target)[targetPropertyName] = deserializedValue;
    };
}