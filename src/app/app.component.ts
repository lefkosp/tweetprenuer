import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { IdeaService } from './services/idea.service';
import { BusinessIdea, ParsedResponse } from './models/idea.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IdeaComponent } from './components/idea/idea.component';

type valuationOptions = 'x' | 'questions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    StepperModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    ProgressSpinnerModule,
    IdeaComponent,
  ],
})
export class AppComponent {
  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private ideaService = inject(IdeaService);

  public profile: any;
  public posts: any;

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

  public xForm = this.formBuilder.group({
    xUsername: this.formBuilder.control(''),
  });

  businessIdea: BusinessIdea | null = null;
  public route: string = 'x';

  public submitUsername() {
    const username = this.xForm.controls.xUsername.value as string;

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
    // this.xapiService.getProfileAndTweets('lefycodes').subscribe((value) => {
    //   this.isSubmitting = false;
    // });
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
}
