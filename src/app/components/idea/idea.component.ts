// idea.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-idea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './idea.component.html',
  styleUrls: ['./idea.component.css'],
})
export class IdeaComponent {
  @Input() profileImage!: string;
  @Input() username!: string;
  @Input() followers!: number;
  @Input() tweets!: string[];
  @Input() businessIdea!: {
    catchyName: string;
    whatWeDo: string;
    tagline: string;
    colorTheme: {
      background: string;
      border: string;
      text: string;
    };
  };
  @ViewChild('card', { static: true }) card!: ElementRef;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const card = this.card.nativeElement;
    const { left, top, width, height } = card.getBoundingClientRect();

    // Calculate tilt rotation based on cursor position
    const x = (event.clientX - left - width / 2) / width;
    const y = (event.clientY - top - height / 2) / height;

    const rotateX = y * 10; // Adjust tilt intensity
    const rotateY = x * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.card.nativeElement.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  }

  shareOnTwitter() {
    const tweetText = encodeURIComponent(
      `${this.businessIdea.catchyName} - ${this.businessIdea.tagline}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  }
}
