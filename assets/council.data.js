/* The Council — content. A tiny island state, one year, nine decisions. */
(function (root) {
  'use strict';

  const GAUGES = [
    { id: 'treasury', name: 'Treasury' },
    { id: 'trust', name: 'Trust' },
    { id: 'reef', name: 'Reef' },
    { id: 'standing', name: 'Standing' }
  ];

  const RULES = [
    'You are the first Council of Ministers of the Republic of Skerry: one island, 9,400 people, independent since January.',
    'For each dispatch the Chair reads it aloud, you argue, and at the bell you vote by hand. A majority carries it. The Chair breaks a tie.',
    'Four gauges, from 0 to 10. Every second dispatch the wages fall due and the Treasury loses a point. If any gauge reaches zero the state is in emergency. A second emergency and the government falls.',
    'Everyone holds two markers (coins will do). Spend one and your vote counts double. Markers can be given away: that is what they are for.',
    'First you write the Charter. Only afterwards does your phone tell you which ministry is yours, and what you promised to get it.'
  ];

  const CHARTER = [
    {
      id: 'cit', title: 'Article 1', question: 'Who is a Skerran?',
      text: 'Nine thousand four hundred people live here. Some arrived last year; some families have been here four hundred. The Charter must say who belongs.',
      options: [
        { id: 'blood', label: 'By birth', pitch: 'Born here, or born to a Skerran. Nobody else.', fx: { trust: 1, standing: -1 } },
        { id: 'resident', label: 'By residence', pitch: 'Anyone who has lived on the island for five years.', fx: { standing: 1 } },
        { id: 'investor', label: 'By residence or investment', pitch: 'Five years here, or a serious investment in the island.', fx: { treasury: 1, trust: -1 } }
      ]
    },
    {
      id: 'tax', title: 'Article 2', question: 'How does the state pay its way?',
      text: 'A hospital, a school, a ferry and a sea wall cost about $40 million a year. The island earns less than that.',
      options: [
        { id: 'income', label: 'A flat income tax', pitch: 'Fifteen per cent of what everyone earns.', fx: { treasury: 1, trust: -1 } },
        { id: 'fees', label: 'No income tax', pitch: 'Fees on visitors, ships and registered companies instead.', fx: { trust: 1, standing: -1 } },
        { id: 'land', label: 'Tax what is taken', pitch: 'A levy on land held and on fish landed.', fx: { reef: 1, trust: -1 } }
      ]
    },
    {
      id: 'sea', title: 'Article 3', question: 'Who owns the sea?',
      text: 'Skerry’s waters are four thousand times the size of its land. Whoever controls them controls most of what the island has.',
      options: [
        { id: 'state', label: 'The state', pitch: 'The government licenses fishing and keeps the fees.', fx: { treasury: 1, trust: -1 } },
        { id: 'village', label: 'The villages', pitch: 'Each village keeps the grounds it has always fished.', fx: { trust: 1, treasury: -1 } },
        { id: 'reserve', label: 'No one', pitch: 'The Skerry Bank becomes a reserve, closed to commercial fishing.', fx: { reef: 2, treasury: -1 } }
      ]
    },
    {
      id: 'lang', title: 'Article 4', question: 'In what language does Skerry govern and teach?',
      text: 'Everyone speaks Skerran at home. Contracts, medicine and the internet arrive in English.',
      options: [
        { id: 'skerran', label: 'Skerran', pitch: 'Government and schools in Skerran; English as a foreign language.', fx: { trust: 2, standing: -1 } },
        { id: 'both', label: 'Both, equally', pitch: 'Every law, sign and lesson in two languages.', fx: { treasury: -1 } },
        { id: 'english', label: 'English', pitch: 'English for the state and the schools; Skerran taught as a subject.', fx: { standing: 1, treasury: 1, trust: -2 } }
      ]
    }
  ];

  const PORTFOLIOS = {
    fin: {
      title: 'Minister of Finance', gauge: 'treasury',
      promise: { crisis: 'passports', keeps: ['a'], short: 'Skerry sells passports.' },
      brief: [
        'Your gauge is the TREASURY. Wherever it stands at the end of the year, that is your score.',
        'Your promise: the independence campaign was paid for by Aldwych & Rook, of London, and you signed for it. In return you gave your word that Skerry would sell passports. When “The Passports” comes before the Council, option A must pass.',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    },
    home: {
      title: 'Minister for Home Affairs', gauge: 'trust',
      promise: { crisis: 'gathering', keeps: ['a', 'c'], short: 'The Gathering goes ahead.' },
      brief: [
        'Your gauge is TRUST: whether Skerrans believe in their own government. Wherever it stands at the end of the year, that is your score.',
        'Your promise: the elders of the north villages won you your seat. You gave them your word that the Gathering, the old harvest of seabirds, would never be stopped. When “The Gathering” comes before the Council, it must go ahead (option A or C).',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    },
    sea: {
      title: 'Minister for Sea and Land', gauge: 'reef',
      promise: { crisis: 'reserve', keeps: ['a', 'c'], short: 'The Bank opens to fishing.' },
      brief: [
        'Your gauge is the REEF: the health of the island’s waters and land. Wherever it stands at the end of the year, that is your score.',
        'Your promise: the fishing co-operative paid for your campaign, and you gave them your word that the Skerry Bank would be opened to fishing. When “The Bank” comes before the Council, it must open (option A or C). You know what that does to your own gauge.',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    },
    'for': {
      title: 'Minister for Foreign Affairs', gauge: 'standing',
      promise: { crisis: 'union', keeps: ['a'], short: 'The Union with Meridia is signed.' },
      brief: [
        'Your gauge is STANDING: how the rest of the world sees Skerry. Wherever it stands at the end of the year, that is your score.',
        'Your promise: Meridia’s ambassador helped Skerry to its seat at the United Nations, and you gave your word in return that the Union of Friends would be signed. When “The Union” comes before the Council, option A must pass.',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    }
  };

  const CRISES = {
    windfall: {
      title: 'The Windfall',
      text: () => 'By an accident of the alphabet, the international register gave Skerry the country code OK. Every web address ending in .ok is now ours to sell, and the world wants them. Halden Registry, of Delaware, offers $12 million a year for twenty years to run it for us: fixed, whatever happens. The alternative is a registry of our own: more if the fashion lasts, nothing if it passes, and nobody on the island has ever run one.',
      options: [
        { id: 'a', label: 'Lease it to Halden', pitch: 'Certain money, every year, for twenty years.', fx: { treasury: 2 },
          out: 'Halden’s first transfer arrives in March, and the hospital orders a scanner. A columnist in Meridia calls it “the cheapest country ever sold”. On the island the phrase catches on.' },
        { id: 'b', label: 'Run it ourselves', pitch: 'Keep it. Hire the people. Take the risk.', fx: { treasury: 1, standing: 1 }, flag: 'ownreg',
          out: 'Four engineers arrive on the Tuesday ferry. By June sixty thousand addresses are sold, and a start-up in Seoul pays $900,000 for “its.ok”. It may last. It may not.' }
      ],
      real: 'Tuvalu leases .tv to an American registrar, and the fees helped to pay for its seat at the United Nations. Anguilla’s .ai brought in about a fifth of its government’s revenue in 2023.'
    },
    passports: {
      title: 'The Passports',
      text: f => 'Aldwych & Rook, the London firm that bankrolled the independence campaign, proposes a citizenship programme. $150,000 buys a Skerran passport; there is no need to live here, or to visit. They vet the applicants and Skerry keeps four-fifths: on their forecast, more than everything else the island earns. The Northern Bloc, where most Skerrans go to study and to work, has let it be known that visa-free travel depends on “the integrity of the passport”.',
      guard: f => f.cit === 'blood' ? { options: ['a'], why: 'The Charter says a Skerran is born, not made. Opening the programme needs every minister’s vote.' }
        : f.cit === 'investor' ? { options: ['b'], why: 'The Charter already promises citizenship to investors. Refusing needs every minister’s vote.' } : null,
      options: [
        { id: 'a', label: 'Open the programme', pitch: 'Sell citizenship; fill the treasury.', fx: { treasury: 3, standing: -2 }, flag: 'passports',
          out: 'Three hundred and twelve new Skerrans in the first quarter; eleven of them have seen the island. In October the Bloc suspends visa-free entry “pending review”. The treasury has never been fuller.' },
        { id: 'b', label: 'Decline', pitch: 'A passport is not for sale.', fx: { standing: 2, treasury: -1 },
          out: 'Aldwych & Rook send a courteous letter, and with it an invoice for campaign services rendered. The Bloc’s ambassador sends a basket of fruit.' }
      ],
      real: 'At their peak, passport sales brought in more than a third of Vanuatu’s government revenue. The European Union began suspending its visa waiver for Vanuatu in 2022 and ended it in 2024.'
    },
    gathering: {
      title: 'The Gathering',
      text: () => 'Every September the villages climb the north cliffs by night and take petrel chicks from their burrows, as they have for four hundred years: three thousand birds, salted for the winter. This year somebody filmed it. Eleven million people have watched. Two cruise lines have “paused” Skerry, and a petition wants our fish off European shelves. The elders say the Gathering is the one week of the year when the whole island is a single family.',
      options: [
        { id: 'a', label: 'It goes ahead as always', pitch: 'Four hundred years outrank eleven million strangers.', fx: { trust: 2, standing: -2, reef: -1 },
          out: 'The birds are taken, the film crews come back, and the fish contract with Hamburg is not renewed. At the feast, for the first time, the ministers are given the seats by the fire.' },
        { id: 'b', label: 'Suspend it for a scientific review', pitch: 'One missed season, and an answer nobody can argue with.', fx: { trust: -2, standing: 1, reef: 1 },
          out: 'The cruise ships return in November. On the north cliffs somebody has painted the Council’s names on the rocks, and not kindly.' },
        { id: 'c', label: 'A licensed quota of 1,000, and no cameras', pitch: 'A third way. It needs every minister’s vote.', fx: { trust: -1, standing: -1 }, unanimous: true,
          out: 'Nobody is satisfied, which the Chair calls the mark of a sound law. A thousand birds are taken under the eye of a biologist from the mainland, who is made to carry the sacks.' }
      ],
      real: 'In 2021 Faroese hunters killed more than 1,400 dolphins in a single day. After the outcry the government reviewed the hunt and set a provisional limit of 500 white-sided dolphins a year.'
    },
    reserve: {
      title: 'The Bank',
      text: f => 'The Skerry Bank, forty thousand square kilometres of our waters, ' +
        (f.sea === 'reserve' ? 'has been closed to commercial fishing since the Charter was signed.' : f.sea === 'village' ? 'is fished only by village boats, by a custom older than the state.' : 'has never been licensed to anyone: no government has dared.') +
        ' A consortium of distant-water fleets now offers $9 million a year for tuna licences, with an observer on every vessel. The marine biologists call the Bank the nursery of half the region. The fishing co-operative points out that foreign boats work the edge of the line every night as it is.',
      guard: f => f.sea === 'reserve' ? { options: ['a', 'c'], why: 'The Charter closed the Bank. Opening any part of it needs every minister’s vote.' }
        : f.sea === 'village' ? { options: ['a'], why: 'The Charter gave these waters to the villages. Licensing foreign fleets needs every minister’s vote.' } : null,
      options: [
        { id: 'a', label: 'License the fleets', pitch: 'Nine million a year, and observers on board.', fx: { treasury: 2, reef: -2 }, flag: 'fleets',
          out: 'Forty purse-seiners by August. The licence fees pay for the first stretch of the sea wall. The village boats come home lighter, and say so.' },
        { id: 'b', label: 'Keep the Bank closed', pitch: 'A nursery is worth more than a licence.', fx: { reef: 1, treasury: -1 },
          out: 'The consortium takes its offer to the next island along. A research ship from Kiel arrives instead, paying nothing and counting everything.' },
        { id: 'c', label: 'Open a third of it, to Skerran boats only', pitch: 'Our fish, our boats, our risk.', fx: { treasury: 1, reef: -1, trust: 1 },
          out: 'The co-operative buys two second-hand longliners on credit. It is not the consortium’s nine million, but the money stays on the island, and so do the arguments.' }
      ],
      real: 'In 2021 Kiribati announced that it would reopen the Phoenix Islands Protected Area, one of the largest marine reserves on Earth, because the closure was costing it fishing-licence revenue.'
    },
    union: {
      title: 'The Union',
      text: () => 'Meridia, our large neighbour, proposes a Union of Friends. Three hundred visas a year for Skerrans to live and work there; a guarantee to come to our aid after a cyclone; $20 million towards the sea wall. And Clause 4: Skerry will “mutually agree” with Meridia before entering any security or defence arrangement with another state.',
      options: [
        { id: 'a', label: 'Sign', pitch: 'A sea wall, a way out for the young, a friend with a navy.', fx: { standing: 1, treasury: 1, trust: -2 }, flag: 'union',
          out: 'The flags go up at the harbour. Within a month four hundred people have applied for the first three hundred visas, among them both of the island’s dentists.' },
        { id: 'b', label: 'Decline', pitch: 'We did not leave one capital to answer to another.', fx: { trust: 2, standing: -1 },
          out: 'Meridia’s ambassador regrets the decision, warmly and at length. The sea wall remains a line on a drawing.' }
      ],
      real: 'Tuvalu and Australia signed the Falepili Union in 2023: up to 280 visas a year and a security guarantee, with a clause on third-country defence deals that critics called a veto.'
    },
    cable: {
      title: 'The Cable',
      text: () => 'Skerry reaches the internet by satellite: slow, and $400 a month for a household. There are two offers for an undersea cable. Zhonghai Marine will lay one within a year, at a third of the usual price, on a soft loan. Meridia will pay for a cable outright: built by its own contractor, in three years’ time, and on condition that Zhonghai equipment is kept out of Skerry’s networks for good.',
      options: [
        { id: 'a', label: 'Zhonghai', pitch: 'Fast, cheap, next year.', fx: { trust: 2, treasury: -1, standing: -1 }, flag: 'zh',
          out: 'The cable ship is off the reef by spring. By Christmas a Skerran teenager has 200,000 followers and the island’s nurses consult specialists by video. Meridia’s ambassador is “recalled for consultations”.' },
        { id: 'b', label: 'Meridia’s cable', pitch: 'Free, friendly, eventually.', fx: { standing: 1 },
          out: 'Meridia announces the gift at a summit, with a map. The survey ship is expected the year after next. Households go on paying $400.' }
      ],
      real: 'In 2018 Australia agreed to pay most of the cost of the Coral Sea Cable to the Solomon Islands, after the Solomons had signed a deal with Huawei.'
    },
    dateline: {
      title: 'The Missing Friday',
      text: () => 'Skerry lies just east of the International Date Line. When it is Monday morning in Meridia, where we sell nearly everything, it is still Sunday here: we share only four working days a week with our customers. The Chamber of Commerce proposes to jump the line by deleting Friday 30 December from the calendar. The churches ask which day would then be the Sabbath. The tourist board observes that Skerry would become the first country on Earth to see each new year.',
      options: [
        { id: 'a', label: 'Jump the line', pitch: 'Lose a day, gain a market.', fx: { treasury: 1, standing: 1, trust: -1 },
          out: 'Thursday is followed by Saturday. Eleven Skerrans lose a birthday; one couple claim a wedding anniversary that never took place. The first sunrise of the year sells out the island’s only hotel.' },
        { id: 'b', label: 'Stay where we are', pitch: 'A country does not move its Sunday for its customers.', fx: { trust: 1, treasury: -1 },
          out: 'The calendar is left alone. The exporters go on answering Monday’s orders on what they insist on calling Sunday.' }
      ],
      real: 'Samoa deleted 30 December 2011 from its calendar to match Australia and New Zealand. Kiribati moved the line in 1995, and later sold itself as the first country to see the year 2000.'
    },
    school: {
      title: 'The Schoolroom',
      text: () => 'The Education Board proposes that from September every lesson, from the age of six, be taught in English. Its case: every well-paid job on the island requires English, and the textbooks are already in it. The island’s poet laureate replies in the Gazette that a language taught as a “subject” is a language in a museum.',
      guard: f => f.lang === 'skerran' ? { options: ['a'], why: 'The Charter makes Skerran the language of the schools. The Board’s plan needs every minister’s vote.' }
        : f.lang === 'english' ? { options: ['b'], why: 'The Charter already names English as the language of the schools. Blocking the plan needs every minister’s vote.' } : null,
      options: [
        { id: 'a', label: 'English from the age of six', pitch: 'Teach the children the language of their wages.', fx: { standing: 1, treasury: 1, trust: -2 }, flag: 'english',
          out: 'Forty teachers retrain over the summer. Exam results rise within the year. Grandparents report that the children now argue with them in a language they cannot answer.' },
        { id: 'b', label: 'Skerran stays; more hours of English', pitch: 'A second language, not a replacement.', fx: { trust: 1, standing: -1 },
          out: 'The Board resigns, then un-resigns. A physics textbook in Skerran is commissioned, the first in history, at the price of a small bridge.' }
      ],
      real: 'Rwanda decided in October 2008 to switch its schools from French to English, and began the following year.'
    },
    mine: {
      title: 'The Licence',
      text: () => 'Abyssal Metals, of Vancouver, wants to harvest metal nodules from the deep seabed in international waters, and the law of the sea says a company needs a sponsoring state. Skerry would be that state: $5 million a year now, a royalty if mining begins, and liability if anything goes wrong four kilometres down. No such mine has ever operated. Forty countries want a moratorium.',
      options: [
        { id: 'a', label: 'Sponsor the licence', pitch: 'Somebody will. It may as well pay for our school.', fx: { treasury: 2, reef: -1, standing: -1 }, flag: 'mine',
          out: 'The application is filed in Skerry’s name in Kingston, Jamaica. A research vessel flying our flag begins trials over the abyssal plain. Three governments summon our ambassador, of whom there is one.' },
        { id: 'b', label: 'Refuse', pitch: 'Not in our name, and not on our liability.', fx: { standing: 1, treasury: -1 },
          out: 'Abyssal Metals signs with another island within the week. Skerry is thanked by forty governments, none of which sends money.' }
      ],
      real: 'In 2021 Nauru, sponsor of a subsidiary of The Metals Company, triggered a rule giving the International Seabed Authority two years to finish its mining code.'
    },
    recognition: {
      title: 'The Sixth State',
      text: () => 'The Republic of Varnia is recognised by five states and claimed by its neighbour. It invites Skerry to become the sixth. A “friendship grant” of $30 million would follow: the price, almost exactly, of the hospital wing we cannot afford. Meridia’s ambassador has asked for a meeting “before any decision is taken”.',
      options: [
        { id: 'a', label: 'Recognise Varnia', pitch: 'A vote is the one thing a small state has to sell.', fx: { treasury: 2, trust: 1, standing: -2 }, flag: 'varnia',
          out: 'A Varnian delegation plants a tree outside the hospital. In New York, Skerry’s vote is suddenly courted by people who had not known where it was, and avoided by most who had.' },
        { id: 'b', label: 'Decline, politely', pitch: 'Recognition is a principle or it is nothing.', fx: { standing: 1, trust: -1 },
          out: 'The hospital wing stays a drawing. Meridia’s ambassador hosts a reception at which nobody mentions Varnia.' }
      ],
      real: 'Nauru recognised Abkhazia and South Ossetia in 2009. The Russian press reported $50 million in aid; Nauru denied that it was a payment.'
    },
    camp: {
      title: 'The Airstrip',
      text: () => 'Meridia will pay $40 million a year, as much as the whole of Skerry’s budget, to house up to 800 asylum seekers here while their claims to enter Meridia are processed. Meridia builds and runs the centre; Skerry provides the land and the law. The United Nations refugee agency has written asking us to decline.',
      options: [
        { id: 'a', label: 'Host the centre', pitch: 'A budget, doubled, for the use of an old airstrip.', fx: { treasury: 3, standing: -2, trust: -1 }, flag: 'camp',
          out: 'The centre opens on the old airstrip. The budget balances for the first time. A UN rapporteur asks to visit; so do four film-makers.' },
        { id: 'b', label: 'Decline', pitch: 'We will not be somebody else’s waiting room.', fx: { standing: 1, trust: 1, treasury: -1 },
          out: 'Meridia finds another island. The Council receives a letter of thanks from Geneva, and a note from the Treasury listing what $40 million would have bought.' }
      ],
      real: 'Nauru has hosted an Australian processing centre, on and off, since 2001. At times the payments have made up a large part of its government’s revenue.'
    },
    coin: {
      title: 'The Tern',
      text: () => 'A firm from Tel Aviv proposes that Skerry issue the world’s first national cryptocurrency as legal tender, alongside the dollar. They build it; we keep half of the first issue, perhaps $30 million. The International Monetary Fund has written, unprompted: if Skerry does this, the one foreign bank that still clears our dollars may decide that we are not worth the risk.',
      options: [
        { id: 'a', label: 'Issue the coin', pitch: 'A currency of our own, and thirty million with it.', fx: { treasury: 2, standing: -2 }, flag: 'coin',
          out: 'The “tern” is launched by video link. It trebles in a week and halves in a day. In November the correspondent bank gives ninety days’ notice.' },
        { id: 'b', label: 'Decline', pitch: 'A state that cannot pay its nurses should not print its own money.', fx: { standing: 1, treasury: -1 },
          out: 'The firm launches the same coin for a different island. The Council’s reply to the IMF is the shortest letter it sends all year.' }
      ],
      real: 'The Marshall Islands passed a law in 2018 to create a digital currency, the SOV, as legal tender. The IMF warned that it could cost the country its last US-dollar banking link.'
    }
  };

  // Before these dispatches (counting from zero) the quarter's wages fall due: Treasury -1.
  const BILLS = [1, 3, 5, 7];
  const PROMISE_CRISES = ['passports', 'gathering', 'reserve', 'union'];
  const POOL = ['cable', 'dateline', 'school', 'mine', 'recognition', 'camp', 'coin'];

  const RECKONING = {
    treasury: {
      title: 'The December Payroll',
      text: () => 'The treasury cannot pay the teachers and the nurses in December. Two lifelines are on the table. The International Monetary Fund will lend, on conditions: the ferry subsidy goes, and one public job in ten. Or Harbourline, of Dubai, will pay $60 million today for a ninety-nine-year lease on the harbour, which is the only one we have.',
      options: [
        { id: 'a', label: 'Take the Fund’s programme', pitch: 'Borrow, cut, and keep what is ours.', fx: { treasury: 3, trust: -2 },
          out: 'The ferry now sails twice a week instead of daily. The teachers are paid. The word “austerity” enters Skerran as a loanword, unchanged.' },
        { id: 'b', label: 'Lease the harbour', pitch: 'Nobody loses a job. We lose a harbour.', fx: { treasury: 3, standing: -1, trust: -1 }, flag: 'lease',
          out: 'The harbour gets new cranes and a fence. Skerrans now show a pass to reach their own boats.' }
      ],
      real: 'Sri Lanka leased the port of Hambantota to a Chinese state company for 99 years in 2017, to raise cash while struggling with its debts.'
    },
    trust: {
      title: 'The Petition',
      text: () => 'Three thousand one hundred signatures, one adult in two, demand a referendum: should Skerry dissolve its Council and ask to rejoin the mainland as a province? The Charter gives this Council five years. It does not say what to do when half the island has stopped believing in it.',
      options: [
        { id: 'a', label: 'Hold the referendum, and campaign to stay', pitch: 'Ask them. If we lose, we deserved to.', fx: { trust: 3, treasury: -1 },
          out: 'On a turnout of 91 per cent, Skerry votes to remain a country, by 212 votes. The Council has been told, exactly, how much it is trusted.' },
        { id: 'b', label: 'Refuse: the Charter stands', pitch: 'Governments are not dismissed by petition.', fx: { trust: -2, standing: -1 },
          out: 'The petition is filed in the archive. On Independence Day the square is half empty, and the half that came has brought whistles.' }
      ],
      real: 'Anguilla rebelled against being governed from St Kitts in 1967, expelled the police, and voted by 1,813 to 5 to leave. It later became a British territory again by its own choice.'
    },
    reef: {
      title: 'The Bleaching',
      text: () => 'Divers from the university report that two-thirds of the lagoon’s coral has bleached since March. Their advice is blunt: close the lagoon and the inshore grounds to all fishing, anchoring and tour boats for five years, or lose them for fifty. One Skerran household in three lives off those waters.',
      options: [
        { id: 'a', label: 'Close the lagoon for five years', pitch: 'Pay people not to fish, and hope.', fx: { reef: 3, trust: -2, treasury: -1 },
          out: 'The buoys go out in a ring. Three hundred families are paid, badly, not to fish. In the second summer the divers send photographs that nobody expected to see.' },
        { id: 'b', label: 'Moorings, a visitor levy, a restoration fund', pitch: 'Do what can be done without closing the sea.', fx: { reef: 1, treasury: -1 },
          out: 'The levy raises enough for a coral nursery and a great many signs. The divers are polite about it.' }
      ],
      real: 'Palau closed most of its waters to commercial fishing in 2020 and banned sunscreens that harm coral, the first country to do so.'
    },
    standing: {
      title: 'The List',
      text: () => 'The Northern Bloc has placed Skerry on its list of “non-cooperative jurisdictions”. Two foreign banks have already closed Skerran accounts, and the ferry company’s insurer wants a conversation. To come off the list Skerry must open its company register, end the arrangements the Bloc dislikes, and accept inspectors.',
      options: [
        { id: 'a', label: 'Comply in full', pitch: 'Swallow it. A small state cannot live on a blacklist.', fx: { standing: 3, treasury: -2 },
          out: 'The inspectors take over the top floor of the post office. By spring Skerry is off the list and on a different one: “countries making progress”.' },
        { id: 'b', label: 'Refuse, and look for other friends', pitch: 'There are other capitals, and they are less particular.', fx: { standing: -1, treasury: 1, trust: 1 },
          out: 'Skerry’s ministers are received with honours in three capitals that most Skerrans could not place on a map. The banks stay closed.' }
      ],
      real: 'The European Union keeps a list of non-cooperative tax jurisdictions. Vanuatu, Samoa and Palau have all spent time on it.'
    }
  };

  const EPILOGUE = {
    treasury: ['The treasury ends the year owing three months’ wages and a great many explanations.', 'The books balance in the manner of small states: narrowly, and by Friday.', 'The treasury ends the year in surplus, a word that had to be explained to readers of the Gazette.'],
    trust: ['The Council no longer walks to work.', 'Skerrans grumble about their Council, which constitutional lawyers consider a healthy sign.', 'On the anniversary of independence the square is full, and people have brought their children.'],
    reef: ['The older fishermen have begun to describe the reef to their grandchildren in the past tense.', 'The reef is holding. Nobody is sure for how long, and nobody asks.', 'The reef is in better shape than on the day the flag went up. The fishermen say so, which settles it.'],
    standing: ['Abroad, Skerry has become shorthand, and not for anything good.', 'Abroad, Skerry is known, when it is known at all, as “the .ok place”.', 'Abroad, Skerry is cited as a model small state, mostly by people who have never been.'],
    flags: {
      passports: 'There are now more Skerrans in Dubai than in the village of North End.',
      union: 'Three hundred left on the first Meridian visas. The dentists were among them.',
      mine: 'Somewhere in the Pacific a machine is scraping the abyssal plain under Skerry’s flag.',
      camp: 'The centre on the old airstrip holds 640 people who never meant to come here.',
      zh: 'The island is online, fast, and watched with interest.',
      varnia: 'A Varnian tree grows outside the hospital.',
      coin: 'One tern is worth four cents.',
      english: 'The first Skerran children who dream in English have started school.',
      lease: 'The harbour belongs to somebody else until the year 2125.',
      fleets: 'At night the lights of the purse-seiners can be seen from the church.',
      ownreg: '“its.ok” remains the most expensive address in the country.'
    }
  };

  const CLOSERS = [
    'The first sentence of your memoirs.',
    'Your letter of resignation, in fifty words.',
    'The entry for “Skerry” in an encyclopaedia published in 2076.'
  ];

  function portfoliosFor(room, n) {
    return root.K.shuffle(['fin', 'home', 'sea', 'for'], root.K.rng(room + ':portfolios')).slice(0, n);
  }
  function orderFor(room) {
    const r = root.K.rng(room + ':order');
    const mid = root.K.shuffle(PROMISE_CRISES.concat(root.K.sample(POOL, 3, r)), r);
    return ['windfall'].concat(mid);
  }

  root.COUNCIL = { GAUGES, RULES, CHARTER, PORTFOLIOS, CRISES, RECKONING, EPILOGUE, CLOSERS, PROMISE_CRISES, POOL, BILLS, portfoliosFor, orderFor };
})(typeof window !== 'undefined' ? window : globalThis);
