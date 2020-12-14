import { CategoryService } from './../service/category.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @ViewChild('category') nameField: ElementRef;

  color: Array<string> = ['#e7845e', '#fc0184', '#f6b93f', '#9224a7', '#20c898', '#f03734', '#aad450', '#026467', '#fefefe', '#928779',
    '#D4D2A5', '#FCDEBE', '#90A583', '#B26E63', '#C6CAED'];

  categories: Array<any>;
  categoryName = '';
  dataStatus = 'Add';
  categoryId: string;

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.loadCategories().subscribe(result => {
      this.categories = result;
    });

  }

  onSubmit(f: NgForm): void {
    if (this.dataStatus === 'Add') {
      const randomNumber = Math.floor(Math.random() * this.color.length);
      const todoCategory = {
        category: f.value.categoryName,
        colorCode: this.color[randomNumber],
        todoCount: 0
      };
      this.categoryService.saveCategory(todoCategory);
      f.resetForm('');
    } else {
      this.categoryService.updateCategory(this.categoryId, f.value.categoryName);
      f.resetForm('');
      this.dataStatus = 'Add';
    }

  }

  onEdit(category: string, id: string, f: FormGroup) {
      this.categoryName = category;
      this.dataStatus = 'Edit';
      this.categoryId = id;
      this.nameField.nativeElement.focus();
  }

  onDelete(id: string) {
    this.categoryService.deleteCategory(id);
  }
}
