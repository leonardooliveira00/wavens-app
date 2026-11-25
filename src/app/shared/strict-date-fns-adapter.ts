import { Injectable } from "@angular/core";
import { DateFnsAdapter } from "@angular/material-date-fns-adapter";

@Injectable()
export class StrictDateFnsAdapter extends DateFnsAdapter {
    constructor() {
        super()
        console.log('StrictDateFnsAdapter instanciado')
    }
    override parse(value: unknown, parseFormat: string | string[]): Date | null {
        if (typeof value === 'string' &&
            value.length > 0 &&
            !/^\d{2}\/\d{2}\/\d{4}$/.test(value)
        ) return this.invalid()

        return super.parse(value, parseFormat)
    }
}