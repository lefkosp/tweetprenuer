import { Routes } from '@angular/router';
import { XComponent } from './components/x/x.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { IdeaComponent } from './components/idea/idea.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'x',
  // },
  {
    path: 'x',
    component: XComponent,
  },
  {
    path: 'questions',
    component: QuestionsComponent,
  },
  {
    path: 'idea/:id',
    component: IdeaComponent,
  },
];
