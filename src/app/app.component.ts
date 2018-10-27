import { Component } from '@angular/core';
import { RouterModule, Routes,Router,ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }
  
      public isLoggedIn(): boolean{
        let status = false;
        if( localStorage.getItem('isLoggedIn') == "true"){
          status = true;
          //this.router.navigate(['/user-list']);
        }
        else{
          status = false;
          //this.router.navigate(['/login']);
        }
        return status;
    }
}
