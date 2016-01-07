'use strict';

export var requiredMetadataKey = "sas:validations:required";

export function requiredDecorator(): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(requiredMetadataKey, true, target, propertyKey);
    };
}