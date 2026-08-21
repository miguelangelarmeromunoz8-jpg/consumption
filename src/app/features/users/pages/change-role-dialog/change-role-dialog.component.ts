import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User, UserRole } from '../../../../core/models/user.model';

export interface ChangeRoleDialogData {
  user: User;
}

@Component({
  selector: 'app-change-role-dialog',
  templateUrl: './change-role-dialog.component.html',
  styleUrls: ['./change-role-dialog.component.scss'],
})
export class ChangeRoleDialogComponent {
  selectedRole: UserRole;
  roleOptions: UserRole[] = ['admin', 'agent', 'client'];
  isSaving = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<ChangeRoleDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: ChangeRoleDialogData
  ) {
    this.selectedRole = data.user.role;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.isSaving = true;
    this.errorMessage = '';

    this.userService.changeRole(this.data.user.id, this.selectedRole).subscribe({
      next: (updatedUser) => {
        this.isSaving = false;
        this.dialogRef.close(updatedUser);
      },
      error: () => {
        this.errorMessage = 'Error al cambiar el rol.';
        this.isSaving = false;
      },
    });
  }
}