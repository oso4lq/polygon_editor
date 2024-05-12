// mapbox.service.ts

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

  constructor() { }

  initMap(container: string, accessToken: string) {
    this.map = new mapboxgl.Map({
      center: [37.347365, 55.692203],
      container: container,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
      pitch: 15,
      bearing: 15,
      antialias: true,
      accessToken: accessToken
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
    });
    this.map.addControl(this.draw);

    this.map.on('draw.create', (event) => {
      const newPolygon = event.features[0];
      this.updateMap();
    });

    this.map.on('draw.delete', (event) => {
      this.updateMap();
    });

    this.map.on('draw.update', (event) => {
      this.updateMap();
    });
  }

  applyExtrudeHeight(extrudeHeight: number) {
    const selectedFeatures = this.draw.getAll();
    if (selectedFeatures.features.length > 0) {
      selectedFeatures.features.forEach((feature: { properties: { height: number; }; }) => {
        feature.properties.height = extrudeHeight;
      });
      this.updateMap();
    } else {
      console.error('No polygons selected.');
    }
  }

  updateMap() {
    // Remove existing layers
    ['extruded-polygons', 'base-polygons'].forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }
      if (this.map.getSource(layerId)) {
        this.map.removeSource(layerId);
      }
    });

    // Get the GeoJSON data from Mapbox Draw
    const data = this.draw.getAll();

    // Add source and layers for both base and extruded polygons
    ['base-polygons', 'extruded-polygons'].forEach(layerId => {
      this.map.addSource(layerId, {
        type: 'geojson',
        data: data
      });

      this.map.addLayer({
        id: layerId,
        type: layerId === 'extruded-polygons' ? 'fill-extrusion' : 'fill',
        source: layerId,
        paint: {
          'fill-color': '#088',
          'fill-opacity': layerId === 'extruded-polygons' ? 0.8 : 0.6,
          'fill-extrusion-color': '#00ffcc',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-opacity': 0.6
        } as any
      });
    });
  }
}
