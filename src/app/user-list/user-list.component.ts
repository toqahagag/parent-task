import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes,Router,ActivatedRoute } from '@angular/router'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { RestService } from '../service/rest.service';
import { User } from '../model/user';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users:any = [];
  user:any;
  userObj:User={id:0,"name":"",
  "job":"",
  "avatar":""}
  closeResult: string;
  DeletedUser: string;
  constructor(public rest:RestService, private router: Router, private route: ActivatedRoute,private modalService: NgbModal,private formBuilder: FormBuilder) { }
  addEditForm: FormGroup;
  submitted = false;
  UserButton:string;
  ngOnInit() {
    this.getUsers();
  }
  createFormGroup() {
      this.addEditForm=new FormGroup({
        Name: new FormControl(this.userObj.name, [Validators.required]),
        jobTitle: new FormControl(this.userObj.job, [Validators.required])
       })
  }
  open(content,user?) {
    if(user){
      this.UserButton="Save";
      this.getUser(user.id);

    }
    else{
      debugger;
      this.UserButton="Add";
      if(this.userObj){
      this.userObj.avatar="";
      this.userObj.name="";
      this.userObj.job="";
      }
    }
   this.createFormGroup();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true ,size:"sm"}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openDeleteUser(content,user) {
    if(user){
      this.DeletedUser=user;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true ,size:"sm"}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.addEditForm.controls; }
  
      onSubmit() {
          this.submitted = true;
  
          // stop here if form is invalid
          if (this.addEditForm.invalid) {
              return;
          }
          if(this.user && this.user.id){
            this.update(this.userObj)
          }
          else{
            debugger
            this.add(this.userObj)
          }
    this.addEditForm.reset();
    
      }
      getUsers() {
        this.users = [];
        this.rest.getUsers().subscribe(data => {
          console.log(data);
          this.users = data;
        });
        
      }
      getUser(id) {
        this.rest.getUser(id).subscribe(data => {
          console.log(data);
          this.user = data;
          this.userObj=data;
        });
        
      }
      add(user) {
        debugger;
       this.rest.addUser(user);
       this.modalService.dismissAll();
       this.getUsers();
      }
      update(user) {
        this.rest.updateUser(this.user.id, this.user).subscribe((result) => {
         // this.router.navigate(['/product-details/'+result._id]);
         this.modalService.dismissAll();
         this.getUsers();
        }, (err) => {
          console.log(err);
        });
      }
      delete(id) {
        this.rest.deleteUser(id)
          .subscribe(res => {
            this.modalService.dismissAll();
            this.getUsers();
            }, (err) => {
              console.log(err);
            }
          );
      }
    
}
