'use strict';

import {requiredMetadataKey} from './requiredDecorator';

import {PropertiesMapper} from './propertiesMapper';

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

export function deserializeArray<T extends Object>(source: Object[], constructorFunction: new () => T){
    if (!constructorFunction) {
        throw new Error("constructorFunction must be specified");
    }
    
    if (!Array.isArray(source)) {
        throw new Error("source object must be an array");
    }
    
    return source.map((x) => deserialize(x, constructorFunction));
}

export function assignPropertyValues<T extends Object>(source: Object, target: T) {

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
            
            if (targetType === Object && (typeof sourceValue !== "object")) {
                var warningMessage = `Deserialization: Primitive type '${sourceValue}'' passed to ` +
                                     `the object for the property '${targetPropertyName}'. ` + 
                                     `It is impossible to determine whether object type is 'any'` + 
                                     ` or 'Object' or 'interface'. Try to avoid 'any' types`;
                console.warn(warningMessage);
            }
            
            var targetTypeIsObjectFunction = targetType instanceof Object 
                && targetType !== Number 
                && targetType !== Object
                && targetType !== String
                && targetType !== Boolean
                && targetType !== Array;
            
            if (targetType === Number && (typeof sourceValue !== "number") && !(sourceValue instanceof Number)) {
                typesAreCompatible = false;
            } else if (targetType === Boolean && (typeof sourceValue !== "boolean") && !(sourceValue instanceof Boolean)) {
                typesAreCompatible = false;
            } else if (targetType === String && (typeof sourceValue !== "string") && !(sourceValue instanceof String)) {
                typesAreCompatible = false;
            } else if (targetType === Function && (typeof sourceValue !== "function")) {
                typesAreCompatible = false;
            } else if (targetTypeIsObjectFunction && !(sourceValue instanceof Object)) {
                typesAreCompatible = false;
            } else if (targetType === Array && !(Array.isArray(sourceValue))) {
                typesAreCompatible = false;
            }
            
            if (!typesAreCompatible) {
                throw new Error(`Types are incompatible. Source types is '${typeof sourceValue}', expected is ${targetType}`);
            }
            
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

function simpleAssignment(target: Object, targetPropertyName: (string|symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = sourceValue;
}

function deepCopyAssignment(target: Object, targetPropertyName: (string|symbol), sourceValue: any) {
    (<any>target)[targetPropertyName] = (JSON.parse(JSON.stringify(sourceValue)));
}

function deserializeAssignment(constructorFunction: new() => any){
    return function (target: Object, targetPropertyName: (string|symbol), sourceValue: any){
        var deserializedValue: any = deserialize(sourceValue, constructorFunction);
        (<any>target)[targetPropertyName] = deserializedValue;
    }
}