import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { ApiService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  public form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.generateForm();
  }

  private generateForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      sku: ["", [Validators.required]],
      cost: ["", [Validators.required]],
      profile: ["furniture", [Validators.required]],
    });
  }

  public submit(): void {
    if (this.form.invalid) return;
    const body = this.form.value;
    body.profile = { type: body.profile };
    console.log(body);
  }
}
