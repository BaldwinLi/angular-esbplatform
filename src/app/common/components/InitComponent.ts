import { Component } from '@angular/core';
import {NgLayer, NgLayerRef} from "angular2-layer/angular2-layer";
import {DialogComponent} from "./DialogComponent";
import { assign } from 'lodash';

@Component({
  selector: 'layer-init',
  templateUrl: 'templates/layer.html',
  styleUrls: ['assets/css/index.css'],
  providers: [NgLayer, NgLayerRef]
})
export class InitComponent {

  constructor(private layer: NgLayer, private layerRef: NgLayerRef) {
    
  }

  ngOnInit(){
    let obj = this;
    window['esbLayer'] = (config: any)=>{
      let overlay;
      if(!config) {
        config = {
                type: "dialog",
                inSelector:"fallDown",
                outSelector:"rollOut",
                align:"center",
                parent: this,
                dialogComponent:DialogComponent,
                closeAble: true
            }
      }else{
        config = assign({
                type: "dialog",
                inSelector:"fadeInDown",
                outSelector:"fadeOutDown",
                align:"center",
                parent: this,
                dialogComponent:DialogComponent,
                closeAble: true
            }, config);
      }
      
      switch(config.type){
        case 'dialog':
          config.title = config.title||"提 示";
          overlay = obj.layer.dialog(config);
          break;
        case 'alert':
          config.title = config.title||"警 告";
          config.okText = config.okText||"确定";
          overlay = obj.layer.alert(config);
          break;
        case 'confirm':
          config.title = config.title||"确 认";
          config.cancelText = config.cancelText||"取消";
          config.okText = config.okText||"确定";
          overlay = obj.layer.confirm(config);
          break;
        case 'loading':
          config.message = config.message||"加载中...";
          config.isModal = config.isModal||true;
          overlay = obj.layer.loading(config);
          break;
        case 'tip':
          overlay = obj.layer.tip(config);
          break;
        default:
          overlay = obj.layer.dialog(config);
      }

      return overlay;
    };
  }
}
