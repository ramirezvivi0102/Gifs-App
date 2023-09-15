import { Component, ElementRef, ViewChild} from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
    selector: 'gifs-search-box',
    template: `
   <h5>Buscar</h5>
   <input type="text" class="form-control" placeholder=" Buscar Gifs..."

   (keyup.enter)="searchTag()"
   #txtTagInput
   >
    `
})
export class SearchBoxComponent  {

    @ViewChild('txtTagInput')
    public txtTagInput!: ElementRef<HTMLInputElement>;

    constructor(private gifsService:GifsService) { }

    //evento
    searchTag(){

        const newTag= this.txtTagInput.nativeElement.value;
        this.gifsService.searchTag(newTag);
        this.txtTagInput.nativeElement.value='';
       
    }

}