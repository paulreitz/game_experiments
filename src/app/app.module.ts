import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { TitleComponent } from './components/title/title.component';
import { RoutingComponent } from './components/routing/routing.component';
import { CreditsComponent } from './modals/credits/credits.component';
import { HudComponent } from './components/hud/hud.component';

@NgModule({
    declarations: [
        // prettier-ignore
        AppComponent,
        GameComponent,
        TitleComponent,
        RoutingComponent,
        CreditsComponent,
        HudComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatDialogModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
