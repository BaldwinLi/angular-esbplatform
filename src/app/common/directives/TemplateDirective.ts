import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[beTemplate]' })
export class TemplateDirective {
    constructor(private er: ElementRef) {}

    
    @Input() click: any;
    @Input() mouseleave: any;
    @Input() mouseover: any;
    @Input() row: any;

    @HostListener('click') onClick() {
        this.click &&　this.click(this.row);
    }

    @HostListener('mouseover') onMouseover() {
        this.mouseover &&　this.mouseover(this.row);
    }

    @HostListener('mouseleave') onMouseleave() {
        this.mouseleave &&　this.mouseleave(this.row);
    }

    @Input() childElement: any;

    ngOnInit(){
        let node;
        try{
            node = $(this.childElement);
        }catch(e){
            node = $();
        };
        if(node.length == 0 && !!this.childElement) node = $(document.createTextNode(this.childElement));
        $(this.er.nativeElement).append(node);
    }
    

}