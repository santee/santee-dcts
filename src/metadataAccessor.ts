import {dataMemberMetadataKey, dataMemberListMetadataKey} from './dataMemberDecorator';
import {typedArrayElementTypeMetadataKey} from './typedArrayDecorator';

export class MetadataAccessor<T extends Object> {
    constructor(private target: T) {
    }

    get objectPrototype() {
        return this.target.constructor.prototype;
    }

    getAllProperties(): (string | symbol)[] {
        return Reflect.getMetadata(dataMemberListMetadataKey, this.objectPrototype) || [];
    }

    getSourcePropertyName(targetPropertyName: (string | symbol)) {
        return Reflect.getMetadata(dataMemberMetadataKey, this.objectPrototype, targetPropertyName);
    }

    getPropertyType(targetPropertyName: (string | symbol)) {
        return Reflect.getMetadata("design:type", this.objectPrototype, targetPropertyName);
    }
    
    tryGetArrayElementType(targetPropertyName: (string | symbol)) {
        return Reflect.getMetadata(typedArrayElementTypeMetadataKey, this.objectPrototype, targetPropertyName) || null;
    }
}