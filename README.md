Numeric Keyboard
====================

## How to include it in your project
Add an entry in your project's bower.json file to:
```
"numeric-keyboard": "github@github.com/rc23/numeric-keyboard.git#0.0.1"
```
**refer to the latest tag available**

Assuming you have already cloned this repository to your machine, browse to the `numeric-keyboard` folder in the terminal and setup all necessary dependencies (for this project only) with the following command:

    npm install

This could take a while, so grab yourself a cup of coffee and please be patient.

## Running sandbox

After you setup all necessary dependencies use the following command in the console:

    grunt sandbox
    
This will allow you to see the keyboard in a sandbox environment.
    
## Running unit tests

After you setup all necessary dependencies use the following command in the console:

    grunt test
    
This will run the tests and generate a coverage report in the `target` folder.

## Directive usage

### Keyboard
To include the keyboard you simply need to use the directive below.
```html
<numeric-keyboard comma-separator="false" confirm-label="'OK'" ></numeric-keyboard>
```

Note: you can pass the comma-separator and the confirm-label as optional parameters if needed. By default, the decimal separator is '.' (dot) and the confirm-label is 'OK'.

### Inputs
In order for an input to be connected to the keyboard you need to bind it to an ng-model and use the directive `numeric-input`.
```html
<input type="text" ng-model="dummyCtrl.values.a" numeric-input="true" />
```

to disable the "numeric-input" behaviour:

```html
<input type="text" ng-model="dummyCtrl.values.a" numeric-input="false" />
```


Note: the input will inherit the class `numeric-input` with all the necessary css.


## Screenshot
![Alt text](/config/keyboard.png "Keyboard")


