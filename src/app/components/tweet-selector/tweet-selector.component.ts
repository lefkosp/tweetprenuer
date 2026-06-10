import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../services/api.service';
import { LoaderComponent } from '../loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tweet-selector',
  imports: [
    MatCardModule,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tweet-selector.component.html',
  styleUrl: './tweet-selector.component.css',
})
export class TweetSelectorComponent {
  private _tweets: { id: string; content: string }[] = [];

  @Input()
  set tweets(value: { id: string; content: string }[]) {
    // Find newly added tweets by comparing with previous tweets
    const newTweets = value.filter(
      (tweet) => !this._tweets.find((t) => t.id === tweet.id)
    );

    // If this is the initial load (this._tweets is empty), select all tweets
    if (this._tweets.length === 0) {
      this.selectedTweets = value.map((tweet) => tweet.id);
    }
    // Otherwise, only add the newly added tweets to selectedTweets
    else if (newTweets.length > 0) {
      this.selectedTweets = [
        ...this.selectedTweets,
        ...newTweets.map((tweet) => tweet.id),
      ];
    }

    this._tweets = value;
    this.isLoading = false;
  }

  get tweets(): { id: string; content: string }[] {
    return this._tweets;
  }

  @Output() onMoreTweets = new EventEmitter();
  @Output() onConfirmSelection = new EventEmitter<string[]>();

  public selectedTweets: string[] = [];
  public isLoading = false;

  toggleTweetSelection(tweetId: string) {
    const index = this.selectedTweets.indexOf(tweetId);
    if (index > -1) {
      this.selectedTweets.splice(index, 1);
    } else {
      this.selectedTweets.push(tweetId);
    }
  }

  getMoreTweets() {
    this.isLoading = true;
    this.onMoreTweets.emit();

    setTimeout(() => {
      const container = document.querySelector('.tweet-selector-content');
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }

  confirmSelection() {
    this.onConfirmSelection.emit(this.selectedTweets);
    // Logic to handle the selected tweets
  }
}
