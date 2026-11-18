import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightPollution]',
  standalone: true,
})
export class HighlightPollutionDirective implements OnChanges {
  @Input('appHighlightPollution') dangerLevel: number | undefined | null = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    const level = this.dangerLevel ?? 0;
    let bgColor = '';
    let borderColor = '';

    if (level <= 20) {
      bgColor = 'rgba(144, 238, 144, 0.35)'; // Vert clair (Faible : 0-20)
      borderColor = '#4caf50';
    } else if (level <= 50) {
      bgColor = 'rgba(255, 235, 59, 0.35)'; // Jaune (Modérée : 21-50)
      borderColor = '#ffeb3b';
    } else if (level <= 100) {
      bgColor = 'rgba(255, 152, 0, 0.40)'; // Orange (Élevée : 51-100)
      borderColor = '#ff9800';
    } else {
      bgColor = 'rgba(244, 67, 54, 0.45)'; // Rouge (Dangereuse : 101+)
      borderColor = '#f44336';
    }

    // Manipulation propre du DOM via Renderer2
    this.renderer.setStyle(this.el.nativeElement, 'background-color', bgColor);
    this.renderer.setStyle(this.el.nativeElement, 'border-left', `5px solid ${borderColor}`);
  }
}
