import { Component, EventEmitter, Inject, Input, Output, inject} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  registerForm! :FormGroup;
  maxDate!: Date
  validationErrors: string[] = []


  constructor(private accountService:AccountService,private toastr:ToastrService,private formBuilder: FormBuilder,private router:Router){  
  }

  ngOnInit():void {
    this.innitializeForm();
    this.maxDate = new Date()
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
  } 
  
  innitializeForm() {
    this.registerForm = this.formBuilder.group({
      gender: ['male', [Validators.required]],
      username: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required]]  
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: false });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  register(): void {
    this.accountService.register(this.registerForm.value).subscribe(response =>{
      this.router.navigateByUrl('/members')
      this.cancel();
    },error => {
      this.validationErrors = error
    })
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
