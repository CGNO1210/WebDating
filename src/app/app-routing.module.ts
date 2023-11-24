import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { TestsErrorsComponent } from './errors/tests-errors/tests-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberDetailedResolver } from './_resolvers/member-detailed.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
      { path: 'members/:username', component: MemberDetailComponent, resolve:{member:MemberDetailedResolver}},
      { path: 'member/edit', component: MemberEditComponent,canDeactivate:[PreventUnsavedChangesGuard] },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListsComponent },
    ]
  },
  { path: "not-found", component: NotFoundComponent },
  { path: "server-error", component: ServerErrorComponent },
  { path: 'errors', component: TestsErrorsComponent },
  { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
  { path: 'members/:id', component: MemberDetailComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'lists', component: ListsComponent },
  { path: '**', component: NotFoundComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
