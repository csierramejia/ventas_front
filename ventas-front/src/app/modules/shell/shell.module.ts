import { NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedCommonModule } from './../shared/shared-common.module';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ShellComponent } from './shell/shell.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menus/menu/menu.component';
import { ContentComponent } from './content/content.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MenuCarritoComponent } from './menus/menu-carrito/menu-carrito.component';



/**
 * Modulo que contiene todos los componentes y modulos que define
 * el esqueleto de la aplicacion web de ADMIN
 */
@NgModule({
  imports: [
    SharedCommonModule,
    MenuModule,
    SidebarModule,
    PanelMenuModule,
    MessagesModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
  ],
  declarations: [
    ShellComponent,
    HeaderComponent,
    ContentComponent,
    MenuComponent,
    MenuCarritoComponent,
    BreadcrumbComponent
  ],
  exports: [
    ShellComponent
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class ShellModule {}
