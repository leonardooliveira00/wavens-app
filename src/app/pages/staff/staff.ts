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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIcon, MatTableModule, MatProgressBar, MatFormFieldModule, MatInputModule, FormsModule, MatProgressSpinnerModule],
  providers: [StaffService],
  selector: 'app-staff',
  styleUrl: './staff.css',
  templateUrl: './staff.html',
})
export class Staff {
  staffService = inject(StaffService)

  source = computed<{ items: StaffListItem[]; search: string }>(() => ({
    items: this.staffService.staffListResource.value()?.items ?? [],
    search: this.staffService.search()
  }))

  isLoadingSearch = computed<boolean>(() => this.staffService.staffListResource.isLoading() &&
    !this.staffService.isLoadingMore())

  isSearching = computed<boolean>(() => this.staffService.search() !== this.staffService.debouncedSearch.value())

  hideEmptyState = computed<boolean>(() => this.isSearching() || this.staffService.staffListResource.isLoading())

  hasMore = computed<boolean>(() => this.staffService.staffListResource.value()?.hasMore ?? false)

  listItems = linkedSignal<{ items: StaffListItem[]; search: string }, StaffListItem[]>({
    source: this.source,
    computation: (current, previous) => {
      if (previous && current.search !== previous.source.search) {
        return []
      }

      return [...(previous?.value ?? []), ...current.items]
    }
  })

  displayedColumns: string[] = ['id', 'fullName', 'email', 'status', 'actions']
}
