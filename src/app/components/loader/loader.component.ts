import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent implements OnInit, OnDestroy {
  public loadingMessages: string[] = [
    '🤷‍♂️ If this idea sucks, blame the AI...',
    '👩‍⚖️ Confirming this isn’t illegal...',
    '🙃 Almost there, don’t start a riot...',
    '📊 Faking financial projections…',
    '🐌 Faster than government paperwork...',
    '💡 Brainstorming... but make it dramatic.',
    '🔥 Injecting some startup buzzwords...',
    '⏳ Measuring your patience...',
    '🚀 Launching in 3..2..wait, false start.',
  ];

  currentMessage: string = this.loadingMessages[0];
  private messageInterval: any;

  ngOnInit() {
    this.shuffleMessages();
    this.startRotatingMessages();
  }

  shuffleMessages() {
    this.loadingMessages = this.loadingMessages
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  startRotatingMessages() {
    let index = 0;
    this.messageInterval = setInterval(() => {
      index = (index + 1) % this.loadingMessages.length;
      this.currentMessage = this.loadingMessages[index];
    }, 1500); // Change every 1.5 seconds
  }

  stopRotatingMessages() {
    clearInterval(this.messageInterval);
  }

  ngOnDestroy() {
    this.stopRotatingMessages();
  }
}
