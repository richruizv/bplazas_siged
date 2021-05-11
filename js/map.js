var map

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 23.3905191, lng: -100.1085054}
  });
}
