import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './pages/ticket-form/ticket-form.component';

const routes: Routes = [
  { path: '', component: TicketListComponent },
  { path: 'new', component: TicketFormComponent },
  { path: ':id', component: TicketDetailComponent },
  { path: ':id/edit', component: TicketFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}