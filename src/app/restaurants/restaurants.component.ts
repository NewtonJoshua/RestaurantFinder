import { Component, OnInit } from '@angular/core';
import { RestaurantModalComponent } from './../restaurant-modal/restaurant-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsService } from './../google-maps-service/google-maps.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
  providers: [GoogleMapsService]
})
export class RestaurantsComponent implements OnInit {

  private placeImageUrl: Observable<string>;
  private placeAddress: Observable<string>;
  private restaurantList = [];
  private currentPosition;

  constructor(private modalService: NgbModal, private googleMapsService: GoogleMapsService) { }

  ngOnInit() {
    this.restaurantList = [];
    this.googleMapsService.getLocation().subscribe(position => {
      this.currentPosition = position;
      this.googleMapsService.createMap(document.getElementById('map'), position);
      this.googleMapsService.getLocationDetails(position).subscribe(locationDetails => {
        this.placeImageUrl = Observable.of(locationDetails.placeImageUrl);
        this.placeAddress = Observable.of(locationDetails.placeAddress);
      });
      this.googleMapsService.getRestaurantsList(position).subscribe(restaurants => {
        restaurants.forEach(restaurant => {
          this.googleMapsService.getRestaurantDetails(restaurant).subscribe(restaurantDetails => {
            this.restaurantList.push(restaurantDetails);
          });
        });
      });
    });
  }

  openModal(restaurant) {
    const modalRef = this.modalService.open(RestaurantModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.restaurant = restaurant;
    modalRef.componentInstance.currentPosition = this.currentPosition;
  }

}
