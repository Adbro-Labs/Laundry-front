import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ selector: 'app-inventory-item-form', templateUrl: './items-form.component.html' })
export class InventoryItemFormComponent implements OnInit {
  form: FormGroup;
  id: string;
  loading = false;
  units = ['Kg', 'Gram', 'Liter', 'Piece', 'Box', 'Roll'];

  constructor(private fb: FormBuilder, private svc: InventoryItemService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      itemName: ['', Validators.required],
      itemCode: ['', Validators.required],
      unit: ['', Validators.required],
      description: [''],
      minimumStockLevel: [0, [Validators.required, Validators.min(0)]],
    });

    this.id = this.route.snapshot.params['id'];
    if (this.id) this.load();
  }

  load() {
    this.loading = true;
    this.svc.getById(this.id).subscribe((res: any) => {
      const data = res.data || res;
      this.form.patchValue(data);
      this.loading = false;
    }, () => (this.loading = false));
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value;
    const obs = this.id ? this.svc.create(payload) : this.svc.create(payload);
    obs.subscribe(() => {
      this.loading = false;
      this.router.navigate(['/inventory/items']);
    }, () => (this.loading = false));
  }
}
