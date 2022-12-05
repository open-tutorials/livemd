Realtime collaboration for markdown.

# Development
```bash
npm i
npm start
PUSHER_APP_ID= PUSHER_KEY= PUSHER_SECRET= node server.js
open http://localhost:4200/example
```

To add tutorials, please use file `consts.ts`

# Production
```bash
npm run build
PUSHER_APP_ID= PUSHER_KEY= PUSHER_SECRET= node server.js
```

# To Do
- [ ] pusher data deserialization
- [ ] cleanup styles
- [ ] decrease bundle size
- [ ] add comments
- [ ] add likes
- [ ] persistent storage
- [ ] tablet / mobile adaptation
- [ ] gzip for express
