'use strict';

import {requiredMetadataKey} from './requiredDecorator';
import {dataMemberMetadataKey, dataMemberListMetadataKey} from './dataMemberDecorator';

export class PropertiesMapper<T extends Object> {
    constructor(private target: T) {
    }
    
    get objectPrototype() {
        return this.target.constructor.prototype;
    }
    
    getAllProperties() : (string|symbol)[] {
        return Reflect.getMetadata(dataMemberListMetadataKey, this.objectPrototype) || [];
    }
    
    getSourcePropertyName(targetPropertyName: (string|symbol)) {
        return Reflect.getMetadata(dataMemberMetadataKey, this.objectPrototype, targetPropertyName)
    }
    
    getPropertyType(targetPropertyName: (string|symbol)) {
        return Reflect.getMetadata("design:type", this.objectPrototype, targetPropertyName);
    }
    
    isPropertyRequired(targetPropertyName: (string|symbol)) {
        return Reflect.getMetadata(requiredMetadataKey, this.objectPrototype, targetPropertyName);
    }
    
    isPropertyAssignable(sourceObject: Object, targetPropertyName: string) {
        var sourcePropertyName = this.getSourcePropertyName(targetPropertyName);
        
        if (!sourcePropertyName) {
            return false;
        }
        
        var sourceHasProperty = sourceObject.hasOwnProperty(targetPropertyName);
        if (!sourceHasProperty) {
            return false;
        }
        
        var sourcePropertyValue = (<any>sourceObject)[sourcePropertyName];
    }
}