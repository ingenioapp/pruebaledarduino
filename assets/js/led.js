/**
 * Created by oscar on 5/04/15.
 */
var app = angular.module( "LedModule", ['ngRoute'] );
app.controller( "LedController", function($scope, $http) {
  
  $scope.encender = function(){
    //console.log("encender");
    $http.post("/Led/swLed/", {operacion:"on"}).then(function(result){
      console.log("Result: ", result);
      $scope.estatus = "ENCENDIDO";
    });
  }
  
  $scope.apagar = function(){
    //console.log("apagar");
    $http.post("/Led/swLed/", {operacion:"off"}).then(function(result){
      console.log("Result: ", result);
      $scope.estatus = "APAGADO";
    });
  }
  
  $scope.iniciar = function(){
    $scope.textoFinal = "";
    $scope.grabando = true;
    if ($scope.recognizing) {
      $scope.recognition.stop();
      return;
    }
    final_transcript = '';
    $scope.recognition.lang = "es-MX";
    $scope.recognition.start();
    ignore_onend = false;
  }
  
  $scope.init = function(){
    $scope.recognizing = false;
    $scope.grabando = false;
    if (!('webkitSpeechRecognition' in window)) {
      //console.log("no se ha iniciado el reconocimiento de voz");
    } else {
      //console.log("ya se ha iniciado el reconocimiento de voz");
      $scope.recognition = new webkitSpeechRecognition();
      $scope.recognition.continuous = true;
      $scope.recognition.interimResults = true;
      $scope.recognition.onstart = function() {
        $scope.recognizing = true;
        console.log("on start recognition ... ");
      };
      $scope.recognition.onerror = function(event) {
        console.error("on error recognition: ");
        if (event.error == 'no-speech') {
          console.error("no speech!!");
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          console.error("audio capture !!");
          ignore_onend = true;
        }
        
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            console.log("not allowed");
          } else {
            console.log("denied");
          }
          ignore_onend = true;
        }
      };
    
      $scope.recognition.onend = function() {
        $scope.grabando = false;
        $scope.recognizing = false;
        $scope.$apply();
        console.log($scope.textoFinal);
        if( $scope.textoFinal.indexOf("prende") != -1 || $scope.textoFinal.indexOf("encender") != -1
          || $scope.textoFinal.indexOf("enciende") != -1 ){
           $scope.encender();
        }else if( $scope.textoFinal.indexOf("apaga") != -1 ){
           $scope.apagar();
        } 
        
        if (ignore_onend) {
          return;
        }
        if (!final_transcript) {
          //console.log("not final transcript");
          return;
        }
        
      };
    
      $scope.recognition.onresult = function(event) {
        //console.log("on result ...");
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        //console.log("Final transcript:: ", final_transcript);
        //console.log("Interim transcript:: ", interim_transcript);
        $scope.textoFinal = final_transcript;
        if( final_transcript.indexOf("por favor") != -1 ){
          $scope.recognition.stop();
          $scope.grabando = false;
          $scope.$apply();
          return;
        }
      };
    }
  }
  
  $scope.init();
  
});