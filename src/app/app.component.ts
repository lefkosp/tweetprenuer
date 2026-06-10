import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { IdeaService } from './services/idea.service';
import { ApiResponse, ParsedResponse } from './models/idea.model';
import { IdeaComponent } from './components/idea/idea.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import html2canvas from 'html2canvas';
import { LoaderComponent } from './components/loader/loader.component';
import { TweetSelectorComponent } from './components/tweet-selector/tweet-selector.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    IdeaComponent,
    LoaderComponent,
    MatSnackBarModule,
    TweetSelectorComponent,
  ],
  animations: [
    trigger('ideaSlide', [
      state(
        'center',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      state(
        'up',
        style({
          transform: 'translateY(-150%)',
          opacity: 0,
        })
      ),
      transition('center <=> up', animate('300ms ease-in-out')),
    ]),
    trigger('tweetsSlide', [
      state(
        'down',
        style({
          transform: 'translateY(100%)',
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      state(
        'center',
        style({
          transform: 'translateY(0)',
          opacity: 1,
          visibility: 'visible',
        })
      ),
      transition('down <=> center', animate('300ms ease-in-out')),
    ]),
  ],
  providers: [provideAnimations()],
})
export class AppComponent {
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private ideaService = inject(IdeaService);
  private snackBar = inject(MatSnackBar);

  public pastResults: ParsedResponse[] = [];
  public parsedResponse: ParsedResponse | undefined;

  public isSubmitting: boolean = false;
  public tweetsVisible = false;

  public xForm: FormGroup = this.formBuilder.group({
    xUsername: [''],
  });

  public tweetUrl = 'https://x.com/lefycodes/status/1893025862812844040';

  constructor() {
    // Warm up the backend (free-tier hosting cold starts) and load the carousel.
    this.apiService.ping().subscribe();

    this.apiService.getPastResults().subscribe((res) => {
      this.pastResults = this.processPastResults(res);
    });
  }

  public processPastResults(res: ApiResponse[]): ParsedResponse[] {
    return res.map((r) => {
      return {
        ...this.ideaService.parseApiResponse(r),
      };
    });
  }

  public submitUsername() {
    const username = (
      this.xForm.controls['xUsername'].value as string
    )?.trim();
    if (!username) return;

    this.isSubmitting = true;
    this.apiService.verifyUsername(username).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.parsedResponse = this.ideaService.parseApiResponse(res);
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(`Error verifying username`, 'error', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.isSubmitting = false;
      },
    });
  }

  public getMoreTweets() {
    const username = this.parsedResponse?.username;
    if (!username) return;

    this.apiService.getMoreTweets(username).subscribe({
      next: (tweets) => {
        if (!this.parsedResponse) return;

        const offset = this.parsedResponse.tweets.length;
        const parsed = tweets.map((content, i) => ({
          id: `${offset + i + 1}`,
          content,
        }));

        // New array reference so the selector's setter picks up the additions.
        this.parsedResponse.tweets = [...this.parsedResponse.tweets, ...parsed];
      },
      error: () => {
        if (this.parsedResponse) {
          // Retrigger the selector's input setter to clear its loading state.
          this.parsedResponse.tweets = [...this.parsedResponse.tweets];
        }
        this.snackBar.open('Could not load more tweets', 'error', {
          duration: 2000,
          verticalPosition: 'top',
        });
      },
    });
  }

  public confirmTweetSelection(selectedIds: string[]) {
    if (!this.parsedResponse) return;

    const selected = this.parsedResponse.tweets
      .filter((tweet) => selectedIds.includes(tweet.id))
      .map((tweet) => tweet.content);

    if (selected.length === 0) {
      this.snackBar.open('Select at least one tweet', 'ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const existingTweets = this.parsedResponse.tweets;

    this.tweetsVisible = false;
    this.isSubmitting = true;
    this.apiService
      .regenerateIdea(this.parsedResponse.username, selected)
      .subscribe({
        next: (res) => {
          // Keep the full tweet list — the response only echoes the selection.
          this.parsedResponse = {
            ...this.ideaService.parseApiResponse(res),
            tweets: existingTweets,
          };
          this.isSubmitting = false;
        },
        error: () => {
          this.snackBar.open('Could not regenerate the idea', 'error', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.isSubmitting = false;
        },
      });
  }

  public toggleTweets() {
    this.tweetsVisible = !this.tweetsVisible;
  }

  async generateScreenshotCanvas(): Promise<HTMLCanvasElement | null> {
    const ideaElement = document.querySelector('.business-card');
    if (!ideaElement) {
      console.error('Business card element not found');
      return null;
    }
    try {
      const canvas = await html2canvas(ideaElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#242424',
        logging: false,
      });
      return canvas;
    } catch (error) {
      console.error('Error generating screenshot:', error);
      return null;
    }
  }

  async downloadScreenshot(): Promise<void> {
    const canvas = await this.generateScreenshotCanvas();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `business-idea-${
        this.parsedResponse?.username || 'screenshot'
      }.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  }

  async shareOnX(): Promise<void> {
    const canvas = await this.generateScreenshotCanvas();
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to convert canvas to blob.');
          return;
        }
        try {
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([clipboardItem]);

          // Define the tweet text with a message and the tweet URL to quote
          const tweetText = encodeURIComponent(
            `Check this out: ${this.tweetUrl}`
          );
          // Open X tweet composition in a new tab
          window.open(
            `https://twitter.com/intent/tweet?text=${tweetText}`,
            '_blank'
          );

          alert(
            'Screenshot copied to clipboard! Paste it into the opened tweet composition on X.'
          );
        } catch (err) {
          console.error('Failed to copy image to clipboard:', err);
          alert('Copying failed. Please try manually.');
        }
      }, 'image/png');
    }
  }
}
