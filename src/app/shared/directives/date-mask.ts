import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appDateMask]',
  host: {
    '(beforeinput)': 'onBeforeInput($event)',
    '(input)': 'onInput()',
  }
})
export class DateMask {
  private el = inject(ElementRef<HTMLInputElement>)
  private isAsciiDigit: RegExp = /[^0-9]/g
  valueChange = output<string>()

  onBeforeInput(event: InputEvent) {
    const inputType = event.inputType

    const input = this.el.nativeElement

    const currentDigits = input.value.replace(this.isAsciiDigit, '').length

    const selectionStart = input.selectionStart
    const selectionEnd = input.selectionEnd

    const selectedValue = input.value.slice(selectionStart, selectionEnd)

    const selectedDigits = selectedValue.replace(this.isAsciiDigit, '').length

    const digitsAfterReplacement = currentDigits - selectedDigits

    if (inputType.startsWith('insert') && digitsAfterReplacement >= 8) event.preventDefault()

    if (inputType === 'deleteContentBackward' && input.value.charAt(selectionStart - 1) === '/') {
      event.preventDefault()

      if (selectionStart === 1) return

      input.value = input.value.slice(0, selectionStart - 2) + input.value.slice(selectionStart - 1)
      input.setSelectionRange(selectionStart - 2, selectionStart - 2)
    }

    if (inputType === 'deleteContentForward' && input.value.charAt(selectionStart) === '/') {
      event.preventDefault()
      input.value = input.value.slice(0, selectionStart + 1) + input.value.slice(selectionStart + 2)
      input.setSelectionRange(selectionStart + 1, selectionStart + 1)
    }
  }

  onInput() {
    const input = this.el.nativeElement

    const currentValue = input.value

    const [rawDay, rawMonth, rawYear] = currentValue.split('/')

    let day = rawDay.replace(this.isAsciiDigit, '').slice(0, 2)
    let month = rawMonth?.replace(this.isAsciiDigit, '').slice(0, 2)
    const year = rawYear?.replace(this.isAsciiDigit, '').slice(0, 4)

    if (day.length === 2 && (Number(day) < 1 || Number(day) > 31)) day = day.slice(0, 1)

    if (month?.length === 2 && (Number(month) < 1 || Number(month) > 12)) month = month.slice(0, 1)

    let maskedValue = day

    if (day.length === 2 || month?.length || year?.length) {
      maskedValue += `/${month ?? ''}`
    }

    if (month?.length === 2 || year?.length) {
      maskedValue += `/${year ?? ''}`
    }

    const selectionStart = input.selectionStart

    const digitsBeforeCursor = currentValue.slice(0, selectionStart).replace(this.isAsciiDigit, '').slice(0, 8).length

    let newCursorPosition = digitsBeforeCursor

    if (digitsBeforeCursor >= 2) newCursorPosition++
    if (digitsBeforeCursor >= 4) newCursorPosition++

    input.value = maskedValue
    this.valueChange.emit(maskedValue)

    input.setSelectionRange(newCursorPosition, newCursorPosition)
  }
}
