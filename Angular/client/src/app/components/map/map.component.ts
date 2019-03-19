/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';

import { DataService} from '../../services/data.service';
import { ViewChild } from '@angular/core';
import {NgbDateStruct,NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';


declare var google: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  show=false;
  coord: any=[];
  dates:any=[];
  marker:any;
  poly:any;
  lat:any;
  lon:any;
  flightPlan:any=[];

  model1: NgbDateStruct;
  model2: NgbDateStruct;
  date1: {year: number, month: number, day: number};
  date2: {year: number, month: number, day: number};

  time1: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  time2: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
 

  private _setIntervalHandler:any;
  
  constructor(private dataservice: DataService) { 
   

    
  }

 
  initMap(){
    
    var mapProp = {
      center: new google.maps.LatLng(this.lat, this.lon),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.marker = new google.maps.Marker({
    position: {lat: Number(this.lat), lng: Number(this.lat)},
    map: this.map
    });

    this.poly = new google.maps.Polyline({
      path: this.flightPlan,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    this.poly.setMap(this.map);
  }

  data(){
    this._setIntervalHandler = setInterval(() => { 

      this.dataservice.getData().subscribe(
        res => {
          
          this.poly.setMap(null);
          this.flightPlan=[];
          this.coord=res;
          this.lat=parseFloat(this.coord.find(t=>t.id).latitud);
          this.lon=parseFloat(this.coord.find(t=>t.id).longitud);
          
          this.marker.setPosition({lat: Number(this.lat), lng: Number(this.lon)});
          
          if (this.map.getBounds().contains(this.marker.getPosition())==false){
            this.map.setCenter({lat: Number(this.lat), lng: Number(this.lon)});
          }
         
          //Polyline
          //var path = this.poly.getPath();
          var latLng={lat: Number(this.lat), lng: Number(this.lon)}
          this.flightPlan.push(latLng);
          console.log(this.flightPlan);
          this.poly = new google.maps.Polyline({
            path: this.flightPlan,
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3
          });
          this.poly.setMap(this.map);
                  
        },
        
        err => console.error(err)
        
      );
    
   }, 10000);
 }

  pad2(number) {
   
    return (number < 10 ? '0' : '') + number

  }
  between(){
    this.show=false;
    this.poly.setMap(null);
    this.flightPlan=[];
    

    this.dataservice.getDatas(this.model1.year.toString()+'-'+this.pad2(this.model1.month).toString()+'-'+this.pad2(this.model1.day).toString(),
    this.pad2(this.time1.hour).toString()+':'+this.pad2(this.time1.minute).toString()+':'+this.pad2(this.time1.second).toString(),
    this.model2.year.toString()+'-'+this.pad2(this.model2.month).toString()+'-'+this.pad2(this.model2.day).toString(),
    this.pad2(this.time2.hour).toString()+':'+this.pad2(this.time2.minute).toString()+':'+this.pad2(this.time2.second).toString()).subscribe(
      res => {
        this.dates=res;
       
        for (var list in this.dates) {
          var latLng={lat: Number(this.dates[list].latitud), lng: Number(this.dates[list].longitud)}
          this.flightPlan.push(latLng);
          
        }
        console.log(this.flightPlan);

        this.poly = new google.maps.Polyline({
          path: this.flightPlan,
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });
       
        this.poly.setMap(this.map);
        
                  
      },
      
      err => console.error(err)
      
    );
    
  }


  ngOnInit() {
    
    
    this.dataservice.getData().subscribe(
      res => {
        
        this.coord=res;
        this.lat=parseFloat(this.coord.find(t=>t.id).latitud);
        this.lon=parseFloat(this.coord.find(t=>t.id).longitud);
        
        this.map.setCenter({lat: Number(this.lat), lng: Number(this.lon)});
        this.marker.setPosition({lat: Number(this.lat), lng: Number(this.lon)});
    
                   
      },
      
      err => console.error(err)
      
    );
    this.initMap();
    this.data();
  
  }
}
