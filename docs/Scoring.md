# Scoring

## <a name="methods-overview"></a> Methods Overview

| method                    | signature                         | short description                               |
| :------------------------ | :-------------------------------- | :---------------------------------------------- |
| [init](#methods.init)     | init( [options] )                 | Initializes the scoring subsystem.              |
| [addBank](#methods.addBank) | addBank( overlay, callback ) | Adds a bank account to the current user. |
| [getBankAccount](#methods.getBankAccount) | getBankAccount( callback ) | List bank accounts for the current user. |
| [getScore](#methods.getScore) | getScore( callback ) | Gets score for current user. |


## <a name="events-overview"></a> Events Overview

| event                                | short description                                      |
| :----------------------------------- | :----------------------------------------------------- |

## <a name="methods"></a> Methods

### <a name="methods.init"></a> init( options )

NOTE: This method is usually handled by the top-level API and can safely be ignored unless you are specifically
handling this system yourself.

Initializes the users subsystem. Takes an optional options structure, eg:

```javascript
float.scoring.init();
```

or

```javascript
float.scoring.init( {
    host: 'scoring-dev.hellofloat.com'
} );
```

Supported options:

| option                   | description                                |
| :----------------------- | :----------------------------------------- |
| host                     | Sets the API host for the users subsystem. |


### <a name="methods.addBank"></a> addBank( overlay, callback )

Adds bank account for the current user in session. 

```javascript
float.scoring.addBank( {
    "username": "plaid_test",
    "password": "plaid_good",
    "type": "citi"
}, function( error, account ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Got account: ' );
    console.log( account );
} );
```

Overlay info:

| option                   | description                                |
| :----------------------- | :----------------------------------------- |
| username                 | Username for the bank login. |
| password                 | Password for the bank login. |
| type                     | Name of the bank account. |

available banks: 
- amex
- bofa
- capone360
- schwab
- chase
- citi
- fidelity
- nfcu
- pnc
- suntrust
- td
- us
- usaa
- wells


### <a name="methods.getBankAccount"></a> getBankAccount( callback )

List bank accounts for the current user.


```javascript
float.scoring.getBankAccount( function( error, accounts ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Got accounts: ' );
    console.log( accounts );
} );
```



### <a name="methods.getScore"></a> getScore( callback )

Gets score for current user.


```javascript
float.scoring.getScore( function( error, score ) {
    if ( error ) {
        console.error( error );
        return;
    }

    console.log( 'Got score: ' );
    console.log( score );
} )
```