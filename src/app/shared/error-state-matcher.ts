import { Injectable } from "@angular/core";
import { Field } from "@angular/forms/signals";
import { ShowOnDirtyErrorStateMatcher } from "@angular/material/core";

@Injectable()
export class ShowOnDirtyOrTouchedErrorStateMatcher extends ShowOnDirtyErrorStateMatcher {
    override isSignalErrorState(field: Field<unknown> | null): boolean {
        const state = field?.()

        if (!state || !state.invalid) return false

        const hasAvailabilityError = state.errors().some(
            error => error.kind === 'emailAlreadyInUse' ||
                error.kind === 'phoneAlreadyInUse'
        )

        return state.touched() && state.invalid() || hasAvailabilityError
    }
}