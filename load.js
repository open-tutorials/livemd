const str  = `
# Фидбек пожалуйста 🙏

<import from="/partials/tutorial_feedback.md">

# 👨‍🎓 Чему ты научился

`;

const matches = str.matchAll(/\<import\sfrom\=\"([a-zA-Z0-9\/\_\-\.]+)\">/g);
for(const match of matches){
  const [, path] = match;
  console.log(path);
}
