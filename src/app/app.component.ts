import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { IdeaService } from './services/idea.service';
import { ApiResponse, BusinessIdea, ParsedResponse } from './models/idea.model';
import { IdeaComponent } from './components/idea/idea.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../environments/environment';

import html2canvas from 'html2canvas';
import { LoaderComponent } from './components/loader/loader.component';
import { NavComponent } from './components/nav/nav.component';

type valuationOptions = 'x' | 'questions';

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
  ],
})
export class AppComponent {
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private ideaService = inject(IdeaService);

  public profile: any;
  public posts: any;

  public pastResults: ParsedResponse[] = [];

  public parsedResponse: ParsedResponse | undefined;

  public valuationOption: valuationOptions = 'x';
  public isSubmitting: boolean = false;
  public currentPanel: number = 1;
  public form = this.formBuilder.group({
    step1: this.formBuilder.group({
      motivation: [''],
      success: [''],
    }),
    step2: this.formBuilder.group({
      skills: [''],
      interests: [''],
    }),
    step3: this.formBuilder.group({
      problem: [''],
      audience: [''],
    }),
    step4: this.formBuilder.group({
      businessTypePreference: [''],
      time: [''],
      money: [''],
      workEnv: [''],
    }),
    step5: this.formBuilder.group({
      experience: [''],
    }),
  });

  public xForm: FormGroup;

  public businessIdea: BusinessIdea | null = null;
  public route: string = 'x';

  public tweetUrl = 'https://x.com/lefycodes/status/1886391492224426495';

  constructor(private fb: FormBuilder) {
    this.xForm = this.fb.group({
      xUsername: [''],
    });

    this.apiService.ping().subscribe((res) => console.log(res));

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
    const username = this.xForm.controls['xUsername'].value as string;

    this.isSubmitting = true;
    this.apiService.verifyUsername(username).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.parsedResponse = this.ideaService.parseApiResponse(res);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
      },
    });
  }

  public setCurrentPanel(panel: number | undefined) {
    this.currentPanel = Number(panel);
  }

  public panelChange(change: number) {
    if (
      (this.currentPanel === 1 && change === -1) ||
      (this.currentPanel === 5 && change === 1)
    )
      return;

    this.currentPanel = this.currentPanel + change;
  }

  public submit() {
    console.log('not working for now');
    // this.isSubmitting = true;
    // this.apiService.apiCall(this.form.value).subscribe((a) => {
    //   this.businessIdea = this.ideaService.parseBusinessIdeaResponse(
    //     a.choices[0].message.content
    //   );
    //   this.isSubmitting = false;
    // });
  }

  public routeChange(value: valuationOptions) {
    this.route = value;
    this.valuationOption = value;
  }

  get objectKeys() {
    return Object.keys;
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
