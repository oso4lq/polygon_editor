import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

@Injectable({
  providedIn: 'root'
})

export class MapboxService {
  //@ts-ignore
  private map: mapboxgl.Map;

  constructor() { }

  initMap(container: string, accessToken: string) {
    this.map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [37.3108581, 55.6939984], // hello to Sk :)
      zoom: 10, // zoom index
      accessToken: accessToken // hardcoded access token
    });
  };

  startPolygonCreationMode() {
    let draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    this.map.addControl(draw);

    this.map.on('draw.create', (event) => {
      console.log('Polygon created:', event.features);
    });

    this.map.on('draw.delete', (event) => {
      console.log('Polygon deleted:', event.features);
    });
  };

}
