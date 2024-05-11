import { Component, Output, EventEmitter } from '@angular/core';
import { MapboxService } from '../../services/mapbox.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {

  constructor(
    private mapboxService: MapboxService,
  ) { }

  @Output() modeSelected = new EventEmitter<string>();

  extrudeHeight: number = 10; // default extrude height

  setMode(mode: string) {
    this.modeSelected.emit(mode);
    console.log(mode + ' mode selected');
  };

  applyExtrudeHeight() {
    // Get the array of user-created polygons
    const polygons = this.mapboxService.getPolygons();
    if (polygons.length > 0) {
      // Get the ID of the last created polygon
      const lastPolygonId = polygons[polygons.length - 1].id;
      this.mapboxService.applyExtrudeHeight(lastPolygonId, this.extrudeHeight);
    } else {
      console.error('No polygons created yet.');
    }
  }


};
