import {test,expect} from '@playwright/test';
test('desktop: questions, notes, real countdown transitions, recording replay and deletion',async({page})=>{
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/'); await expect(page).toHaveTitle('Louise IELTS Speaking Academy');
  for(const part of [1,2,3]) {
    await page.locator(`[data-part="${part}"]`).click();
    await expect(page.locator('#question-select option')).toHaveCount(10);
    await page.locator('#question-select').selectOption('9');
    await expect(page.locator('#question-count')).toHaveText('10 / 10');
    await expect(page.locator('#next')).toBeDisabled();
  }
  await page.locator('[data-part="2"]').click();
  await page.locator('#notes').fill('My ideas'); await page.locator('#next').click(); await page.locator('#previous').click(); await expect(page.locator('#notes')).toHaveValue('My ideas');
  await page.clock.install();
  await page.locator('#prep').click(); await expect(page.locator('#timer-display')).toHaveText('01:00');
  await page.clock.fastForward(60000); await expect(page.locator('#timer-display')).toHaveText('00:00');
  await expect(page.locator('#timer-status')).toContainText('Preparation complete');
  await page.locator('#speak').click(); await expect(page.locator('#timer-display')).toHaveText('02:00');
  await page.clock.fastForward(120000); await expect(page.locator('#timer-status')).toContainText('Speaking time is up');
  await page.locator('#reset-timer').click(); await expect(page.locator('#timer-display')).toHaveText('01:00');
  await page.locator('#record').click(); await expect(page.locator('#record')).toHaveText('■ Stop recording');
  await expect(page.locator('#question-select')).toBeDisabled();
  // Let the real browser's simulated microphone provide actual audio data.
  await page.waitForTimeout(1100); await page.locator('#record').click();
  await expect(page.locator('audio')).toHaveCount(1);
  const audio=page.locator('audio'); await audio.evaluate(a=>a.play());
  await expect.poll(()=>audio.evaluate(a=>a.readyState)).toBeGreaterThanOrEqual(2);
  await expect(page.getByRole('link',{name:'Download',exact:true})).toHaveAttribute('download',/ielts-part-2/);
  await page.getByRole('button',{name:/Delete answer/}).click(); await expect(page.locator('audio')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('phone: layout fits viewport and microphone denial is explained',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},permissions:[]});
  const page=await context.newPage();
  await page.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};});
  await page.goto('/');
  for(const part of [1,2,3]) {await page.locator(`[data-part="${part}"]`).click(); expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}
  await page.locator('#record').click(); await expect(page.locator('#record-status')).toContainText('Microphone access was blocked');
  await expect(page.locator('#record')).toBeEnabled(); await expect(page.locator('#question-select')).toBeEnabled();
  await context.close();
});
