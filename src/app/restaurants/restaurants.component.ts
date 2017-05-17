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
  constructor() { }

  ngOnInit() {
    this.google = (<any>window).google;
    this.geocoder = new this.google.maps.Geocoder();
    this.map = new this.google.maps.Map(document.getElementById('map'), {
      center: { lat: 11, lng: 10 },
      zoom: 14,
      mapTypeId: 'satellite'
    });
  }


  // Try HTML5 geolocation.


  locate() {
    let that = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        that.pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        that.map.setCenter(that.pos);
        this.getPlaceName(position);

        that.map = new that.google.maps.Map(document.getElementById('map'), {
          center: that.pos,
          zoom: 13,
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
      types: ['locality', 'neighborhood', 'street_number', 'administrative_area_level_2']
    };

    this.service = new this.google.maps.places.PlacesService(this.map);

    this.service.textSearch(request, (results, status) => {
      let placePhoto;
      if (status === 'OK') {
        results.every(place => {
          if (place.photos && !placePhoto) {
            placePhoto = place.photos[0];
            this.placeImageUrl = placePhoto.getUrl({ 'maxHeight': 150 });
            console.log(place.formatted_address);
          }
        });
      }
    });
  }

  createMarker(place) {
    if (place.photos) {
      const placeLoc = place.geometry.location;
      const marker = new this.google.maps.Marker({
        map: this.map,
        position: place.geometry.location
      });

      this.google.maps.event.addListener(marker, 'click', () => {
        const request = {
          placeId: place.place_id
        };
        this.service.getDetails(request, function (placeDetails, status) {
          if (status === this.google.maps.places.PlacesServiceStatus.OK) {
            console.log(placeDetails);
          }
        });
        const contentString = '<div>' +
          '<h1><img src=' + place.icon + ' height="25px">' + place.name + '</h1>' +
          '<img src=' + place.photos[0].getUrl({
            'maxWidth': 200,
            'maxHeight': 200
          }) + ' >' +
          '</div>';
        this.infowindow.setContent(contentString);
        this.infowindow.open(this.map, this);
      });
    }

  }
}
