import { NgIf, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  simpleAsyncValidator,
  slowAsyncValidator,
  westernZipValidatorFactory
} from './asyncValidators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, JsonPipe]
})
export class AppComponent {
  inputFormGroup: FormGroup<{
    input: FormControl<string>;
    zip: FormControl<string>;
  }>;

  constructor(http: HttpClient, fb: NonNullableFormBuilder) {
    this.inputFormGroup = fb.group({
      input: ['', Validators.nullValidator, simpleAsyncValidator],
      zip: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.required
        ],
        [slowAsyncValidator, westernZipValidatorFactory(http)]
      ]
    });
  }

  onFormSubmit(): void {
    console.log('submitted', this.inputFormGroup.value);
  }

  logTheForm(): void {
    console.log('form', this.inputFormGroup);
  }
}
