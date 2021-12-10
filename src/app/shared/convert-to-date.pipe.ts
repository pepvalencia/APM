import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'convertToDate'
})
export class ConvertToDatePipe implements PipeTransform {
  transform(value: string): string {
    {
      var year = value.substr(0, 4);
      var month = value.substr(5, 2);
      var day = value.substr(8, 2);

      return day + "-" + month + "-" + year;
    }
  }
}
