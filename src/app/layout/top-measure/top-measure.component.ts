import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MeasureService } from 'src/app/shared/services/measure.service';

@Component({
  selector: 'app-top-measure',
  templateUrl: './top-measure.component.html',
  styleUrls: ['./top-measure.component.scss']
})
export class TopMeasureComponent implements OnInit {
topMeasureForm: FormGroup;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data, private measure: MeasureService,
  private dialog: MatDialogRef<TopMeasureComponent>) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.topMeasureForm = this.fb.group({
      measureName:['SELF', Validators.required],
      length:[''],
      shoulder:[''],
      sleeveLength:[''],
      chest:[''],
      hip:[''],
      crossFront:[''],
      crossBack:[''],
      neck:[''],
      cuff:[''],
      armRound:[''],
      collarStyle:[''],
      cuffStyle:[''],
      bottomRound:[true],
      bottomStright:[true],
      bottomSideSlit:[true],
      pocketOne:[false],
      pocketTwo:[false],
      pocketNill:[true],
      pocketV:[false],
      pocketChisel:[false],
      pocketRound:[false],
      pocketWithFlap:[true],
      fpPlain:[false],
      fpBox:[false],
      fpPlainFuse:[false],
      fpConcealed:[false],
      backPlain:[false],
      backSidePleat:[false],
      backBoxPleat:[false],
      backDart:[false],
      others:[],
      remarks:[]
  });
  }
  saveMeasure() {
    const measureDetails = {
      measureName: this.topMeasureForm.get('measureName').value,
      measureType: 'TOP',
      measureDetails: this.topMeasureForm.value,
      customerId: this.data.customerId
    };
    this.measure.saveMeasure(measureDetails).subscribe(data => {
      this.dialog.close();
    });
  }
  setValue(input, value) {
    this.topMeasureForm.get(input).setValue(value);
  }
}
