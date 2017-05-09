import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,  Validators } from '@angular/forms';
import { Customer } from './customer';

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
            lastName: ['Holiday',[Validators.required, Validators.maxLength(50)]],
            email: ['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            sendCatalog:[{value:true}],
            phone: [''],
            notification: 'email',
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
            phoneControl.clearAsyncValidators();
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
        })
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }
 }


