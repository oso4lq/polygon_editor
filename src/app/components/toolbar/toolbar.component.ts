import { Component, Output, EventEmitter } from '@angular/core';
import { MapboxService } from '../../services/mapbox.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {
  @Output() modeSelected = new EventEmitter<string>();

  setMode(mode: string) {
    this.modeSelected.emit(mode);
    console.log(mode + ' mode selected');
  };
};
