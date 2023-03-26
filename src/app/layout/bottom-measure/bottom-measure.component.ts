import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MeasureService } from 'src/app/shared/services/measure.service';

@Component({
  selector: 'app-bottom-measure',
  templateUrl: './bottom-measure.component.html',
  styleUrls: ['./bottom-measure.component.scss']
})
export class BottomMeasureComponent implements OnInit {
  bottomMeasureForm: FormGroup;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data, private measure: MeasureService,
  private dialog: MatDialogRef<BottomMeasureComponent>) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.bottomMeasureForm = this.fb.group({
      measureName:['SELF', Validators.required],
      length:[''],
      inseam:[''],
      croatch:[''],
      waist:[''],
      hip:[''],
      thigh:[''],
      knee:[''],
      bottom:[''],
      flow:[''],
      beltCut:[''],
      beltLong:[''],
      beltHook:[''],
      beltButton:[true],
      beltSquare:[true],
      beltRound:[true],
      beltVshape:[false],
      pleatSingle:[false],
      pleatDouble:[false],
      pleatFlat:[false],
      fpCross:[false],
      fpStright:[false],
      fpLpocket:[false],
      fpMobile:[false],
      fpCoin:[false],
      bpOne: [false],
      bpTwo: [false],
      bpNone: [false],
      bottomPlain: [false],
      bottomShoeShape: [false],
      bottomTurnUp: [false],
      fitRegular:[false],
      fitSlim:[false],
      fitTaperd:[false],
      loopBts:[false],
      kaajBts:[false],
      flap:[false],
      liningKnee:[false],
      liningCalf:[false],
      liningFull:[false],
      loops:[''],
      loopSize:[''],
      remarks:[]
  });
  }
  setValue(input, value) {
    this.bottomMeasureForm.get(input).setValue(value);
  }
  saveMeasure() {
    const measureDetails = {
      measureName: this.bottomMeasureForm.get('measureName').value,
      measureType: 'BOTTOM',
      measureDetails: this.bottomMeasureForm.value,
      customerId: this.data.customerId
    };
    this.measure.saveMeasure(measureDetails).subscribe(data => {
      this.dialog.close();
    });
  }
}
