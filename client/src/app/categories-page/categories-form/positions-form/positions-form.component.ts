import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position } from '../../../shared/interfaces'
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  loading = false
  modal: MaterialInstance

  constructor(private positionService: PositionsService) { }

  ngOnInit() {
    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      this.loading = false
      this.positions = positions
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position){
    this.modal.open()
  }

  onAddPosition(){
    this.modal.open()
  }

  onCancel(){
    this.modal.close()
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }

}
