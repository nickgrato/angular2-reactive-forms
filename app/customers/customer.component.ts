import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,  Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Customer } from './customer';





////////////////////////
// CUSTOME VALIDATION //
////////////////////////

// CONFIGURABLE VALIDATION (Validation function takes parameters.)
/* Note: Custome validation only takes one parameter so we returned an validator function wrapped in a function that takes more parameters 
   giving us the ability to configure the valdation. */
function ratingRange(min: number, max: number): ValidatorFn {

    // The parameter passed to the returned functon is the form control. So in this function we have acces to the entire object.
    return  (c: AbstractControl): {[key: string]: boolean} | null => {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        };
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








@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customerForm: FormGroup;
    customer: Customer = new Customer();

    constructor(private fb: FormBuilder){}

    ngOnInit(){
        
        this.customerForm = this.fb.group({
            firstName: ['Brain',[Validators.required, Validators.minLength(2)]],
            // Each value property can take an array, the array takes two objects (1.)Is an object that has initial value and is if it disabled or not
            // (2.) This is an onject of custome or build in validation guards.
            // lastName: [{value:'n/a', disabled: true }],
            lastName: ['',[Validators.required, Validators.minLength(2)]],
            email: ['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            sendCatalog:[{value:true}],
            phone: '',
            notification: 'email',
            rating: ['', ratingRange(1,8)]
        });

        
    }

    /* 
       When accessing a "Control" (a control being any of the inputs we assign to a form group)
       We have the ability to change the validation requirements on the fly. Below we are seeing if the user
       has chosen to be notified by text or email. If the user chooses text then the phone control validation
       is updated to make form control 'Phone' required. If the user then chooses email, then 'Phone'
       is updated by clearing all the validators. "updateValueAndValidity" is a catch all to update the system - not 
       too clear on that function, I think it may update the DOM, again not sure.. 
    */
    setNotification(notifyVia: string):void{
        //accesing the phone input control
        const phoneControl = this.customerForm.get('phone');
        if(notifyVia === 'text'){
            phoneControl.setValidators(Validators.required);
        }else{
            console.log("You clicked email");
            phoneControl.clearAsyncValidators();
            phoneControl.clearValidators();
        }
        
        phoneControl.updateValueAndValidity();
    }
    

    //this is a test button to show how you can populate the whole object model.
    populateTestData(): void{
        this.customerForm.setValue({
            firstName: 'Brain',
            lastName: 'Holiday',
            email: 'bhiliday@gmail.com',
            sendCatalog:false
        })
    }

    // this is an example to populate SOME of the data. If model object is complete use function above called "setValue()"
    populateSomeTestData(): void{
        this.customerForm.patchValue({
            firstName: 'Mary',
            lastName: 'Telsa',
            sendCatalog:true
        });
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
 }


