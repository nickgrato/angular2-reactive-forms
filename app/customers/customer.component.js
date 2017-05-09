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
var customer_1 = require('./customer');
var CustomerComponent = (function () {
    function CustomerComponent(fb) {
        this.fb = fb;
        this.customer = new customer_1.Customer();
    }
    CustomerComponent.prototype.ngOnInit = function () {
        this.customerForm = this.fb.group({
            firstName: ['Brain', [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
            // Each value property can take an array, the array takes two objects (1.)Is an object that has initial value and is if it disabled or not
            // (2.) This is an onject of custome or build in validation guards.
            // lastName: [{value:'n/a', disabled: true }],
            lastName: ['Holiday', [forms_1.Validators.required, forms_1.Validators.maxLength(50)]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            sendCatalog: [{ value: true }],
            phone: [''],
            notification: 'email',
        });
    };
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
            phoneControl.clearAsyncValidators();
        }
        phoneControl.updateValueAndValidity();
    };
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
    CustomerComponent.prototype.save = function () {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
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
exports.CustomerComponent = CustomerComponent;
//# sourceMappingURL=customer.component.js.map