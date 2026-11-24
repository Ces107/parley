/* The Leak — class scenario. A confidential paper reached a newspaper. Who sent it, and were they right to? */
(function (root) {
  'use strict';

  const META = {
    when: 'National Examinations Board · Tuesday 12 August, 10:00',
    place: 'The Board room',
    label: 'National Examinations Board',
    lead: 'A confidential paper reached a newspaper. One of you sent it. Bring pencils; print the case notebook and the exhibits if you can.',
    all: ['kit', 'morgan', 'rowan', 'ellis'],
    leaker: 'ellis',
    absent: 'rowan',
    awayTitle: 'Rowan Haddad is not here.',
    awayTag: ['Given to the Chief Executive', 'Monday evening'],
    prompts: ['Who are you, and what was your part in this?', 'What happened to your copy of Paper 14 after Friday’s meeting?', 'Where were you on Sunday evening?'],
    truth: 'It was Ellis Marsh.',
    clear: 'kit',
    secrets: [
      { who: 'kit', id: 'prof', chip: 'Kit’s email to the professor came out', kept: 'The professor stayed out of it' },
      { who: 'rowan', id: 'lookup', chip: 'Rowan’s look-up came out', kept: 'The look-up stayed quiet' }
    ],
    verdict: { yes: 'The room found the leak justified.', no: 'The room found the leak unjustified.' },
    tie: 'A tie goes to the more cautious answer: that is what the Chief Executive would choose.',
    grid: ['Which copy? Where is it now?', 'Where on Sunday evening?', 'Hiding something?'],
    real: 'In August 2020, with examinations cancelled, England’s regulator calculated A-level grades with a statistical model. About 39 per cent of the grades teachers had proposed were lowered, and very small classes, commoner in private schools, were largely exempt. After four days of protest pupils were given whichever grade was higher.'
  };

  const PREMISE = [
    'After the spring floods the written examinations were cancelled. For the first time, final grades for 280,000 school-leavers were set by a statistical model: teachers ranked their pupils, and the model fitted those rankings to each school’s results over the past three years.',
    'On Friday the Board met to consider Paper 14, a confidential analysis of what the model does. It decided to issue the grades this Thursday, 14 August, as they stand.',
    'On Sunday night somebody sent photographs of Paper 14 to The Record. On Monday morning it was the front page.',
    'It is now Tuesday. The Minister’s inquiry team arrives at half past eleven. The Chief Executive has left you in the Board room with one instruction: find out who it was before they do.'
  ];

  const RULES = [
    'You each have a private brief: who you are, what you know, what you would rather keep quiet.',
    'All of you but one tell only the truth. You may decline to answer a question once; asked again, you answer it.',
    'One of you sent the paper. That person may lie.',
    'No accents, no acting: a name and a motive are enough.',
    'Use the notebook sheet. Times, places and exact wording matter.'
  ];

  const CAST = {
    kit: {
      name: 'Kit Ansah', job: 'Head of Statistics',
      who: 'A statistician, eleven years at the Board. You built the model, and you wrote Paper 14.',
      know: [
        'In May the Ministry instructed the Board that this year’s results must look like last year’s. Your model does that: it takes each school’s results over three years and fits the teachers’ rankings to them.',
        'On Thursday night you finished Paper 14. It shows that 39 per cent of the grades teachers proposed are lowered; that large classes in poor districts lose most; and that classes of fewer than five keep the teacher’s grade, because the model cannot work on groups so small. Such classes are far commoner in fee-paying schools.',
        'Friday, 15:00, the Board room: the Chief Executive, Morgan, Rowan, you, and Ellis from the Minister’s office. Five paper copies in named envelopes; nothing by email. The decision: results go out on Thursday as they stand. You said: “If this goes out as it stands, I will not defend it.”',
        'You sat next to Ellis. During the meeting you pencilled notes in the margins of your copy. On page 3 you wrote “n < 5 = exempt!!”.',
        'At 16:20 the fire alarm went and everybody left for a quarter of an hour, papers on the table. You were one of the last back in. At the end you picked up the copy in front of you, and only that one.',
        'On Saturday morning you took the paper out of your bag and found no pencil marks on it. It was not your copy. You handed it to Rowan on Monday at 09:20, and said so.',
        'On Sunday evening you were at home, working on an appeals calculation over the Board’s remote link from about half past eight until after eleven. Your phone is the Board’s standard Lark.'
      ],
      quiet: [
        'On Saturday you typed the main table of Paper 14 into an email to Professor Lena Okoro, who supervised your doctorate, and asked whether you had got it wrong. She answered in four words: “You have not. Sorry.” That breaks the Board’s rules, and it is a second way the figures could have left the building.'
      ],
      want: 'You did not send it. But the pages in the newspaper are from your copy, with your handwriting on them, and you said what you said on Friday. Find out who did, and clear your name.',
      hearing: 'When it comes to deciding what happens next: you want Thursday’s grades changed, to the teachers’ grades or to whichever is higher, and you want what happened put on the record, not settled in private.',
      liar: false
    },
    morgan: {
      name: 'Morgan Reid', job: 'Director of Standards',
      who: 'Twenty years in examinations. Keeping grades comparable from one year to the next is your job, and choosing the model was your decision.',
      know: [
        'In May the Minister wrote to the Board: this year’s results “must be comparable with those of previous years”. You commissioned Kit’s model to deliver exactly that.',
        'Friday, 15:00: the Chief Executive, Kit, Rowan, you, and Ellis from the Minister’s office. Five paper copies of Paper 14 in named envelopes. You argued that teachers’ grades alone would be the largest inflation in the Board’s history, and the meeting agreed to go ahead on Thursday. Kit said: “If this goes out as it stands, I will not defend it.”',
        'At 16:20 the fire alarm went and everybody left, papers on the table. When you came back some of the others were already at the table. You could not now say who.',
        'You took your own copy home and returned it to Rowan on Monday at five past nine.',
        'On Saturday you spoke at the head teachers’ conference in Northgate. On Sunday you took the 18:40 train home to Lowbridge, got in at five past nine, drove home from the station car park and were indoors by half past nine, alone. Your phone is a Meridian 7: the Board gives them to directors.'
      ],
      quiet: [
        'On 19 June a trial run of the model on last year’s results showed the same pattern. You saw it, judged it “within tolerance”, initialled it and filed it. It was never minuted and the Board was never told. If that comes out, the question stops being who leaked and becomes why nothing was done for seven weeks.'
      ],
      want: 'You did not send it. Find out who did. Keep 19 June out of the conversation if you can.',
      hearing: 'When it comes to deciding what happens next: you want the model’s grades issued on Thursday with a fast appeal, and whoever did this dealt with in private.',
      liar: false
    },
    rowan: {
      name: 'Rowan Haddad', job: 'Secretary to the Board',
      who: 'Secretary to the Board for nine years. You keep its papers, its minutes and its secrets.',
      know: [
        'In June a paper on examination fees reached the press. Since then, on the Chief Executive’s instruction, sensitive papers are tabled on paper only, and each copy differs from the others by a word or two. The copies look identical and carry no number. Only the Chief Executive has the key; you have never seen it.',
        'Paper 14 went out on Friday in five envelopes with names on them: Morgan, Kit, Ellis, you, and the Chief Executive. Your own copy and the Chief Executive’s have been in your safe since half past five on Friday.',
        'At 16:20 the fire alarm went. You were the last out and you did not lock the room. Everybody was back within a quarter of an hour. At the end you did not count the copies off the table: you assumed everybody had taken their own.',
        'On Monday Morgan returned a copy at 09:05. At 09:20 Kit handed in a copy with no marks on it and said: “This is the one that was in my bag. It is not the one I was given.” At 09:40 Ellis rang to say: “I have nothing to return. My copy was gone from my place after the fire alarm; I left without one.” The Chief Executive has since checked the returned copies against the key. You have not been told the result.',
        'On Sunday evening you were at home. Your phone is the Board’s standard Lark.'
      ],
      quiet: [
        'Your youngest sat the examinations this year. On Friday night, and again on Sunday at about a quarter to ten, you used your access to the results database to open one record: theirs. The model has turned AAB into BBC, and the university place is gone. The Secretary to the Board is not supposed to look, and you of all people now have a reason to want Thursday stopped.'
      ],
      want: 'You did not send it. Find out who did. Keep your own look-up out of the conversation if you can.',
      hearing: 'When it comes to deciding what happens next: you want Thursday’s grades changed, to the teachers’ grades or to whichever is higher. If your child comes into it, you may be asked to stand aside.',
      liar: false
    },
    ellis: {
      name: 'Ellis Marsh', job: 'Special Adviser to the Minister',
      who: 'Special adviser to the Minister of Education: a political appointment, not a civil servant. You sent it.',
      know: [
        'Friday, 15:00: you sat in on the Board’s meeting, next to Kit. It was the first time you had seen Paper 14. Kit said: “If this goes out as it stands, I will not defend it.”',
        'At 16:20 the fire alarm went. You were first back into the room. The copy at Kit’s place had pencil notes in the margins. You took it, and left your own clean copy where it had been. At the end Kit picked that one up without looking.',
        'On Sunday you caught the 21:15 from Capital Central to Harrow Vale, the Minister’s constituency. At 21:52 you photographed four pages on the seat-back table with your Ministry phone, a Meridian 7. At 22:40 you sent the photographs from a new email address to Sacha Lund, education editor of The Record, with three lines of your own.',
        'On Monday morning you put the pages through the shredder at the constituency office.',
        'Your story, which you have already given Rowan by telephone: when you came back from the fire alarm your copy was no longer at your place. You sat through the rest of the meeting without one and went home empty-handed.'
      ],
      quiet: [
        'On Thursday more than a hundred thousand pupils would have been marked down, and by Friday it would have been “the Minister’s algorithm”. This way it is the Board’s paper, the Board’s warning and the Board’s decision: the Minister is “demanding answers” by Monday lunchtime and can order a rescue before results day. The pencil notes were a piece of luck: if the copy were ever traced, it would be traced to Kit. You tell yourself that the pupils come out of it better too.'
      ],
      want: 'Do not be found out. You may lie. You succeed if fewer than half of the others name you. Kit made a threat in front of everybody, the pages are Kit’s, and it is Kit who walked off with your copy. Let that do the work.',
      hearing: 'If you are found out, you will be asked to explain yourself. From then on, tell the truth. You want it kept between the Board and the Minister.',
      liar: true
    }
  };

  // Shown on the screen when only three play: Rowan is away, and has left a statement.
  const AWAY = [
    'Statement of R. Haddad, Secretary to the Board, given to the Chief Executive on Monday evening.',
    'Since June, sensitive papers have been tabled on paper only, and each copy differs from the others by a word or two. The copies carry no number. The Chief Executive keeps the key; I have never seen it. Paper 14 went out on Friday in five named envelopes: M. Reid, K. Ansah, E. Marsh, myself and the Chief Executive. My copy and the Chief Executive’s have been in my safe since 17:30 on Friday.',
    'When the fire alarm went at 16:20 I was the last to leave, and I did not lock the room. At the end of the meeting I did not count the copies off the table.',
    'On Monday M. Reid returned a copy at 09:05. At 09:20 K. Ansah handed in an unmarked copy and said it was not the one issued. At 09:40 E. Marsh telephoned to say there was nothing to return: the Ministry’s copy had gone from the table during the fire alarm. On Sunday evening I was at home.'
  ];

  const EXHIBITS = [
    {
      id: 'A', round: 1, title: 'The Record, Monday', tag: 'Front page',
      html: '<div class="press"><h5>Exam algorithm marks down the poorest pupils</h5>' +
        '<p><b>By Sacha Lund, Education Editor</b></p>' +
        '<p>Tens of thousands of school-leavers will be given lower grades on Thursday than their teachers recommended, and those at large state schools in the poorest districts will lose most, according to an internal paper of the National Examinations Board, photographed and sent to The Record.</p>' +
        '<p>“Some 39 per cent of grades are lowered,” the paper states. Pupils in big classes are tied to their school’s past results, “whilst pupils in classes of fewer than five keep the grade their teachers gave them”. Such classes are nine times as common in fee-paying schools.</p>' +
        '<p>A pencilled note in the margin of the third page reads: “n &lt; 5 = exempt!!”</p>' +
        '<p>The four photographs arrived by email at 10.40pm on Sunday, from an address created the same evening. The sender wrote: “The Board’s own data shows who loses. Results are out August 14. Somebody should ask who signed this off.”</p>' +
        '<p>The Board said last night that it does not comment on leaked documents.</p>' +
        '<p><i>Photographs: pages 1 to 4 of “Paper 14”, as received. Quotations from the paper and from the sender are reproduced exactly, in their own spelling.</i></p></div>'
    },
    {
      id: 'B', round: 1, title: 'The Chief Executive’s key: Paper 14', tag: 'Five copies, Friday',
      html: '<table><tr><th>Copy</th><th>Envelope addressed to</th><th>Paragraph 2</th><th>Paragraph 4</th></tr>' +
        '<tr><td>1</td><td>M. Reid</td><td>“Some 39 per cent…”</td><td>“…while pupils in classes of fewer than five…”</td></tr>' +
        '<tr><td>2</td><td>K. Ansah</td><td>“Some 39 per cent…”</td><td>“…whilst pupils in classes of fewer than five…”</td></tr>' +
        '<tr><td>3</td><td>E. Marsh</td><td>“Some 39 percent…”</td><td>“…while pupils in classes of fewer than five…”</td></tr>' +
        '<tr><td>4</td><td>R. Haddad</td><td>“Some 39 percent…”</td><td>“…whilst pupils in classes of fewer than five…”</td></tr>' +
        '<tr><td>5</td><td>C. Abbott</td><td>“Some 39 per cent…”</td><td>“…although pupils in classes of fewer than five…”</td></tr>' +
        '<tr><td colspan="4">The copies are otherwise identical and carry no number. Five were printed, in the Chief Executive’s office; the printer’s log shows no other. Nobody but the Chief Executive had seen this key before today.</td></tr></table>'
    },
    {
      id: 'C', round: 2, title: 'The Chief Executive’s check: Paper 14', tag: 'Monday afternoon',
      html: '<table><tr><th>Copy</th><th>Issued to</th><th>Where it is now</th></tr>' +
        '<tr><td>1</td><td>M. Reid</td><td>Returned Monday 09:05. No marks.</td></tr>' +
        '<tr><td>2</td><td>K. Ansah</td><td>Not returned.</td></tr>' +
        '<tr><td>3</td><td>E. Marsh</td><td>Handed in Monday 09:20 by K. Ansah. No marks.</td></tr>' +
        '<tr><td>4</td><td>R. Haddad</td><td>In the Secretary’s safe since Friday 17:30.</td></tr>' +
        '<tr><td>5</td><td>C. Abbott</td><td>In the Secretary’s safe since Friday 17:30.</td></tr>' +
        '<tr><td colspan="3">Each copy was identified by checking its wording against the key. From the Secretary’s register. K. Ansah, handing in a copy: “This is the one that was in my bag. It is not the one I was given.” E. Marsh, by telephone at 09:40: “I have nothing to return. My copy was gone from my place after the fire alarm; I left without one.”</td></tr></table>'
    },
    {
      id: 'D', round: 2, title: 'Four emails', tag: 'From the Board’s mail archive',
      html: '<table><tr><th>From, to, when</th><th>Text</th></tr>' +
        '<tr><td>K. Ansah to R. Haddad<br>Thursday 22:14</td><td>Paper 14 is ready for tomorrow. The data are unambiguous, I am afraid. I would like twenty minutes, not ten. Results day is 14 August: there is still time to put this right, just.</td></tr>' +
        '<tr><td>R. Haddad to all<br>Friday 09:30</td><td>Papers for this afternoon will be tabled in hard copy only. Please return your copy to me by Monday 11 August, or destroy it. For the avoidance of doubt, the data in Paper 14 are embargoed until results day, 14 August.</td></tr>' +
        '<tr><td>E. Marsh to M. Reid<br>Friday 18:05</td><td>Thanks for today. The Minister will want a line Monday. The data shows what it shows, but nobody outside that room needs the detail before August 14. We should keep it tight.</td></tr>' +
        '<tr><td>M. Reid to C. Abbott<br>Saturday 08:02</td><td>My view has not changed overnight. The data is what it is, and the alternative is inflation on a scale we could never defend. We publish on 14 August, as planned.</td></tr></table>'
    },
    {
      id: 'E', round: 3, title: 'IT security: the photographs', tag: 'Monday 15:30',
      html: '<p>The Record put the four photographs on its website without removing the information stored inside the files.</p>' +
        '<p><b>Taken: Sunday 10 August, between 21:52 and 21:54. Device: Meridian 7. Location: switched off.</b></p>' +
        '<p>The Meridian 7 is not sold to the public: it is supplied only to government departments and public bodies.</p>' +
        '<p>At the left-hand edge of the third photograph, beneath the page: a fold-down seat-back table carrying the NorthRail emblem.</p>'
    },
    {
      id: 'F', round: 3, title: 'Phones, journeys, remote access', tag: 'Sunday 10 August',
      html: '<table><tr><th>Who</th><th>Phone issued</th><th>Sunday</th></tr>' +
        '<tr><td>K. Ansah</td><td>Lark S (Board, staff)</td><td>No journey. Remote link to the statistics server from home broadband, 20:31 to 23:12, in use throughout.</td></tr>' +
        '<tr><td>M. Reid</td><td>Meridian 7 (Board, directors)</td><td>NorthRail 18:40 Northgate to Lowbridge, arrived 21:05. Car out of the station car park at 21:13.</td></tr>' +
        '<tr><td>R. Haddad</td><td>Lark S (Board, staff)</td><td>No journey. Remote link to the results database from home broadband, 21:44 to 22:06. One record opened.</td></tr>' +
        '<tr><td>E. Marsh</td><td>Meridian 7 (Ministry)</td><td>NorthRail 21:15 Capital Central to Harrow Vale, arrived 23:50.</td></tr>' +
        '<tr><td>C. Abbott</td><td>Meridian 7 (Board, directors)</td><td>In Lisbon from Friday 20:10 to Monday 07:40.</td></tr>' +
        '<tr><td colspan="3">From the travel desks of the Board and the Ministry, the car-park barrier and the Board’s network log. None of the five made any other journey that day. Lowbridge is ninety minutes by rail from Capital Central.</td></tr></table>'
    }
  ];

  const ROUNDS = [
    { n: 1, title: 'What the paper had', ask: 'Whose copy reached The Record?', ids: ['A', 'B'],
      hints: ['Read the newspaper’s two quotations letter by letter.', 'One word for “while”; and is “per cent” one word or two?', 'The Record had copy 2: the one addressed to Kit, with Kit’s pencil note on it. Does that settle it?'] },
    { n: 2, title: 'Where the copies went', ask: 'Who had copy 2 after Friday, and who writes like the sender?', ids: ['C', 'D'],
      hints: ['Which copy did Kit hand in on Monday, and whose was it?', 'Kit says: I took one copy, and it was not mine. Ellis says: I took none. If both were true, where is copy 2?', 'Set the sender’s three sentences beside the four emails. Look at the verb after “data”, and at how each of them writes a date.'] },
    { n: 3, title: 'The photographs', ask: 'Who took them?', ids: ['E', 'F'],
      hints: ['Where were the photographs taken, and at what time?', 'Who carries that model of phone, and where was each of them at 21:52?', 'One train had reached Lowbridge at 21:05. Another left Capital Central at 21:15.'] }
  ];

  const SOLUTION = [
    'The Record quoted “whilst” and “per cent”. Only copy 2 has both: the copy addressed to Kit, with Kit’s pencil note in the margin.',
    'But the copy Kit handed in on Monday was copy 3, the one addressed to Ellis. The two copies changed places on Friday, when the room stood empty during the fire alarm.',
    'So either Kit went home with both copies, or Ellis went home with Kit’s and has lied about leaving empty-handed. The paper trail alone cannot say which.',
    'The photographs can. They were taken at 21:52 on Sunday, on a NorthRail seat-back table, with a Meridian 7. Kit and Rowan carry Larks and were both at home on the Board’s network. Morgan’s train had reached Lowbridge at 21:05 and Morgan’s car left the station at 21:13. The Chief Executive was in Lisbon. Ellis’s train left Capital Central at 21:15.',
    'And the sender wrote “the data shows” and “August 14”. Of the four, only Ellis writes both.'
  ];

  const HEARING_INTRO = [
    'The Minister’s inquiry team is in the lobby. Before it comes up, the Chief Executive wants a recommendation from this room, and results day is the day after tomorrow.',
    'Stay in character: you all still have something at stake. Three questions, decided by a show of hands.'
  ];

  const CARDS = [
    { title: 'The numbers', text: 'Of 720,000 grades, 39 per cent are lower than the teacher proposed. In large classes in the poorest fifth of districts the figure is 48 per cent. In fee-paying schools, where one class in three has fewer than five pupils, it is 21 per cent.' },
    { title: 'The other side', text: 'Left alone, the teachers’ grades would give 38 per cent of entries one of the top two grades. Last year it was 26. The universities made their offers on last year’s pattern: 22,000 more pupils would qualify than there are places.' },
    { title: 'The rules', text: 'A special adviser is bound by a code: no disclosure of official information without authority, and answerable to the Minister alone. The Board cannot discipline one. It can tell the Minister, complain to the Cabinet Office, or tell the public.' },
    { title: 'Since Monday', text: 'A petition has 190,000 signatures. Two universities have promised to honour every offer they made. On the radio this morning the Minister said: “I was not shown this paper, and I have asked the Board for an explanation.”' },
    { title: '19 June', text: 'Found an hour ago on the Statistics drive: a trial run of the model on last year’s results, dated 19 June, showing the same pattern. It is initialled M.R. and marked “within tolerance”. It was never minuted.' }
  ];

  const QUESTIONS = [
    { id: 'q1', q: 'Was Ellis right to send it to The Record?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }] },
    { id: 'q2', q: 'What does the Board do about Ellis?', options: [
      { id: 'private', label: 'Tell the Minister in private, and nobody else' },
      { id: 'formal', label: 'Complain formally to the Cabinet Office' },
      { id: 'public', label: 'Say so in public' },
      { id: 'nothing', label: 'Nothing, and keep it in reserve' }] },
    { id: 'q3', q: 'What happens on Thursday?', options: [
      { id: 'model', label: 'The model’s grades, with a fast appeal' },
      { id: 'teachers', label: 'The teachers’ grades' },
      { id: 'higher', label: 'Whichever of the two is higher' },
      { id: 'delay', label: 'Results delayed two weeks, and the model rerun' }] }
  ];

  // Hearing aims: points if the votes land where the character wanted them.
  const AIMS = {
    kit: v => (v.q3 === 'teachers' || v.q3 === 'higher') && (v.q2 === 'formal' || v.q2 === 'public'),
    morgan: v => v.q3 === 'model' && v.q2 === 'private',
    rowan: v => v.q3 === 'teachers' || v.q3 === 'higher',
    ellis: v => v.q2 === 'private' || v.q2 === 'nothing'
  };

  const EPILOGUE = {
    open: 'The inquiry sat for two days and reported within the week.',
    q2: {
      'private': 'The Minister was told in private. In the autumn reshuffle Ellis Marsh moved, with the Minister, to a larger department.',
      formal: 'The Cabinet Office took four months and found “a serious error of judgement”. Ellis Marsh resigned the day before the finding was published, and now advises examination boards.',
      'public': 'The Board named Ellis Marsh at a press conference. The Minister lasted eleven more days.',
      nothing: 'Nothing was said. The Board’s budget review in October went unexpectedly well.'
    },
    q3: {
      model: 'The model’s grades went out on Thursday. By the following Tuesday there were 61,000 appeals and a date in court.',
      teachers: 'The teachers’ grades went out. The universities took 22,000 more students than they had rooms for, and that year’s school-leavers have been explaining their certificates ever since.',
      higher: 'Every pupil received the higher of the two grades. Nobody could say what the grades now measured, and nobody asked.',
      delay: 'Results day moved by two weeks. The rerun changed four grades in a hundred. Term began with a third of the new students still waiting to hear.'
    },
    close: 'Paper 14 is now taught on statistics courses, under a title its author never gave it: how a fair method produces an unfair result.'
  };

  const CLOSERS = [
    'The Board’s public statement, in sixty words.',
    'The Record’s editorial: the headline and the first sentence.',
    'A letter to the Board from one of the 280,000.'
  ];

  function castFor(room, n) {
    const list = n >= 4 ? META.all : META.all.filter(c => c !== META.absent);
    return root.K.shuffle(list, root.K.rng(room + ':cast'));
  }

  root.LEAK = { META, PREMISE, RULES, CAST, AWAY, EXHIBITS, ROUNDS, SOLUTION, HEARING_INTRO, CARDS, QUESTIONS, AIMS, EPILOGUE, CLOSERS, castFor };
})(typeof window !== 'undefined' ? window : globalThis);
