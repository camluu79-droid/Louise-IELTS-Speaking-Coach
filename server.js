import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const files = new Map([['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.js','app.js'],['/questions.js','questions.js']]);
const types = {html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8'};
export const server = http.createServer(async (req,res) => {
  const file = files.get(new URL(req.url, 'http://localhost').pathname);
  if (!file) {res.writeHead(404); res.end('Not found'); return;}
  try {const content = await readFile(new URL(file, import.meta.url)); res.writeHead(200,{'Content-Type':types[file.split('.').pop()], 'X-Content-Type-Options':'nosniff'}); res.end(content);} catch {res.writeHead(500); res.end('Unable to load page');}
});
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port,'0.0.0.0',() => console.log(`Louise IELTS Speaking Academy is ready: http://localhost:${port}`));
}
