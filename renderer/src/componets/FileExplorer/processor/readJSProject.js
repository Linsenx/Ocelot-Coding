const fs = window.require('fs')

export default (path) => {
  let JS = '', CSS = '', HTML = ''
  if (fs.existsSync(`${path}/main.js`)) {
    JS = fs.readFileSync(`${path}/main.js`).toString()
  }
  if (fs.existsSync(`${path}/style.css`)) {
    CSS = fs.readFileSync(`${path}/style.css`).toString()
  }
  if (fs.existsSync(`${path}/index.html`)) {
    HTML = fs.readFileSync(`${path}/index.html`).toString()
  }
  return { JS, CSS, HTML }
}