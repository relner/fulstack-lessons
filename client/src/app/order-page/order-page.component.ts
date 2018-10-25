import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MaterialService, MaterialInstance } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrderPosition, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  oSub: Subscription
  isRoot: boolean
  pending: boolean = false

  constructor(private router: Router,
              private order: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  open() {
    this.modal.open()
  }

  cancel(){
    this.modal.close()
  }

  submit(){

    this.pending = true

    const myOrder: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }

    this.oSub = this.ordersService.create(myOrder).subscribe(
      newOrder => {
        MaterialService.toast(`Order ${newOrder.order} created`)
        this.order.cleare()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.pending = false
      },
      () => {
        this.modal.close()
        this.pending = false
      }
    )

    
  }

  ngOnDestroy(): void {
    this.modal.destroy()
    if(this.oSub) this.oSub.unsubscribe()
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  removePosition(orderPosition: OrderPosition){
    this.order.remove(orderPosition)
  }



}
