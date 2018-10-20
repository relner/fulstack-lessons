import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('imgInput') inputRef: ElementRef

  form: FormGroup
  image: File
  isNew = true
  imagePreview: string | ArrayBuffer;
  category: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    /*
    this.route.params.subscribe((params: Params) => {
      if(params['id']){
        //edit form
        this.isNew = false
      }
    })
    */

    this.form.disable()

    this.route.params.pipe(
      switchMap(
        (params: Params) => {
          
          if(params['id']){
            this.isNew = false
            return this.categoriesService.getById(params['id'])
          }

          return of(null)
        }
      )
    ).subscribe(
      (category: Category) => {
        if(category){
          this.form.patchValue({
            name: category.name
          })
          this.imagePreview = category.imageSrc
          MaterialService.updateTextInputs()
          this.category = category
        }

        this.form.enable()
      },
      error => {MaterialService.toast(error.error.message)}
    )

  }

  triggerClick(){
    this.inputRef.nativeElement.click()
  }

  deleteCategory(){
    const decision = window.confirm(`Are you shure delete ${this.category.name}`)
    if(decision){
      this.categoriesService.delete(this.category._id).subscribe(
        responce => MaterialService.toast(responce.message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/categories'])
      )
    }
  }

  onFileUpload(event: any){
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit(){
    let obs$
    this.form.disable()
    if(this.isNew){
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Changes saved!!!')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
