import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes,Router,ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { ILogin } from '../interface/login';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public toastr: ToastrService,private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, public authService: AuthService) { }
  model: ILogin = { userName: "admin", password: "admin123" };
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
   // stop here if form is invalid
   if (this.loginForm.invalid) {
    return;
}
else{
  if(this.loginForm.controls.username.value == this.model.userName && this.loginForm.controls.password.value == this.model.password){
    this.toastr.success('login successfully', 'Success!');
    
    //this.authService.authLogin(this.model);
    localStorage.setItem('isLoggedIn', "true");
    localStorage.setItem('token', this.loginForm.controls.username.value);
    this.router.navigate(['/user-list']);
  }
  else{
    this.toastr.error('login failed', 'Error!');
    
  }
} 
    this.loading = true;

}
get formData() { return this.loginForm.controls; }
}
