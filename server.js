const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');
const adler = require('adler-32');

class Member {
  id;
  name;
  avatar;

  constructor(defs = {}) {
    Object.assign(this, defs);
  }
}

class Channel {
  id;
  markdown;
  members = {};
  owner;
  marks = {};
  comments = {};
  progress = {};
  opened = {};
  polls = {};
  baseUrl;
  imagesUrl;
  locked;

  constructor(defs = {}) {
    Object.assign(this, defs);
  }
}

const channels = {};

function getFile(id) {
  const [, p1, p2,] = id.match(/^(.{2})(.{2})/i);

  const c1 = adler.str(p1) % 10;
  const c2 = adler.str(p2) % 10;

  return [process.env.DEV_MODE ? 'channels' : '/var/run/app', c1, c2, id].join('/') + '.json';
}

function loadChannel(id) {
  const file = getFile(id);
  if (fs.existsSync(file)) {
    // we need deserialization
    const channel = JSON.parse(fs.readFileSync(file, {encoding: 'utf8'}));
    channels[id] = channel;
    return channel;
  }
  return null;
}

function saveChannel(channel) {
  const file = getFile(channel.id);
  const folder = path.dirname(file);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {recursive: true});
  }

  fs.writeFileSync(file, JSON.stringify(channel, null, 2), {encoding: 'utf8'});
}

let dirty = {};

function saveDirty() {
  const save = Object.values(dirty);
  console.log('save dirty', save.map(c => c.id));
  save.forEach(channel => saveChannel(channel));
  dirty = {};

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

app.use(express.static('dist/livemd'));
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/livemd/index.html'));
});

app.post('/api/channels', (req, res) => {
  const {slug, owner, markdown, baseUrl, imagesUrl, locked} = req.body;

  if (!!slug && slug.length < 4) {
    res.status(404).send('Slug should be more than 4 letters');
    return;
  }

  const id = slug || shortid.generate();
  const channel = new Channel({id, markdown, owner, baseUrl, imagesUrl, locked});
  channels[id] = channel;

  res.send({id});

  dirty[channel.id] = channel;
});

app.post('/api/channels/:id/auth', (req, res) => {
  const id = req.params.id;
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  const {member} = req.body;
  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  const socketId = req.body.socket_id;
  const channelName = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channelName);
  res.send(auth);
});

app.post('/api/channels/:id/join', (req, res) => {
  const id = req.params.id;
  const channel = channels[id] || loadChannel(id);
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  {
    const {id, name, avatar} = req.body;
    let member = channel.members[id];
    if (!member) {
      member = new Member({id, name, avatar});
      channel.members[id] = member;

      pusher.trigger(channel.id, 'member_joined', {member});
    } else {
      console.log('member updated');
      Object.assign(member, {name, avatar});

      pusher.trigger(channel.id, 'member_updated', {member});
    }

    if (!channel.marks[id]) {
      channel.marks[id] = {};
    }

    if (!channel.polls[id]) {
      channel.polls[id] = {};
    }

    if (!channel.progress[id]) {
      channel.progress[id] = 0;
    }

    // reverse support
    if(!channel.opened) {
      channel.opened = {};
    }

    if (!channel.opened[id]) {
      channel.opened[id] = 0;
    }

  }

  res.send(channel);

  dirty[channel.id] = channel;
});

app.post('/api/channels/:id/members/:member/marks/:line', (req, res) => {
  const [id, member, line] = [req.params.id, req.params.member, req.params.line];
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  const {mark} = req.body;
  if (!!mark) {
    channel.marks[member][line] = mark;
  } else {
    delete channel.marks[member][line];
  }

  console.log('put mark', channel.id, member, line, mark);
  pusher.trigger(channel.id, 'put_mark', {member, line, mark});

  res.status(200).send();

  dirty[channel.id] = channel;
});

app.post('/api/channels/:id/members/:member/polls/:line', (req, res) => {
  const [id, member, line] = [req.params.id, req.params.member, req.params.line];
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  if (!channel.polls[member]) {
    channel.polls[member] = {};
  }

  const {option} = req.body;
  channel.polls[member][line] = option;

  console.log('vote poll', channel.id, member, line, option);
  pusher.trigger(channel.id, 'vote_poll', {member, line, option});

  res.status(200).send();

  dirty[channel.id] = channel;
});

app.post('/api/channels/:id/members/:member/comments/:line', (req, res) => {
  const [id, member, line] = [req.params.id, req.params.member, req.params.line];
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  if (!channel.comments[line]) {
    channel.comments[line] = {};
  }

  const {comment} = req.body;
  if (!!comment) {
    channel.comments[line][member] = comment;
  } else {
    delete channel.comments[line][member];
  }

  console.log('put comment', channel.id, member, line, comment);
  pusher.trigger(channel.id, 'put_comment', {member, line, comment});

  res.status(200).send();

  dirty[channel.id] = channel;
});

app.post('/api/channels/:id/members/:member/open', (req, res) => {
  const [id, member] = [req.params.id, req.params.member];
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  const {line} = req.body;
  channel.opened[member] = line;

  console.log('open', channel.id, member, line);
  res.status(200).send();

  dirty[channel.id] = channel;
});

app.post('/api/channels/:id/members/:member/progress', (req, res) => {
  const [id, member] = [req.params.id, req.params.member];
  const channel = channels[id];
  if (!channel) {
    res.status(404).send('Channel not found');
    return;
  }

  if (!channel.members[member]) {
    res.status(404).send('Member not found');
  }

  const {line} = req.body;
  channel.progress[member] = line;

  if (member === channel.owner) {
    for (let m of Object.keys(channel.progress)) {
      if (m !== channel.owner && channel.progress[m] > line) {
        channel.progress[m] = line;
      }
    }
  }

  console.log('set progress', channel.id, member, line);
  pusher.trigger(channel.id, 'set_progress', {member, line});

  res.status(200).send();

  dirty[channel.id] = channel;
});

const port = process.env.PORT || 4300;
app.listen(port);
