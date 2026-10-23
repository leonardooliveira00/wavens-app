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
import { StaffTableColumn } from '../../features/staff/models/staff.table.column';

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
    search: this.staffService.debouncedSearch.value()
  }))

  listItems = linkedSignal<{ items: StaffListItem[]; search: string }, StaffListItem[]>({
    source: this.source,
    computation: (current, previous) => {
      if (previous && current.search !== previous.source.search) {
        return current.items
      }

      return [...(previous?.value ?? []), ...current.items]
    }
  })

  isInitialLoading = computed<boolean>(() =>
    !this.staffService.hasCompletedInitialLoad() &&
    this.staffService.staffListResource.isLoading()
  )

  isLoadingSearch = computed<boolean>(() =>
    this.staffService.staffListResource.isLoading() &&
    !this.isInitialLoading() &&
    !this.staffService.isLoadingMore()
  )

  isSearching = computed<boolean>(() => this.staffService.search() !== this.staffService.debouncedSearch.value())

  isListVisible = computed(() =>
    !this.isLoadingSearch()
  )

  hideEmptyState = computed<boolean>(() => this.isSearching() || this.staffService.staffListResource.isLoading())

  hasMore = computed<boolean>(() => this.staffService.staffListResource.value()?.hasMore ?? false)

  columns: StaffTableColumn[] = [
    { key: 'id', label: 'UUID', skeletonWidth: 'w-32', skeletonClass: '', headerClass: '', cellClass: '' },
    { key: 'fullName', label: 'Nome', skeletonWidth: 'w-40', skeletonClass: '', headerClass: '', cellClass: '' },
    { key: 'email', label: 'Email', skeletonWidth: 'w-48', skeletonClass: '', headerClass: '', cellClass: '' },
    { key: 'status', label: 'Status', skeletonWidth: 'w-20', skeletonClass: 'mx-auto', headerClass: 'text-center', cellClass: 'text-center' },
    { key: 'actions', label: 'Ações', skeletonWidth: 'w-24', skeletonClass: 'mx-auto', headerClass: 'text-center', cellClass: 'text-center' }
  ]

  displayedColumns = computed(() =>
    this.columns.map(column => column.key))

  skeletonRows: StaffListItem[] = Array.from(
    { length: 5 },
    () => ({
      id: '',
      fullName: '',
      email: '',
      status: ''
    })
  )

  tableData = computed(() => this.isInitialLoading() ? this.skeletonRows : this.listItems())
}
