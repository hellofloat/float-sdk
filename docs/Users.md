# Users

## <a name="methods-overview"></a> Methods Overview

| method                    | signature                         | short description                               |
| :------------------------ | :-------------------------------- | :---------------------------------------------- |
| [init](#methods.init)     | init( [options] )                 | Initializes the users subsystem.                |
| [login](#methods.login)   | login( data, callback )           | Logs in with the given data.                    |
| [logout](#methods.logout) | logout( callback )                | Logs the current user out.                      |
| [get](#methods.get)       | get( [id, ] callback )            | Gets a user. Without id, gets the current user. |
| [create](#methods.create) | create( overlay, callback )       | Creates a user with the given overlay settings. |
| [update](#methods.update) | update( user, overlay, callback ) | Updates the given user with the given overlay.  |
| [del](#methods.del)       | del( user, callback )             | Deletes the given user.                         |

## <a name="events-overview"></a> Events Overview

| event                                | short description                                      |
| :----------------------------------- | :----------------------------------------------------- |
| [login](#events.logout)              | Emitted when a user logs in.                           |
| [logout](#events.logout)             | Emitted when a user logs out.                          |
| [updated](#events.updated)           | Emitted when a user is updated.                        |

## <a name="methods"></a> Methods

### <a name="methods.init"></a> init( options )

NOTE: This method is usually handled by the top-level API and can safely be ignored unless you are specifically
handling this system yourself.

Initializes the users subsystem. Takes an optional options structure, eg:

```javascript
float.users.init();
```

or

```javascript
float.users.init( {
    host: 'auth.float.systems'
} );
```

Supported options:

| option                   | description                                |
| :----------------------- | :----------------------------------------- |
| host                     | Sets the API host for the users subsystem. |

### <a name="methods.login"></a> login( data, callback )

Logs the user in given the data specified. (Usually an email or phone number and a password.)

```javascript
float.users.login( {
    email: 'foo@test.com',
    password: 'horrible_password'
}, function( error, user ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'User logged in: ' + user.id );
} );
```

### <a name="methods.logout"></a> login( callback )

Logs the current user out.

```javascript
float.users.logout( function( error ) {
    if ( error ) {
        console.error( error );
    }
} );
```

### <a name="methods.get"></a> get( [id, ] callback )

Gets the specified user.

```javascript
float.users.get( userId, function( error, user ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Got user: ' );
    console.log( user );
} );
```

Or, you can get the currently logged in user by not specifying an id:

```javascript
float.users.get( function( error, user ) {
    if ( error ) {
        console.error( error );
        return;
    }

    if ( !user ) {
        console.log( 'No current user!' );
        return;
    }

    console.log( 'Current user:' );
    console.log( user );
} );
```

### <a name="methods.create"></a> create( overlay, callback )

Creates a user, setting the fields specified in overlay.

```javascript
float.users.create( {
    email: 'bob@test.com',
    first_name: 'Bob',
    password: 'horrible_password'
}, function( error, user ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Created user:' );
    console.log( user );
} );
```

### <a name="methods.update"></a> update( user, overlay, callback )

Updates the specified user with the given overlay.

```javascript
float.users.update( user, {
    last_name: 'Test',
    zipcode: '12345'
}, function( error, updatedUser ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Updated user:' );
    console.log( updatedUser );
} );
```

### <a name="methods.del"></a> del( user, callback )

Deletes the specified user.

```javascript
float.users.del( user, function( error ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Deleted user.' );
} );
```


## <a name="events"></a> Events

### <a name="events.login"></a> login

Emitted when a user logs in (including after a signup).

Event structure:

```
{
    user: <user object>
}
```

### <a name="events.logout"></a> logout

Emitted when a user logs out.

Event structure:

```
{
    user: <user object>
}
```

### <a name="events.updated"></a> updated

Emitted when a user is updated.

Event structure:

```
{
    old: <previous user object>
    user: <updated user object>
}
```
