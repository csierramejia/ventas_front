import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ROUTES } from './app-routing';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './directives/spinner/spinner.component';
import { AutenticacionGuard } from './auth-guard/autenticacion.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectivePreload } from './directives/preload/selective-preload';
import { PrivilegiosGuard } from './auth-guard/privilegios.guard';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
/**
 * Modulo principal de la aplicacion, contiene
 * todos los componentes y modulos de inicio
 */
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    RouterModule.forRoot(ROUTES, { preloadingStrategy: SelectivePreload }),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    SelectivePreload,
    AutenticacionGuard,
    PrivilegiosGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
