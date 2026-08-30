import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'http://localhost:3001';
const outputDir = path.join(os.tmpdir(), 'spotify-clone-visual-check');
const profileDir = path.join(os.tmpdir(), `spotify-clone-profile-${Date.now()}`);
const sessionScript = `
  localStorage.setItem('spotify-clone-users', JSON.stringify([{ id: 1, name: 'Demo User', email: 'demo@demo.com', password: '123456' }]));
  localStorage.setItem('spotify-clone-session', JSON.stringify({ id: 1, name: 'Demo User', email: 'demo@demo.com', password: '123456' }));
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await mkdir(outputDir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=0',
  `--user-data-dir=${profileDir}`,
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

const wsUrl = await new Promise((resolve, reject) => {
  let stderr = '';
  let done = false;
  const timer = setTimeout(() => {
    if (!done) reject(new Error(`Timed out waiting for Chrome DevTools. ${stderr}`));
  }, 10000);

  chrome.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match && !done) {
      done = true;
      clearTimeout(timer);
      resolve(match[1]);
    }
  });

  chrome.on('exit', (code) => {
    if (!done) {
      done = true;
      clearTimeout(timer);
      reject(new Error(`Chrome exited with code ${code}. ${stderr}`));
    }
  });
});

const connect = (url) => new Promise((resolve, reject) => {
  const socket = new WebSocket(url);
  const pending = new Map();
  let nextId = 1;

  socket.addEventListener('open', () => {
    resolve({
      send(method, params = {}, sessionId) {
        const id = nextId++;
        const payload = { id, method, params };
        if (sessionId) payload.sessionId = sessionId;
        socket.send(JSON.stringify(payload));

        return new Promise((resolveCommand, rejectCommand) => {
          pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
        });
      },
      close() {
        socket.close();
      }
    });
  });

  socket.addEventListener('message', async (event) => {
    const raw = typeof event.data === 'string'
      ? event.data
      : Buffer.from(await event.data.arrayBuffer()).toString('utf8');
    const message = JSON.parse(raw);

    if (message.id && pending.has(message.id)) {
      const { resolve: resolveCommand, reject: rejectCommand } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        rejectCommand(new Error(message.error.message));
      } else {
        resolveCommand(message.result);
      }
    }
  });

  socket.addEventListener('error', reject);
});

const client = await connect(wsUrl);

try {
  const target = await client.send('Target.createTarget', { url: 'about:blank' });
  const attached = await client.send('Target.attachToTarget', {
    targetId: target.targetId,
    flatten: true
  });
  const sessionId = attached.sessionId;
  const send = (method, params = {}) => client.send(method, params, sessionId);

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: targetUrl });
  await sleep(1500);
  await send('Runtime.evaluate', { expression: sessionScript, awaitPromise: true });

  const capture = async (name, metrics) => {
    await send('Emulation.setDeviceMetricsOverride', metrics);
    await send('Page.reload', { ignoreCache: true });
    await sleep(1600);

    const text = await send('Runtime.evaluate', {
      expression: 'document.body.innerText',
      returnByValue: true
    });
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });
    const filePath = path.join(outputDir, name);
    await writeFile(filePath, Buffer.from(screenshot.data, 'base64'));

    return {
      filePath,
      hasHome: text.result.value.includes('Buenas tardes'),
      hasPlayer: text.result.value.includes('Midnight Echo')
    };
  };

  const desktop = await capture('desktop.png', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  const mobile = await capture('mobile.png', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log(JSON.stringify({ desktop, mobile }, null, 2));
} finally {
  client.close();
  chrome.kill();
}
