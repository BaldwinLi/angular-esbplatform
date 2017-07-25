import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'nav-bar',
  templateUrl: 'templates/navbar.html'
})
export class NavbarComponent {

  private ckanOpen: Boolean = false;
  private bkanOpen: Boolean = true;
  private activeAll: Boolean = false;
  private curSider: any = {minus: false, plus: true};
  private isSuperAdmin: boolean;

  constructor(private appSvc: AppRequestService){}

  toActiveCkanOpenSub(){
    this.ckanOpen = !this.ckanOpen;
  }

  toActiveBkanOpenSub(){
    this.bkanOpen = !this.bkanOpen;
  }

  toActiveAll(){
    this.activeAll = !this.activeAll;
    this.curSider.minus = this.activeAll;
    this.curSider.plus = !this.activeAll;
    this.ckanOpen = this.activeAll;
    this.bkanOpen = this.activeAll;
  }

  ngOnInit(){
    let obj = this;
    this.appSvc.afterInitCall(()=>{
      obj.isSuperAdmin = (window['currentUser'].is_admin == "3");
    });
  }
}
