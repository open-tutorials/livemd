import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AVATARS } from 'src/consts';
import { MeManager } from 'src/managers/me.manager';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

  avatars = AVATARS;

  avatarControl = this.fb.control(null, [Validators.required]);
  form = this.fb.group({
    avatar: this.avatarControl,
    name: [null, [Validators.required]]
  });

  @ViewChild('nameRef', {read: ElementRef})
  nameRef!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder,
              private meManager: MeManager,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    const {me} = this.meManager;
    if (me.confirmed) {
      this.form.patchValue({
        avatar: me.avatar,
        name: me.name
      });
    }
  }

  ngAfterViewInit() {
    this.nameRef.nativeElement.focus();
  }

  join() {
    const {avatar, name} = this.form.getRawValue();
    const {me} = this.meManager;
    Object.assign(me, {avatar, name, confirmed: true});
    this.meManager.save();

    this.router.navigate(['join'], {relativeTo: this.route});
  }

}
