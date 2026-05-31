import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { AboutUs } from './about-us/about-us';
import { Portfolio } from './portfolio/portfolio';
import { Prices } from './prices/prices';
import { Footer } from './footer/footer';
import{ HeroParticlesComponent} from './hero-particles/hero-particles';
import {Waves} from './waves/waves'
import {QuickContact} from './quick-contact/quick-contact'


export const routes: Routes = [

    {path: 'contact', component: Contact},
    {path: 'about-us', component: AboutUs},
    {path: 'portfolio', component: Portfolio},
    {path: 'prices', component: Prices},
    {path: 'footer', component: Footer},
    {path: 'particles',component: HeroParticlesComponent},
    {path: 'waves', component: Waves}, 
    {path: 'quick-contact', component: QuickContact}
];
