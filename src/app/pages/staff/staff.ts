import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StaffService } from '../../features/staff/services/staff.service';
import { StaffListItem } from '../../features/staff/models/staff.list.item';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIcon, MatTableModule, MatProgressBar, MatFormFieldModule, MatInputModule, FormsModule],
  providers: [StaffService],
  selector: 'app-staff',
  styleUrl: './staff.css',
  templateUrl: './staff.html',
})
export class Staff {
  staffService = inject(StaffService)

  staffSource = computed<StaffListItem[]>(() => this.staffService.staffListResource.value()?.items ?? [])

  hasMore = computed<boolean>(() => this.staffService.staffListResource.value()?.hasMore ?? false)

  listItems = linkedSignal<StaffListItem[], StaffListItem[]>({
    source: this.staffSource,
    computation: (newItems, previousItems) => {
      return [...previousItems?.value ?? [], ...newItems]
    }
  })

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'actions']
}
