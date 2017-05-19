import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {

  private google;
  private geocoder;
  private map;
  private infowindow;
  private pos;
  private service;
  private placeImageUrl;
  private placeAddress;
  private restaurantList = [];
  constructor() { }

  ngOnInit() {
    this.google = (<any>window).google;
    this.geocoder = new this.google.maps.Geocoder();
    this.map = new this.google.maps.Map(document.getElementById('map'), {
      center: { lat: 11, lng: 10 },
      zoom: 14,
      mapTypeId: 'satellite'
    });
    this.locate();
  }


  // Try HTML5 geolocation.


  locate() {
    this.restaurantList = [];
    const that = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        that.pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        that.map.setCenter(that.pos);
        const marker = new this.google.maps.Marker({
          map: this.map,
          position: new this.google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        });
        this.createMarker(that.pos);
        this.getPlaceName(position);

        that.map = new that.google.maps.Map(document.getElementById('map'), {
          center: that.pos,
          zoom: 14,
          mapTypeId: 'satellite'
        });

        that.infowindow = new that.google.maps.InfoWindow();
        that.service = new that.google.maps.places.PlacesService(that.map);
        that.service.nearbySearch({
          location: that.pos,
          radius: 1000,
          type: ['restaurant'], // Restricts the results to places matching restaurant
          // openNow: true,
          // minPriceLevel: 0,
          // maxPriceLevel: 4
        }, (results, status) => {
          if (status === that.google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              that.createMarker(results[i]);
              this.getPlaceDetails(results[i]);
            }
          }
        });

      }, () => {
        // The Geolocation service failed.
      });
    } else {
      // Browser doesn't support Geolocation
    }
  }

  getPlaceName(position) {
    const latlng = new this.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    const request = {
      location: latlng,
      radius: '50',
      types: ['locality', 'neighborhood', 'political', 'street_number', 'administrative_area_level_2', 'administrative_area_level_3']
    };

    this.service = new this.google.maps.places.PlacesService(this.map);

    this.service.textSearch(request, (results, status) => {
      let placePhoto;
      if (status === 'OK') {
        results.forEach(place => {
          if (place.photos && !placePhoto && (place.types.includes('administrative_area_level_2') ||
            place.types.includes('administrative_area_level_3'))) {
            placePhoto = place.photos[0];
            this.placeImageUrl = placePhoto.getUrl({ 'maxHeight': 150 });
            this.placeAddress = place.formatted_address;
          }
        });
        if (!placePhoto) {
          results.forEach(place => {
            if (place.photos && !placePhoto && place.types.includes('administrative_area_level_1')) {
              placePhoto = place.photos[0];
              this.placeImageUrl = placePhoto.getUrl({ 'maxHeight': 150 });
              this.placeAddress = place.formatted_address;
            }
          });
        }
      }
    });
  }

  createMarker(place) {
    const that = this;
    if (place.photos) {
      const placeLoc = place.geometry.location;
      const marker = new this.google.maps.Marker({
        map: this.map,
        position: place.geometry.location
      });

      this.google.maps.event.addListener(marker, 'click', () => {

      });
    }
  }

  getPlaceDetails(place) {
    const request = {
      placeId: place.place_id
    };
    return this.service.getDetails(request, (placeDetails, status) => {
      if (status === this.google.maps.places.PlacesServiceStatus.OK) {
        this.restaurantList.push({
          location: placeDetails.geometry.location,
          name: placeDetails.name.substring(0, 50),
          open: placeDetails.opening_hours ? placeDetails.opening_hours.open_now : null,
          photo: placeDetails.photos ? placeDetails.photos[0].getUrl({ 'maxHeight': 150 }) : null,
          rating: placeDetails.rating,
          url: placeDetails.website ? placeDetails.website : placeDetails.url,
          address: placeDetails.vicinity,
          phone: placeDetails.international_phone_number
        });
      }
    });
  }
}
