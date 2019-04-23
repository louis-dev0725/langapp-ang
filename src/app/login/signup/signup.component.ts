import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

  }

  getTimezone() {

  }

  getLanguage() {

  }

  getInvatedId(): number | boolean {
    return  false;
  }
}
