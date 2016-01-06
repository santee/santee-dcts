'use strict';

import {requiredMetadataKey} from './requiredDecorator';

export class PropertiesCollector {
    
    constructor(fn: Function){
        
    }
    
    collect() {
        
    }
}


export function deserialize<T>(source: Object, constructorFunction: new() => T){
    if (!constructorFunction) {
        throw new Error("constructorFunction must be specified")
    }
    
    if (source instanceof Object) {
        var target = new constructorFunction();
        
        return target;
    } else {
        throw new Error("source object must be an object")
    }
}