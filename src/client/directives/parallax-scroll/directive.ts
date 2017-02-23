import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[parallax-scroll]',
    host: {'(window:scroll)': 'scroll($event)'}
})

export class ParallaxScrollDirective {

    @Input('parallax-scroll') parallaxScale: number;

    constructor(private _element: ElementRef) {
        _element.nativeElement.style.position = 'relative';
    }

    scroll($event: Event): void {
         let doc = $event.target['documentElement'];
         let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

         this._element.nativeElement.style.top = (top * this.parallaxScale) + 'px';
    }
}
