'use strict';

import {Constraint} from './common';

export class TypeSafetyConstraint implements Constraint {

    constructor(private propertyName: (string | symbol), private targetType: any) {
    }

    check(sourceValue: any) {
        var targetType = this.targetType;

        if (!targetType || sourceValue === null || sourceValue === undefined) {
            return;
        }
        
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

        if (targetType === Object && (typeof sourceValue !== "object")) {
            console.warn(this.formatAnyTypeWarningMessage(sourceValue, this.propertyName));
        }

        let typesAreCompatible = true;

        typesAreCompatible = typesAreCompatible && !(targetType === Number && (typeof sourceValue !== "number") && !(sourceValue instanceof Number));
        typesAreCompatible = typesAreCompatible && !(targetType === Boolean && (typeof sourceValue !== "boolean") && !(sourceValue instanceof Boolean));
        typesAreCompatible = typesAreCompatible && !(targetType === String && (typeof sourceValue !== "string") && !(sourceValue instanceof String));
        typesAreCompatible = typesAreCompatible && !(targetType === Function && (typeof sourceValue !== "function"));
        typesAreCompatible = typesAreCompatible && !(targetType === Array && !(Array.isArray(sourceValue)));

        if (!typesAreCompatible) {
            throw new Error(`Types are incompatible. Source types is '${typeof sourceValue}', expected is ${targetType}`);
        }
    }


    private formatAnyTypeWarningMessage(sourceValue: any, targetPropertyName: (string | symbol)) {
        var warningMessage = `Deserialization: Primitive type '${sourceValue}'' passed to ` +
            `the object for the property '${targetPropertyName.toString()}'. ` +
            `It is impossible to determine whether object type is 'any'` +
            ` or 'Object' or 'interface'. Try to avoid 'any' types`;

        return warningMessage;
    }
}