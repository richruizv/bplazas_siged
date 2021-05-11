var app = angular.module('myApp', []);
app.controller('myCtrl',["$scope","$http",function($scope,$http) {


//get
  $http.get("https://siged.sep.gob.mx/services/CatalogosSiged/CatalogosRS/catalogos/cat_entidad_federativa")
  .then(function (data) {
      $scope.states = data.data.entFed;
  });

  $scope.getMunicipios = function(){
      $http.get("http://10.8.20.191:8080/CoreServices/apiRest/plaza/municipio/identidad="+$scope.user.state.id)
      .then(function (data) {
          $scope.municipalities = data.data;
          console.log($scope.municipalities)
      });
  }

  $scope.buscar = function(){
    var myLatLng,bounds;
    var  nombreMun = $scope.user.municipality.municipioDTO.nombre,idMun= $scope.user.municipality.municipioDTO.id;
    var nombreEst = $scope.user.state.des, idEst =  $scope.user.state.id;
    $('.buscador_titulo').hide('slow');
    $('#buscar_plaza').attr('type','button');
    $('#buscar_plaza').html('<i class="fa fa-spin fa-spinner"></i> Buscando');
    $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+nombreEst+" "+nombreMun+"&components=country:MX&key=AIzaSyDnkqJjLVH2s2pXhNisTMC0KKr_JBA-dPo")
    .then(function (data) {
      console.log(idMun)
      console.log(idEst)
        data.data.results.length > 1 ? alert('mas de un lugar en maps') : undefined
        myLatLng = new google.maps.LatLng(data.data.results[0].geometry.location);
        bounds = new google.maps.LatLngBounds(
           new google.maps.LatLng(data.data.results[0].geometry.bounds.southwest),
           new google.maps.LatLng(data.data.results[0].geometry.bounds.northeast)
        );
        google.maps.event.trigger(map, 'resize');
        map.setCenter(myLatLng);
        map.fitBounds(bounds);

    });

    $http.get("http://10.8.20.191:8080/CoreServices/apiRest/plaza/buscarDisponible/identidad="+idEst+"&idmunicipio="+idMun)
    .then(function (data) {
      $('#buscar_plaza').attr('type','submit');
      $('#buscar_plaza').html('Buscar');
      var locations = []
      console.log(data.data)
      data.data.forEach(function(item,index){
        locations.push({lat: parseFloat(item.ctDTO.ctDealleDTO.latitud), lng: parseFloat(item.ctDTO.ctDealleDTO.longitud)});
      })

      var labels = 'E';
      var markers = locations.map(function(location, i) {
        return new google.maps.Marker({
          position: location,
          label: labels[i % labels.length]
        });
      });


      // Add a marker clusterer to manage the markers.
      var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});



        google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
        // your code here
        console.log(this)
        if(this.getMap().getZoom() > 15)
          console.log('debe mostrar el modal')

      });
    });





  }
}]);
