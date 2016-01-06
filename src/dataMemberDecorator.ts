'use strict';

export var dataMemberListMetadataKey = 'sas:validation:data-member-list';
export var dataMemberMetadataKey = 'sas:validation:data-member';

export function dataMemberDecorator(fieldName?: string) : PropertyDecorator {
    return (target, propertyKey) => {
        //Replace dataMemberList
        var dataMembers: (string|symbol)[] = Reflect.getMetadata(dataMemberListMetadataKey, target) || [];
        dataMembers = [...dataMembers, propertyKey];
        
        Reflect.defineMetadata(dataMemberListMetadataKey, dataMembers, target);
        
        var metadataValue = fieldName || propertyKey;
        
        Reflect.defineMetadata(dataMemberMetadataKey, metadataValue, target, propertyKey);
    };
}