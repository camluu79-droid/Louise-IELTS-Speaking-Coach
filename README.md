# IELTS Speaking Coach

A free, responsive IELTS Speaking practice website. It includes 10 original questions for each speaking part, 10 Part 2 cue cards, preparation notes, a 1-minute preparation timer, a 2-minute speaking timer, and microphone recording with replay, download, and deletion. There are no paid APIs, accounts, or automatic band scores.

## Run and preview (beginner guide)

1. Install **Node.js 20 or newer (LTS recommended)** from https://nodejs.org.
2. Download this repository using GitHub’s **Code → Download ZIP**, then unzip it.
3. Open a terminal in the unzipped folder. In VS Code, open the folder and select **Terminal → New Terminal**.
4. Type `npm start` and press Enter. No dependency installation is needed.
5. Open **http://localhost:3000** in your browser. Keep the terminal open while you practise.
6. To stop the website, return to the terminal and press **Ctrl+C**.

If port 3000 is occupied, stop the other app or set the `PORT` environment variable to another port before starting.

## How students use it

- Select Speaking Part 1, 2, or 3. Choose a topic from the menu or use Previous / Next.
- For Part 2, read the cue card and optionally write preparation notes. Press **1 min preparation**. When it finishes, press **2 min speaking**.
- Timers do not start the microphone. Press **Start recording**, allow microphone permission, and speak. Press **Stop recording** when finished. A running speaking timer stops an active recording when the two minutes finish.
- Replay answers under **Your recordings**. Use **Download** to keep an audio file or **Delete** to remove an answer.
- Question changes are disabled while recording so each answer stays attached to its question.

**Privacy and storage:** Recordings and notes stay in the current tab’s memory. They are not uploaded. Refreshing or closing the page loses them. Download any recordings you want to keep. The browser may warn before you leave, but this warning is not guaranteed on every device.

## Microphone and mobile preview

Use a recent Chrome, Edge, Firefox, or Safari browser. Recording requires microphone permission and either **HTTPS** or **localhost**. If access is blocked, allow the microphone in your browser’s site settings. If no microphone is found, connect one and try again.

The layout adapts to phones and computers. To try the mobile layout on your computer, open your browser’s developer tools and select the phone/tablet view. To record on an actual phone, host the static files with HTTPS; an ordinary `http://192.168…` network address usually cannot access the microphone. No website is published automatically by this project.

## Tests

Run:

```sh
npm test
npm run check
```

Tests check the question bank, cue card completeness, timer calculations (including delayed callbacks), and the preview server. Two additional automated browser tests cover question navigation, preparation notes, timer completion, recording/replay/deletion with a simulated microphone, microphone permission errors, and phone-sized layout. To run them:

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

These test dependencies are optional; the application itself still runs with `npm start` without installing anything. The browser tests use system Chromium when available, otherwise Playwright’s Chromium. Set `CHROMIUM_PATH` to use another Chromium executable.

Validation during development: all 3 automated core tests, both Chromium browser tests, and JavaScript syntax checks passed. The microphone test uses simulated audio; real microphone quality and Safari/Firefox compatibility still need the manual checks below.

### Manual check before using in class

1. On a computer and phone, select each part and browse all 10 topics.
2. In Part 2, run preparation to 00:00, then run speaking to 00:00. Check Reset and changing questions.
3. Allow microphone access, record a short answer, stop it, replay it, and download it. Play the downloaded file.
4. Record a second answer, delete one, and confirm the other still plays.
5. Block microphone permission and check that helpful instructions appear.
6. Use keyboard Tab to reach controls and check that focus is visible.

## Files and editing questions

- `index.html`: page structure and text.
- `styles.css`: colours, spacing, and responsive layout.
- `questions.js`: sample prompts and timer helpers. Edit the text here to add your own topics.
- `app.js`: question selection, timers, notes, and recording.
- `server.js`: local preview server using built-in Node.js tools.
- `tests/app.test.js`: automated checks.

To host later, upload `index.html`, `styles.css`, `questions.js`, and `app.js` to a static HTTPS host such as GitHub Pages. No backend is required. The questions are original practice material, not official IELTS exam questions. This project is not affiliated with IELTS.


## Publish online with Netlify (no terminal needed)

The repository includes `netlify.toml`, which supplies the hosting settings automatically. A build copies only the four public website files into `dist/`; it does not publish tests, dependencies, or Git files.

1. Merge the application pull request on GitHub: open it, click **Merge pull request**, then **Confirm merge**. This puts the website files on the `main` branch.
2. Visit https://app.netlify.com/ and create an account or log in. Select the **Free** plan. You do not need a paid domain. Free plans have usage limits; review the plan details when signing up.
3. In the Netlify dashboard, choose **Add new project** (sometimes called **Add new site**) → **Import an existing project**.
4. Choose **GitHub**. If asked, authorize Netlify and select **Only select repositories** → **Louise-IELTS-Speaking-Coach**. You do not need to make a private repository public for this.
5. Select the repository and choose branch **main**.
6. Confirm **Build command: `npm run build`** and **Publish directory: `dist`**. Leave the base directory empty. No environment variables or API keys are needed.
7. Click **Deploy** or **Deploy project**. Wait for the deployment to say **Published**.
8. Click the website address ending in **.netlify.app**. This is your public HTTPS website link. Open it directly in a normal browser tab to test the microphone.
9. Click **Start recording**, then **Allow** when asked for microphone access. Speak, stop, replay, and download your answer.

The deployed website is public, while your GitHub repository keeps its existing visibility. Later changes merged into `main` will automatically redeploy. Recordings still stay in each student's browser tab and are never uploaded to Netlify. If deployment fails, open the deploy log and share its error text, excluding any secrets.
