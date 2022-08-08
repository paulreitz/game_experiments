import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Route } from '../../shared/enums/route';
import { RoutingService } from '../../shared/services/routing.service';

@Component({
    selector: 'app-routing',
    templateUrl: './routing.component.html',
    styleUrls: ['./routing.component.scss'],
})
export class RoutingComponent implements OnInit, OnDestroy {
    route: Route = Route.MENU;
    routes = Route;

    private ngUnsubscribe$ = new Subject<void>();

    constructor(private routingService: RoutingService) {
        this.route = routingService.route;
    }

    ngOnInit(): void {
        this.routingService.route$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((route: Route) => {
            this.route = route;
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
