'use strict';

import 'reflect-metadata';

import {requiredDecorator} from './src/requiredDecorator';
import {dataMemberDecorator} from './src/dataMemberDecorator';
import {deserialize, deserializeArray} from './src/deserializer';
import {typedArrayDecorator} from './src/typedArrayDecorator';
import {anyArrayDecorator} from './src/anyArrayDecorator';

export {requiredDecorator as required,
        dataMemberDecorator as dataMember,
        typedArrayDecorator as typedArray,
        anyArrayDecorator as anyArray,
        deserialize, deserializeArray};