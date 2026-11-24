/* The Panel — content. Four BBC-style rounds: talk, bluff, lie, smuggle. */
(function (root) {
  'use strict';

  const ROUNDS = {
    jam: {
      name: 'One Minute', sym: '1',
      rules: [
        'Speak on the subject for sixty seconds without hesitation, repetition or deviation.',
        'Anybody else may buzz. The clock stops and they say which of the three it was.',
        'Challenge upheld: the challenger gets a point and takes over the subject for the time that is left.',
        'Challenge overruled: the speaker gets a point and carries on.',
        'Whoever is speaking when the minute ends gets a point. A whole minute with no challenge at all earns one more.'
      ]
    },
    bluff: {
      name: 'The Dictionary', sym: 'D',
      rules: [
        'A real English word that nobody knows. The Reader has the true definition on their phone and copies it onto a slip of paper.',
        'Everybody else writes a definition they have invented, in the style of a dictionary. Two minutes.',
        'The Reader shuffles the slips and reads them all out, straight-faced. On three, everyone points.',
        'Two points for choosing the true definition. One point for every person who chooses yours.',
        'If nobody finds the truth, the Reader gets two.'
      ]
    },
    wilty: {
      name: 'True or Not', sym: 'T',
      rules: [
        'First, on paper: two true things about yourself that people would not guess. One sentence each. Keep them hidden.',
        'On your turn your phone says TRUTH or LIE. Truth: use one of your own. Lie: claim what your phone says, as if it happened to you.',
        'The others cross-examine you for two and a half minutes. Invent whatever you need.',
        'They vote. One point for each correct vote; one point to the speaker for each person fooled.'
      ]
    },
    truth: {
      name: 'The Lecture', sym: 'L',
      rules: [
        'Your phone gives you a subject and three true facts about it.',
        'Give a ninety-second lecture that is false from beginning to end, except for those three facts. Hide them well.',
        'The others buzz when they think they have heard something true. Right: a point. Wrong: they lose one.',
        'The lecturer gets a point for every truth that slips past.'
      ]
    }
  };

  const SUBJECTS = [
    'Queues', 'My least favourite word', 'The office kitchen', 'What the Romans got wrong', 'A law I would repeal', 'Airports',
    'Small talk', 'The perfect apology', 'Things that ought to be taxed', 'Jury duty', 'Open-plan offices', 'The best age to be',
    'Nuclear power', 'Tipping', 'Passwords', 'A skill nobody needs any more', 'Group chats', 'The case for boredom',
    'Referees', 'Why meetings overrun', 'Self-checkout machines', 'Inheritance', 'Daylight saving time', 'Peer review',
    'My first job', 'Roundabouts', 'What I would put in a time capsule', 'The metric system', 'Terms and conditions',
    'A city I could never live in', 'Neighbours', 'Compulsory voting', 'The comma', 'Cash', 'Subtitles', 'How to lose an argument',
    'Sunday evenings', 'Statistics', 'The word “literally”', 'Hotel breakfasts', 'Experts', 'Borrowed words', 'Deadlines',
    'The phone call nobody makes any more', 'A sport I do not understand', 'Lawyers', 'The last thing I repaired', 'Small countries'
  ];

  const WORDS = [
    { w: 'gongoozler', pos: 'noun', def: 'An idle spectator; originally, a person who stands watching the boats on a canal.' },
    { w: 'mumpsimus', pos: 'noun', def: 'A belief stubbornly held although it has been shown to be wrong; also, a person who holds one.' },
    { w: 'ultracrepidarian', pos: 'noun', def: 'A person who gives opinions on matters they know nothing about.' },
    { w: 'nudiustertian', pos: 'adjective', def: 'Of, or belonging to, the day before yesterday.' },
    { w: 'quockerwodger', pos: 'noun', def: 'A wooden puppet worked by strings; hence, a politician whose strings are pulled by somebody else.' },
    { w: 'snollygoster', pos: 'noun', def: 'A shrewd, unprincipled person, especially a politician.' },
    { w: 'borborygmus', pos: 'noun', def: 'The rumbling sound made by gas and fluid moving through the intestines.' },
    { w: 'absquatulate', pos: 'verb', def: 'To leave abruptly; to make off.' },
    { w: 'widdershins', pos: 'adverb', def: 'Anticlockwise; in the direction contrary to the course of the sun.' },
    { w: 'velleity', pos: 'noun', def: 'A wish so faint that it leads to no action at all.' },
    { w: 'apricity', pos: 'noun', def: 'The warmth of the sun in winter.' },
    { w: 'spanghew', pos: 'verb', def: 'To throw violently into the air; originally, to launch a frog from the end of a stick.' },
    { w: 'gobemouche', pos: 'noun', def: 'A credulous person who believes everything they are told.' },
    { w: 'ucalegon', pos: 'noun', def: 'A neighbour whose house is on fire.' },
    { w: 'jentacular', pos: 'adjective', def: 'Of or relating to breakfast.' },
    { w: 'cacography', pos: 'noun', def: 'Bad handwriting, or bad spelling.' },
    { w: 'filipendulous', pos: 'adjective', def: 'Hanging by a thread.' },
    { w: 'roorback', pos: 'noun', def: 'A false story published to damage a political opponent.' },
    { w: 'queach', pos: 'noun', def: 'A dense thicket of bushes.' },
    { w: 'taradiddle', pos: 'noun', def: 'A petty lie; pretentious nonsense.' },
    { w: 'cockalorum', pos: 'noun', def: 'A self-important little man.' },
    { w: 'gardyloo', pos: 'interjection', def: 'A warning once shouted in Edinburgh before slops were thrown from an upstairs window.' },
    { w: 'crapulous', pos: 'adjective', def: 'Feeling ill as a result of eating or drinking too much.' },
    { w: 'logomachy', pos: 'noun', def: 'An argument about words.' }
  ];

  const LIES = [
    'I once spent a night locked inside a public library.',
    'I was held at an airport for two hours because I share a name with somebody on a watch list.',
    'I have appeared as an extra in a feature film.',
    'I failed my driving test four times.',
    'I once had lunch next to a head of state without realising who it was.',
    'I have a scar from an argument with a swan.',
    'I was banned from a library for a year.',
    'I once spent three weeks pretending to speak a language I could not speak.',
    'I have been on live television by accident.',
    'I returned a lost wallet and the owner accused me of stealing from it.',
    'As a child I ran a small business that my school closed down.',
    'I gave a speech at the wedding of two people I had met that morning.',
    'I once drove for three hours in the wrong direction before noticing.',
    'I own something that used to belong to somebody famous.',
    'I was once the only passenger on a scheduled flight.',
    'I have been stuck in a lift for more than two hours.',
    'I got a job by answering an interview question completely wrong.',
    'I have eaten the same breakfast every day for ten years.',
    'I was once paid to stand in a queue.',
    'I have received a written apology from a government ministry.',
    'I hold a qualification that I have never mentioned to an employer.',
    'I sold something online and later saw it in the window of an antiques shop.',
    'I shared a taxi with a stranger who turned out to be my next boss.',
    'I have been asked to leave a wedding.',
    'I missed a flight while sitting at the gate.',
    'There is a photograph of me on the wall of a bar in another country.',
    'I won a competition that I did not know I had entered.',
    'I have been bitten by an animal in a zoo.',
    'I spent an entire holiday in the wrong town.',
    'I have given evidence in court.',
    'I once taught a class on a subject I knew nothing about.',
    'I have kept a list of every book I have read since I was twelve.',
    'I was once offered a bribe.',
    'I had to make an announcement over an airport loudspeaker.',
    'I was a regional champion in a sport none of you would guess.',
    'I once walked out of my own birthday party.'
  ];

  // Every fact below has been checked. Keep it that way if you add more.
  const LECTURES = [
    { subject: 'Octopuses', truths: ['An octopus has three hearts.', 'Its blood is blue.', 'About two-thirds of its neurons are in its arms, not its head.'] },
    { subject: 'The planet Venus', truths: ['A day on Venus lasts longer than its year.', 'Venus spins the opposite way to most planets.', 'It is the hottest planet, hotter than Mercury.'] },
    { subject: 'Bananas', truths: ['To a botanist a banana is a berry, and a strawberry is not.', 'Bananas are slightly radioactive.', 'Nearly every banana in the supermarket is a clone of the same plant.'] },
    { subject: 'Sharks', truths: ['Sharks have existed for longer than trees.', 'A shark has no bones.', 'The Greenland shark can live for more than 250 years.'] },
    { subject: 'Nintendo', truths: ['Nintendo was founded in 1889.', 'It began by making playing cards.', 'It started in Kyoto, and its headquarters are still there.'] },
    { subject: 'The University of Oxford', truths: ['There was teaching at Oxford by 1096.', 'The university is older than the Aztec empire.', 'Nobody knows the date it was founded.'] },
    { subject: 'Honey bees', truths: ['A bee tells the hive where the food is by dancing.', 'The scientist who decoded the dance won a Nobel Prize.', 'A male bee has no father.'] },
    { subject: 'The guillotine', truths: ['France last used the guillotine in 1977.', 'The last public guillotining in France was in 1939.', 'Dr Guillotin, who gave it his name, was against the death penalty.'] },
    { subject: 'The fax machine', truths: ['The fax machine was patented in 1843.', 'That was more than thirty years before the telephone.', 'Its inventor was a Scottish clockmaker.'] },
    { subject: 'Cleopatra', truths: ['Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.', 'Her family was Greek, not Egyptian.', 'She shared the throne with two of her own brothers, one after the other.'] },
    { subject: 'The calendar', truths: ['In 2011 Samoa skipped a day: 30 December never happened there.', 'It did so to share a working week with Australia and New Zealand.', 'Kiribati moved the date line in 1995 so that the whole country could have the same date.'] },
    { subject: 'Printers', truths: ['Many colour printers add a pattern of tiny yellow dots to every page.', 'The dots can identify the machine that printed the page.', 'Manufacturers did this for years before the public found out.'] }
  ];

  const K = () => root.K;
  // The whole evening is derived from the room code, so the screen and every phone agree without talking.
  function plan(room, n, v) {
    const half = list => list.filter((_, i) => (i % 2 === 0) === (v !== 'class'));
    const SUBJECTS_ = half(SUBJECTS), WORDS_ = half(WORDS), LIES_ = half(LIES), LECTURES_ = half(LECTURES);
    const r = K().rng(room + ':panel:' + (v === 'class' ? 'class' : 'rehearsal'));
    const seats = Array.from({ length: n }, (_, i) => i);
    const jamTurns = n * 2;
    const subjects = K().sample(SUBJECTS_, jamTurns, r);
    const jam = subjects.map((s, i) => ({ subject: s, starter: i % n }));
    const words = K().sample(WORDS_, 4, r);
    const bluff = words.map((w, i) => ({ word: w, reader: i % n }));
    const wTurns = n === 3 ? 4 : n;
    const lies = K().sample(LIES_, wTurns, r);
    let kinds = [];
    do { kinds = Array.from({ length: wTurns }, () => r() < 0.5); } while (kinds.every(Boolean) || !kinds.some(Boolean));
    const order = K().shuffle(seats, r);
    const wilty = lies.map((l, i) => ({ speaker: order[i % n], truth: kinds[i], lie: l }));
    const lect = K().sample(LECTURES_, n, r);
    const tOrder = K().shuffle(seats, r);
    const truth = lect.map((l, i) => ({ lecturer: tOrder[i], subject: l.subject, truths: l.truths }));
    return { jam, bluff, wilty, truth };
  }

  root.PANEL = { ROUNDS, SUBJECTS, WORDS, LIES, LECTURES, plan };
})(typeof window !== 'undefined' ? window : globalThis);
