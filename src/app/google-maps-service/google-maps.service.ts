import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleMapsService {

  private google = (<any>window).google;
  private googleMap;
  private googlePlacesService;
  constructor() { }

  getLocation(): Observable<any> {
    return Observable.create(observer => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          observer.next(pos);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      } else {
        observer.error('Browser doesnt support Geolocation');
      }
    });

  }

  createMap(mapElement, position) {
    this.googleMap = new this.google.maps.Map(mapElement, {
      center: position,
      zoom: 14,
      mapTypeId: this.google.maps.MapTypeId.HYBRID,
      disableDefaultUI: true
    });

    const trafficLayer = new this.google.maps.TrafficLayer();
    trafficLayer.setMap(this.googleMap);
    const transitLayer = new this.google.maps.TransitLayer();
    transitLayer.setMap(this.googleMap);
    this.googlePlacesService = new this.google.maps.places.PlacesService(this.googleMap);

    const marker = new this.google.maps.Marker({
      map: this.googleMap,
      animation: this.google.maps.Animation.DROP,
      position: position,
      icon: {
        path: this.google.maps.SymbolPath.CIRCLE,
        scale: 8
      }
    });
    marker.addListener('click', () => {
      marker.setAnimation(this.google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 2000);
    });
  }

  getLocationDetails(position): Observable<any> {

    const latlng = new this.google.maps.LatLng(position.lat, position.lng);
    const request = {
      location: latlng,
      radius: '50',
      types: ['locality', 'neighborhood', 'political', 'street_number', 'administrative_area_level_2', 'administrative_area_level_3']
    };

    return Observable.create(observer => {
      this.googlePlacesService.textSearch(request, (results, status) => {
        let placePhoto;
        if (status === 'OK') {
          results.forEach(place => {
            if (place.photos && !placePhoto && (place.types.includes('administrative_area_level_2') ||
              place.types.includes('administrative_area_level_3'))) {
              placePhoto = place.photos[0];
              observer.next({
                placeImageUrl: place.photos[0].getUrl({ 'maxHeight': 150 }),
                placeAddress: place.formatted_address
              });
            }
          });
          if (!placePhoto) {
            results.forEach(place => {
              if (place.photos && !placePhoto && place.types.includes('administrative_area_level_1')) {
                placePhoto = place.photos[0];
                observer.next({
                  placeImageUrl: place.photos[0].getUrl({ 'maxHeight': 150 }),
                  placeAddress: place.formatted_address
                });
              }
            });
          }
          observer.complete();
        }
      });
    });
  }

  getRestaurantsList(position): Observable<any> {
    return Observable.create(observer => {
      this.googlePlacesService.nearbySearch({
        location: position,
        radius: 1000,
        type: ['restaurant'], // Restricts the results to places matching restaurant
      }, (restaurants, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          observer.next(restaurants);
          observer.complete();
        } else {
          observer.error('Sorry. There are no Restaurants in your position.');
        }
      });
    });
  }

  getRestaurantDetails(place): Observable<any> {
    const request = {
      placeId: place.place_id
    };
    return Observable.create(observer => {
      this.googlePlacesService.getDetails(request, (placeDetails, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          const placeName = placeDetails.name.substring(0, 30);
          observer.next({
            location: placeDetails.geometry.location,
            name: placeName,
            open: placeDetails.opening_hours ? placeDetails.opening_hours.open_now : null,
            photo: placeDetails.photos ? placeDetails.photos[0].getUrl({ 'maxHeight': 150 }) : null,
            rating: placeDetails.rating,
            url: placeDetails.website ? placeDetails.website : placeDetails.url,
            address: placeDetails.vicinity,
            phone: placeDetails.international_phone_number
          });
          this.createMarker(placeDetails.geometry.location, placeName);
          observer.complete();
        }
      });
    });
  }

  createMarker(location, placeName) {
    const marker = new this.google.maps.Marker({
      map: this.googleMap,
      position: location,
      animation: this.google.maps.Animation.DROP
    });
    const infoWindow = new this.google.maps.InfoWindow({
      content: '<span style="color:black">' + placeName + '</span>'
    });

    this.google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.googleMap, marker);
    });
  }

  getDirections(elememt, origin, destination) {
    const directionsService = new this.google.maps.DirectionsService;
    const directionsDisplay = new this.google.maps.DirectionsRenderer;
    const center = {
      lat: (origin.lat + destination.lat()) / 2,
      lng: (origin.lng + destination.lng()) / 2
    };
    const map = new this.google.maps.Map(elememt, {
      center: center,
      disableDefaultUI: true,
      zoom: 14
    });
    const trafficLayer = new this.google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    directionsDisplay.setMap(map);
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


}
