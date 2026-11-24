/* The Leak — content. A confidential note reached a newspaper. Who sent it, and were they right to? */
(function (root) {
  'use strict';

  const META = {
    when: 'Northmere Water · Thursday, 10:00',
    place: 'The boardroom',
    label: 'Northmere Water',
    lead: 'A confidential note reached a newspaper. One of you sent it. Bring pencils; print the case notebook and the exhibits if you can.',
    all: ['robin', 'alex', 'sam', 'jo'],
    leaker: 'alex',
    absent: 'sam',
    awayTitle: 'Sam Okafor is not here.',
    awayTag: ['Left with Human Resources', 'Wednesday'],
    prompts: ['Who are you, and what was your part in this?', 'Where were you on Tuesday between six and ten in the evening?', 'Which version of the note did you have, and how many pages was it?'],
    truth: 'It was Alex Mercer.',
    clear: 'robin',
    secrets: [
      { who: 'jo', id: 'grange', chip: 'Jo’s dinner at the Grange came out', kept: 'The Grange stayed quiet' },
      { who: 'sam', id: 'monday', chip: 'Sam’s offer to the reporter came out', kept: 'Monday stayed quiet' }
    ],
    verdict: { yes: 'The room found the leak justified.', no: 'The room found the leak unjustified.' },
    tie: 'A tie goes to the harsher answer: that is what the Board would do.',
    grid: ['Which version, how many pages?', 'Where on Tuesday evening?', 'Hiding something?'],
    real: ''
  };

  const PREMISE = [
    'Northmere Water supplies two million people. Last Friday the result of a routine sample from the Ashby works, which serves 61,000 of them, came back showing PFAS, the so-called forever chemicals, at 0.14 micrograms per litre. The legal limit is 0.10.',
    'On Tuesday morning the Chief Executive decided to tell the Water Inspectorate only after its ruling on Northmere’s prices, ten days away.',
    'On Tuesday night somebody sent the internal note to The Courier. This morning, Thursday, it is the front page.',
    'The Inspectorate’s investigators arrive at half past eleven. The Chief Executive has left you in the boardroom with one instruction: find out who it was before they do.'
  ];

  const RULES = [
    'You each have a private brief: who you are, what you know, what you would rather keep quiet.',
    'All of you but one tell only the truth. You may decline to answer a question once; asked again, you answer it.',
    'One of you sent the note. That person may lie.',
    'Use the notebook sheet. Dates, times and page numbers matter.'
  ];

  const CAST = {
    robin: {
      name: 'Robin Vale', job: 'Head of Water Quality',
      who: 'A chemist, fourteen years at Northmere. You found the result and wrote the first note.',
      know: [
        'Friday’s result from Ashby: PFAS at 0.14 µg/L against a legal limit of 0.10. On Monday at 14:10 you sent Jo a six-page note saying so, and recommending that the Inspectorate be told at once.',
        'Tuesday, 09:00, the Chief Executive’s office: Marianne Holt, Jo, Alex and you. Sam came in at 09:40. Holt and Jo decided to notify the Inspectorate only after the price ruling, “once the re-test confirms it”.',
        'Alex said, in front of everyone, that the Regulations say “as soon as the company becomes aware” and that waiting “would be difficult to defend”. Alex was overruled.',
        'You lost your temper and said: “If you won’t tell them, somebody will.” Everybody heard it.',
        'At 12:01 you opened the version Alex had circulated. It was eight pages long: your six, plus a legal section.',
        'You left headquarters at about 17:40, drove to the Lab Building three kilometres away, and ran the re-test yourself until just after eight. You were alone.'
      ],
      quiet: [
        'At 12:05 on Tuesday you began an email to the Inspectorate’s hotline. You never sent it. It is still in your drafts.',
        'In January you reported Ashby’s rising trend to that same hotline, anonymously. You received an automatic reply and nothing more. Nobody here knows.'
      ],
      want: 'You did not send the note. Find out who did, and make sure nobody leaves this room believing it was you.',
      hearing: 'When it comes to deciding what happens next: you want whoever did this to keep their job, and you want somebody to answer for the ten days.',
      liar: false
    },
    jo: {
      name: 'Jo Lindqvist', job: 'Chief Operating Officer',
      who: 'Twenty-two years in water. You run the works and the pipes, and you are the one who has to land the price ruling.',
      know: [
        'Robin’s six-page note reached you on Monday at 14:10. At about 14:40 you warned Sam in the corridor that “something is coming on Ashby”. You briefed Marianne Holt that evening.',
        'Tuesday, 09:00: Holt and you decided to notify the Inspectorate after the price ruling. Your reasons: one result is not a confirmed exceedance; a formal re-test takes five days; and a scare the week before the ruling could cost the £180 million investment plan, which includes new treatment at Ashby itself.',
        'Alex objected on the law. Robin shouted: “If you won’t tell them, somebody will.”',
        'At 11:42 you opened the version Alex had circulated. It was eight pages long.',
        'At about 15:00 you briefed Sam by word of mouth for the “lines to take”. You told Sam the result was “marginally above 0.1”. You never sent Sam either version of the note.',
        'You left headquarters at 18:31.'
      ],
      quiet: [
        'Where you went. At 19:00 you had dinner at the Grange Hotel with the chair of Calder Utilities, who has offered you the post of chief executive there. If Northmere’s price ruling goes badly, Calder is the likely buyer. You know exactly how that looks.'
      ],
      want: 'You did not send the note. Find out who did. Keep the Grange Hotel out of the conversation if you can.',
      hearing: 'When it comes to deciding what happens next: you want the leaker dismissed and reported to their professional body, and you want the matter to end there.',
      liar: false
    },
    sam: {
      name: 'Sam Okafor', job: 'Director of Communications',
      who: 'Nine years a reporter on The Courier before you crossed the road to Northmere. Dana Reyes, who wrote today’s front page, sat at the next desk.',
      know: [
        'Nobody ever sent you Robin’s note or Alex’s version of it. You have never seen either.',
        'You joined Tuesday’s meeting at 09:40, after the decision had been taken. At about 15:00 Jo briefed you by word of mouth, and you wrote four pages of “lines to take”. Your text says “marginally above 0.1”, because that is what Jo told you. You printed six copies at 16:34.',
        'You stayed until 19:40 working on a question-and-answer sheet, and printed a draft of it at 19:33 on the fourth-floor printer.',
        'A little before seven you heard that printer running. You had thought you were alone on the floor.',
        'At 21:55 and again at 22:10 on Tuesday night, Dana Reyes rang you. She had a document and wanted the company’s comment. You said you could not help and tried the Chief Executive’s office, which was closed: Holt was in Brussels.'
      ],
      quiet: [
        'Monday. After Jo’s warning in the corridor you rang Dana and met her for coffee at four. Before you had seen a single figure, you offered her a deal that nobody had authorised: sit on anything she heard about Ashby, and a week on Friday she would have the story first, with Holt on the record. You gave her no document and no numbers. But you told a journalist that there was a story.'
      ],
      want: 'You did not send the note. Find out who did. Keep Monday’s coffee out of the conversation if you can.',
      hearing: 'When it comes to deciding what happens next: you want a quiet departure by agreement and one joint statement. No tribunal, no martyr, no second front page.',
      liar: false
    },
    alex: {
      name: 'Alex Mercer', job: 'General Counsel',
      who: 'The company’s lawyer for six years. You sent the note.',
      know: [
        'Tuesday, 09:00: you told Marianne Holt and Jo that the Regulations require notification “as soon as the company becomes aware”, and that waiting ten days for the price ruling “would be difficult to defend”. They overruled you. Robin shouted: “If you won’t tell them, somebody will.”',
        'At 11:18 you wrote your version of the note: Robin’s six pages plus your legal section. At 11:20 you shared eight pages with Jo and Robin. Your own file has a ninth page, Annex A: your formal advice to the Chief Executive. At 11:25 you emailed that annex to Holt, for the record.',
        'At 18:52, believing the fourth floor was empty, you printed all nine pages from a USB stick at the corridor printer, which needs no login. You left the building at 19:14.',
        'At home you photographed the pages. At 21:40 you sent them to Dana Reyes of The Courier.'
      ],
      quiet: [
        'Why. You believed the delay was unlawful, and that the proper channel was useless: the Inspectorate is the same body that is about to rule on Northmere’s prices, and you have watched it sit on reports before. You are a solicitor. You know what disclosing a client’s privileged advice does to a career.'
      ],
      want: 'Do not be found out. You may lie. You succeed if fewer than half of the others name you. Do not over-defend: the others have things to hide. Robin made a threat. Sam used to work with Dana Reyes. Jo left early and will not say where.',
      hearing: 'If you are found out, you will be asked to explain yourself. From then on, tell the truth, and argue for your job.',
      liar: true
    }
  };

  // Shown on the screen when only three play: Sam is away, and has left a statement.
  const SAM_STATEMENT = [
    'Statement of S. Okafor, Director of Communications, given to Human Resources on Wednesday.',
    'I was never sent Robin Vale’s note or the General Counsel’s version of it. I joined Tuesday’s meeting at 09:40. At about 15:00 Jo Lindqvist briefed me orally and I wrote four pages of lines to take, which say “marginally above 0.1” because that is what I was told. I printed six copies at 16:34.',
    'I was in the building until 19:40 and printed a draft Q&A at 19:33 on the fourth-floor printer. A little before seven I heard that printer running. I had thought I was alone on the floor.',
    'Dana Reyes of The Courier rang me at 21:55 and 22:10 on Tuesday. She had a document and wanted a comment. I gave none.'
  ];

  const EXHIBITS = [
    {
      id: 'A', round: 1, title: 'The Courier, Thursday', tag: 'Front page',
      html: '<div class="press"><h5>Water firm sat on ‘forever chemical’ result</h5>' +
        '<p><b>By Dana Reyes</b></p>' +
        '<p>Northmere Water knew last week that drinking water supplied to 61,000 people in Ashby contained PFAS at a level “forty per cent over the limit”, and chose not to tell the regulator until after next week’s ruling on its prices, an internal note seen by The Courier reveals.</p>' +
        '<p>The note records a reading of 0.14 micrograms per litre against a legal limit of 0.10. It also records that the company’s own lawyers warned that waiting for the price ruling “would be difficult to defend”.</p>' +
        '<p>The Courier received the document at 9.40pm on Tuesday. Northmere declined to comment.</p>' +
        '<p><i>Photograph: page one of the note, as received.</i></p></div>'
    },
    {
      id: 'B', round: 1, title: 'Document vault: “Ashby PFAS”', tag: 'Version history',
      html: '<table><tr><th>Version</th><th>Saved</th><th>Author</th><th>Pages</th><th>Wording</th></tr>' +
        '<tr><td>1</td><td>Mon 14:10</td><td>R. Vale</td><td>6</td><td>“0.14 µg/L, forty per cent over the limit.” Recommends immediate notification.</td></tr>' +
        '<tr><td>2</td><td>Tue 11:18</td><td>A. Mercer</td><td>8</td><td>Vale’s text unchanged, plus section 7, “Legal position”: waiting for the price ruling “would be difficult to defend”.</td></tr>' +
        '<tr><td>3</td><td>Tue 16:30</td><td>S. Okafor</td><td>4</td><td>“Lines to take.” Result described as “marginally above 0.1”. No legal section.</td></tr></table>'
    },
    {
      id: 'C', round: 2, title: 'Document vault: version 2', tag: 'Access log, Tuesday',
      html: '<table><tr><th>Time</th><th>Event</th><th>Account</th></tr>' +
        '<tr><td>11:18</td><td>Created.</td><td>A. Mercer, owner</td></tr>' +
        '<tr><td>11:20</td><td>Shared read-only, pages 1–8.</td><td>to J. Lindqvist, R. Vale</td></tr>' +
        '<tr><td>11:25</td><td>Annex A (one page: advice to the Chief Executive) added to the owner’s copy and sent by email. Never forwarded.</td><td>A. Mercer to M. Holt</td></tr>' +
        '<tr><td>11:42</td><td>Opened, pages 1–8.</td><td>J. Lindqvist</td></tr>' +
        '<tr><td>12:01</td><td>Opened, pages 1–8.</td><td>R. Vale</td></tr>' +
        '<tr><td colspan="3">No other account has permission to open version 2. Version 3 was created as a new document; it is not derived from version 2.</td></tr></table>'
    },
    {
      id: 'D', round: 2, title: 'Phones, calendars, mailboxes', tag: 'Monday to Wednesday',
      html: '<table><tr><th>Whose</th><th>When</th><th>Entry</th></tr>' +
        '<tr><td>S. Okafor, mobile</td><td>Mon 15:12</td><td>Call out to D. Reyes, 2 min</td></tr>' +
        '<tr><td>S. Okafor, calendar</td><td>Mon 16:00</td><td>“D.R. coffee, Albion Street”</td></tr>' +
        '<tr><td>R. Vale, mailbox</td><td>Tue 12:05</td><td>Draft, never sent. To: hotline@water-inspectorate. Subject: “Ashby PFAS: notification”.</td></tr>' +
        '<tr><td>J. Lindqvist, calendar</td><td>Tue 19:00</td><td>“Private”</td></tr>' +
        '<tr><td>S. Okafor, mobile</td><td>Tue 21:55</td><td>Call in from D. Reyes, 4 min</td></tr>' +
        '<tr><td>S. Okafor, mobile</td><td>Tue 22:10</td><td>Call in from D. Reyes, 11 min</td></tr>' +
        '<tr><td>S. Okafor, mobile</td><td>Tue 22:23</td><td>Call out to Chief Executive’s office. No answer.</td></tr>' +
        '<tr><td>Press office</td><td>Wed 07:31</td><td>Email from The Courier newsdesk asking for comment.</td></tr></table>'
    },
    {
      id: 'E', round: 3, title: 'Doors and barriers', tag: 'Tuesday',
      html: '<table><tr><th>Person</th><th>Time</th><th>Event</th></tr>' +
        '<tr><td>M. Holt</td><td>14:55</td><td>Headquarters, exit. Flight to Brussels departed 16:20.</td></tr>' +
        '<tr><td>R. Vale</td><td>17:41</td><td>Headquarters, exit.</td></tr>' +
        '<tr><td>R. Vale</td><td>17:58</td><td>Lab Building, entry.</td></tr>' +
        '<tr><td>J. Lindqvist</td><td>18:31</td><td>Headquarters, exit. Car park barrier 18:36.</td></tr>' +
        '<tr><td>A. Mercer</td><td>19:14</td><td>Headquarters, exit.</td></tr>' +
        '<tr><td>S. Okafor</td><td>19:40</td><td>Headquarters, exit.</td></tr>' +
        '<tr><td>R. Vale</td><td>20:05</td><td>Lab Building, exit.</td></tr>' +
        '<tr><td colspan="3">Complete record: nobody entered headquarters after 16:00, and no other badge was used there after 17:00. The Lab Building is 3 km away. Lab sample log, Ashby re-run: samples loaded 18:40 and 19:25, initialled R.V.</td></tr></table>'
    },
    {
      id: 'F', round: 3, title: 'IT security: the photograph', tag: 'Wednesday 16:10',
      html: '<p>The Courier’s website shows a photograph of page one of the note. Under magnification the sheet carries the pattern of yellow tracking dots that our colour printers add to every page.</p>' +
        '<p><b>Decoded: printer 4F-02, fourth-floor corridor, headquarters. Tuesday, 18:52.</b></p>' +
        '<table><tr><th>4F-02, Tuesday</th><th>Job</th><th>Pages</th><th>User</th></tr>' +
        '<tr><td>16:34</td><td>Ashby_lines_v3.docx, 6 copies</td><td>4</td><td>S. Okafor</td></tr>' +
        '<tr><td>18:52</td><td>Ashby_note_v2.pdf, from USB stick at the machine</td><td>9</td><td>none: the USB port needs no login</td></tr>' +
        '<tr><td>19:33</td><td>QA_draft.docx</td><td>2</td><td>S. Okafor</td></tr></table>'
    }
  ];

  const ROUNDS = [
    { n: 1, title: 'What the paper had', ask: 'Which version reached The Courier?', ids: ['A', 'B'],
      hints: ['Compare the newspaper’s quotations with the three versions, word for word.', 'Which version says “difficult to defend”? Which says “marginally”?', 'The Courier had version 2. So: who was ever given version 2?'] },
    { n: 2, title: 'Who could have had it', ask: 'Who could open that version, and who was talking to the reporter?', ids: ['C', 'D'],
      hints: ['Who was able to open version 2 at all?', 'Set the times of Dana Reyes’s calls against 9.40pm.', 'Nobody outside the access list could open version 2. And a draft that was never sent is not a leak.'] },
    { n: 3, title: 'Where and when', ask: 'Who stood at that printer at 18:52?', ids: ['E', 'F'],
      hints: ['A print from a USB stick needs a person standing at the machine.', 'Who was still inside headquarters at 18:52? And count the pages that came out.', 'Two people were in the building; only one of them could open the file. The circulated copies had eight pages; nine were printed.'] }
  ];

  const SOLUTION = [
    'The Courier quoted “would be difficult to defend”. Only version 2 says that.',
    'Nine pages came out of the printer. The copies shared with Jo and Robin had eight. The ninth was Annex A, which existed only in the owner’s copy and in the Chief Executive’s inbox, and the Chief Executive was in Brussels.',
    'The pages were printed at the fourth-floor printer at 18:52, from a USB stick. Jo had left at 18:31. Robin was three kilometres away, loading samples at 18:40.',
    'Sam was in the building, but was never given version 2 and had no permission to open it. Dana Reyes’s calls to Sam came after the document had already arrived.',
    'Alex Mercer wrote the file, owned the ninth page, and was in the building until 19:14.'
  ];

  const HEARING_INTRO = [
    'The investigators are in the lobby. Before they come up, the Board wants a recommendation from this room.',
    'Stay in character: you all still have something at stake. Three questions, decided by a show of hands.'
  ];

  const CARDS = [
    { title: 'The law', text: 'The Disclosure Act protects an employee who goes to the press only in three cases: they told the regulator first and nothing was done within three months; or there was an imminent or manifest danger to the public; or evidence was about to be destroyed.' },
    { title: 'The profession', text: 'A solicitor may break a client’s confidence only to prevent serious bodily harm or a crime. The rule for everything else is short: resign, and say nothing.' },
    { title: 'The science', text: 'The limit of 0.10 µg/L is set for a lifetime of drinking the water, with a wide margin. Ten more days at 0.14 changes almost nothing for anybody’s health. It changes a great deal for whether they will ever believe the company again.' },
    { title: 'This morning', text: 'By ten o’clock the shops in Ashby had sold out of bottled water. The Inspectorate has postponed its price ruling. Northmere’s bonds have been marked down, and £180 million of investment is in doubt. Robin’s own overnight re-run came back at 0.13: the result was real.' },
    { title: 'The hotline', text: 'Disclosed by the Inspectorate an hour ago: in January its hotline received a report from “a member of Northmere staff” about a rising trend at Ashby. It was answered automatically and never followed up.' }
  ];

  const QUESTIONS = [
    { id: 'q1', q: 'Was Alex right to send the note to The Courier?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }] },
    { id: 'q2', q: 'What happens to Alex?', options: [
      { id: 'tribunal', label: 'Dismissed, and reported to the Solicitors’ Tribunal' },
      { id: 'quiet', label: 'Leaves by agreement, with a reference' },
      { id: 'warning', label: 'Stays, with a written warning' },
      { id: 'apology', label: 'Stays, and the Board apologises' }] },
    { id: 'q3', q: 'Who answers for the ten days?', options: [
      { id: 'nobody', label: 'Nobody. It ends here.' },
      { id: 'jo', label: 'Jo Lindqvist goes too' },
      { id: 'ceo', label: 'The Chief Executive is asked to resign' }] }
  ];

  // Hearing aims: one point each if the vote lands where the character wanted it.
  const AIMS = {
    jo: v => v.q2 === 'tribunal' && v.q3 === 'nobody',
    sam: v => v.q2 === 'quiet',
    robin: v => (v.q2 === 'warning' || v.q2 === 'apology') && v.q3 !== 'nobody',
    alex: v => v.q2 === 'warning' || v.q2 === 'apology'
  };

  const EPILOGUE = {
    open: 'Ashby was put on blended supply within the week. The price ruling came three months late.',
    q2: {
      tribunal: 'Alex Mercer was dismissed on the Friday and referred to the Solicitors’ Tribunal, which sat fourteen months later. By then the Disclosure Act had been amended. The newspapers called it Mercer’s clause.',
      quiet: 'Alex Mercer left “by mutual agreement”, with a reference that mentions neither Ashby nor The Courier. Three water companies have since declined to interview Northmere’s former General Counsel.',
      warning: 'Alex Mercer kept the job and was given a written warning. Board papers are now numbered, watermarked and counted back in.',
      apology: 'The Board apologised to Alex Mercer in writing. The letter was drafted, as all the Board’s letters are, by the General Counsel.'
    },
    q3: {
      nobody: 'Nobody else answered for the ten days. The Inspectorate’s report, published in the autumn, used the word “culture” eleven times.',
      jo: 'Jo Lindqvist resigned the same week, and a month later was announced as chief executive of Calder Utilities.',
      ceo: 'Marianne Holt resigned before the Inspectorate could ask her to. Her successor’s first act was to publish every water-quality result within a day of receiving it.'
    },
    close: 'Dana Reyes won the regional press award for the story. She has never said who sent it.'
  };

  const CLOSERS = [
    'Northmere’s public statement, in sixty words.',
    'The Courier’s editorial: the headline and the first sentence.',
    'Alex Mercer’s letter to the Board.'
  ];

  function castFor(room, n) {
    const list = n >= 4 ? META.all : META.all.filter(c => c !== META.absent);
    return root.K.shuffle(list, root.K.rng(room + ':cast'));
  }

  root.LEAK = { META, PREMISE, RULES, CAST, AWAY: SAM_STATEMENT, EXHIBITS, ROUNDS, SOLUTION, HEARING_INTRO, CARDS, QUESTIONS, AIMS, EPILOGUE, CLOSERS, castFor };
})(typeof window !== 'undefined' ? window : globalThis);
