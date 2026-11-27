/* The Council — rehearsal scenario. A small island state and its first year. */
(function (root) {
  'use strict';

  const TIMES = ['', 'once', 'twice', 'three times', 'four times', 'five times'];

  const META = {
    title: 'The Republic of Skerry',
    lead: 'A new country and its first year. Bring pencils, paper and two coins each.',
    bill: 'The teachers, the nurses and the ferry crew have been paid.',
    verdicts: {
      fell: 'The government fell before the year was out.',
      dead: 'The Republic did not reach its first anniversary.',
      just: 'The Republic of Skerry has made it into a second year, but only just.',
      ok: 'The Republic of Skerry begins its second year.'
    },
    charterLine: n => n ? 'The Council set its own Charter aside ' + (TIMES[n] || 'many times') + ' during the year.' : 'The Council got through the year without setting the Charter aside.'
  };

  const GAUGES = [
    { id: 'treasury', name: 'Treasury', what: 'The money the state has to spend.', high: 'The nurses are paid on time and there is money for the sea wall.', zero: 'Nobody who works for the state is paid.' },
    { id: 'trust', name: 'Trust', what: 'How far Skerrans believe in their own government.', high: 'People will put up with a hard decision.', zero: 'People stop doing what the Council says.' },
    { id: 'reef', name: 'Reef', what: 'The state of the island’s sea and land. Almost everybody here makes a living from them.', high: 'The boats come home full.', zero: 'There is nothing left to catch.' },
    { id: 'standing', name: 'Standing', what: 'What the rest of the world thinks of Skerry.', high: 'Other countries lend, trade and give Skerrans visas.', zero: 'No foreign bank or government will deal with Skerry.' }
  ];

  const INTRO = {
    place: 'Port Skerry, 1 January',
    headline: 'The Republic of Skerry is one day old.',
    story: [
      'At midnight the mainland’s flag was lowered over the harbour, and most of the island stayed up to watch. Skerry is now a country of 9,400 people, the smallest with a seat at the United Nations, on an island that a cyclist can cross before lunch.',
      'The new state has a hospital, a school and a ferry. It has no army and no bank of its own, the sea wall it needs has not been built, and it spends more each year than it earns.',
      'You are its first Council of Ministers. Nobody has done the job before you. Three outsiders will take an interest in whatever you decide: Meridia, the large country next door; the Northern Bloc, where most young Skerrans go to study and work; and Aldwych & Rook, the London firm that paid for the independence campaign.'
    ],
    sheet: 'Skerry in brief',
    facts: [
      ['People', '9,400'],
      ['Land', 'one island, 280 km²'],
      ['Sea', 'about 1.1 million km²'],
      ['Languages', 'Skerran at home, English for business'],
      ['Currency', 'the US dollar'],
      ['Income', 'fishing, some tourism, money sent home from abroad'],
      ['The state spends', '$40 million a year'],
      ['The state earns', 'less than that']
    ],
    charter: {
      title: 'The Charter of the Republic of Skerry',
      date: 'Port Skerry, 1 January',
      lead: 'Before the Council governs, it has to write the Charter. There are four articles, and you vote on each one. None of you knows yet which ministry you will be given.',
      points: [
        'The Charter binds you. Each article will matter again later in the year, and the Council can only go against it if every minister agrees.',
        'When the Charter is signed, your phone will tell you which ministry is yours and which gauge is your score. It will also tell you what you promised somebody in order to get the job.'
      ]
    }
  };

  const RULES = [
    'The Chair reads each dispatch aloud. You argue until the bell goes, then vote with your hands. The majority wins, and if the vote is tied the Chair decides.',
    'Under each option you can see what it will do to the gauges. Occasionally there are only question marks, and you have to vote without knowing.',
    'Before every second dispatch the state pays its wages, and the Treasury loses a point.',
    'If a gauge falls to zero there is an emergency, and you must give up two points of another gauge to rescue it. At the second emergency the government falls.',
    'Each of you has two markers (coins will do). Spend one and your vote counts twice. You can also give a marker to another minister, in return for whatever the two of you agree.'
  ];

  // Each article binds one of the four dispatches on which a minister has made a private promise.
  const CHARTER = [
    {
      id: 'cit', title: 'Article 1', binds: 'passports', question: 'Who is a Skerran?',
      text: 'Some families have been on the island for four hundred years, and some people arrived last year. The Charter has to say which of them are citizens.',
      options: [
        { id: 'blood', label: 'By birth', pitch: 'Only people born here, or born to a Skerran parent.', law: 'A Skerran is a person born on the island or born to a Skerran parent. Nobody else is a Skerran.', fx: { trust: 1, standing: -1 } },
        { id: 'resident', label: 'By residence', pitch: 'Anyone who has lived on the island for five years.', law: 'Any person who has lived on the island for five years is a Skerran.', fx: { standing: 1 } },
        { id: 'investor', label: 'By residence or investment', pitch: 'Five years on the island, or a large investment in it.', law: 'Any person who has lived on the island for five years, or has made a substantial investment in it, is a Skerran.', fx: { treasury: 1, trust: -1 } }
      ]
    },
    {
      id: 'safe', title: 'Article 2', binds: 'union', question: 'Who defends Skerry?',
      text: 'Skerry has no army and no navy. It has one police launch. Meridia, next door, has a fleet.',
      options: [
        { id: 'neutral', label: 'Nobody', pitch: 'Skerry stays neutral. It has no army and joins no alliance.', law: 'The Republic is neutral. It keeps no army and signs no treaty that binds it in matters of defence.', fx: { trust: 1, standing: -1 } },
        { id: 'friend', label: 'A larger country', pitch: 'Skerry asks a bigger state to protect it, and signs a treaty to that effect.', law: 'The Republic keeps no army. It shall seek the protection of a larger friendly state, by treaty.', fx: { standing: 1, trust: -1 } },
        { id: 'self', label: 'Skerry itself', pitch: 'The island pays for a coastguard of its own.', law: 'The Republic is responsible for its own defence and bears the cost.', fx: { trust: 1, treasury: -1 } }
      ]
    },
    {
      id: 'sea', title: 'Article 3', binds: 'reserve', question: 'Who owns the sea?',
      text: 'Skerry’s waters are four thousand times the size of its land, and most of what the island earns comes out of them.',
      options: [
        { id: 'state', label: 'The state', pitch: 'The government licenses the fishing and keeps the fees.', law: 'The sea belongs to the Republic, which may license fishing in it.', fx: { treasury: 1, trust: -1 } },
        { id: 'village', label: 'The villages', pitch: 'Each village keeps the grounds it has always fished.', law: 'Each village owns the fishing grounds it has traditionally used.', fx: { trust: 1, treasury: -1 } },
        { id: 'reserve', label: 'Nobody', pitch: 'The Skerry Bank becomes a reserve, and commercial fishing there is banned.', law: 'The Skerry Bank is a reserve. Commercial fishing in it is forbidden.', fx: { reef: 2, treasury: -1 } }
      ]
    },
    {
      id: 'lang', title: 'Article 4', binds: 'school', question: 'Which language does Skerry use for government and school?',
      text: 'Everybody speaks Skerran at home. Contracts, medicine and the internet are in English.',
      options: [
        { id: 'skerran', label: 'Skerran', pitch: 'Government and schools work in Skerran. English is taught as a foreign language.', law: 'Skerran is the language of the Republic and of its schools.', fx: { trust: 2, standing: -1 } },
        { id: 'both', label: 'Both', pitch: 'Two official languages with equal status. Every document is printed twice.', law: 'Skerran and English are the languages of the Republic and have equal status.', fx: { treasury: -1 } },
        { id: 'english', label: 'English', pitch: 'The state and the schools work in English. Skerran is taught as a subject.', law: 'English is the language of the state and of its schools. Skerran is taught in every school.', fx: { standing: 1, treasury: 1, trust: -2 } }
      ]
    }
  ];

  const SCORE = 'If you keep the promise you score 5 more points. Every marker you still hold at the end is worth 1.';
  const PORTFOLIOS = {
    fin: {
      title: 'Minister of Finance', gauge: 'treasury',
      promise: { crisis: 'passports', keeps: ['a'], short: 'Skerry sells passports.' },
      brief: [
        'Your gauge is the Treasury. Your score is wherever it stands at the end of the year.',
        'Your promise. Aldwych & Rook paid for the independence campaign, and it was you who signed the agreement with them. You promised in return that Skerry would sell passports. When “The Passports” comes up, option A has to win.',
        SCORE
      ]
    },
    home: {
      title: 'Minister for Home Affairs', gauge: 'trust',
      promise: { crisis: 'school', keeps: ['b'], short: 'The schools go on teaching in Skerran.' },
      brief: [
        'Your gauge is Trust, which measures how far Skerrans believe in their government. Your score is wherever it stands at the end of the year.',
        'Your promise. The elders of the northern villages got you elected. You promised them that the island’s children would go on being taught in Skerran. When “The Schoolroom” comes up, option B has to win.',
        SCORE
      ]
    },
    sea: {
      title: 'Minister for Sea and Land', gauge: 'reef',
      promise: { crisis: 'reserve', keeps: ['a', 'c'], short: 'The Bank is opened to fishing.' },
      brief: [
        'Your gauge is the Reef, which measures the state of the island’s sea and land. Your score is wherever it stands at the end of the year.',
        'Your promise. The fishing co-operative paid for your campaign, and you promised its members that the Skerry Bank would be opened to fishing. When “The Bank” comes up, option A or option C has to win. Either will damage your own gauge.',
        SCORE
      ]
    },
    'for': {
      title: 'Minister for Foreign Affairs', gauge: 'standing',
      promise: { crisis: 'union', keeps: ['a'], short: 'The Union with Meridia is signed.' },
      brief: [
        'Your gauge is Standing, which measures what the rest of the world thinks of Skerry. Your score is wherever it stands at the end of the year.',
        'Your promise. Meridia’s ambassador helped Skerry to get its seat at the United Nations. You promised him in return that Skerry would sign the Union of Friends. When “The Union” comes up, option A has to win.',
        SCORE
      ]
    }
  };

  const CRISES = {
    windfall: {
      title: 'The Windfall',
      text: () => 'By an accident of the alphabet, Skerry’s country code is OK. Every web address ending in .ok is ours to sell, and plenty of companies want one. Halden Registry, an American firm, offers $12 million a year for twenty years to run the domain on our behalf, and the payment is fixed whatever happens. We could run it ourselves instead. That might bring in more if the demand lasts and nothing if it does not, and nobody on the island has ever run a registry.',
      options: [
        { id: 'a', label: 'Lease it to Halden', pitch: 'We know exactly what we will get, every year for twenty years.', fx: { treasury: 2 },
          out: 'Halden’s first payment arrives in March and the hospital orders a scanner. A newspaper columnist in Meridia writes that Skerry is the cheapest country ever sold, and people on the island start repeating it.' },
        { id: 'b', label: 'Run it ourselves', pitch: 'It belongs to us. We should hire the people and take the risk.', fx: { treasury: 1, standing: 1 }, flag: 'ownreg',
          out: 'Four engineers arrive on the Tuesday ferry. By June the registry has sold sixty thousand addresses, and a company in Seoul has paid $900,000 for “its.ok”. Nobody knows how long the demand will last.' }
      ],
      real: 'Tuvalu leases .tv to an American registrar, and the fees helped to pay for its seat at the United Nations. Anguilla’s .ai brought in about a fifth of its government’s revenue in 2023.'
    },
    passports: {
      title: 'The Passports',
      text: () => 'Aldwych & Rook, the London firm that paid for the independence campaign, wants Skerry to sell citizenship. A passport would cost $150,000, and the buyer would not have to live here or even visit. The firm would check the applicants and keep a fifth of the money. It forecasts that Skerry’s share would be larger than everything else the island earns. The Northern Bloc, where most Skerrans go to study and work, has warned that it will only go on letting them in without a visa if it can trust the passport.',
      guard: f => f.cit === 'blood' ? { options: ['a'], why: 'Under the Charter nobody becomes a Skerran except by birth. The programme can only be opened if every minister votes for it.' }
        : f.cit === 'investor' ? { options: ['b'], why: 'The Charter already gives citizenship to investors. The offer can only be refused if every minister votes to refuse it.' }
        : { options: [], why: 'The Charter gives citizenship to people who have lived here for five years. It does not stop the Council from granting it to others, so a majority decides.' },
      options: [
        { id: 'a', label: 'Open the programme', pitch: 'Nothing else on offer would bring in this much money.', fx: { treasury: 3, standing: -2 }, flag: 'passports',
          out: 'In the first three months 312 people become Skerrans, and eleven of them have seen the island. In October the Bloc suspends visa-free travel while it reviews the scheme. The treasury has more money than it has ever had.' },
        { id: 'b', label: 'Decline', pitch: 'If anybody can buy our passport, it will be worth less to the people who were born with it.', fx: { standing: 2, treasury: -1 },
          out: 'Aldwych & Rook reply with a polite letter and an invoice for their work on the campaign. The Bloc’s ambassador sends the Council a basket of fruit.' }
      ],
      real: 'At their peak, passport sales brought in more than a third of Vanuatu’s government revenue. The European Union began suspending its visa waiver for Vanuatu in 2022 and ended it in 2024.'
    },
    school: {
      title: 'The Schoolroom',
      text: () => 'The Education Board proposes that from September every lesson should be taught in English, starting with the six-year-olds. It argues that every well-paid job on the island needs English and that the textbooks are in English already. The island’s best-known poet has replied in the Gazette that a language which is only taught as a subject will soon be spoken only in the classroom.',
      guard: f => f.lang === 'skerran' ? { options: ['a'], why: 'Under the Charter the schools teach in Skerran. The Board’s plan can only pass if every minister votes for it.' }
        : f.lang === 'english' ? { options: ['b'], why: 'The Charter already makes English the language of the schools. The plan can only be stopped if every minister votes against it.' }
        : { options: [], why: 'The Charter gives the two languages equal status but does not say what that means in a classroom. A majority decides.' },
      options: [
        { id: 'a', label: 'Teach in English from the age of six', pitch: 'The children will need English to earn a living.', fx: { standing: 1, treasury: 1, trust: -2 }, flag: 'english',
          out: 'Forty teachers are retrained over the summer, and exam results improve within a year. Grandparents complain that the children answer them back in a language they cannot follow.' },
        { id: 'b', label: 'Keep Skerran and add more hours of English', pitch: 'They can learn English properly without losing their own language.', fx: { trust: 1, standing: -1 },
          out: 'The Board resigns and then changes its mind. The ministry commissions the first physics textbook ever written in Skerran, which costs about as much as a small bridge.' }
      ],
      real: 'Rwanda decided in October 2008 to switch its schools from French to English, and began the following year.'
    },
    reserve: {
      title: 'The Bank',
      text: f => 'The Skerry Bank is forty thousand square kilometres of our waters. ' +
        (f.sea === 'reserve' ? 'It has been closed to commercial fishing since the Charter was signed.' : f.sea === 'village' ? 'Only village boats fish there, as they did long before there was a state.' : 'No government has ever licensed anybody to fish it.') +
        ' A consortium of foreign fleets is offering $9 million a year for tuna licences and will carry an observer on every vessel. Marine biologists say half the fish in the region are spawned on the Bank. The fishing co-operative says foreign boats already work the edge of it every night.',
      guard: f => f.sea === 'reserve' ? { options: ['a', 'c'], why: 'The Charter made the Bank a reserve. No part of it can be opened unless every minister votes for it.' }
        : f.sea === 'village' ? { options: ['a'], why: 'The Charter gave these waters to the villages. Foreign fleets can only be licensed if every minister votes for it.' }
        : { options: [], why: 'Under the Charter the sea belongs to the state, so the Council may license the Bank or keep it closed. A majority decides.' },
      options: [
        { id: 'a', label: 'License the fleets', pitch: 'It is $9 million a year, and there will be an observer on every boat.', fx: { treasury: 2, reef: -2 }, flag: 'fleets',
          out: 'By August forty purse-seiners are working the Bank. The fees pay for the first stretch of the sea wall. The village boats are catching less than they did, and their crews say so to anyone who will listen.' },
        { id: 'b', label: 'Keep the Bank closed', pitch: 'If the fish stop spawning there, there will be nothing to license next time.', fx: { reef: 1, treasury: -1 },
          out: 'The consortium makes the same offer to the next island. A research ship from Kiel spends the summer on the Bank instead. It pays nothing, and its scientists count everything they find.' },
        { id: 'c', label: 'Open a third of it to Skerran boats only', pitch: 'If anybody fishes the Bank it should be us.', fx: { treasury: 1, reef: -1, trust: 1 },
          out: 'The co-operative borrows the money for two second-hand longliners. They earn far less than the consortium offered, but what they earn is spent on the island.' }
      ],
      real: 'In 2021 Kiribati announced that it would reopen the Phoenix Islands Protected Area, one of the largest marine reserves on Earth, because the closure was costing it fishing-licence revenue.'
    },
    union: {
      title: 'The Union',
      text: () => 'Meridia proposes a treaty called the Union of Friends. It offers three hundred visas a year for Skerrans to live and work in Meridia, help after a cyclone or an attack, and $20 million towards the sea wall. Clause 4 says that Skerry must agree with Meridia before it makes any security or defence arrangement with another country.',
      guard: f => f.safe === 'neutral' ? { options: ['a'], why: 'Under the Charter Skerry signs no treaty that binds it in matters of defence, and Clause 4 would. The Union can only be signed if every minister votes for it.' }
        : f.safe === 'friend' ? { options: ['b'], why: 'The Charter tells the Council to seek the protection of a larger state, and Meridia is offering it. The Union can only be declined if every minister votes to decline.' }
        : { options: [], why: 'The Charter makes Skerry responsible for its own defence. It does not rule out a treaty, so a majority decides.' },
      options: [
        { id: 'a', label: 'Sign', pitch: 'We get a sea wall, visas for our young people and a neighbour with a navy.', fx: { standing: 1, treasury: 1, trust: -2 }, flag: 'union',
          out: 'Flags go up along the harbour. Within a month four hundred people have applied for the three hundred visas, and both of the island’s dentists are among them.' },
        { id: 'b', label: 'Decline', pitch: 'We have only just stopped taking orders from one capital.', fx: { trust: 2, standing: -1 },
          out: 'Meridia’s ambassador says at some length how sorry he is. The sea wall stays on the drawing board.' }
      ],
      real: 'Tuvalu and Australia signed the Falepili Union in 2023: up to 280 visas a year and a security guarantee, with a clause on third-country defence deals that critics called a veto.'
    },
    gathering: {
      title: 'The Gathering',
      text: () => 'For four hundred years the northern villages have climbed the cliffs on a September night to take petrel chicks from their burrows. They take about three thousand and salt them for the winter. This year somebody filmed it, and eleven million people have watched the film. Two cruise lines have stopped calling at Skerry, and a petition is asking European supermarkets to stop selling our fish. The elders say it is the only week of the year when the whole island does something together.',
      options: [
        { id: 'a', label: 'Let it go ahead as usual', pitch: 'People who have never been here should not decide what we eat.', fx: { trust: 2, standing: -2, reef: -1 },
          out: 'The birds are taken and the film crews come back for more. A fish buyer in Hamburg does not renew his contract. At the feast afterwards the ministers are given the seats nearest the fire.' },
        { id: 'b', label: 'Suspend it while scientists review it', pitch: 'We lose one season, and then we have evidence that nobody can dismiss.', fx: { trust: -2, standing: 1, reef: 1 },
          out: 'The cruise ships are back by November. Somebody paints the ministers’ names on the rocks below the north cliffs, with a few words about each of them.' },
        { id: 'c', label: 'Allow 1,000 birds under licence, and ban cameras', pitch: 'This is a compromise, and it only passes if every minister votes for it.', fx: { trust: -1, standing: -1 }, unanimous: true,
          out: 'Neither side is happy with it. A thousand birds are taken while a biologist from the mainland counts them, and the villagers make her carry the sacks down.' }
      ],
      real: 'In 2021 Faroese hunters killed more than 1,400 dolphins in a single day. After the outcry the government reviewed the hunt and set a provisional limit of 500 white-sided dolphins a year.'
    },
    cable: {
      title: 'The Cable',
      text: () => 'Skerry’s internet comes by satellite. It is slow and costs a household $400 a month. Two companies have offered to lay an undersea cable. Zhonghai Marine would finish within a year at a third of the usual price, and would lend us the money. Meridia would pay for a cable itself, but its contractor needs three years, and Skerry would have to promise never to use Zhonghai equipment in its networks.',
      options: [
        { id: 'a', label: 'Zhonghai', pitch: 'People need it now, and this one is ready next year.', fx: { trust: 2, treasury: -1, standing: -1 }, flag: 'zh',
          out: 'The cable ship arrives in spring. By Christmas the island’s nurses are consulting specialists by video and a Skerran teenager has 200,000 followers. Meridia calls its ambassador home for consultations.' },
        { id: 'b', label: 'Meridia’s cable', pitch: 'It costs us nothing and keeps our neighbour on our side.', fx: { standing: 1 },
          out: 'Meridia announces its gift at a summit and shows a map of the route. The survey ship is due the year after next, and until then households go on paying $400 a month.' }
      ],
      real: 'In 2018 Australia agreed to pay most of the cost of the Coral Sea Cable to the Solomon Islands, after the Solomons had signed a deal with Huawei.'
    },
    dateline: {
      title: 'The Missing Friday',
      text: () => 'Skerry lies just east of the International Date Line. When it is Monday morning in Meridia, where we sell nearly everything, it is still Sunday here, so we share only four working days a week with our customers. The Chamber of Commerce wants to move to the other side of the line by dropping Friday 30 December from the calendar. The churches want to know which day would then be the Sabbath. The tourist board points out that Skerry would be the first country in the world to see each new year.',
      options: [
        { id: 'a', label: 'Cross the line', pitch: 'We lose one day and gain a working day with our customers every week.', fx: { treasury: 1, standing: 1, trust: -1 },
          out: 'Thursday is followed by Saturday. Eleven Skerrans have no birthday that year, and one couple celebrate an anniversary on a date that never happened. The island’s only hotel is fully booked for the first sunrise of the year.' },
        { id: 'b', label: 'Stay where we are', pitch: 'I am not moving Sunday to suit the people who buy our fish.', fx: { trust: 1, treasury: -1 },
          out: 'The calendar is left as it is. Exporters go on answering Monday’s orders on what is still, for them, Sunday.' }
      ],
      real: 'Samoa deleted 30 December 2011 from its calendar to match Australia and New Zealand. Kiribati moved the line in 1995, and later sold itself as the first country to see the year 2000.'
    },
    mine: {
      title: 'The Licence',
      text: () => 'Abyssal Metals, a company from Vancouver, wants to collect metal nodules from the deep seabed in international waters. Under the law of the sea it can only do so if a state sponsors it, and it has asked Skerry. It would pay $5 million a year now and a royalty once mining starts. Skerry would be liable if anything went wrong four kilometres down. Nobody has ever run a mine like this, and forty countries are calling for a moratorium.',
      options: [
        { id: 'a', label: 'Sponsor the licence', pitch: 'Some country will take this money, and we have a school to pay for.', fx: { treasury: 2, reef: -1, standing: -1 }, flag: 'mine',
          out: 'The application is filed in Skerry’s name in Kingston, Jamaica, and a research vessel flying our flag begins trials over the abyssal plain. Three governments call in Skerry’s only ambassador to explain.' },
        { id: 'b', label: 'Refuse', pitch: 'I do not want our name on it, or the bill if it goes wrong.', fx: { standing: 1, treasury: -1 },
          out: 'Abyssal Metals signs with another island within a week. Forty governments thank Skerry, and none of them offers any money.' }
      ],
      real: 'In 2021 Nauru, sponsor of a subsidiary of The Metals Company, triggered a rule giving the International Seabed Authority two years to finish its mining code.'
    },
    recognition: {
      title: 'The Sixth State',
      text: () => 'Five countries recognise the Republic of Varnia, and its neighbour claims the whole of it. Varnia has invited Skerry to be the sixth. It would follow this with a “friendship grant” of $30 million, which is almost exactly what the new hospital wing would cost. Meridia’s ambassador has asked to see the Council before it decides.',
      options: [
        { id: 'a', label: 'Recognise Varnia', pitch: 'Our vote is one of the few things we have that anybody wants.', fx: { treasury: 2, trust: 1, standing: -2 }, flag: 'varnia',
          out: 'A Varnian delegation plants a tree outside the hospital. At the United Nations, diplomats who could not have found Skerry on a map now ask for its vote, and several old friends stop asking.' },
        { id: 'b', label: 'Decline politely', pitch: 'If we sell recognition once, nobody will take ours seriously again.', fx: { standing: 1, trust: -1 },
          out: 'The hospital wing is not built. Meridia’s ambassador gives a reception, and nobody there mentions Varnia.' }
      ],
      real: 'Nauru recognised Abkhazia and South Ossetia in 2009. The Russian press reported $50 million in aid; Nauru denied that it was a payment.'
    },
    camp: {
      title: 'The Airstrip',
      text: () => 'Meridia offers $40 million a year, which is as much as Skerry’s whole budget, to hold up to 800 asylum seekers here while it decides whether to admit them. Meridia would build and run the centre on the old airstrip, and Skerry would supply the land and pass the necessary laws. The United Nations refugee agency has written to ask us to refuse.',
      options: [
        { id: 'a', label: 'Host the centre', pitch: 'It doubles our budget, and all we give up is an airstrip nobody uses.', fx: { treasury: 3, standing: -2, trust: -1 }, flag: 'camp',
          out: 'The centre opens on the old airstrip, and the budget balances for the first time. A United Nations rapporteur asks permission to visit. So do four film-makers.' },
        { id: 'b', label: 'Decline', pitch: 'I do not want Skerry to be where another country keeps the people it will not let in.', fx: { standing: 1, trust: 1, treasury: -1 },
          out: 'Meridia makes the same offer to another island. Geneva sends the Council a letter of thanks, and the finance ministry sends it a list of what $40 million would have paid for.' }
      ],
      real: 'Nauru has hosted an Australian processing centre, on and off, since 2001. At times the payments have made up a large part of its government’s revenue.'
    },
    coin: {
      title: 'The Tern',
      text: () => 'A company from Tel Aviv proposes that Skerry issue a cryptocurrency of its own and make it legal tender alongside the dollar. It would be the first national cryptocurrency anywhere. The company would build it, and Skerry would keep half of the first issue, which might be worth $30 million. The International Monetary Fund has written without being asked. It warns that the one foreign bank which still handles our dollar payments may decide that Skerry has become too risky.',
      options: [
        { id: 'a', label: 'Issue the coin', pitch: 'We would have our own currency, and $30 million on the day it launches.', fx: { treasury: 2, standing: -2 }, flag: 'coin',
          out: 'The coin is called the tern and is launched by video link. Its value trebles in a week and then halves in a day. In November the foreign bank gives Skerry ninety days’ notice.' },
        { id: 'b', label: 'Decline', pitch: 'We cannot always pay our nurses. This is no time to invent a currency.', fx: { standing: 1, treasury: -1 },
          out: 'The company launches the same coin for another island. The Council’s reply to the IMF is two lines long.' }
      ],
      real: 'The Marshall Islands passed a law in 2018 to create a digital currency, the SOV, as legal tender. The IMF warned that it could cost the country its last US-dollar banking link.'
    }
  };

  // Before these dispatches (counting from zero) the quarter's wages fall due: Treasury -1.
  const BILLS = [1, 3, 5, 7];
  const FIRST = 'windfall';
  const PROMISE_CRISES = ['passports', 'school', 'reserve', 'union'];
  const POOL = ['gathering', 'cable', 'dateline', 'mine', 'recognition', 'camp', 'coin'];

  const RECKONING = {
    treasury: {
      title: 'The December Payroll',
      text: () => 'The treasury cannot pay the teachers and nurses in December. There are two ways to find the money. The International Monetary Fund will lend it if Skerry ends the ferry subsidy and cuts one public job in ten. Or Harbourline, a company from Dubai, will pay $60 million today for a ninety-nine-year lease on the harbour. Skerry has no other harbour.',
      options: [
        { id: 'a', label: 'Take the IMF loan', pitch: 'We borrow and we cut, but the harbour stays ours.', fx: { treasury: 3, trust: -2 },
          out: 'The ferry now sails twice a week instead of every day, and the teachers are paid. Skerran has no word for austerity, so people use the English one.' },
        { id: 'b', label: 'Lease the harbour', pitch: 'Nobody loses their job, and we get the harbour back in the end.', fx: { treasury: 3, standing: -1, trust: -1 }, flag: 'lease',
          out: 'Harbourline installs new cranes and puts a fence round the quay. Fishermen now have to show a pass to reach their own boats.' }
      ],
      real: 'Sri Lanka leased the port of Hambantota to a Chinese state company for 99 years in 2017, to raise cash while struggling with its debts.'
    },
    trust: {
      title: 'The Petition',
      text: () => 'A petition signed by 3,100 people, about half the adults on the island, demands a referendum on dissolving the Council and asking the mainland to take Skerry back as a province. The Council was elected for five years. The Charter does not say what should happen if half the island stops believing in it before then.',
      options: [
        { id: 'a', label: 'Hold the referendum and campaign to stay', pitch: 'We should ask them. If we lose, we deserved to.', fx: { trust: 3, treasury: -1 },
          out: 'Ninety-one per cent of the island votes, and Skerry stays independent by 212 votes. The Council now knows precisely how far it is trusted.' },
        { id: 'b', label: 'Refuse', pitch: 'A petition cannot dismiss an elected government.', fx: { trust: -1, treasury: 1 },
          out: 'The petition is filed in the archive. On Independence Day the square is half empty, and many of the people who do come have brought whistles.' }
      ],
      real: 'Anguilla rebelled against being governed from St Kitts in 1967, expelled the police, and voted by 1,813 to 5 to leave. It later became a British territory again by its own choice.'
    },
    reef: {
      title: 'The Bleaching',
      text: () => 'Divers from the university report that two-thirds of the coral in the lagoon has bleached since March. They advise closing the lagoon and the inshore grounds to fishing, anchoring and tour boats for five years. If that is not done, they say, the coral will not recover for fifty. One Skerran household in three makes its living from those waters.',
      options: [
        { id: 'a', label: 'Close the lagoon for five years', pitch: 'We pay people not to fish and hope the coral comes back.', fx: { reef: 3, trust: -2, treasury: -1 },
          out: 'A ring of buoys goes out round the lagoon, and three hundred families are paid a small allowance to stay ashore. In the second summer the divers send photographs of new coral, sooner than anyone had predicted.' },
        { id: 'b', label: 'Fixed moorings, a visitor levy and a restoration fund', pitch: 'We can do a good deal without closing the sea to a third of the island.', fx: { reef: 1, treasury: -1 },
          out: 'The levy pays for a coral nursery and a large number of signs. The divers thank the Council and say it is a start.' }
      ],
      real: 'Palau closed most of its waters to commercial fishing in 2020 and banned sunscreens that harm coral, the first country to do so.'
    },
    standing: {
      title: 'The List',
      text: () => 'The Northern Bloc has put Skerry on its list of “non-cooperative jurisdictions”. Two foreign banks have closed Skerran accounts, and the ferry company’s insurer has asked for a meeting. To be taken off the list Skerry must publish its company register, end the arrangements the Bloc objects to and admit inspectors.',
      options: [
        { id: 'a', label: 'Comply in full', pitch: 'We are too small to live on a blacklist.', fx: { standing: 3, treasury: -2 },
          out: 'The inspectors move into the top floor of the post office. By spring Skerry has been moved to a second list, of countries that are making progress.' },
        { id: 'b', label: 'Refuse and look for other friends', pitch: 'There are other governments, and they ask fewer questions.', fx: { standing: -1, treasury: 1, trust: 1 },
          out: 'Skerry’s ministers are received with full honours in three capitals that few Skerrans have heard of. The two banks do not reopen the accounts.' }
      ],
      real: 'The European Union keeps a list of non-cooperative tax jurisdictions. Vanuatu, Samoa and Palau have all spent time on it.'
    }
  };

  const EPILOGUE = {
    treasury: ['The state ends the year owing its staff three months’ wages.', 'The state has just enough money to get through each month.', 'The state ends the year with money left over, which has never happened on Skerry before.'],
    trust: ['Ministers no longer walk to work.', 'Skerrans complain about the Council, as people do about any government.', 'On the first anniversary of independence the square is full, and people have brought their children.'],
    reef: ['The older fishermen tell their grandchildren what the reef used to be like.', 'The reef is no worse than it was a year ago.', 'The fishermen say the reef is in better condition than it was at independence.'],
    standing: ['Abroad, Skerry is mentioned mainly as a warning to other small states.', 'Abroad, the few people who have heard of Skerry know it for its web addresses.', 'Abroad, Skerry is often held up as an example of a small state that works.'],
    flags: {
      passports: 'More Skerran citizens now live in Dubai than in the village of North End.',
      union: 'Three hundred Skerrans have left on the first Meridian visas, the two dentists among them.',
      mine: 'A machine is at work on the seabed of the Pacific under Skerry’s flag.',
      camp: 'There are 640 people in the centre on the old airstrip.',
      zh: 'The island has fast internet, and Meridia has not forgiven the way it got it.',
      varnia: 'The Varnian tree outside the hospital is doing well.',
      coin: 'One tern is now worth four cents.',
      english: 'The first children to be taught entirely in English have started school.',
      lease: 'The harbour will belong to Harbourline until 2125.',
      fleets: 'At night the lights of the purse-seiners can be seen from the church.',
      ownreg: 'Nobody has yet paid more for an address than the $900,000 for “its.ok”.'
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
    return [FIRST].concat(mid);
  }

  root.COUNCIL = { META, INTRO, FIRST, GAUGES, RULES, CHARTER, PORTFOLIOS, CRISES, RECKONING, EPILOGUE, CLOSERS, PROMISE_CRISES, POOL, BILLS, portfoliosFor, orderFor };
})(typeof window !== 'undefined' ? window : globalThis);
