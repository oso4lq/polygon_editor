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
      center: [37.347365, 55.692203], // hello to Sk :)
      // center: [-87.61694, 41.86625],
      container: container,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12, // zoom index
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

      const style = this.map.getStyle();
      console.log(style.sources);
      // Update the map to reflect the changes
      this.updateMap();
    } else {
      console.error('Polygon with ID ' + polygonId + ' not found.'); // Handle error if polygon is not found
    }
  }


  updateMap() {
    if (this.map.getLayer('extruded-polygons')) {
      this.map.removeLayer('extruded-polygons');
    }
    if (this.map.getSource('extruded-polygons')) {
      this.map.removeSource('extruded-polygons');
    }

    // Add a new source using the polygons array
    this.map.addSource('extruded-polygons', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.polygons // Use the polygons array as features
      }
    });

    // Add a new layer to render the extruded polygons
    this.map.addLayer({
      id: 'extruded-polygons',
      type: 'fill-extrusion',
      source: 'extruded-polygons',
      paint: {
        // Get the extrusion color from the properties of each polygon
        'fill-extrusion-color': '#00ffcc',
        // Get the extrusion height from the properties of each polygon
        'fill-extrusion-height': ['get', 'height'],
        // Set extrusion opacity
        'fill-extrusion-opacity': 0.8
      }
    });
  };

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
