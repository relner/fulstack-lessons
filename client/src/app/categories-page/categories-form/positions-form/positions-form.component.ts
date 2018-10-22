import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position, Message } from '../../../shared/interfaces'
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  positionId = null
  loading = false
  modal: MaterialInstance
  form: FormGroup

  constructor(private positionService: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

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
    this.positionId = position._id

    this.modal.open()
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    MaterialService.updateTextInputs()
  }

  onAddPosition(){
    this.positionId = null

    this.modal.open()
    this.form.reset({
      name: null,
      cost: null
    })
    MaterialService.updateTextInputs()
  }

  onCancel(){
    this.modal.close()
  }

  onSubmit(){
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const complited = () => {
      this.modal.close()
      this.form.enable()
      this.form.reset({name: '', cost: 0})
    }

    if(this.positionId){
      newPosition._id = this.positionId
      this.positionService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position

          MaterialService.toast('Position editet')
        },
        error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        },
        complited
      )
    } else {
      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position created')
          this.positions.push(position)
        },
        error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        },
        complited
      )
    }

  }

  onDeletePosition(event: Event, position: Position){
    event.stopPropagation()
    const decision = window.confirm('Are you shure to delete this position')

    if(decision){
      this.positionService.delete(position).subscribe(
        responce => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(responce.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }

}
