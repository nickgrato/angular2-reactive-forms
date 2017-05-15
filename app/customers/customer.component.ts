import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,  Validators, AbstractControl, ValidatorFn } from '@angular/forms';

// DEBOUNCE 
import 'rxjs/add/operator/debounceTime';

import { Customer } from './customer';





////////////////////////
// CUSTOME VALIDATION //
////////////////////////

// Note: this is an example on how to compare two fields with in a sub form group.
function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
    /* when passing in a formGroupto a validation function as apposed to just a control we have access
    to all the controlls with in that formGroup so we don't neeed params in this case to conpair them. 
    The main diference is in this validation we are working with the form group, and in validaions below such as ratingRange
    we are working with the form control */
    
    let emailControl = c.get('email');
    let confirmControl = c.get('confirmEmail');

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
    emailMessage: any[];
    hasFieldError: boolean;

    private emailValidationMessages = {
        // these validation messages could easily be populated with a backend server. 
        required: 'please enter your email address',
        pattern: 'please enter a valid email address',
        minlength: 'I need more letters please'
    }

    constructor(private fb: FormBuilder){}

    ngOnInit(){
        

        ///////////////////////////////////////////////
        // Creating the Form Group and Form Controls //
        ///////////////////////////////////////////////
        
        this.customerForm = this.fb.group({
            firstName: ['Brain',[Validators.required, Validators.minLength(2)]],
            // Each value property can take an array, the array takes two objects (1.)Is an object that has initial value and is if it disabled or not
            // (2.) This is an onject of custome or build in validation guards.
            // lastName: [{value:'n/a', disabled: true }],
            lastName: ['',[Validators.required, Validators.minLength(2)]],
            emailGroup: this.fb.group({
                email: ['',[Validators.required, Validators.minLength(2), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmEmail: ['', Validators.required],
            },{ validator:emailMatcher}),
            sendCatalog:[{value:true}],
            phone: '',
            notification: 'email',
            rating: ['', ratingRange(1,8)],
            // Note: look there is a slight syntax difference when applying a group validation and control validation - in the group you need to say { validator:nameOfValidator}
            // and in the control you just put the name of the validator. No object. 
            addresses: this.fb.group({
                addressType: 'home',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: ''
            })
            
        });
 


        

        ///////////////////////////////////
        // Watching 'Notification' Value //
        ///////////////////////////////////
        this.customerForm.get('notification').valueChanges
            .subscribe( value => this.setNotification(value));




        ////////////////////////////
        // Watching 'email' Value //
        ////////////////////////////

        const emailControl = this.customerForm.get('emailGroup.email');
        // This watcher uses the debounce methode to apply a wait time for any events to fire. 
        emailControl.valueChanges.debounceTime(2000)
                    .subscribe( value =>  this.emailMessage = this.setMessage(emailControl, this.emailValidationMessages));
            /* Here we are subscribing to the email input changes. Then we have a specific var that holds all the
               error messages. We equal that to the return value of "setMessage", we pass the email input field "control"
               it self to the method so we wan see what error it has in it's error object. we then swap that out with the
               the corliating messages that we passed in as a second param "emailValidationMessages". So on each input field we watch
               we need to pass setMesages the control itself and the validation messages that go with it. This keeps
               setMessage agnostic to what field it calling it. 
            */
           



    }// end on init
                                                                                                                                                                  
    


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
    setNotification(notifyVia: string):void{
        //accesing the phone input control
        const phoneControl = this.customerForm.get('phone');
        if(notifyVia === 'text'){
            phoneControl.setValidators(Validators.required);
        }else{
            phoneControl.clearAsyncValidators();// this one is to clear custome validators. 
            phoneControl.clearValidators();// this one is being used.
        }
        
        phoneControl.updateValueAndValidity();
    }
    




    ///////////////////
    // Populate Form //
    ///////////////////

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




    /////////////////
    // Submit Form //
    /////////////////

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }





    ///////////////////////
    // SET ERROR MESSAGE //
    ///////////////////////

    setMessage(c: AbstractControl, messages: any): any[] {
        //clear left over messages. If is has one
        this.hasFieldError = false;
        console.log(c);
    
        //put loguc here for input status, if it is touched or has changes and has erros then ....
        if ((c.touched || c.dirty) && c.errors) {
             this.hasFieldError = true;
           
            //to return an array of the error validation collection keys
            // Object.keys(c.errors) returns the key so in this case "pattern" or "require"

                return Object.keys(c.errors)
                //['require']
                .map(key => 
                // select the 'require' message from the validationMessages

                //Note: the map section is only here to handle mutiple error at once.
                // it is going to take each key in the and return a string in its place. 
                
                messages[key] )
                // ['please enter your email address']
        }
    }





 }// END CONTROLER


