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
  private polygons: any[] = [];

  constructor() { }

  initMap(container: string, accessToken: string) {
    this.map = new mapboxgl.Map({
      center: [37.347365, 55.692203], // hello to Sk :)
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
    });

    this.map.addControl(this.draw);

    this.map.on('draw.create', (event) => {
      const newPolygon = event.features[0];
      this.polygons.push(newPolygon);
      this.updateMap();
    });

    this.map.on('draw.delete', (event) => {
      const deletedFeatureId = event.features[0].id;
      this.polygons = this.polygons.filter(polygon => polygon.id !== deletedFeatureId);
      this.updateMap();
    });

    this.map.on('draw.update', (event) => {
      const updatedFeatureId = event.features[0].id;
      const updatedFeatureIndex = this.polygons.findIndex(polygon => polygon.id === updatedFeatureId);
      if (updatedFeatureIndex !== -1) {
        const extrudeHeight = this.polygons[updatedFeatureIndex].properties.height;
        this.polygons[updatedFeatureIndex] = event.features[0];
        this.polygons[updatedFeatureIndex].properties.height = extrudeHeight;
        this.updateMap();
      }
    });
  };

  zoomIn() {
    this.map.zoomIn();
  };
  
  zoomOut() {
    this.map.zoomOut();
  };

  startDrawing() {
    this.draw.changeMode('draw_polygon');
  };

  deleteSelected() {
    const selectedFeatures = this.draw.getSelected();
    if (selectedFeatures.features.length > 0) {
      const selectedFeatureId = selectedFeatures.features[0].id;
      const selectedPolygonIndex = this.polygons.findIndex(polygon => polygon.id === selectedFeatureId);
      if (selectedPolygonIndex !== -1) {
        // Remove selected polygon from the custom array
        this.polygons.splice(selectedPolygonIndex, 1);
        this.updateMap();
      } else {
        console.error('Selected polygon not found in custom array.');
      }
      // Delete selected polygon from Mapbox Draw
      this.draw.delete(selectedFeatureId);
    } else {
      console.error('No polygon selected.');
    }
  };

  applyExtrudeHeight(extrudeHeight: number) {
    const selectedFeatures = this.draw.getSelected();
    if (selectedFeatures.features.length > 0) {
      const selectedFeatureId = selectedFeatures.features[0].id;
      const selectedPolygon = this.polygons.find(polygon => polygon.id === selectedFeatureId);
      if (selectedPolygon) {
        selectedPolygon.properties.height = extrudeHeight;
        this.updateMap();
      } else {
        console.error('Selected polygon not found in custom array.');
      }
    } else {
      console.error('No polygons selected.');
    }
  };

  updateMap() {
    ['extruded-polygons', 'base-polygons'].forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }
      if (this.map.getSource(layerId)) {
        this.map.removeSource(layerId);
      }
    });

    ['base-polygons', 'extruded-polygons'].forEach(layerId => {
      this.map.addSource(layerId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.polygons
        }
      });

      this.map.addLayer({
        id: layerId,
        type: layerId === 'extruded-polygons' ? 'fill-extrusion' : 'fill',
        source: layerId,
        paint: {
          'fill-color': layerId === 'base-polygons' ? '#088' : '#00ffcc',
          'fill-opacity': layerId === 'base-polygons' ? 0.6 : 0.8,
          ...(layerId === 'extruded-polygons' && {
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-opacity': 0.6
          }) as any
        }
      });
    });
  };
};
