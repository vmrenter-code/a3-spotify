import { Component, OnInit, Input } from '@angular/core';
import { Popularity } from 'src/app/data/popularity';

@Component({
    selector: 'app-thermometer',
    templateUrl: './thermometer.component.html',
    styleUrls: ['./thermometer.component.css'],
    standalone: false
})
export class ThermometerComponent implements OnInit {
  //The resource's popularity, passed in by the parent page (e.g. [popularity]="artist.popularity").
  //Can be undefined when Spotify reports a popularity of 0, so the template checks for it.
  @Input() popularity:Popularity;

  constructor() { }

  ngOnInit() {
  }

}
