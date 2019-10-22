import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(data: any): any {
    Object.keys(data).forEach(key => {
      
      data.original = data[key];

      if (this.checkNumber(data.original))
        data.formatted = this.addLetter(data.original)

      switch(data.formatted.toString()[data.formatted.toString().length - 1]){
        case 'K':
          data.suffix = 'K';
          data.formatted = data.formatted.slice(0,data.formatted.toString().length - 1);
          data.tooltip = this.addCommas(data.original);
          break;
        
        case 'M':
          data.suffix = 'M';
          data.formatted = data.formatted.slice(0,data.formatted.toString().length - 1);
          data.tooltip = this.addCommas(data.original);
          break;
        
        case 'B':
          data.suffix = 'B';
          data.formatted = data.formatted.slice(0,data.formatted.toString().length - 1);
          data.tooltip = this.addCommas(data.original);
          break;
        default:
          break;
      }
      
      if(data.formatted.toString().includes('.')){
        data.decimals = data.formatted.toString().split('.')[1];
        data.formatted = data.formatted.toString().split('.')[0];
      }
      
    })

    return data
  }

  checkNumber(value){
    return value !== '' && (value - value) === 0;
  }
  // => Refactor into directive/pipe
  addLetter(value){
    if(value == null || value == 'null') return 'N/A';
    
    value = value > 999999999999 ? '+999.9B' : value < -999999999999 ? '-999.9B' : value > 999999999 || value < -999999999 ? parseInt((value/1000000000).toString()) + 'B' : value > 999999 || value < -999999 ? parseInt((value/1000000).toString()) + 'M' : value > 999 || value < -999 ? parseInt((value/1000).toString()) + 'K' : value.toString().includes('.') ? parseFloat(value).toFixed(2) : value;
    return value;
  }

  addCommas(value){
    if(value == null || value == 'null') return 'N/A';

    value = value.toString();
    let negative_number = false;
    let decimals = value.includes('.') ? value.slice(value.indexOf('.')) : '';
    value = decimals === '' ? value : value.slice(0, value.indexOf('.'));
    
    if(value[0] === '-') {
      negative_number = true
      value = value.slice(1);
    }
    
    for(let i = value.length - 3; i > 0; i -= 3)
      value = value.slice(0, i) + ',' + value.slice(i);
    
    value = negative_number ? '-' + value : value;
    value = decimals === '' ? value : value + parseFloat(decimals).toFixed(1).toString().slice(1);
    
    return value;
  }

}

