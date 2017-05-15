"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
// DEBOUNCE 
require('rxjs/add/operator/debounceTime');
var customer_1 = require('./customer');
////////////////////////
// CUSTOME VALIDATION //
////////////////////////
// Note: this is an example on how to compare two fields with in a sub form group.
function emailMatcher(c) {
    /* when passing in a formGroupto a validation function as apposed to just a control we have access
    to all the controlls with in that formGroup so we don't neeed params in this case to conpair them.
    The main diference is in this validation we are working with the form group, and in validaions below such as ratingRange
    we are working with the form control */
    var emailControl = c.get('email');
    var confirmControl = c.get('confirmEmail');
    if (emailControl.pristine || confirmControl.pristine) {
        return null;
    }
    if (emailControl.value === confirmControl.value) {
        return null;
    }
    // This error object is added to the form group not the controls. 
    // To solidify this look at the location of the custome validation, it is applied to the entire group below. 
    return { 'match': true };
}
// CONFIGURABLE VALIDATION (Validation function takes parameters.)
/* Note: Custome validation only takes one parameter so we returned an validator function wrapped in a function that takes more parameters
   giving us the ability to configure the valdation. */
function ratingRange(min, max) {
    // The parameter passed to the returned functon is the form control. So in this function we have acces to the entire object.
    return function (c) {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        }
        ;
        return null;
    };
}
// SINGLE EXAMPLE (Validation function doesn't take params)
// function ratingRange(c: AbstractControl):{[key: string] :boolean} | null {
//     if(c.value != undefined && (isNaN(c.value) || c.value < 1 || c.value > 5)){
//         //return true if the validation fails.
//         //We can access this "range" specifically like so - customerForm.get('rating').errors.range
//         return{ 'range': true }
//     };
//     //return null if validation passes
//     return null
// } 
var CustomerComponent = (function () {
    function CustomerComponent(fb) {
        this.fb = fb;
        this.customer = new customer_1.Customer();
        this.emailValidationMessages = {
            // these validation messages could easily be populated with a backend server. 
            required: 'please enter your email address',
            pattern: 'please enter a valid email address',
            minlength: 'I need more letters please'
        };
    }
    Object.defineProperty(CustomerComponent.prototype, "addresses", {
        get: function () {
            // Must cast this returned array because it will be an AbstractControl instead
            // Type 'AbstractControl' is not assignable to type 'FormArray'.
            // Property 'controls' is missing in type 'AbstractControl'.
            return this.customerForm.get('addresses');
        },
        enumerable: true,
        configurable: true
    });
    CustomerComponent.prototype.ngOnInit = function () {
        ///////////////////////////////////////////////
        // Creating the Form Group and Form Controls //
        ///////////////////////////////////////////////
        var _this = this;
        this.customerForm = this.fb.group({
            firstName: ['Brain', [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
            // Each value property can take an array, the array takes two objects (1.)Is an object that has initial value and is if it disabled or not
            // (2.) This is an onject of custome or build in validation guards.
            // lastName: [{value:'n/a', disabled: true }],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
            emailGroup: this.fb.group({
                email: ['', [forms_1.Validators.required, forms_1.Validators.minLength(2), forms_1.Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmEmail: ['', forms_1.Validators.required],
            }, { validator: emailMatcher }),
            sendCatalog: [{ value: true }],
            phone: '',
            notification: 'email',
            rating: ['', ratingRange(1, 8)],
            // Note: look there is a slight syntax difference when applying a group validation and control validation - in the group you need to say { validator:nameOfValidator}
            // and in the control you just put the name of the validator. No object. 
            addresses: this.fb.array([this.buildAddress()])
        });
        ///////////////////////////////////
        // Watching 'Notification' Value //
        ///////////////////////////////////
        this.customerForm.get('notification').valueChanges
            .subscribe(function (value) { return _this.setNotification(value); });
        ////////////////////////////
        // Watching 'email' Value //
        ////////////////////////////
        var emailControl = this.customerForm.get('emailGroup.email');
        // This watcher uses the debounce methode to apply a wait time for any events to fire. 
        emailControl.valueChanges.debounceTime(2000)
            .subscribe(function (value) { return _this.emailMessage = _this.setMessage(emailControl, _this.emailValidationMessages); });
        /* Here we are subscribing to the email input changes. Then we have a specific var that holds all the
           error messages. We equal that to the return value of "setMessage", we pass the email input field "control"
           it self to the method so we wan see what error it has in it's error object. we then swap that out with the
           the corliating messages that we passed in as a second param "emailValidationMessages". So on each input field we watch
           we need to pass setMesages the control itself and the validation messages that go with it. This keeps
           setMessage agnostic to what field it calling it.
        */
    }; // end on init
    /////////////////////
    // ADD NEW ADDRESS //
    /////////////////////
    CustomerComponent.prototype.addAddress = function () {
        this.addresses.push(this.buildAddress());
    };
    CustomerComponent.prototype.buildAddress = function () {
        return this.fb.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    };
    ///////////////////////////////////////////////
    // Update Valdation Requirements for 'Phone' //
    ///////////////////////////////////////////////
    /*
       When accessing a "Control" (a control being any of the inputs we assign to a form group)
       We have the ability to change the validation requirements on the fly. Below we are seeing if the user
       has chosen to be notified by text or email. If the user chooses text then the phone control validation
       is updated to make form control 'Phone' required. If the user then chooses email, then 'Phone'
       is updated by clearing all the validators. "updateValueAndValidity" is a catch all to update the system - not
       too clear on that function, I think it may update the DOM, again not sure..
    */
    CustomerComponent.prototype.setNotification = function (notifyVia) {
        //accesing the phone input control
        var phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(forms_1.Validators.required);
        }
        else {
            phoneControl.clearAsyncValidators(); // this one is to clear custome validators. 
            phoneControl.clearValidators(); // this one is being used.
        }
        phoneControl.updateValueAndValidity();
    };
    ///////////////////
    // Populate Form //
    ///////////////////
    //this is a test button to show how you can populate the whole object model.
    CustomerComponent.prototype.populateTestData = function () {
        this.customerForm.setValue({
            firstName: 'Brain',
            lastName: 'Holiday',
            email: 'bhiliday@gmail.com',
            sendCatalog: false
        });
    };
    // this is an example to populate SOME of the data. If model object is complete use function above called "setValue()"
    CustomerComponent.prototype.populateSomeTestData = function () {
        this.customerForm.patchValue({
            firstName: 'Mary',
            lastName: 'Telsa',
            sendCatalog: true
        });
    };
    /////////////////
    // Submit Form //
    /////////////////
    CustomerComponent.prototype.save = function () {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    };
    ///////////////////////
    // SET ERROR MESSAGE //
    ///////////////////////
    CustomerComponent.prototype.setMessage = function (c, messages) {
        //clear left over messages. If is has one
        this.hasFieldError = false;
        console.log(c);
        //put loguc here for input status, if it is touched or has changes and has erros then ....
        if ((c.touched || c.dirty) && c.errors) {
            this.hasFieldError = true;
            //to return an array of the error validation collection keys
            // Object.keys(c.errors) returns the key so in this case "pattern" or "require"
            return Object.keys(c.errors)
                .map(function (key) {
                // select the 'require' message from the validationMessages
                //Note: the map section is only here to handle mutiple error at once.
                // it is going to take each key in the and return a string in its place. 
                return messages[key];
            });
        }
    };
    CustomerComponent = __decorate([
        core_1.Component({
            selector: 'my-signup',
            templateUrl: './app/customers/customer.component.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder])
    ], CustomerComponent);
    return CustomerComponent;
}());
exports.CustomerComponent = CustomerComponent; // END CONTROLER
//# sourceMappingURL=customer.component.js.map