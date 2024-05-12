import { Component, Output, EventEmitter } from '@angular/core';
import { MapboxService } from '../../services/mapbox.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {

  constructor(
    private mapboxService: MapboxService,
  ) { }

  @Output() modeSelected = new EventEmitter<string>();

  extrudeHeight: number = 1000; // default extrude height

  // extrude height input
  passExtrudeHeight() {
    this.mapboxService.applyExtrudeHeight(this.extrudeHeight);
  };
  
  // toolbar buttons
  zoomIn() {
    this.mapboxService.zoomIn();
  };
  zoomOut() {
    this.mapboxService.zoomOut();
  };
  startDrawing() {
    this.mapboxService.startDrawing();
  };
  deleteSelected() {
    this.mapboxService.deleteSelected();
  };
};
