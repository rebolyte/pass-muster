# pass-muster

Objects work well as a single argument to a function. That way you don't have to remember the order of parameters, and your code gets a nice self-documenting look. `passMuster` lets you be a little more sure of those objects that you pass as an argument to functions by validating that the properties you need are there and of the right types. Think of it as a lightweight implementation of interfaces.

Of course, this isn't limited to validating objects passed as arguments. Use it wherever you want to make sure an object has what you need.

The module is written in good ol' ES5, so it works everywhere.

## Usage

```js
myFunction(opts) {
    passMuster(opts, {
        id: 'number',
        username: 'string'
    });
    // do something with opts object
}

myFunction({
    id: 007,
    username: 'jbond'
})
// --> no error thrown, myFunction continues
```

If `myFunction` is called without a required property, `passMuster` will throw an error:

```js
myFunction({
    id: 007
})
// --> "missing property 'username'"
```

It will also throw an error if the property is not the right type:

```js
myFunction({
    id: 007
    username: 12345
})
// --> "property 'username' has wrong type"
```

An array of possible types can be supplied:

```js
let objToValidate = {
    prop: 'test'
}
passMuster(objToValidate, {
    prop: ['string', 'number']
});
// --> no error

passMuster(objToValidate, {
    prop: ['array', 'object']
});
// --> "property 'prop' not one of allowed types"
```

If you have further validation you want to do, a predicate function that returns `true` or `false` can be passed in:

```js
let objToValidate = {
    num: 11
}
passMuster(objToValidate, {
    num: p => (p < 100)
});
// --> no error

passMuster(objToValidate, {
    num: p => (p % 2 === 0)
});
// --> "property 'num' does not pass predicate function"

let alsoValidate = {
    buf: new Buffer(2)
}
passMuster(alsoValidate, {
    buf: _.isBuffer // <-- using lodash
});
// --> no error
```

Predicate functions are executed in the context of the type object, so you can reference the expected type of other properties:

```js
let objToValidate = {
    otherProp: 'foobar',
    num: 11
}
passMuster(objToValidate, {
    otherProp: 'string',
    num: p => (typeof p !== this.otherProp)
});
// --> no error
```

If you need to reference the other values passed in, the object being validated is passed as a second argument to predicate functions:

```js
let objToValidate = {
    otherProp: 'foobar',
    num: 11
}
passMuster(objToValidate, {
    otherProp: 'string',
    num: (p, objIn) => is.not.sameType(p, objIn.otherProp) // <-- using @pwn/is, linked below
});
// --> no error
```

Nested objects also work:

```js
 myFunction(opts) {
    passMuster(opts, {
        id: 'number',
        address: {
            street: 'string',
            city: 'string',
            state: 'string',
            zip: 'number'
        }
    });
    // do something with opts object
}

myFunction({
    id: 007,
    address: {
        street: '123 anywhere st',
        city: 'Los Angeles',
        state: 'CA'
    }
})
// --> "missing property 'zip'"
```

To mark a property as optional, put it in the special `_optional` block:

```js
myFunction(opts) {
    passMuster(opts, {
        id: 'number',
        _optional: {
            username: 'string'
        }
    })
    // do something with opts object
}

myFunction({
    id: 007
})
// --> no error

myFunction({
    id: 007,
    username: 12345
})
// --> "property 'username' has wrong type"
```

To see the function from which you called `passMuster`, just look at the stack trace on the error that gets thrown.

## See also

* [joi](https://github.com/hapijs/joi)
* [obey](https://github.com/TechnologyAdvice/obey)
* [is.js](https://github.com/pwnn/is.js) (see `is.conforms`)
* [rfx](https://github.com/ericelliott/rfx)
* [validator.js](https://github.com/chriso/validator.js)
* [io-ts](https://github.com/gcanti/io-ts)
* [superstruct](https://github.com/ianstormtaylor/superstruct)
* [yup](https://github.com/jquense/yup)

## License

MIT

