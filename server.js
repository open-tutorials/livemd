const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const path = require('path');
const fs = require('fs');
const adler = require('adler-32');
const {merge} = require('lodash');
const http = require('https');
const xml = require('xml');

class Channel {
  id;
  members = {};
  polls = {};

  constructor(defs = {}) {
    Object.assign(this, defs);
  }
}

const channels = {};

class Heap {
  channel;
  member;

  constructor(defs = {}) {
    Object.assign(this, defs);
  }
}

const heaps = {};

function getChannelFolder(id) {
  const [, p1, p2,] = id.match(/^(.{2})(.{2})/i);

  const c1 = adler.str(p1) % 10;
  const c2 = adler.str(p2) % 10;

  return path.resolve(process.env.DEV_MODE ? 'channels' : '/var/run/app', c1.toString(), c2.toString());
}

function getChannelFile(id) {
  const folder = getChannelFolder(id);
  console.debug('channel folder =', folder);
  return path.resolve(folder, id + '.json');
}

function loadChannel(id) {
  let channel;
  const file = getChannelFile(id);
  if (fs.existsSync(file)) {
    // we need deserialization
    channel = JSON.parse(fs.readFileSync(file, {encoding: 'utf8'}));
    // for transition period
    delete channel['markdown'];
    delete channel['baseUrl'];
    delete channel['imagesUrl'];
    delete channel['owner'];
    delete channel['progress'];
    delete channel['opened'];
    delete channel['comments'];
    delete channel['marks'];
  } else {
    channel = new Channel({id});
  }
  channels[id] = channel;
  return channel;
}

function saveChannel(channel) {
  const file = getChannelFile(channel.id);
  const folder = path.dirname(file);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {recursive: true});
  }

  fs.writeFileSync(file, JSON.stringify(channel, null, 2), {encoding: 'utf8'});
}

function getHeapFile(channel, member) {
  const folder = path.resolve(getChannelFolder(channel), channel);
  console.debug('heap folder =', folder);
  return path.resolve(folder, member + '.json');
}

function loadHeap(channel, member) {
  let heap;
  const file = getHeapFile(channel, member);
  if (fs.existsSync(file)) {
    // we need deserialization
    heap = JSON.parse(fs.readFileSync(file, {encoding: 'utf8'}));
  } else {
    heap = new Heap({channel, member});
  }

  if (!heaps[channel]) {
    heaps[channel] = {};
  }

  heaps[channel][member] = heap;
  return heap;
}

function saveHeap(heap) {
  console.log('save heap =', heap);
  const file = getHeapFile(heap.channel, heap.member);
  const folder = path.dirname(file);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {recursive: true});
  }

  fs.writeFileSync(file, JSON.stringify(heap, null, 2), {encoding: 'utf8'});
}

let dirty = {
  channels: {},
  heaps: {}
};

function saveDirty() {
  {
    const save = Object.values(dirty.channels);
    console.log('save dirty channels', save.map(c => c.id));
    save.forEach(channel => saveChannel(channel));
  }

  {
    const save = Object.values(dirty.heaps);
    console.log('save dirty heaps', save.map(c => c.member));
    save.forEach(heap => saveHeap(heap));
  }
  dirty = {
    channels: {},
    heaps: {}
  };

  setTimeout(saveDirty, 5000);
}

saveDirty();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'eu',
  useTLS: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.get('/api/example', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'example.md'));
});


let TUTORIALS;
const INDEX_URL = 'https://raw.githubusercontent.com/open-tutorials/cypress/main/index.json';

function loadIndex() {
  console.log('load index', INDEX_URL);
  return new Promise(done => {
    http.request(INDEX_URL, resp => {
      resp.setEncoding('utf8');
      const chunks = [];
      resp.on('data', (chunk) => {
        chunks.push(chunk);
      });
      resp.on('end', () => {
        TUTORIALS = JSON.parse(chunks.join(''));
        console.log('loaded index');
        done();
      });
    }).end();
  });
}

function loadTutorial(tutorial) {
  console.log('load tutorial', tutorial.source);
  return new Promise((done) => {
    loadURL(tutorial.source).then(markdown => {
      const queue = [];

      const matches = markdown.matchAll(/\<import\sfrom\=\"([a-zA-Z0-9\/\_\-\.]+)\">/g);
      for (const match of matches) {
        const [replace, path] = match;
        const url = tutorial.assetsUrl + path;
        console.log('load partial', url);
        queue.push(new Promise((done) => {
          loadURL(url).then(data => done({replace, data}));
        }));
      }

      Promise.all(queue).then((partials) => {
        for (const {replace, data} of partials) {
          console.log('replace partial', replace);
          markdown = markdown.replace(replace, data);
        }
        done(markdown);
      });
    });
  });
}

function loadURL(url) {
  console.log('load URL', url);
  return new Promise((done) => {
    http.request(url + '?r=' + Math.random(), resp => {
      resp.setEncoding('utf8');
      const chunks = [];
      resp.on('data', (chunk) => {
        chunks.push(chunk);
      });
      resp.on('end', () => {
        done(chunks.join(''));
      });
    }).end();
  });
}

function fullReload() {
  loadIndex().then(() => {
    const slugs = Object.keys(TUTORIALS.tutorials);
    slugs.forEach(slug => {
      const tutorial = TUTORIALS.tutorials[slug];
      loadTutorial(tutorial)
        .then(markdown => tutorial.markdown = markdown);
    });
  });
}

fullReload();

app.get('/api/utils/flush', (req, res) => {
  fullReload();
  res.status(200).send('ok');
});

app.get('/api/tutorials/:slug', (req, res) => {
  const {slug} = req.params;
  const tutorial = TUTORIALS.tutorials[slug];
  if (!!tutorial.markdown) {
    res.send(tutorial);
    return;
  }

  loadTutorial(tutorial.source)
    .then(markdown => {
      tutorial.markdown = markdown;
      res.send(tutorial);
    });
});

app.post('/api/channels/:id/auth', (req, res) => {
  const id = req.params.id;
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  const {authorization} = req.headers;
  const [member, secret] = authorization.split(' ');

  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  const socketId = req.body.socket_id;
  const channelName = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channelName);
  res.send(auth);
});

app.post('/api/channels/:id/join', (req, res) => {
  const {id} = req.params;
  const channel = channels[id] || loadChannel(id);

  const {authorization} = req.headers;
  const [me, secret] = authorization.split(' ');

  const {name, avatar} = req.body;
  const changes = {
    members: {
      [me]: {name, avatar}
    }
  }
  merge(channel, changes);
  pusher.trigger(channel.id, 'channel_updated', {member: me, changes});

  res.send(channel);

  dirty.channels[channel.id] = channel;
});

app.get('/api/tutorials/:tutorial/heaps/:member', (req, res) => {
  const {tutorial, member} = req.params;
  // checkSecret(channel, member);
  res.send(heaps[tutorial]?.[member] || loadHeap(tutorial, member));
});

app.post('/api/tutorials/:tutorial/heaps/:member', (req, res) => {
  const {tutorial, member} = req.params;
  // checkSecret(channel, member);
  let heap = heaps[tutorial]?.[member] || loadHeap(tutorial, member);
  merge(heap, req.body);
  res.status(200).send();

  dirty.heaps[heap.id] = heap;
});

app.post('/api/channels/:id/polls/:poll/vote', (req, res) => {
  const {id, poll} = req.params;

  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  if (!channel.polls[poll]) {
    channel.polls[poll] = {answers: {}, voted: {}};
  }

  const {authorization} = req.headers;
  const [me, secret] = authorization.split(' ');

  if (!channel.members[me]) {
    res.status(404).send('Member not found');
  }

  const {answer} = req.body;
  const count = channel.polls[poll].answers?.[answer] || 0;
  const changes = {
    polls: {
      [poll]: {
        voted: {
          [me]: answer
        },
        answers: {
          [answer]: count + 1
        }
      }
    }
  };

  merge(channel, changes);

  console.log('vote poll', id, me, poll, answer);
  pusher.trigger(id, 'channel_updated', {member: me, changes});

  res.status(200).send();

  dirty.channels[channel.id] = channel;
});

app.get('/sitemap.xml', (req, res) => {
  const urls = Object.keys(TUTORIALS.tutorials)
    .map(slug => ({
      url: [
        {loc: ['https://www.epic1h.com/' + slug]},
        {changefreq: ['daily']},
        {priority: ['1']}
      ]
    }));
  urls.push({
    _attr:
      {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml'
      }
  });
  const map = xml({urlset: urls});
  console.log(map);
  res.contentType('application/xml');
  res.send(map);
});

const files = {
  index: fs.readFileSync(path.resolve(__dirname, 'dist/livemd/index.html'), 'utf8')
};

function prerender(tutorial) {

  const metaTag = (name, value, content) => ({
    meta: [{
      _attr: {
        [name]: [value], content
      }
    }]
  });

  let output = files.index;

  if (!!tutorial.meta) {
    const {description, thumbnail, keywords, site} = tutorial.meta;
    const meta = xml([
      metaTag('name', 'description', description),
      metaTag('name', 'keywords', keywords),

      metaTag('itemprop', 'name', tutorial.title),
      metaTag('itemprop', 'description', description),
      metaTag('itemprop', 'image', thumbnail),

      metaTag('thumbnail', 'og:type', 'article'),
      metaTag('thumbnail', 'og:title', tutorial.title),
      metaTag('thumbnail', 'og:description', description),
      metaTag('thumbnail', 'og:image', thumbnail),
      metaTag('thumbnail', 'og:site_name', site),

      metaTag('name', 'twitter:card', 'summary_large_image'),
      metaTag('name', 'twitter:title', tutorial.title),
      metaTag('name', 'twitter:description', description),
      metaTag('name', 'twitter:image', thumbnail),
      metaTag('name', 'twitter:image:alt', tutorial.title)
    ]);

    output = output.replace('<!--metatags-->', meta);
  }

  if (!!tutorial.markdown) {
    output = output.replace('<!--prerender-->', tutorial.markdown);
  }
  output = output.replace(/<title>.+<\/title>/, `<title>${tutorial.title}</title>`);
  return output;
}

app.get('/', (req, res) => {
  const tutorial = TUTORIALS.tutorials.home;
  if (!!files.index) {
    res.send(prerender(tutorial));
    return;
  }
  res.send(files.index);
});

// for production
app.use(express.static('dist/livemd', {index: false}));

app.get('/editor', (req, res) => {
  res.send(files.index);
});

app.get('/:slug', (req, res) => {
  const {slug} = req.params;
  const tutorial = TUTORIALS.tutorials[slug];
  if (!tutorial) {
    res.redirect(404, `/?404=${slug}`);
    return;
  }

  if (!!files.index) {
    res.send(prerender(tutorial));
    return;
  }
  res.send(files.index);
});

app.get('*', function (request, response) {
  response.send(files.index);
});

const port = process.env.PORT || 4300;
app.listen(port);
