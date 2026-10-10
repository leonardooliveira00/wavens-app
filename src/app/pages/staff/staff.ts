import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StaffItem } from '../../models/Staff';
import { StaffService } from '../../services/staff.service';
import { JsonPipe } from '@angular/common';

const STAFF_DATA: StaffItem[] = [
  { id: 1, firstName: 'Staff1', lastName: "Staff1", email: "staff1@email.com" },
  { id: 2, firstName: "Staff2", lastName: "Staff2", email: "staff2@email.com" },
  { id: 3, firstName: "Staff3", lastName: "Staff3", email: "staff3@email.com" }
]

@Component({
  imports: [MatButtonModule, MatIcon, MatTableModule, JsonPipe],
  selector: 'app-staff',
  styleUrl: './staff.css',
  templateUrl: './staff.html',
})
export class Staff {
  private staffService = inject(StaffService);

  staffList = this.staffService.staffResource.value;

  public isLoading = this.staffService.staffResource.isLoading;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'actions']
  dataSource = STAFF_DATA;
}
