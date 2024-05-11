import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

@Injectable({
  providedIn: 'root'
})

export class MapboxService {
  //@ts-ignore
  private map: mapboxgl.Map;
  private draw: MapboxDraw;
  private polygons: any[] = []; // user-created polygons

  constructor() { }

  initMap(container: string, accessToken: string) {
    this.map = new mapboxgl.Map({
      // center: [37.3108581, 55.6939984], // hello to Sk :)
      center: [-87.61694, 41.86625],
      container: container,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 16, // zoom index
      pitch: 15, // axis x
      bearing: 15, // axis z
      antialias: true,
      accessToken: accessToken // hardcoded access token
    });

    // add polygons to the map
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
    });
    this.map.addControl(this.draw);
    // handle create polygon
    this.map.on('draw.create', (event) => {
      const newPolygon: any = event.features[0]; // Get the created polygon feature
      this.polygons.push(newPolygon); // Add the polygon to the polygons array
      console.log('Polygon created:', newPolygon);
      console.log('polygons: ' + this.polygons);
    });
    // handle delete polygon
    this.map.on('draw.delete', (event) => {
      console.log('Polygon deleted:', event.features);
    });
  };





  applyExtrudeHeight(polygonId: string, extrudeHeight: number) {
    // Find the polygon with the specified ID in the polygons array
    const polygonIndex = this.polygons.findIndex(polygon => polygon.id === polygonId);

    // Check if the polygon with the specified ID was found
    if (polygonIndex !== -1) {
      // Update the height property of the specified polygon
      this.polygons[polygonIndex].properties.height = extrudeHeight;

      console.log(this.polygons);
      console.log(this.polygons[polygonIndex]);
      // Update the map to reflect the changes
      // this.updateMap();
    } else {
      console.error('Polygon with ID ' + polygonId + ' not found.'); // Handle error if polygon is not found
    }
  }



  //     // Get the source for the specified polygon
  //     // const sourceId = 'polygon-' + (polygonIndex + 1);
  //     // const source = this.map.getSource(sourceId) as mapboxgl.GeoJSONSource;
  //     // if (source) {
  //     //   // Update the polygon layer on the map if the source exists
  //     //   source.setData(updatedPolygon);
  //     // } else {
  //     //   console.error(`Source '${sourceId}' does not exist.`);
  //     // }

  //     console.log(updatedPolygon);


  // user-created polygons
  getPolygons() {
    console.log(this.polygons);
    return this.polygons;
  };



















  setMode(mode: string) {
    switch (mode) {
      case 'create':
        this.draw.changeMode('draw_polygon');
        break;
      case 'delete':
        this.draw.changeMode('delete');
        break;
      case 'select':
        this.draw.changeMode('direct_select');
        break;
      case 'edit':
        this.draw.changeMode('simple_select');
        break;
      case 'move':
        this.draw.changeMode('direct_select');
        break;
      default:
        break;
    };
  };

};
