import { Routes } from '@angular/router';
import { RegisterComponent } from './components/registerform/registerform.component';
import { LoginPageComponent } from './components/loginpage/loginpage.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutComponent } from './components/about/about.component';
import { FaqComponent } from './components/faq/faq.component';
import { ProfilepageComponent } from './components/profilepage/profilepage.component';
import { MytripsComponent } from './components/mytrips/mytrips.component';  
import { PosttravelComponent } from './components/posttravel/posttravel.component';


export const routes: Routes = [

    { path: 'homepage', component: HomepageComponent},
    { path: 'profile', component: ProfilepageComponent},
    { path: 'loggingin', component: LoginPageComponent },
    { path: 'registration', component: RegisterComponent},
    { path: 'mytrips', component: MytripsComponent},
    { path: 'about', component:AboutComponent},
    { path: 'FAQ', component:FaqComponent},
    { path: '', redirectTo: '/homepage', pathMatch: 'full'},
    { path: 'posttravel', component: PosttravelComponent},
];
