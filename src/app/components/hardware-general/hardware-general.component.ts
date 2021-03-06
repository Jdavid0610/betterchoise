import { Component, OnInit, ViewChild,OnDestroy, ComponentFactoryResolver} from '@angular/core';
import {AddBoxesService} from '../../services/addBoxes/add-boxes.service'
import { from } from 'rxjs';
import { ConexionService } from '../../services/conexion/conexion.service'
import { DynamycHostDirective } from '../../directive/dynamyc-host.directive'
import { BoxComponent } from '../box/box.component';
import { Item } from '../../interfaces/item'
@Component({
  selector: 'app-hardware-general',
  templateUrl: './hardware-general.component.html',
  styleUrls: ['./hardware-general.component.scss']
})
export class HardwareGeneralComponent implements OnInit {
  
  @ViewChild(DynamycHostDirective, {static: true}) boxHost: DynamycHostDirective;
  constructor(public conexionService:ConexionService,private cfr: ComponentFactoryResolver, private limpiar:AddBoxesService) {

   }

  ngOnInit(): void {

  }


  sendSearch(Sbrand?:String, sModel?:String, sPrice_max?:number,sPrice_min?:number,){
    const sItem = {
      brand: Sbrand,
      model: sModel,
      price_max: sPrice_max,
      price_min:sPrice_min
    }
    this.conexionService.SendData(sItem).subscribe(item => {
      this.limpiar.reiniciarSolicitudes();
      sessionStorage.clear();
      this.boxHost.viewContainerRef.clear();
      var items=item["items"];
      for (const key in items) {
        this.createComponents(items[key],key);
      }
    });
  }

  createComponents(items:Item,i:string){
    sessionStorage.setItem('item'.concat(i),JSON.stringify(items));
    let cf = this.cfr.resolveComponentFactory(BoxComponent);
    let vcr = this.boxHost.viewContainerRef;
    vcr.createComponent(cf,0);
  }
}
