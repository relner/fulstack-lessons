import { OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Component } from "@angular/core";
import { AnalyticsService } from "../shared/services/analytics.service";
import { MaterialInstance, MaterialService } from "../shared/classes/material.service";
import { Observable } from "rxjs";
import { OverviewPage } from "../shared/interfaces";

@Component({
    selector: 'app-overview-page',
    templateUrl: './overview-page.component.html',
    styleUrls: ['./overview-page.component.css']
})

export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(private service: AnalyticsService){}

    @ViewChild('tapTarget') tapTargetRef: ElementRef
    tapTarget: MaterialInstance
    data$: Observable<OverviewPage>

    yesterday = new Date()

    ngOnInit(): void {
        this.data$ = this.service.getOverview()

        this.yesterday.setDate(this.yesterday.getDate() - 1)
    }

    ngAfterViewInit(): void {
        this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
    }

    ngOnDestroy(): void {
        this.tapTarget.destroy()
    }

    openInfo() {
        this.tapTarget.open()
    }
}