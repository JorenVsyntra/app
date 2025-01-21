import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registerform/registerform.component';
import { LoginPageComponent } from './components/loginpage/loginpage.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutComponent } from './components/about/about.component';
import { FaqComponent } from './components/faq/faq.component';


export const routes: Routes = [

    { path: 'homepage', component: HomepageComponent},
    { path: 'loggingin', component: LoginPageComponent },
    { path: 'registration', component: RegistrationComponent},
    { path: 'about', component:AboutComponent},
    { path: 'FAQ', component:FaqComponent},
    { path: '', redirectTo: '/homepage', pathMatch: 'full'},
];
