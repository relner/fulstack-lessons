import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Filter } from 'src/app/shared/interfaces';
import { MaterialService, MaterialDatePicker } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()

  constructor() { }
  order: number
  @ViewChild('start') startRef: ElementRef
  @ViewChild('end') endRef: ElementRef

  start: MaterialDatePicker
  end: MaterialDatePicker

  isValid = true

  ngOnInit() {
  }

  submitFilter() {
    const filter: Filter = {}
    if(this.order) filter.order = this.order
    if(this.start.date) filter.start = this.start.date
    if(this.end.date) filter.end = this.end.date

    this.onFilter.emit(filter)
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    if(!this.start.date || !this.end.date) {
      this.isValid = true
      return
    }

    this.isValid = this.start.date < this.end.date
  }

  ngOnDestroy(): void {
    this.start.destroy()
    this.end.destroy()
  }

}
