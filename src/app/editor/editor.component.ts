import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { deserialize, serialize } from 'serialize-ts';
import { PREVIEW_TUTORIAL_KEY } from 'src/consts';
import { Tutorial } from 'src/models/tutorial';
import { LocalstorageService } from 'src/services/local-storage.service';
import { getEndpoint } from 'src/utils';

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

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private localStorage: LocalstorageService) {

  }

  ngOnInit() {
    const json = this.localStorage.getItem(PREVIEW_TUTORIAL_KEY);
    if (!!json) {
      const tutorial = deserialize(JSON.parse(json), Tutorial);
      this.form.patchValue(tutorial);
    } else {
      const endpoint = getEndpoint('example');
      this.http.get(endpoint + '?rand=' + Math.random(), {responseType: 'text'})
        .subscribe(markdown => this.form.patchValue({markdown}));
    }
  }

  preview() {
    if (this.form.valid) {
      const tutorial = new Tutorial(this.form.getRawValue());
      this.localStorage.setItem(PREVIEW_TUTORIAL_KEY, JSON.stringify(serialize(tutorial)));
      this.router.navigate(['preview'], {relativeTo: this.route});
    }
  }

}
