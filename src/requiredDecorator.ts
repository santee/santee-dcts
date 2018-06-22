'use strict';

import {Constraint} from './common';

export var requiredMetadataKey = "sas:validations:required";

export interface RequiredDecoratorParameters {
    nullable?: boolean;
}

export function requiredDecorator(params?: RequiredDecoratorParameters): PropertyDecorator {
    return (target, propertyKey) => {

        var metadataValue = params || { nullable: false };

        Reflect.defineMetadata(requiredMetadataKey, metadataValue, target, propertyKey);
    };
}

export class RequiredMetadataConstraint implements Constraint {
    constructor(private obj: any, private propertyName: (string | symbol)) {
    }

    private readRequiredDecoratorMetadata() {
        var metadataValue = <RequiredDecoratorParameters>Reflect.getMetadata(requiredMetadataKey, this.obj, this.propertyName);
        return metadataValue || null;
    }

    check(sourceValue: any) {
        var decoratorParams = this.readRequiredDecoratorMetadata();
        if (!decoratorParams) {
            return;
        }

        if (sourceValue === undefined || (sourceValue === null && decoratorParams.nullable !== true)) {
            throw new Error(`${this.propertyName.toString()} is required`);
        }
    }
}