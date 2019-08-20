'use strict';

import {RequiredMetadataConstraint} from './requiredDecorator';
import {TypeSafetyConstraint} from './typesSafetyConstraint';

import {isPrimitiveTypeConstructor} from './common';
import {MetadataAccessor} from './metadataAccessor';

export function deserialize<T extends Object>(source: Object, constructorFunction: new () => T) {
    if (!constructorFunction) {
        throw new Error("constructorFunction must be specified");
    }

    if (source === null) {
        throw new Error("source object cannot be null");
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

type assignmentFunction = (target: Object, targetPropertyName: (string | symbol), sourceValue: any) => void;

export function assignPropertyValues<T extends Object>(source: Object, target: T) {
    var metadataAccessor = new MetadataAccessor(target);
    var allProperties = metadataAccessor.getAllProperties();
    for (const targetPropertyName of allProperties) {

        const targetType = metadataAccessor.getPropertyType(targetPropertyName);
        const constraints = [new RequiredMetadataConstraint(target, targetPropertyName), new TypeSafetyConstraint(targetPropertyName, targetType)];

        const sourcePropertyName = metadataAccessor.getSourcePropertyName(targetPropertyName);

        let sourceValue = (<any>source)[sourcePropertyName];

        const customDeserializer = metadataAccessor.tryGetCustomDeserializer(targetPropertyName);
        if (customDeserializer) {
            sourceValue = customDeserializer(sourceValue);
        }

        for (const constraint of constraints) {
            constraint.check(sourceValue);
        }

        const assignmentFunction = customDeserializer 
            ? simpleAssignment 
            : findAssignmentFunction(targetType, targetPropertyName, sourceValue);

        //get assignment funciton
        assignmentFunction(target, targetPropertyName, sourceValue);
    }

    function findAssignmentFunction<T>(targetType: any, targetPropertyName: (string|symbol), sourceValue: any) {
        let assignmentFunction: assignmentFunction = simpleAssignment;

        if (sourceValue instanceof Object) {
            assignmentFunction = deepCopyAssignment;
        }

        const targetTypeIsPrimitiveTypeConstructor = isPrimitiveTypeConstructor(targetType);

        if (!targetTypeIsPrimitiveTypeConstructor && targetType !== Object) {
            assignmentFunction = deserializeAssignment(targetType);
        }

        if (sourceValue instanceof Array) {
            var typedArrayType = metadataAccessor.tryGetArrayElementType(targetPropertyName);
            if (typedArrayType) {
                assignmentFunction = deserializeArrayAssignment(typedArrayType);
            }
        }

        return assignmentFunction;
    }
}

function simpleAssignment(target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = sourceValue;
}

function deepCopyAssignment(target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = (JSON.parse(JSON.stringify(sourceValue)));
}

function deserializeAssignment(constructorFunction: new () => any): assignmentFunction {
    return function (target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
        var deserializedValue: any = sourceValue == null ? sourceValue : deserialize(sourceValue, constructorFunction);
        (<any>target)[targetPropertyName] = deserializedValue;
    };
}

function deserializeArrayAssignment(constructorFunction: new () => any): assignmentFunction {
    return function (target: Object, targetPropertyName: (string | symbol), sourceValue: any) {
        var deserializedValue: any = deserializeArray(sourceValue, constructorFunction);
        (<any>target)[targetPropertyName] = deserializedValue;
    };
}
