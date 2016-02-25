# pass-muster

Objects work well as a single argument to a function. That way you don't have to remember the order of parameters, and your code gets a nice self-documenting look. `passMuster` lets you be a little more sure of those objects that you pass as an argument to functions by validating that the properties you need are there and of the right types. Think of it as a lightweight implementation of interfaces.

## Usage

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

If `myFunction` is called without a required property, `passMuster` will throw an error:

    myFunction({
        id: 007
    })
    // --> "missing property 'username'"

It will also throw an error if the property is not the right type:

    myFunction({
        id: 007
        username: 12345
    })
    // --> "property 'username' has wrong type"


Nested objects also work:

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


The last trick up this little function's sleeve is an `_optional` block:

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

To see the function from which you called `passMuster`, just look at the stack trace on the error that gets thrown.

## License

MIT