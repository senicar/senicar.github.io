import { Component } from '@angular/core';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import images from 'src/assets/images.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'senicar-net';

  images = [];

  constructor() {
    this.images = images;
    console.log(images);
  }


  ngOnInit() {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#my-gallery',
      children: 'a',
      bgOpacity: 0.9,
      pswpModule: PhotoSwipe,
    });
    lightbox.init();
  }
}
