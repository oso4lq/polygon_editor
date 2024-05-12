import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MapboxService } from './services/mapbox.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  constructor(private mapboxService: MapboxService) { }

  ngOnInit() {
    this.mapboxService.initMap('map-container', environment.mapbox.accessToken);
  };

  title = 'Polygon Editor';
  currentMode: string = '';

  handleModeSelected(mode: string) {
    this.currentMode = mode;
  }
};
