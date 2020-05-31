'use strict';

export const dataMemberListMetadataKey = 'sas:validation:data-member-list';
export const dataMemberMetadataKey = 'sas:validation:data-member';
export const dataMemberCustomDeserializerMetadataKey = 'sas:validation:custom-deserializer';
export const dataMemberFieldTypeMetadataKey = 'sas:validation:field-type';

export function dataMemberDecorator(params?: DataMemberDecoratorParams) : PropertyDecorator {
    return (target, propertyKey) => {
        //Replace dataMemberList
        let dataMembers: (string|symbol)[] = Reflect.getMetadata(dataMemberListMetadataKey, target) || [];
        dataMembers = [...dataMembers, propertyKey];

        Reflect.defineMetadata(dataMemberListMetadataKey, dataMembers, target);

        let metadataValue = propertyKey;

        if (params && params.fieldName) {
            metadataValue = params.fieldName;
        }

        if (params && params.fieldType) {
            Reflect.defineMetadata(dataMemberFieldTypeMetadataKey, params.fieldType, target, propertyKey);
        }

        Reflect.defineMetadata(dataMemberMetadataKey, metadataValue, target, propertyKey);

        if (params && params.customDeserializer) {
            Reflect.defineMetadata(dataMemberCustomDeserializerMetadataKey, params.customDeserializer, target, propertyKey);
        }
    };
}

export interface DataMemberDecoratorParams {
    fieldName?: string;
    fieldType?: new (...args: any[]) => any;
    customDeserializer?: ( (value: any) => any);
}