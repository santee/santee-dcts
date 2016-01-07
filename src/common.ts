'use strict';

import {requiredMetadataKey} from './requiredDecorator';
import {dataMemberMetadataKey, dataMemberListMetadataKey} from './dataMemberDecorator';

export class MetadataAccessor<T extends Object> {
    constructor(private target: T) {
    }
    
    get objectPrototype() {
        return this.target.constructor.prototype;
    }
    
    getAllProperties() : (string|symbol)[] {
        return Reflect.getMetadata(dataMemberListMetadataKey, this.objectPrototype) || [];
    }
    
    getSourcePropertyName(targetPropertyName: (string|symbol)) {
        return Reflect.getMetadata(dataMemberMetadataKey, this.objectPrototype, targetPropertyName);
    }
    
    getPropertyType(targetPropertyName: (string|symbol)) {
        return Reflect.getMetadata("design:type", this.objectPrototype, targetPropertyName);
    }
}

export interface Constraint {
    check(sourceValue: any) : void;
} 