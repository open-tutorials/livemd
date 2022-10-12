import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MARKDOWN } from 'src/consts';
import { ChannelsService } from 'src/services/channels.service';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateChannelComponent implements OnInit {

  markdown = MARKDOWN;

  form = this.fb.group({
    markdown: [MARKDOWN, Validators.required],
    baseUrl: ['https://github.com/{your_repository}/blob/main/'],
    imagesUrl: ['https://raw.githubusercontent.com/{your_repository}/main'],
    slug: [null],
    locked: [false]
  });

  constructor(private fb: FormBuilder,
              private channelsService: ChannelsService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const baseUrl = localStorage['baseUrl'];
    if (!!baseUrl) {
      this.form.patchValue({baseUrl});
    }

    const imagesUrl = localStorage['imagesUrl'];
    if (!!imagesUrl) {
      this.form.patchValue({imagesUrl});
    }

    const slug = localStorage['slug'];
    if (!!slug) {
      this.form.patchValue({slug});
    }
  }

  create() {
    const {markdown, baseUrl, imagesUrl, slug, locked} = this.form.getRawValue();
    this.channelsService.create(markdown, baseUrl, imagesUrl, slug, locked)
      .subscribe(({id}) => {
        this.router.navigate([id],
          {relativeTo: this.route});
      });

    localStorage.setItem('baseUrl', baseUrl);
    localStorage.setItem('imagesUrl', imagesUrl);
    if (!!slug) {
      localStorage.setItem('slug', slug);
    } else {
      localStorage.removeItem('slug');
    }
  }

}
