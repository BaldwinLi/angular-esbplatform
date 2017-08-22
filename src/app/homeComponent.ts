import { Component } from '@angular/core';
import { NgLayer, NgLayerRef } from "angular2-layer/angular2-layer";
import { assign } from 'lodash';
import { DataModelService } from './model/data-model';
import { UsersInfoService } from './services/UsersInfoService';
// import { initUser } from './services/common/CommonService';
import { Router } from '@angular/router';
import { isLocal } from './services/common/AppRequestService';
import { DialogComponent } from './common/components/DialogComponent';
// import { dates } from '..//lib/locales/i18n';
export let userInitialized: any;

@Component({
  selector: 'esb-app-root',
  templateUrl: 'templates/home.html',
  styleUrls: ['assets/css/index.css'],
  providers: [NgLayer, NgLayerRef, DataModelService]
})
export class homeComponent {
  private userName: string;
  private routeName: string = 'monitorhome';

  constructor(private layer: NgLayer, private layerRef: NgLayerRef, private dataModel: DataModelService, private userSvc: UsersInfoService, private router: Router) {
    let obj = this;

    window['esbLayer'] = (config: any) => {
      let overlay;
      if (!config) {
        config = {
          type: "tip",
          inSelector: "fallDown",
          outSelector: "rollOut",
          align: "center",
          parent: this,
          closeAble: true
        }
      } else {
        config = assign({
          type: "tip",
          inSelector: "fadeInDown",
          outSelector: "fadeOutDown",
          align: "center",
          parent: this,
          closeAble: true
        }, config);
      }

      switch (config.type) {
        case 'error':
          config.dialogComponent = DialogComponent;

          config.title = config.title || "异 常";
          overlay = obj.layer.dialog(config);
          // config.dialogComponent.setTemplate(config.message)
          break;
        case 'dialog':
          if (!config.dialogComponent) {
            console.error("Dialog Layer must be assigned dialogComponent.");
            return;
          }
          config.title = config.title || "消 息";
          overlay = obj.layer.dialog(config);
          break;
        case 'alert':
          config.title = config.title || "提 示";
          config.okText = config.okText || "确定";
          overlay = obj.layer.alert(config);
          break;
        case 'confirm':
          config.title = config.title || "确 认";
          config.cancelText = config.cancelText || "取消";
          config.okText = config.okText || "确定";
          overlay = obj.layer.confirm(config);
          break;
        case 'loading':
          config.message = config.message || "加载中...";
          config.isModal = config.isModal || true;
          config.inSelector = "jelly",
            config.outSelector = "jelly",
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

    window['loading'] = {
      loadingLayer: null,
      opened: false,
      startLoading: () => {
        // if (window['loading'].requestsCount < 0) window['loading'].requestsCount = 0;
        if (!window['loading'].opened) {
          setTimeout(() => {
            window['loading'].loadingLayer = window['esbLayer']({
              type: "loading"
            });
          });
          window['loading'].opened = true;
        }
      },
      finishLoading: () => {
        if (window['loading'].opened) {
          setTimeout(() => {
            window['loading'].loadingLayer.close();
          });
          window['loading'].opened = false;
        }
      }
    }

    // $.fn['datetimepicker'].dates['en'] = dates.cn;
  }

  private logout(evenet: any): void {
    window['esbLayer']({ type: 'confirm', message: '是否确认登出？' }).ok(() => {
      window.open(window.location.protocol + '//' + window.location.hostname + "/pkmslogout?filename=esbmonlogout.html", '_self');
    });
  }

  ngOnInit() {
    let obj = this;
    // 获取当前登录用户信息
    userInitialized = this.userSvc
      .UserLogin();
    // .queryUser('apptest05');
    userInitialized.subscribe(
      success => {
        window['currentUser'] = {
          user_code: success.body.user_code,
          user_name: success.body.user_name,
          is_admin: success.body.is_admin
        };
        obj.userName = success.body.user_name || 'N/A';
      },
      error => {
        window['esbLayer']({ type: 'error', message: error });
      }
    );
    obj.dataModel.init();
    this.$startWatchBreadcrumb();
  }

  private $startWatchBreadcrumb(): void {
    let obj = this;
    setInterval(() => {
      let availableRoutes = [
        'monitor',
        'monitorhome',
        'serviceslist',
        'servicedetail',
        'transactionhome',
        'transactionslist',
        'confighome',
        'mappingconfig',
        'serviceconfig',
        'subscribeconfig',
        'mdmconfig',
        'systemconfig',
        'contactsconfig',
        'myshare',
        'transactiondetail',
        'emailconfig',
        'errflowconfig'
      ];
      location.hash.replace('#', '').split(';').forEach((e, i) => {
        if (i > 0) {
          let key = e.split('=')[0], value = e.split('=')[1];
          obj.servicedetail_param_str[key] = value;
        }
      });
      let hashsplitArr = location.hash.replace('#', '').split(';')[0].split('/');
      let routesNames = hashsplitArr.filter((e) => {
        return availableRoutes.some((route) => route == e);
      });
      hashsplitArr.forEach((e, i) => {
        if (e == 'serviceslist') {
          // if (!obj.serviceslist_param_str)
          obj.serviceslist_param_str = hashsplitArr[i + 1] || '';
        }
      });
      obj.routeName = routesNames[routesNames.length - 1];
    }, 200);
  }

  private serviceslist_param_str: string = '';
  private servicedetail_param_str: any = {};
  private onSelectBreadcrumb(routName: string) {
    if (routName == 'serviceslist')
      this.router.navigate(['/monitor/serviceslist', this.serviceslist_param_str]);
    else if (routName == 'servicedetail')
      this.router.navigate(['/monitor/servicedetail', this.servicedetail_param_str]);
  }
}
