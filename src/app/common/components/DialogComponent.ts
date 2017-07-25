import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";

@Component({
    selector: 'esb-dialog',
    templateUrl: 'templates/dialog.html',
    providers: [NgLayer, NgLayerRef]
})
export class DialogComponent {

    private templateContent: any;

    constructor(protected layerRef: NgLayerRef, protected layer: NgLayer, protected layComp: NgLayerComponent) { }

    title(text: string) {
        this.layComp.lyRef.setTitle(text);
    }

    message(text: string) {
        this.layComp.lyRef.setMessage(text);
    }

    okText(text: string) {
        this.layComp.lyRef.setOkText(text);
    }

    cancelText(text: string) {
        this.layComp.lyRef.setCancelText(text);
    }

    onClose(callBack) {
        this.layComp.lyRef.setOnClose(callBack);
    }

    onOk(callBack) {
        this.layComp.lyRef.ok(callBack);
    }

    onCancel(callBack) {
        this.layComp.lyRef.cancel(callBack);
    }

    showCloseBtn(isShow: boolean) {
        this.layComp.lyRef.showCloseBtn(isShow || true)
    }

    close() {
        this.layComp.close();
    }

    ngOnInit(){
        this.templateContent = this.layComp['config'].message;
    }
}