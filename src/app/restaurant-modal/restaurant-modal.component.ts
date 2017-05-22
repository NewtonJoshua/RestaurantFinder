import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsService } from './../google-maps-service/google-maps.service';

@Component({
  selector: 'app-restaurant-modal',
  templateUrl: './restaurant-modal.component.html',
  styleUrls: ['./restaurant-modal.component.css'],
  providers: [GoogleMapsService]
})
export class RestaurantModalComponent implements OnInit {
  @Input() restaurant;
  @Input() currentPosition;

  private twttr = (<any>window).twttr;
  private review = '';

  constructor(public activeModal: NgbActiveModal, private googleMapsService: GoogleMapsService) { }

  ngOnInit() {
    this.googleMapsService.getDirections(document.getElementById('directionMap'), this.currentPosition, this.restaurant.location);
    this.createTweetButton();
  }

  createTweetButton() {
    document.getElementById('tweet').innerHTML = '';
    const hashTag = this.restaurant.name.replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, '_');
    this.twttr.widgets.createHashtagButton(hashTag, document.getElementById('tweet'), { text: this.review, size: 'large' });
  }

  enableTweetButton() {
    document.getElementById('tweet').classList.remove('disabledbutton');
  }

}
