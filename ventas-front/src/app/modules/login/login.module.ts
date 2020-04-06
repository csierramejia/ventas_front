import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedCommonModule } from './../shared/shared-common.module';
import { LoginComponent } from './login-component/login.component';

/**
 * Modulo para la autenticacion del sistema
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent
      }
    ]),
    SharedCommonModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule {}
