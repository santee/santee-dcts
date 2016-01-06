'use strict';

import {requiredMetadataKey} from './requiredDecorator';

import {PropertiesMapper} from './propertiesMapper';

export function deserialize<T>(source: Object, constructorFunction: new() => T){
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
    for(var targetPropertyName of allProperties) {
        var sourcePropertyName = mapper.getSourcePropertyName(targetPropertyName);
        
        var sourceValue = (<any>source)[sourcePropertyName];
        
        (<any>target)[targetPropertyName] = sourceValue;
    }
}