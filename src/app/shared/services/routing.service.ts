import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Route } from '../enums/route';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RoutingService {
    route: Route = Route.MENU;
    private routeSource = new Subject<Route>();
    route$ = this.routeSource.asObservable();

    constructor() {
        if (environment.env === 'sandbox') {
            this.route = Route.GAME;
        }
    }

    navigate(route: Route): void {
        this.route = route;
        this.routeSource.next(route);
    }
}
