import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-restaurant-modal',
  templateUrl: './restaurant-modal.component.html',
  styleUrls: ['./restaurant-modal.component.css']
})
export class RestaurantModalComponent implements OnInit {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
