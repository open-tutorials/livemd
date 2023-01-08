import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { deserialize, serialize } from 'serialize-ts';
import { PREVIEW_TUTORIAL_KEY } from 'src/consts';
import { Tutorial } from 'src/models/tutorial';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  form = this.fb.group({
    title: ['Tutorial'],
    markdown: [null, Validators.required],
    baseUrl: ['https://github.com/your_login/repo_name/blob/main', Validators.required],
    assetsUrl: ['https://raw.githubusercontent.com/your_login/repo_name/main', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    const json = localStorage.getItem(PREVIEW_TUTORIAL_KEY);
    if (!!json) {
      const tutorial = deserialize(JSON.parse(json), Tutorial);
      this.form.patchValue(tutorial);
    }
  }

  preview() {
    if (this.form.valid) {
      const tutorial = new Tutorial(this.form.getRawValue());
      localStorage.setItem(PREVIEW_TUTORIAL_KEY, JSON.stringify(serialize(tutorial)));
      this.router.navigate(['preview'], {relativeTo: this.route});
    }
  }

}
