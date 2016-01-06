# Cards

## <a name="methods-overview"></a> Methods Overview

| method                    | signature                         | short description                               |
| :------------------------ | :-------------------------------- | :---------------------------------------------- |
| [init](#methods.init)     | init( [options] )                 | Initializes the scoring subsystem.              |
| [createCard](#methods.addBank) | createCard( callback ) | Create a credit card for the current user. |
| [getCard](#methods.getScore) | getCard( callback ) | Gets credit cards for the current user. |

## <a name="events-overview"></a> Events Overview

| event                                | short description                                      |
| :----------------------------------- | :----------------------------------------------------- |

## <a name="methods"></a> Methods

### <a name="methods.init"></a> init( options )

NOTE: This method is usually handled by the top-level API and can safely be ignored unless you are specifically
handling this system yourself.

Initializes the users subsystem. Takes an optional options structure, eg:

```javascript
float.cards.init();
```

or

```javascript
float.cards.init( {
    host: 'cards-dev.hellofloat.com'
} );
```

Supported options:

| option                   | description                                |
| :----------------------- | :----------------------------------------- |
| host                     | Sets the API host for the cards subsystem. |


### <a name="methods.createCard"></a> createCard( callback )

Create a credit card for the current user.

```javascript
float.cards.createCard( function( error, card ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Got card: ' );
    console.log( card );
} );
```

### <a name="methods.getCard"></a> getCard( callback )

Gets credit card for the current user.


```javascript
float.cards.getCard( function( error, card ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Got card: ' );
    console.log( card );
} )
```