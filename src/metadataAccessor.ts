import { dataMemberMetadataKey, dataMemberListMetadataKey, dataMemberCustomDeserializerMetadataKey, dataMemberFieldTypeMetadataKey } from './dataMemberDecorator';
import {typedArrayElementTypeMetadataKey} from './typedArrayDecorator';
import {anyArrayElementTypeMetadataKey} from './anyArrayDecorator';

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

    tryGetCustomDeserializer(targetPropertyName: (string | symbol)) {
        return Reflect.getMetadata(dataMemberCustomDeserializerMetadataKey, this.objectPrototype, targetPropertyName) || null;
    }
    
    tryGetArrayElementType(targetPropertyName: (string | symbol)) {
        const arrayType = Reflect.getMetadata(typedArrayElementTypeMetadataKey, this.objectPrototype, targetPropertyName);
        if (arrayType) {
            return arrayType;
        }

        if (Reflect.getMetadata(anyArrayElementTypeMetadataKey, this.objectPrototype, targetPropertyName)) {
            return null;
        }

        throw new Error(`Array found for '${targetPropertyName.toString()}' field with no type declared. Use @anyArray or @typedArray decorators.`);
    }

    tryGetFieldTypeProperty(targetPropertyName: (string | symbol)) {
        return Reflect.getMetadata(dataMemberFieldTypeMetadataKey, this.objectPrototype, targetPropertyName) || null;
    }
}