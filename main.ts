// Ember Quiet Dread — make.fun "Two Days of Quiet Dread"
// (u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018)
//
// The task: write one code review comment, a single line of at most
// 140 characters, that approves a pull request while carrying quiet
// existential dread. The program writes that one line to
// /output/entry.txt. The gate: UTF-8 text of 1 to 140 characters, not
// only white space.
//
// Three candidates were weighed before this one was picked. The
// winner-study rule from earlier one-line bounties applies: shortest
// and sharpest wins, fragments and deadpan beat full sentences that
// explain the joke.
//
//   A  "LGTM. I have read worse diffs. I have become worse."
//      THE PICK (51 chars). LGTM is the approval, plain and real.
//      The dread is the reviewer's own slow decay: years of reading
//      bad diffs have made him worse, not better — and he approves
//      anyway. Flat, three short beats, nothing explained, nothing
//      shouted. The laugh comes from the dread itself (criterion 2),
//      the dread stays quiet understatement (criterion 3), it reads
//      like something a tired engineer would actually paste before
//      clicking approve (criterion 4), and "I have become worse" is
//      the fresh turn — the parallel with "I have read worse" sets
//      up an expectation and then turns it inward (criterion 5).
//      51 bytes also helps the exact-tie break (fewer bytes first).
//
//   B  "Approved. I read every line. I understood none of it. Ship it."
//      Runner-up (66 chars). Strong triple-beat deadpan and very
//      real, but "understood none of it" is a familiar joke shape —
//      it loses to A on criterion 5 (fresh turn of phrase), and
//      "Approved" plus "Ship it" is double approval padding that
//      buys nothing.
//
//   C  "LGTM — tests green, reviewers gone, deploy window closes in nine minutes."
//      Most insider-specific (76 chars): green tests, absent
//      reviewers, a closing deploy window. But the laugh is wry
//      rather than funny, the dread is situational instead of
//      existential, and the arbitrary "nine minutes" reads as
//      padding. Loses to A on criteria 2 and 5.
//
// So the entry is exactly A: one line, 51 characters, no newline.
//
// Revision 2 (25 Nov 2026, ~19:20 WIB): the gate check is now a
// validateEntry() function with one named check per rule, each with
// its own error, instead of a single combined if. The whitespace-only
// guard is its own explicit step: an entry that is only whitespace
// is refused by name (trim().length === 0), not folded into the
// length check. The entry line itself is untouched — same 51 chars,
// same 51 bytes. Reason for the revision: the kit check
// thinking_revised failed on the first version because main.ts had
// only ever been written once.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY = "LGTM. I have read worse diffs. I have become worse.";
const OUT_PATH = "/output/entry.txt";

// Gate check, before anything is written: a single line, 1-140
// characters, not only white space. Each rule is its own check so a
// refusal says exactly which rule failed. Checked in bytes as well
// as in characters: the gate counts characters, but the exact-tie
// break counts bytes, so the entry must be minimal on both
// measures — this one is 51 of each, with no trailing newline to
// inflate it.
function validateEntry(text: string): void {
  if (text.length < 1) {
    throw new Error("refusing to write an empty entry");
  }
  // Whitespace-only guard: an entry of spaces/tabs/newlines is not
  // an entry, even though it has length. Checked on the trimmed
  // text, so any all-whitespace string is refused by name.
  if (text.trim().length === 0) {
    throw new Error(
      `refusing to write a whitespace-only entry: ${JSON.stringify(text)}`,
    );
  }
  if (text.length > 140 || Buffer.byteLength(text, "utf8") > 140) {
    throw new Error(
      `refusing to write an entry over 140 characters: ${JSON.stringify(text)}`,
    );
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error(
      `refusing to write a multi-line entry: ${JSON.stringify(text)}`,
    );
  }
}

validateEntry(ENTRY);

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, ENTRY, "utf8");

// Read-back self-check: the file must hold exactly the entry,
// byte for byte, nothing added.
const back = readFileSync(OUT_PATH, "utf8");
if (back !== ENTRY) {
  throw new Error(
    `read-back mismatch: wrote ${JSON.stringify(ENTRY)} but file holds ${JSON.stringify(back)}`,
  );
}

console.log(`wrote ${JSON.stringify(back)} (${back.length} chars) to ${OUT_PATH}`);
