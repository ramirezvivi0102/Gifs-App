import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif} from '../interfaces/gifs.interfaces';


@Injectable( {providedIn:'root'})


export class GifsService {
    //Propiedad 

    public gifList: Gif[]=[];

    private _tagsHistory:   string[]=[];
    private apiKey:         string ='1JTYcjUDddd99ZfDGIhdtdg7vq32qQ2y';
    private serviceUrl:     string ='https://api.giphy.com/v1/gifs';

    constructor(private http:HttpClient) {

        //llamamos el metodo de historial
        this.loadlocalStorage(); 
        console.log('gifs Service Ready')
     }

    get tagsHistory(){
        return [...this._tagsHistory];
    }
    

    //metodo de organizacion 
    private organizeHistory(tag:string ){
        // pasamos lo que se escribe en el tac (buscar) a minuscula 
        tag = tag.toLowerCase();

        // si el taghystory  incluye el tac nuevo entonces lo elimino 
        if(this.tagsHistory.includes(tag)){
            this._tagsHistory = this._tagsHistory.filter((oldtag)=>oldtag !== tag) 
        }

        //inserta el nuevo elemento al inicio
        this._tagsHistory.unshift(tag);

        //limita la busqueda hasta 10
        this._tagsHistory = this.tagsHistory.splice(0,10);

        // llamamos el metodo de persistencia 
        this.savelocalStorage();
    }

     // metodo para la persistencia de la busqueda 
     private savelocalStorage():void {
        localStorage.setItem('history',JSON.stringify(this._tagsHistory));
     }

     // metodo para cargar la pertesistencia 
     private loadlocalStorage():void{
         //si no tenemos data no devuelve nada 
        if ( !localStorage.getItem('history'))return; 

        //si tenemos data cargamos el historial
        this._tagsHistory = JSON.parse(localStorage.getItem('history')! );

        // si no tenemos 0 datos pues es cero
        if (this._tagsHistory.length===0)return;
        // si no muestreme los datos del historial 
        this.searchTag(this._tagsHistory[0]);
       
     }

    searchTag( tag: string) : void {

        if(tag.length === 0)return;
        //llamamos el metodo de organizacion 
        this.organizeHistory(tag);

        //parametros
        const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', tag)
        

        //peticion http
        this.http.get<SearchResponse>(`${ this.serviceUrl }/search` , {params})
        .subscribe(resp =>{

            this.gifList = resp.data;

           // console.log({ gifs: this.gifList });
        });
    }
}