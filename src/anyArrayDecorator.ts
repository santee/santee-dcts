export const anyArrayElementTypeMetadataKey = 'sas:validation:anyArrayType';

export function anyArrayDecorator(): PropertyDecorator {
    return function(target: Object, propertyKey: (string|symbol)){
        Reflect.defineMetadata(anyArrayElementTypeMetadataKey, true, target, propertyKey);
    };
}