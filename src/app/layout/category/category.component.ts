 import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { AddcategoryComponent } from "../addcategory/addcategory.component";
import { CategoryService } from "src/app/shared/services/category.service";
import { debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: "app-category",
    templateUrl: "./category.component.html",
    styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
    tempCategoryList: any = [];
    private refreshSubject = new Subject<void>();
    query = new FormControl("");
    disableNext;
    index = 0;

    constructor(private dialog: MatDialog, private category: CategoryService) {}

    ngOnInit(): void {
        this.query.valueChanges.pipe(debounceTime(400)).subscribe((data) => {
            this.getAllCategory(data);
        });

        this.refreshSubject.pipe(debounceTime(400)).subscribe(() => {
            this.getAllCategory();
        });

        this.getAllCategory();
    }

    showCategoryDialog() {
        const dialogRef = this.dialog.open(AddcategoryComponent, {
            disableClose: true,
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(
            (result) => {
                console.log(`Dialog result: ${result}`);
                if (result) {
                    this.refreshSubject.next();
                }
            },
            (error) => {
                console.error(`Dialog error: ${error}`);
            }
        );
    }

    editCategory(category) {
        this.dialog
            .open(AddcategoryComponent, {
                disableClose: true,
                width: "400px",
                data: category,
            })
            .afterClosed()
            .subscribe((data) => {
                this.getAllCategory();
            });
    }

    getAllCategory(query: string = "") {
        this.disableNext = false;
        this.category.getAllCategory(this.index, query).subscribe(
            (data) => {
                this.tempCategoryList = data;
                if (data && (data as any).length < 1) {
                    this.disableNext = true;
                }
            },
            (error) => {
                console.error("Error fetching categories:", error);
            }
        );
    }
}
