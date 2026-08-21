import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { ChangeRoleDialogComponent, ChangeRoleDialogData } from '../change-role-dialog/change-role-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los usuarios.';
        this.isLoading = false;
      },
    });
  }

  openChangeRoleDialog(user: User): void {
    const dialogRef = this.dialog.open<ChangeRoleDialogComponent, ChangeRoleDialogData>(
      ChangeRoleDialogComponent,
      {
        width: '360px',
        data: { user },
      }
    );

    dialogRef.afterClosed().subscribe((updated: User | undefined) => {
      if (updated) {
        const index = this.users.findIndex((u) => u.id === updated.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
      }
    });
  }
}