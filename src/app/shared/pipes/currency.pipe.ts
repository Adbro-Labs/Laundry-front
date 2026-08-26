import { Pipe, PipeTransform } from '@angular/core';
import { CURRENCY_LOCALE, CURRENCY_SYMBOL } from '../config/currency.constants';

@Pipe({
  name: 'appCurrency',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    const amount = Number(value || 0);
    const formattedAmount = new Intl.NumberFormat(CURRENCY_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${CURRENCY_SYMBOL} ${formattedAmount}`;
  }
}
