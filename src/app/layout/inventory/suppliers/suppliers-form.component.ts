import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ selector: 'app-supplier-form', templateUrl: './suppliers-form.component.html' })
export class SupplierFormComponent implements OnInit {
  form: FormGroup;
  id: string;
  loading = false;

  constructor(private fb: FormBuilder, private svc: SupplierService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      supplierName: ['', Validators.required],
      contactPerson: [''],
      phone: [''],
      email: ['', Validators.email],
      address: [''],
      notes: [''],
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
    const obs = this.id ? this.svc.update(this.id, payload) : this.svc.create(payload);
    obs.subscribe(() => {
      this.loading = false;
      this.router.navigate(['/inventory/suppliers']);
    }, () => (this.loading = false));
  }
}
