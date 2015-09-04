# Passwords

## <a name="methods-overview"></a> Methods Overview

| method                                | signature                         | short description                                   |
| :------------------------------------ | :-------------------------------- | :-------------------------------------------------- |
| [init](#methods.init)                 | init( [options] )                 | Initializes the passwords subsystem.                |
| [requestReset](#methods.requestReset) | requestReset( options, callback ) | Requests a reset for the user specified in options. |
| [reset](#methods.reset)               | reset( options, callback )        | Resets the user's password based on options.        |


## <a name="events-overview"></a> Events Overview

| event                                                    | short description                           |
| :------------------------------------------------------- | :------------------------------------------ |
| [password_reset_request](#events.password_reset_request) | Emitted when a password reset is requested. |
| [password_reset](#events.password_reset)                 | Emitted when a the password is reset.       |

## <a name="methods"></a> Methods

### <a name="methods.init"></a> init( options )

NOTE: This method is usually handled by the top-level API and can safely be ignored unless you are specifically
handling this system yourself.

Initializes the users subsystem. Takes an optional options structure, eg:

```javascript
float.passwords.init();
```

or

```javascript
float.passwords.init( {
    host: 'auth-dev.hellofloat.com'
} );
```

Supported options:

| option                   | description                                    |
| :----------------------- | :--------------------------------------------- |
| host                     | Sets the API host for the passwords subsystem. |

### <a name="methods.requestReset"></a> requestReset( options, callback )

Requests a password reset given the specified options.

```javascript
float.passwords.requestReset( {
    email: 'foo@test.com'
}, function( error ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Requested password reset.' );
} );
```

Supported options:

| option                   | description                                    |
| :----------------------- | :--------------------------------------------- |
| email                    | The user's email address.                      |
| phone                    | The user's phone number.                       |

NOTE: You should only specify one, either an email address or a phone number.

### <a name="methods.reset"></a> reset( options, callback )

Resets the user's password given a password reset token and new password.

```javascript
float.passwords.reset( {
    token: passwordResetToken,
    password: 'new_horrible_password'
}, function( error, response ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Successfully reset password for user:' );
    console.log( response.user );
} );
```

## <a name="events"></a> Events

### <a name="events.password_reset_request"></a> password_reset_request

Emitted when a password reset is requested.

Event structure:

```
{
    options: <options specified in request>
}
```

### <a name="events.password_reset"></a> password_reset

Emitted when the password is successfully reset.

Event structure:

```
{
    options: <options specified in reset>,
    response: <response from API>
}
```
