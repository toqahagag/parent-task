import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes,Router,ActivatedRoute } from '@angular/router'
import {NgbModal, ModalDismissReasons,NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { RestService } from '../service/rest.service';
import { User } from '../model/user';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users:any = [];
  user:any;
  userObj={"name":"",
  "job":"",
  "avatar":""}
  closeResult: string;
  DeletedUser: string;
  isCollapsed = true;
  EditedUser:any;
  EditedUserImg;
  EditID;
  constructor(public toastr: ToastrService,public rest:RestService, private router: Router, private route: ActivatedRoute,private modalService: NgbModal,private formBuilder: FormBuilder) {
   }
   
  addEditForm: FormGroup;
  submitted = false;
  UserButton:string;
  ngOnInit() {
    this.getUsers();
  }
  createFormGroup() {
      this.addEditForm=new FormGroup({
        Name: new FormControl('', [Validators.required]),
        jobTitle: new FormControl('', [Validators.required])
       })
  }
  open(content,user?) {
    if(user){
      this.UserButton="Save";
      this.getUser(user.id);
      
    }
    else{
      debugger
      this.UserButton="Add";
      if(this.user){
      this.userObj.avatar="";
      this.userObj.name="";
      this.userObj.job="";
      }
     // this.getUser(0);
    }
   this.createFormGroup();
   this.addEditForm.clearValidators();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true ,size:"sm",backdrop : 'static',
    keyboard : false}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openDeleteUser(content,user) {
    if(user){
      this.DeletedUser=user;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true ,size:"sm",backdrop : 'static',
    keyboard : false}).result.then((result) => {
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
            this.update(this.user);
            this.EditedUser=this.user.name          
            this.addEditForm.reset();
            this.addEditForm.clearValidators();
            this.getUsers();
          }
          else{
            this.add(this.userObj);
            this.addEditForm.reset();
            this.addEditForm.clearValidators();
            
            this.getUsers();
          }
    
    
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
        /*  this.addEditForm.controls.Name=this.user.name;
          this.addEditForm.controls.avatar=this.user.avatar;
          this.addEditForm.controls.jobTitle=this.user.job;
    */
          this.userObj.name=this.user.name;
          this.userObj.avatar=this.user.avatar;
          this.userObj.job=this.user.job;
    
          this.userObj=data;
        });
        
      }
      add(user) {
        ;
      // this.rest.addUser(user);
     
       this.rest.addUser(user).subscribe((result) => {
        //this.router.navigate(['/product-details/'+result._id]);
        this.toastr.success('user added successfully', 'Success!');
        
        this.getUsers();
      }, (err) => {
        this.toastr.error('saving failed', 'Error!');
      });  this.modalService.dismissAll();
     

      }
      update(user) {
        debugger;
        this.rest.updateUser(this.user.id, this.user).subscribe((result) => {
          this.toastr.success('user data updated successfully', 'Success!');
         this.modalService.dismissAll();
         this.getUsers();
        }, (err) => {
          this.toastr.error('updating failed', 'Error!');
        });
      }
      delete(id) {
        this.rest.deleteUser(id)
          .subscribe(res => {
          this.toastr.success('user deleted successfully', 'Success!');
          this.isCollapsed=true
            this.modalService.dismissAll();
            this.getUsers();
            }, (err) => {
          this.toastr.error('deleting failed', 'Error!');
            }
          );
      }
      ShowUserDetails(e,user){
        debugger
        var exist
      var ClassExist=document.getElementsByClassName("user-list-single-row");
      for (var i = 0; i < ClassExist.length; i++){
      var IsClassExist=  ClassExist[i].classList.contains("active-item");
      if(IsClassExist){
        exist=true;
        break;
      }
      }
      
     if(!exist){
      this.isCollapsed = !this.isCollapsed;
     }
      this.getUser(user.id);
       
        var elems = document.querySelectorAll(".user-list-single-row");
        for (var i = 0; i < elems.length; i++) {
          elems[i].classList.remove('active-item');
        }

        document.getElementById("item_"+user.id).classList.add("active-item");
         this.EditedUserImg=user.avatar;
         this.EditedUser=user.name;
        this.EditID=user.id;
        
      }
      gotoHome(){
        this.router.navigate(['/home']);
      }
      closeDetails(){
        this.isCollapsed=true;
        debugger;
        var elems = document.querySelectorAll(".user-list-single-row");
        for (var i = 0; i < elems.length; i++) {
          elems[i].classList.remove('active-item');
        }
      }
}
