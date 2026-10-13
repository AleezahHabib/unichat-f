import { test, expect } from "@playwright/test";

test.describe("Feature 08: Interactive Product Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("test_AC_08_01_section_placement_and_gate_overlay", async ({ page }) => {
    // Renders section with id="demo"
    const section = page.locator("#demo");
    await expect(section).toBeVisible();

    // Sits after platform strip
    await expect(section.locator("h2")).toHaveText("See it work");
    await expect(section.locator("p").first()).toHaveText(
      "Five clicks through a real workflow. No sign-up."
    );

    // Gate overlay is initially visible with Start button
    const gate = page.locator("#fc-gate");
    await expect(gate).toBeVisible();
    const startBtn = page.locator("#fc-go");
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toContainText("Start interactive demo");

    // Hotspot and rail are hidden at rest
    await expect(page.locator("#fc-spot")).not.toBeVisible();
    await expect(page.locator("#fc-rail")).not.toBeVisible();
  });

  test("test_AC_08_02_five_step_interactive_progression_and_reversibility", async ({ page }) => {
    // Start the demo
    await page.click("#fc-go");
    await expect(page.locator("#fc-gate")).not.toBeVisible();
    await expect(page.locator("#fc-rail")).toBeVisible();

    // Step 0: Connect
    await expect(page.locator("#fc-tip-chip")).toHaveText("Connect");
    await page.click("#fc-spot");

    // After Step 0: Badges visible, button says Linked
    await expect(page.locator("#fc-hdr-slack")).toBeVisible();
    await expect(page.locator("#fc-hdr-discord")).toBeVisible();
    await expect(page.locator("#fc-btn-link")).toHaveText("Linked");

    // Step 1: Send
    await expect(page.locator("#fc-tip-chip")).toHaveText("Send");
    await page.click("#fc-spot");

    // After Step 1: Sent msg and Slack echo visible
    await expect(page.locator("#fc-msg-sent")).toBeVisible();
    await expect(page.locator("#fc-slack-echo")).toBeVisible();
    await expect(page.locator("#fc-draft")).toHaveText("Message #launch");

    // Step 2: Receive
    await expect(page.locator("#fc-tip-chip")).toHaveText("Receive");
    await page.click("#fc-spot");

    // After Step 2: Marco's message visible
    await expect(page.locator("#fc-msg-marco")).toBeVisible();
    await expect(page.locator("#fc-discord-msg")).toBeVisible();
    await expect(page.locator("#fc-discord-empty")).not.toBeVisible();

    // Step 3: Ask
    await expect(page.locator("#fc-tip-chip")).toHaveText("Ask");
    await page.click("#fc-spot");

    // After Step 3: Assistant view active
    await expect(page.locator("#fc-assist")).toBeVisible();

    // Step 4: Verify
    await expect(page.locator("#fc-tip-chip")).toHaveText("Verify");
    await page.click("#fc-spot");

    // After Step 4: Channel view restored and end card displayed
    await expect(page.locator("#fc-chan")).toBeVisible();
    await expect(page.locator("#fc-done")).toBeVisible();

    // Test reversibility: Back button
    await page.click("#fc-back");
    // Undoes step 4: Assistant view active again
    await expect(page.locator("#fc-assist")).toBeVisible();
    await expect(page.locator("#fc-done")).not.toBeVisible();

    // Step forward again to finish
    await page.click("#fc-next");
    await expect(page.locator("#fc-done")).toBeVisible();

    // Test Replay button
    await page.click("#fc-replay");
    await expect(page.locator("#fc-done")).not.toBeVisible();
    await expect(page.locator("#fc-tip-chip")).toHaveText("Connect");
    await expect(page.locator("#fc-btn-link")).toHaveText("Link channel");
    await expect(page.locator("#fc-hdr-slack")).not.toBeVisible();
  });

  test("test_AC_08_03_measurement_based_hotspot_and_tooltip_positioning", async ({ page }) => {
    await page.click("#fc-go");

    const spot = page.locator("#fc-spot");
    await expect(spot).toBeVisible();

    // Verify style has left and top coordinates in px
    const spotStyle = await spot.getAttribute("style");
    expect(spotStyle).toContain("left:");
    expect(spotStyle).toContain("top:");
    expect(spotStyle).toContain("px");

    const tip = page.locator("#fc-tip");
    await expect(tip).toBeVisible();
    const tipStyle = await tip.getAttribute("style");
    expect(tipStyle).toContain("left:");
    expect(tipStyle).toContain("top:");
    expect(tipStyle).toContain("px");
  });

  test("test_AC_08_04_end_card_and_navigation_actions", async ({ page }) => {
    await page.click("#fc-go");

    // Advance through all 5 steps
    for (let i = 0; i < 5; i++) {
      await page.click("#fc-spot");
    }

    const doneCard = page.locator("#fc-done");
    await expect(doneCard).toBeVisible();
    await expect(doneCard).toContainText("That was the whole product.");

    // Relative CTA link
    const signupLink = doneCard.locator('a[href="/signup"]');
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveText("Create a free workspace");

    // Replay button
    const replayBtn = page.locator("#fc-replay");
    await expect(replayBtn).toBeVisible();
  });

  test("test_AC_08_05_responsive_laptop_frame_and_accessibility", async ({ page }) => {
    // Desktop view (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    const lid = page.locator("#fc-demo > div").first();
    await expect(lid).toBeVisible();

    // Mobile view (375px)
    await page.setViewportSize({ width: 375, height: 812 });
    // In mobile view, sidebar should be hidden
    const sidebar = page.locator("aside");
    await expect(sidebar).not.toBeVisible();

    // Start demo on mobile and check it still advances
    await page.click("#fc-go");
    await expect(page.locator("#fc-rail")).toBeVisible();
    await page.click("#fc-spot");
    await expect(page.locator("#fc-hdr-slack")).toBeVisible();
  });
});
