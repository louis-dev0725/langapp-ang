import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit {

  restoreForm: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.restoreForm = this.formBuilder.group({
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}]
    })
  }

  checkError() {
    return !this.restoreForm.controls['email'].valid && this.restoreForm.controls['email'].touched;
  }

  emailErrors(): string {
    // todo: [SHR]: translate errors
    const eml = this.restoreForm.get('email');
    return eml.hasError('required') ? 'Field is required' :
      eml.hasError('email') ? 'Not a valid email' : '';
  }
}
