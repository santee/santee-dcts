'use strict';

import 'reflect-metadata';

import {requiredDecorator} from './src/requiredDecorator';
import {dataMemberDecorator} from './src/dataMemberDecorator';
import {deserialize, deserializeArray} from './src/deserializer';
import {typedArrayDecorator} from './src/typedArrayDecorator';

export {requiredDecorator as required,
        dataMemberDecorator as dataMember,
        typedArrayDecorator as typedArray,
        deserialize, deserializeArray};