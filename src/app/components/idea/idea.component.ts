// idea.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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

  shareOnTwitter() {
    const tweetText = encodeURIComponent(
      `${this.businessIdea.catchyName} - ${this.businessIdea.tagline}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  }
}
