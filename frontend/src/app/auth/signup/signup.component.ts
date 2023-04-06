import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';

import * as jstz from 'jstz';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { SessionService } from '@app/services/session.service';
import { allParams } from '@app/shared/helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuItem } from 'primeng/api';
import skillLevel from '@iconify/icons-carbon/skill-level';
import skillLevelBasic from '@iconify/icons-carbon/skill-level-basic';
import skillLevelIntermediate from '@iconify/icons-carbon/skill-level-intermediate';
import skillLevelAdvanced from '@iconify/icons-carbon/skill-level-advanced';
import { Category } from '@app/interfaces/common.interface';
import { TreeNode } from 'primeng/api';
import { getCountryForTimezone } from 'countries-and-timezones';
import { PhoneNumberFormat } from 'ngx-intl-tel-input';
import { IconService } from '@visurel/iconify-angular';
import { icons as flagIcons } from '@iconify-json/flag';

@UntilDestroy()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: UntypedFormGroup;
  errors: any[] = [];
  quickSignup = true;

  icons = {
    skillLevel,
    skillLevelBasic,
    skillLevelIntermediate,
    skillLevelAdvanced,
  };

  steps: MenuItem[] = [
    {
      label: 'Japanese Level',
    },
    {
      label: 'Topics',
    },
    {
      label: 'Native language',
    },
    {
      label: 'E-mail',
    },
  ];

  levels: MenuItem[] = [
    {
      label: "I'm new to Japanese",
      icon: 'skillLevel',
    },
    {
      label: 'Beginner',
      icon: 'skillLevelBasic',
    },
    {
      label: 'Intermediate',
      icon: 'skillLevelIntermediate',
    },
    {
      label: 'Advanced',
      icon: 'skillLevelAdvanced',
    },
  ];

  activeStep = 2;

  languageToLearn = 'ja';
  categories: Category[];
  availableLanguages = [];
  selectedLanguages = [];
  languageOptions = [];
  languageSearch: string = '';

  timezone: string;
  country: string;
  PhoneNumberFormat = PhoneNumberFormat;
  openLangSelectModal = false;

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private sessionService: SessionService, iconService: IconService) {
    iconService.registerAll(flagIcons.icons);
  }

  ngOnInit() {
    this.timezone = this.detectTimezone();
    this.country = getCountryForTimezone(this.timezone).id.toLowerCase();
    this.signupForm = this.formBuilder.group(
      {
        //timezone: [this.getTimezone() || ''],
        //language: [this.getLanguage() || ''],
        //invitedByUserId: [this.getInvitedByUserId() || ''],
        name: ['', { validators: [Validators.required], updateOn: 'change' }],
        //company: [''],
        telephone: [''],
        email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
        password: ['', { validators: [Validators.required], updateOn: 'change' }],
        passrepeat: ['', { validators: this.quickSignup ? [] : [Validators.required], updateOn: 'change' }],
        level: [''],
        languages: [''],
        favoriteCategoryId: [''],
      },
      {
        validators: this.quickSignup ? [] : [CustomValidator.confirmPasswordCheck],
      }
    );
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      if (params['email']) {
        this.signupForm.get('email').setValue(params['email']);
      }
    });
    this.api.getAllCategories({ 'per-page': '100' }).subscribe((c) => {
      this.categories = c.items;
    });
    this.api.getAllLanguage().subscribe((languages) => {
      this.availableLanguages = languages.items.map(
        (l: any): TreeNode => ({
          label: l.title,
          data: l.code,
        })
      );
      this.languageOptions = this.availableLanguages.filter((item) => !this.selectedLanguages.find((selectedItem) => selectedItem.label === item.label));

      // Move current browser language to the top
      let browserLangs = window.navigator.languages ?? [window.navigator.language];
      let newLanguages = [];
      for (let browserLang of browserLangs) {
        let browserLang2 = browserLang.substring(0, 2);
        if (browserLang != this.languageToLearn || browserLang2 != this.languageToLearn) {
          let langIndex = this.availableLanguages.findIndex((l) => l.data == browserLang);
          if (langIndex == -1) {
            langIndex = this.availableLanguages.findIndex((l) => l.data == browserLang2);
          }
          if (langIndex !== -1) {
            let langValue = this.availableLanguages.splice(langIndex, 1)[0];
            this.availableLanguages.splice(newLanguages.length, 0, langValue);
            newLanguages.push(langValue);
          }
        }
      }
      console.log('newLanguages:', newLanguages);
      this.signupForm.get('languages').setValue(newLanguages.map((l) => l.data));
      this.selectedLanguages = newLanguages;
    });
  }

  setValue(fieldName: string, value: any, moveToNextStep = true) {
    this.signupForm.get(fieldName).setValue(value);
    if (moveToNextStep) {
      this.activeStep++;
    }
  }

  nextStep() {
    console.log
    this.activeStep++;
  }

  clickedOnCategory(category: Category) {
    let categoryId = category.id;
    let selectedCategories = this.signupForm.controls.favoriteCategoryId.value;
    if (selectedCategories.indexOf(categoryId) !== -1) {
      this.signupForm.controls.favoriteCategoryId.setValue(selectedCategories.filter((c: number) => c != categoryId));
    } else {
      this.signupForm.controls.favoriteCategoryId.setValue([...selectedCategories, categoryId]);
    }
  }

  detectTimezone() {
    let timezone = Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone;
    if (!timezone) {
      const tz = jstz.determine();
      timezone = tz.name();
    }
    return timezone;
  }

  getLanguage() {
    return this.sessionService.language;
  }

  getInvitedByUserId(): number {
    const val = parseInt(this.cookieService.get('invitedByUserId'));
    return val;
  }

  onSubmit() {
    this.errors = [];
    const data = {
      ...this.signupForm.value,
      invitedByUserId: this.getInvitedByUserId(),
      language: this.getLanguage(),
      timezone: this.timezone,
      telephone: this.signupForm.get('telephone').value?.e164Number,
    };
    this.api.signUp(data).subscribe((res) => {
      if (res instanceof ApiError) {
        this.errors = res.error;
      } else {
        this.router.navigate(['/payment']);

        window.postMessage({ type: 'LoginSuccess', text: 'Login' }, '*');
      }
    });
  }

  getErrors(fieldName: string): string {
    return this.customValidator.getErrors(this.signupForm, fieldName);
  }

  checkError(fieldName: string) {
    let field = this.signupForm.get(fieldName);
    console.log(fieldName, { dirty: field.dirty, touched: field.touched });
    return field.touched && !field.valid;
  }

  onChangeLangSelectModal(value: boolean) {
    this.openLangSelectModal = value;
  }

  onSearchLanguages() {
    if (this.languageSearch === '') {
      this.languageOptions = this.availableLanguages.filter((item) => !this.selectedLanguages.find((selectedItem) => selectedItem.label === item.label));
    } else {
      this.languageOptions = this.availableLanguages.filter((item) => !this.selectedLanguages.find((selectedItem) => selectedItem.label === item.label)).filter((item) => item.label.toLowerCase().includes(this.languageSearch.toLowerCase()));
    }
  }

  clearLangSearch() {
    this.languageSearch = '';
    this.languageOptions = this.availableLanguages;
  }
  onSelectLanguage(label) {
    const selectedLangItem = this.languageOptions.find((item) => item.label === label);
    this.selectedLanguages = [...this.selectedLanguages, selectedLangItem];
    this.languageOptions = this.availableLanguages.filter((item) => !this.selectedLanguages.find((selectedItem) => selectedItem.label === item.label));
    this.signupForm.get('languages').setValue(this.selectedLanguages.map((l) => l.data));
    this.openLangSelectModal = false;
  }
  removeItemFromSelected(label) {
    this.selectedLanguages = this.selectedLanguages.filter((item) => item.label !== label);
    this.languageOptions = this.availableLanguages.filter((item) => !this.selectedLanguages.find((selectedItem) => selectedItem.label === item.label));
  }
  isIconExist(iconLabel) {
    return !!flagIcons.icons[`${iconLabel}-4x3`];
  }
}
