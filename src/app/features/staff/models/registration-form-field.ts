import { RegisterStaffData } from "./register-staff-data"

type StaffFieldKey = keyof RegisterStaffData

export interface RegistrationFormField {
    key: StaffFieldKey
    label: string
    placeholder: string
    span: 1 | 2 | 3
    hasAvailabilityCheck?: boolean
}