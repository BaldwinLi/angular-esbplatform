import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'esb-services-info',
  templateUrl: 'templates/servicesInfo.html'
})
export class servicesInfoComponent {

  @Input() private svcsData: Array<any>;

  constructor(
    private router: Router
  ) { }

  onSelectService(svc_no: string) {
    this.router.navigate(['/monitor/serviceslist', svc_no]);
  }
}
