import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { animate } from 'motion';

// Directive d'attribut : applique une animation d'apparition fluide au montage de l'élément (via la lib Motion)
@Directive({
  selector: '[appCyberReveal]',
  standalone: true,
})
export class CyberRevealDirective implements OnInit {
  @Input() delay = 0;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(16px) scale(0.98)';

    animate(
      element,
      {
        opacity: [0, 1],
        transform: ['translateY(16px) scale(0.98)', 'translateY(0px) scale(1)'],
      },
      {
        duration: 0.45,
        delay: this.delay,
        ease: [0.22, 1, 0.36, 1],
      },
    );
  }
}
