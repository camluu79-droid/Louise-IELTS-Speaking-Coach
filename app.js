import {questions, remainingSeconds, formatTime} from './questions.js';
const $ = (id) => document.getElementById(id);
let part = 1, index = 0, interval, deadline, timerKind, recorder, stream, pending = false, recording = false, recordingStarted, recordingContext, elapsedInterval;
const recordings = [];
const notes = new Map();
const labels = {1:'INTRODUCTION & INTERVIEW',2:'THE LONG TURN',3:'DISCUSSION'};
function resetTimer() {clearInterval(interval); deadline = null; $('timer-display').textContent = '01:00'; $('timer-status').textContent = 'Choose a timer to begin.';}
function renderQuestion() {
  const q = questions[part][index];
  $('practice-title').textContent = `PART ${part} · ${labels[part]}`;
  $('question-count').textContent = `${String(index+1).padStart(2,'0')} / 10`;
  $('question-select').replaceChildren(...questions[part].map((q,i) => new Option(`${i+1}. ${q.topic}`, i)));
  $('question-select').value = index;
  $('topic').textContent = q.topic; $('prompt').textContent = q.prompt;
  $('cue').replaceChildren(); $('cue').hidden = part !== 2; $('timers').hidden = part !== 2;
  if (part === 2) {
    const intro = document.createElement('p'); intro.textContent = 'You should say:';
    const list = document.createElement('ul'); q.points.forEach(point => {const li = document.createElement('li'); li.textContent = point; list.append(li);});
    const explanation = document.createElement('p'); explanation.textContent = `And explain ${q.explain}`;
    const label = document.createElement('label'); label.htmlFor = 'notes'; label.textContent = 'Your preparation notes (optional)';
    const field = document.createElement('textarea'); field.id = 'notes'; field.placeholder = 'A few keywords, an example, a story…'; field.value = notes.get(index) || ''; field.oninput = () => notes.set(index, field.value);
    $('cue').append(intro,list,explanation,label,field);
  }
  $('answer-hint').textContent = part === 1 ? 'Try 2–4 sentences. Give a reason or a short example.' : part === 2 ? 'Prepare for 1 minute, then speak for 1–2 minutes. Timers and recording work independently.' : 'Develop your opinion with reasons, examples, and a different perspective.';
  $('previous').disabled = index === 0 || recording || pending; $('next').disabled = index === 9 || recording || pending;
}
function lockQuestions(locked) {
  document.querySelectorAll('[data-part]').forEach(b => b.disabled = locked);
  $('question-select').disabled = locked; $('previous').disabled = locked || index === 0; $('next').disabled = locked || index === 9;
}
document.querySelectorAll('[data-part]').forEach(button => button.onclick = () => {
  part = Number(button.dataset.part); index = 0; resetTimer();
  document.querySelectorAll('[data-part]').forEach(b => {b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));});
  renderQuestion();
});
function changeQuestion(next) {index = next; resetTimer(); renderQuestion();}
$('previous').onclick = () => changeQuestion(index-1); $('next').onclick = () => changeQuestion(index+1);
$('question-select').onchange = e => changeQuestion(Number(e.target.value));
function startTimer(kind) {
  clearInterval(interval); timerKind = kind; deadline = Date.now() + (kind === 'prep' ? 60 : 120)*1000;
  $('timer-status').textContent = kind === 'prep' ? 'Preparation timer running. Jot down a few ideas.' : 'Speaking timer running. Start recording when you’re ready.';
  const tick = () => {const left = remainingSeconds(deadline); $('timer-display').textContent = formatTime(left); if (!left) {clearInterval(interval); deadline = null; $('timer-status').textContent = timerKind === 'prep' ? 'Preparation complete. Start the 2-minute speaking timer when ready.' : 'Speaking time is up. Well done!'; if (timerKind === 'speak' && recording) stopRecording();}};
  tick(); interval = setInterval(tick,200);
}
$('prep').onclick = () => startTimer('prep'); $('speak').onclick = () => startTimer('speak'); $('reset-timer').onclick = resetTimer;
function releaseMic() {stream?.getTracks().forEach(t => t.stop()); stream = null;}
function restoreControls() {recording = false; pending = false; clearInterval(elapsedInterval); document.body.classList.remove('is-recording'); $('record').disabled = false; $('record').textContent = '● Start recording'; lockQuestions(false);}
function stopRecording() {if (recorder?.state === 'recording') { $('record').disabled = true; $('record-status').textContent = 'Finishing your recording…'; recorder.stop(); releaseMic();}}
$('record').onclick = async () => {
  if (recording) {stopRecording(); return;}
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { $('record-status').textContent = 'Recording is unavailable. Open this page using HTTPS or localhost in a recent Chrome, Edge, Firefox, or Safari browser.'; return; }
  pending = true; lockQuestions(true); $('record').disabled = true; $('record-status').textContent = 'Waiting for microphone permission…';
  try {
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
    const chunks = []; recorder = new MediaRecorder(stream);
    recordingContext = {part, prompt:questions[part][index].prompt};
    recorder.ondataavailable = e => {if(e.data.size) chunks.push(e.data);};
    recorder.onerror = () => {releaseMic(); restoreControls(); $('record-status').textContent = 'Recording was interrupted. Please try again.';};
    recorder.onstop = () => {
      const duration = Math.max(1,Math.round((Date.now()-recordingStarted)/1000));
      const blob = new Blob(chunks,{type:recorder.mimeType || chunks[0]?.type || 'audio/webm'});
      if(blob.size) recordings.unshift({...recordingContext, url:URL.createObjectURL(blob),type:blob.type,duration,created:new Date()});
      releaseMic(); restoreControls(); renderRecordings(); $('record-status').textContent = blob.size ? 'Recording ready. Listen back below.' : 'No audio was captured. Please try again.';
    };
    recorder.start(); recordingStarted = Date.now(); recording = true; pending = false; $('record').disabled = false; $('record').textContent = '■ Stop recording'; document.body.classList.add('is-recording');
    const tick = () => $('record-status').textContent = `Recording · ${formatTime(Math.floor((Date.now()-recordingStarted)/1000))}`;
    tick(); elapsedInterval = setInterval(tick,500);
  } catch (error) {
    releaseMic(); restoreControls();
    $('record-status').textContent = error.name === 'NotAllowedError' ? 'Microphone access was blocked. Allow it in your browser’s site settings, then try again.' : error.name === 'NotFoundError' ? 'No microphone was found. Connect a microphone and try again.' : 'Could not start the microphone. Check that it is connected and not in use, then try again.';
  }
};
function renderRecordings() {
  $('recording-count').textContent = recordings.length; $('recordings').replaceChildren();
  if(!recordings.length) {const p = document.createElement('p'); p.className = 'empty'; p.textContent = 'Your next step starts with your first recording.'; $('recordings').append(p);}
  recordings.forEach((r,i) => {
    const article = document.createElement('article'); article.className = 'recording';
    const title = document.createElement('h3'); title.textContent = `Part ${r.part} · ${r.prompt}`;
    const meta = document.createElement('p'); meta.textContent = `${r.created.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · ${formatTime(r.duration)}`;
    const controls = document.createElement('div'); controls.className = 'recording-controls';
    const audio = document.createElement('audio'); audio.controls = true; audio.src = r.url; audio.setAttribute('aria-label',`Replay answer: ${r.prompt}`);
    const download = document.createElement('a'); download.href = r.url; download.download = `ielts-part-${r.part}-${r.created.getTime()}.${r.type.includes('mp4') ? 'm4a' : r.type.includes('ogg') ? 'ogg' : 'webm'}`; download.textContent = 'Download';
    const remove = document.createElement('button'); remove.className = 'secondary'; remove.textContent = 'Delete'; remove.setAttribute('aria-label',`Delete answer: ${r.prompt}`); remove.onclick = () => {audio.pause(); audio.removeAttribute('src'); URL.revokeObjectURL(r.url); recordings.splice(i,1); renderRecordings();};
    controls.append(audio,download,remove); article.append(title,meta,controls); $('recordings').append(article);
  });
}
window.addEventListener('beforeunload', e => {if (recording || pending || recordings.length) {e.preventDefault(); e.returnValue = '';}});
window.addEventListener('pagehide', () => {releaseMic(); recordings.forEach(r => URL.revokeObjectURL(r.url));});
renderQuestion();
