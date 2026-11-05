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
import { StaffSortBy } from '../../features/staff/models/staff.sort.by';
import { StaffSortOrder } from '../../features/staff/models/staff.sort.order';
import { StaffSortStatus } from '../../features/staff/models/staff.sort.status';
import { MatSelectModule } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIcon, MatTableModule, MatProgressBar, MatFormFieldModule, MatInputModule, FormsModule, MatProgressSpinnerModule, MatSelectModule, MatDivider, MatMenuModule],
  providers: [StaffService],
  selector: 'app-staff',
  styleUrl: './staff.css',
  templateUrl: './staff.html',
})
export class Staff {
  staffService = inject(StaffService)

  source = computed<{ items: StaffListItem[]; search: string, sortBy: string, sortOrder: string, status: string }>(() => ({
    items: this.staffService.staffListResource.value()?.items ?? [],
    sortBy: this.staffService.selectedSortBy(),
    sortOrder: this.staffService.selectedSortOrder(),
    status: this.staffService.selectedStatus(),
    search: this.staffService.debouncedSearch.value()
  }))

  listItems = linkedSignal<{ items: StaffListItem[]; search: string, sortBy: string, sortOrder: string, status: string }, StaffListItem[]>({
    source: this.source,
    computation: (current, previous) => {
      if (
        previous && (
          current.search !== previous.source.search ||
          current.sortBy !== previous.source.sortBy ||
          current.sortOrder !== previous.source.sortOrder ||
          current.status !== previous.source.status
        )
      ) {
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

  staffSortBy: StaffSortBy[] = [
    { value: 'CreatedAt', viewValue: 'Data de criação', icon: 'calendar_month' },
    { value: 'FirstName', viewValue: 'Nome', icon: 'sort_by_alpha' },
    { value: 'LastName', viewValue: 'Sobrenome', icon: 'sort_by_alpha' }
  ]

  staffSortOrder: StaffSortOrder[] = [
    { value: 'DESC', viewValue: 'Mais recente', icon: 'arrow_downward' },
    { value: 'ASC', viewValue: 'Mais antigo', icon: 'arrow_upward' }
  ]

  staffSortStatus: StaffSortStatus[] = [
    { value: 'Active', viewValue: "Ativo" },
    { value: 'Inactive', viewValue: "Inativo" }
  ]

  sortOrderOptions = computed<StaffSortOrder[]>(() => {
    switch (this.staffService.selectedSortBy()) {
      case 'FirstName':
      case 'LastName':
        return [
          { value: 'ASC', viewValue: 'Crescente', icon: 'arrow_upward' },
          { value: 'DESC', viewValue: 'Decrescente', icon: 'arrow_downward' },
        ]

      case 'CreatedAt':
        return [
          { value: 'DESC', viewValue: 'Mais recente', icon: 'arrow_downward' },
          { value: 'ASC', viewValue: 'Mais antiga', icon: 'arrow_upward' }
        ]

      default:
        return []
    }
  })

  sortByIcon = computed(() =>
    this.staffSortBy.find(
      option => option.value === this.staffService.selectedSortBy()
    )?.icon ?? 'sort'
  )

  sortOrderIcon = computed(() =>
    this.staffSortOrder.find(
      option => option.value === this.staffService.selectedSortOrder()
    )?.icon ?? 'sort'
  )

  skeletonRows: StaffListItem[] = Array.from({ length: 10 })
}
