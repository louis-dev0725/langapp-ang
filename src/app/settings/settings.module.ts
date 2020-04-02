import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { ProfileComponent } from '@app/settings/profile/profile.component';
import { SettingsRoutingModule } from '@app/settings/settings-routing.module';
import { SettingsComponent } from '@app/settings/settings.component';
import { PluginComponent } from './plugin/plugin.component';

@NgModule({
  declarations: [
    ProfileComponent, SettingsComponent, PluginComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule, TranslateModule, RouterModule, FormsModule, SettingsRoutingModule, SharedModule
  ]
})
export class SettingsModule {}
