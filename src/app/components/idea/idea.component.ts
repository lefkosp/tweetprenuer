import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-idea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './idea.component.html',
  styleUrl: './idea.component.css',
})
export class IdeaComponent {
  @Input() profileImage!: string;
  @Input() username!: string;
  @Input() followers!: number;
  @Input() tweets!: string[];
  @Input() businessIdea!: {
    catchyName: string;
    whatItIs: string;
    tagline: string;
    tweetableHook: string;
  };

  shareOnTwitter() {
    const tweetText = encodeURIComponent(this.businessIdea.tweetableHook);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  }
}
