import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registerform/registerform.component';
import { LoginPageComponent } from './components/loginpage/loginpage.component';
import { HomepageComponent } from './components/homepage/homepage.component';


export const routes: Routes = [

    { path: 'homepage', component: HomepageComponent},
    { path: 'loggingin', component: LoginPageComponent },
    { path: 'registration', component: RegistrationComponent},
    { path: '', redirectTo: '/homepage', pathMatch: 'full'},
];
