# DataMemberSerializer for TypeScript

Runtime javascript objects deserializer for TypeScript. Basically transforms JSON objects to class instances.
### Example:

```TypeScript

import {deserialize, dataMember} from 'santee-dcts'

class B {
    @dataMember()
    public foo: string;

    @dataMember()
    public boo: number;
    }

    class A {
        @dataMember()
        public obj: B;
    };

    var source = { obj: { foo: "a", boo: 10 } };
    var result = deserialize(source, A);

    expect(result.obj).not.equal(source.obj);
    expect(result.obj).is.deep.equal(source.obj);

    expect(result.obj).to.be.instanceof(B);

```

###Installation

```sh
npm install santee-dcts --save
tsd link
```

It's better to have the following settings enabled in your tsconfig.json:
```javascript
{
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
}
```

