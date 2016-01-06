'use strict';

import {requiredMetadataKey} from './requiredDecorator';

import {PropertiesMapper} from './propertiesMapper';

export function deserialize<T>(source: Object, constructorFunction: new () => T) {
    if (!constructorFunction) {
        throw new Error("constructorFunction must be specified")
    }

    if (source instanceof Object) {
        var target = new constructorFunction();

        assignPropertyValues(source, target);

        return target;
    } else {
        throw new Error("source object must be an object")
    }
}

export function assignPropertyValues<T>(source: Object, target: T) {
    var mapper = new PropertiesMapper(target);
    var allProperties = mapper.getAllProperties();
    for (var targetPropertyName of allProperties) {
        let sourcePropertyName = mapper.getSourcePropertyName(targetPropertyName);

        let sourceValue = (<any>source)[sourcePropertyName];

        let assignmentFunction = simpleAssignment;

        let targetType = mapper.getPropertyType(targetPropertyName);
        if (targetType && sourceValue !== null && sourceValue !== undefined) {
            //check on types compatibility
            //Basic types serialization rules for design:types
            //number -> Number
            //string -> String
            //boolean -> Boolean
            //any -> Object
            //void -> undefined
            //Array -> Array
            //Tuple -> Array
            //class -> Class constructor
            //enum -> Number
            //function -> Function
            //interface -> Object
            //Otherwise -> Object
            
            let typesAreCompatible = true;
            
            if (targetType === Number && (typeof sourceValue !== "number") && !(sourceValue instanceof Number)) {
                typesAreCompatible = false;
            }

            if (targetType === Boolean && (typeof sourceValue !== "boolean") && !(sourceValue instanceof Boolean)) {
                typesAreCompatible = false;
            }
            
            if (targetType === String && (typeof sourceValue !== "string") && !(sourceValue instanceof String)) {
                typesAreCompatible = false;
            }
            
            if (targetType === Function && (typeof sourceValue !== "function")) {
                typesAreCompatible = false;
            }
            
            if (!typesAreCompatible) {
                throw new Error(`Types are incompatible. Source types is '${typeof sourceValue}', expected is ${targetType}`);
            }
        }
        
        if (sourceValue instanceof Object) {
            assignmentFunction = deepCopyAssignment;
        }

        assignmentFunction(target, targetPropertyName, sourceValue);
    }
}

function simpleAssignment(target: Object, targetPropertyName: (string|symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = sourceValue;
}

function deepCopyAssignment(target: Object, targetPropertyName: (string|symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = (JSON.parse(JSON.stringify(sourceValue)));
}