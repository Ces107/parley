/* The Council — class scenario. A mountain valley and its first year. */
(function (root) {
  'use strict';

  const TIMES = ['', 'once', 'twice', 'three times', 'four times', 'five times'];

  const META = {
    title: 'The Free State of Tarn',
    lead: 'A new country and its first year. Bring pencils, paper and two coins each.',
    bill: 'The teachers, the road crews and the Guard have been paid.',
    verdicts: {
      fell: 'The government fell before the year was out.',
      dead: 'The Free State did not reach its first anniversary.',
      just: 'The Free State of Tarn has made it into a second year, but only just.',
      ok: 'The Free State of Tarn begins its second year.'
    },
    charterLine: n => n ? 'The Council set its own Charter aside ' + (TIMES[n] || 'many times') + ' during the year.' : 'The Council got through the year without setting the Charter aside.'
  };

  const GAUGES = [
    { id: 'treasury', name: 'Treasury', what: 'The money the state has to spend.', high: 'The roads are cleared and the teachers are paid on time.', zero: 'Nobody who works for the state is paid.' },
    { id: 'trust', name: 'Trust', what: 'How far the people of the valley believe in their own government.', high: 'People will put up with a hard decision.', zero: 'People stop doing what the Council says.' },
    { id: 'land', name: 'Mountain', what: 'The state of the valley’s land, water and ice. Almost everybody here makes a living from them.', high: 'There is snow in winter and water in summer.', zero: 'There is nothing left to farm, ski on or sell.' },
    { id: 'standing', name: 'Standing', what: 'What the rest of the world thinks of Tarn.', high: 'Other countries lend, trade and keep their borders open.', zero: 'No foreign bank or government will deal with Tarn.' }
  ];

  const INTRO = {
    place: 'Tarn, 1 January',
    headline: 'The Free State of Tarn is one day old.',
    story: [
      'At midnight every church bell in the valley rang for an hour. For six hundred years Tarn was ruled by the Abbot of Saint Aurel, and no Abbot ever came to see it. Since this morning it has been a country of 7,200 people, in a valley that takes forty minutes to drive from end to end.',
      'The valley has three dams, a glacier, two ski areas and three banks, which between them hold thirty times as much money as the state spends in a year. The state itself has a school, a clinic and an army of sixty-one men, and its taxes have never covered half of what it costs to run.',
      'You are its first Council of Ministers. Nobody has done the job before you. Two neighbours will take an interest in whatever you decide. Arlen is large, buys the valley’s electricity and supported its independence. Vara, just across the border, is happy to take any business that Tarn turns away.'
    ],
    sheet: 'Tarn in brief',
    facts: [
      ['People', '7,200, a quarter of them born abroad'],
      ['Land', 'one valley, with 40 km of river'],
      ['Language', 'the valley’s own dialect'],
      ['Currency', 'the US dollar'],
      ['Income', 'electricity, skiing and banking'],
      ['The state spends', '$50 million a year'],
      ['The state raises', 'less than half of that']
    ],
    charter: {
      title: 'The Charter of the Free State of Tarn',
      date: 'Tarn, 1 January',
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
      id: 'cit', title: 'Article 1', binds: 'cowbells', question: 'Who can become a citizen of Tarn?',
      text: 'A quarter of the people in the valley were born somewhere else. They run the hotels, the dams and the clinic. The Charter has to say how a newcomer becomes a citizen.',
      options: [
        { id: 'descent', label: 'By descent', pitch: 'Only the children of citizens. Anyone else remains a guest, however long they stay.', law: 'A citizen of Tarn is the child of a citizen. Nobody else can become one.', fx: { trust: 1, treasury: -1 } },
        { id: 'state', label: 'By the state', pitch: 'After ten years in the valley and a language test, an office in the capital decides.', law: 'A person who has lived in the valley for ten years and speaks its language may be made a citizen by the state.', fx: { standing: 1, trust: -1 } },
        { id: 'village', label: 'By the village', pitch: 'After ten years in the valley, the neighbours vote on it.', law: 'A person who has lived in the valley for ten years may be made a citizen by a vote of their village.', fx: { trust: 2, standing: -1 } }
      ]
    },
    {
      id: 'water', title: 'Article 2', binds: 'machines', question: 'Who owns the water?',
      text: 'Three dams on forty kilometres of river produce far more electricity than the valley uses. Electricity is the one thing Tarn has that every other country wants.',
      options: [
        { id: 'state', label: 'The state', pitch: 'The government owns the dams and sells the power.', law: 'The rivers of the valley and the dams on them belong to the state.', fx: { treasury: 1, trust: -1 } },
        { id: 'commune', label: 'The communes', pitch: 'Each village owns the water that runs through it, as it always has.', law: 'Each commune owns the water that runs through it.', fx: { trust: 1, treasury: -1 } },
        { id: 'concession', label: 'Whoever pays for it', pitch: 'Arlen’s power company buys a sixty-year concession now.', law: 'The use of the valley’s water is granted for sixty years to the holder of the concession.', fx: { treasury: 2, land: -1 } }
      ]
    },
    {
      id: 'tax', title: 'Article 3', binds: 'disc', question: 'How does Tarn pay for itself?',
      text: 'Roads, a school, a clinic and avalanche barriers cost about $50 million a year. The valley’s taxes have never raised half of that.',
      options: [
        { id: 'income', label: 'An income tax', pitch: 'Everybody pays twelve per cent of what they earn.', law: 'Every person in the valley pays tax on their income at a single rate.', fx: { treasury: 2, trust: -1 } },
        { id: 'haven', label: 'No income tax', pitch: 'Companies and their owners are welcome here, and nobody asks them many questions.', law: 'There is no tax on income. People who bring their business to the valley are welcome, and their affairs are private.', fx: { treasury: 2, standing: -1 } },
        { id: 'visitor', label: 'A tax on visitors', pitch: 'A levy on every hotel bed and every second home. It raises less, and it slows the building down.', law: 'The state is paid for by a levy on hotel beds and second homes.', fx: { treasury: 1, land: 1 } }
      ]
    },
    {
      id: 'rule', title: 'Article 4', binds: 'ridge', question: 'Who can overrule the Council?',
      text: 'For six hundred years the last word in the valley belonged to an Abbot who never came here. The Charter has to say who has it now.',
      options: [
        { id: 'abbot', label: 'The Abbot', pitch: 'He stays on as head of state with a veto, and has promised not to use it.', law: 'The Abbot of Saint Aurel is head of state and may refuse his assent to any act of the Council.', fx: { trust: 1, standing: -1 } },
        { id: 'people', label: 'The people', pitch: 'Five hundred signatures send any decision to a vote of the whole valley.', law: 'Five hundred citizens may, by signing a petition, send any decision of the Council to a vote of the whole valley.', fx: { trust: 2, treasury: -1 } },
        { id: 'council', label: 'Nobody', pitch: 'The Council governs for five years and then faces an election.', law: 'The Council governs for five years and answers to the valley at the election.', fx: { treasury: 1, trust: -1 } }
      ]
    }
  ];

  const SCORE = 'If you keep the promise you score 5 more points. Every marker you still hold at the end is worth 1.';
  const PORTFOLIOS = {
    fin: {
      title: 'Minister of Finance', gauge: 'treasury',
      promise: { crisis: 'machines', keeps: ['a'], short: 'Halcyon gets its electricity.' },
      brief: [
        'Your gauge is the Treasury. Your score is wherever it stands at the end of the year.',
        'Your promise. The loan that paid for Tarn’s first budget was arranged by the backers of Halcyon Compute, and it was you who signed for it. You promised in return that Halcyon would get its electricity. When “The Machines” comes up, option A has to win.',
        SCORE
      ]
    },
    home: {
      title: 'Minister for Home Affairs', gauge: 'trust',
      promise: { crisis: 'cowbells', keeps: ['b'], short: 'The village’s vote stands.' },
      brief: [
        'Your gauge is Trust, which measures how far the valley believes in its government. Your score is wherever it stands at the end of the year.',
        'Your promise. The upper villages got you elected. You promised them that the Council would never overrule a village on the question of who belongs to it. When “The Cowbells” comes up, option B has to win.',
        SCORE
      ]
    },
    land: {
      title: 'Minister for Land and Water', gauge: 'land',
      promise: { crisis: 'ridge', keeps: ['a', 'c'], short: 'The ski areas are joined.' },
      brief: [
        'Your gauge is the Mountain, which measures the state of the valley’s land, water and ice. Your score is wherever it stands at the end of the year.',
        'Your promise. Half your village works for Tarnbahn, the lift company, and Tarnbahn paid for your campaign. You promised that the two ski areas would be joined. When “The Ridge” comes up, option A or option C has to win. Either will damage your own gauge.',
        SCORE
      ]
    },
    'for': {
      title: 'Minister for Foreign Affairs', gauge: 'standing',
      promise: { crisis: 'disc', keeps: ['a'], short: 'Bank secrecy ends.' },
      brief: [
        'Your gauge is Standing, which measures what the rest of the world thinks of Tarn. Your score is wherever it stands at the end of the year.',
        'Your promise. Arlen’s finance minister supported Tarn’s independence when no other government would. You promised him in return that the valley’s banks would open their books. When “The Disc” comes up, option A has to win.',
        SCORE
      ]
    }
  };

  const CRISES = {
    offer: {
      title: 'The Booking',
      text: () => 'A man who made $9 billion from a phone app wants to rent Tarn for the four days of his fiftieth birthday in June. He offers $9 million. For that he wants the pass road closed to anyone who is not on his guest list, his flag flown next to ours on the town hall, fireworks from all three summits and the high street renamed for the weekend. His office points out that a country has been rented before, and for much less.',
      options: [
        { id: 'a', label: 'Accept', pitch: 'It is $9 million for four days, and on Monday the valley has its road back.', fx: { treasury: 2, trust: -1 }, flag: 'rented',
          out: 'The guests arrive in forty helicopters. The fireworks set off an avalanche on the north face, which hurts nobody and is added to his bill. The villagers spend the weekend behind a rope in their own high street, and they do not forget it.' },
        { id: 'b', label: 'Decline', pitch: 'We should not hire out the country like a hotel.', fx: { standing: 1, trust: 1, treasury: -1 },
          out: 'He rents a castle in Vara instead and tells an interviewer that Tarn “lacked ambition”. A shop in the valley prints the remark on tea towels and sells them to tourists all summer.' }
      ],
      real: 'In 2011 the whole of Liechtenstein could be rented through Airbnb for $70,000 a night, with a two-night minimum.'
    },
    machines: {
      title: 'The Machines',
      text: () => 'Halcyon Compute wants forty megawatts, a third of the electricity the dams produce, for a hall of computers at the head of the valley. The machines would mine cryptocurrency and be rented out for computing. Halcyon would pay half as much again as Arlen’s grid pays, for fifteen years, and would employ eleven people. Once that power was sold, the valley’s own electricity would cost more every February, when the rivers are low. The hall would also hum day and night.',
      guard: f => f.water === 'commune' ? { options: ['a'], why: 'The Charter gave the water to the communes. A third of their electricity can only be sold if every minister votes for it.' }
        : f.water === 'concession' ? { options: ['b'], why: 'Under the Charter the water was sold to Arlen’s power company, which has already agreed terms with Halcyon. The contract can only be blocked if every minister votes against it.' }
        : { options: [], why: 'Under the Charter the dams belong to the state, so the Council may sell their power or keep it. A majority decides.' },
      options: [
        { id: 'a', label: 'Sign the power contract', pitch: 'We should sell our surplus to whoever pays most for it.', fx: { treasury: 3, land: -1, trust: -1 }, flag: 'machines',
          out: 'The hall is built in eleven weeks. It is grey, has no windows and is as long as the village beside it. The first payment arrives in a currency that the finance ministry has to look up.' },
        { id: 'b', label: 'Refuse', pitch: 'The valley needs that power in February more than Halcyon needs it all year.', fx: { trust: 1, treasury: -1 },
          out: 'Halcyon builds its hall in Vara, a little further down the same river. On a still night the customs officers at the border can hear it.' }
      ],
      real: 'Bhutan has used its surplus hydropower to mine bitcoin since about 2019. The kingdom’s holdings have been worth hundreds of millions of dollars.'
    },
    cowbells: {
      title: 'The Cowbells',
      text: () => 'Anneke Visser was born in Rotterdam and has lived in the village of Sennach for thirty-four of her forty-two years. She speaks the dialect and has brought up three children there. She has also campaigned against cowbells, against the church bell that rings at six in the morning and against the piglet race at the summer fair. Her neighbours have now voted for the second time not to make her a citizen, because she “does not respect our way of life”. She has appealed to the Council.',
      guard: f => f.cit === 'village' ? { options: ['a'], why: 'Under the Charter each village decides who becomes a citizen. The Council can only overrule Sennach if every minister votes for it.' }
        : f.cit === 'descent' ? { options: ['a'], why: 'Under the Charter only the children of citizens are citizens. The Council can only make an exception if every minister votes for it.' }
        : { options: ['b'], why: 'Under the Charter the state decides who becomes a citizen, and the neighbours do not. The village’s refusal can only stand if every minister votes for it.' },
      options: [
        { id: 'a', label: 'Make her a citizen', pitch: 'After thirty-four years she is entitled to her opinions.', fx: { standing: 2, trust: -2 }, flag: 'visser',
          out: 'A clerk hands Mrs Visser her passport without looking up. The following Sunday the bell at Sennach is rung at half past five.' },
        { id: 'b', label: 'Let the village’s vote stand', pitch: 'The people who live beside her are the ones who should decide.', fx: { trust: 1, standing: -1 },
          out: 'Newspapers in nine languages run the story under headlines like “Too annoying to be Tarner”. More people than ever come to Sennach for the piglet race.' }
      ],
      real: 'Nancy Holten, born in the Netherlands and raised in Switzerland from the age of eight, was twice refused citizenship by her village after campaigning against cowbells. The canton overruled the village in 2017.'
    },
    ridge: {
      title: 'The Ridge',
      text: () => 'Tarnbahn, the lift company, wants to join the valley’s two ski areas and make the largest in the region. The Kesselgrat ridge is in the way. Tarnbahn would blast thirty metres off the top of it and run a cable car across the glacier underneath. Six hundred jobs depend on the lifts. The glacier is a third shorter than it was in 1980, and the hydrologists point out that most of the valley’s water comes from it.',
      guard: f => f.rule === 'people' ? { options: ['a'], why: 'Under the Charter five hundred signatures can send a decision to a vote of the whole valley, and a petition to save the Kesselgrat already has three thousand. The link can only be approved if every minister votes for it.' }
        : f.rule === 'abbot' ? { options: [], why: 'The Abbot was asked for his opinion as head of state and replied that mountains are not his business. A majority decides.' }
        : { options: [], why: 'Under the Charter nobody can overrule the Council on this. A majority decides.' },
      options: [
        { id: 'a', label: 'Approve the link', pitch: 'Six hundred families live off those lifts.', fx: { treasury: 2, land: -2 }, flag: 'blast',
          out: 'The blasting takes nine days, and television crews from four countries film it. The first joint season is sold out. Climbers leave a wreath where the summit cross used to stand.' },
        { id: 'b', label: 'Refuse', pitch: 'I am not blowing the top off a mountain so that people can ski further.', fx: { land: 2, treasury: -1, trust: -1 },
          out: 'Tarnbahn cancels its order for the cable car and lays off sixty people before Christmas. The ridge is on that year’s postage stamps.' },
        { id: 'c', label: 'Allow the cable car but keep the ridge', pitch: 'The cable car goes round the ridge. This only passes if every minister votes for it.', fx: { treasury: 1, land: -1 }, unanimous: true,
          out: 'The cable car takes the long way round and costs twice as much. The ridge is untouched, and neither Tarnbahn nor the climbers are satisfied.' }
      ],
      real: 'A plan to join two glacier ski areas in the Austrian Tyrol, Pitztal and Ötztal, which involved blasting away part of a mountain ridge, was abandoned in 2022 after one village voted narrowly against it.'
    },
    disc: {
      title: 'The Disc',
      text: () => 'A former clerk at the Tarner Kantonalbank has sold Arlen’s tax office a disc with the names of 1,400 Arleners who have accounts in the valley. Arlen’s finance minister has now asked, very politely, for everything else. He wants bank secrecy ended and a report every year on every account held by a foreigner. The banks hold thirty times the state’s budget, and they say the money would be in Singapore by Friday.',
      guard: f => f.tax === 'haven' ? { options: ['a'], why: 'The Charter promised people who bring their business to the valley that their affairs would be private. Bank secrecy can only be ended if every minister votes for it.' }
        : f.tax === 'income' ? { options: [], why: 'The Charter taxes what people in the valley earn. It makes no promise to foreigners who bank here, so a majority decides.' }
        : { options: [], why: 'The Charter taxes hotel beds and second homes and says nothing about bank accounts. A majority decides.' },
      options: [
        { id: 'a', label: 'End bank secrecy', pitch: 'Secrecy is finished whatever we do. We may as well get the credit for ending it.', fx: { standing: 2, treasury: -2 }, flag: 'open',
          out: 'A fifth of the deposits leave within a month, and one of the three banks closes. At the next summit Tarn’s minister is given a seat at the table. Until now he has sat behind it.' },
        { id: 'b', label: 'Refuse, and prosecute the clerk', pitch: 'The banks gave their customers a promise, and so did we.', fx: { treasury: 1, standing: -2 },
          out: 'The clerk is convicted in his absence. Arlen’s customs officers begin to search every car that leaves the valley and say it is routine.' }
      ],
      real: 'In 2008 it emerged that Germany had paid an informant more than four million euros for client data stolen from LGT, a bank owned by Liechtenstein’s ruling family. A year later Liechtenstein agreed to share tax information with other countries.'
    },
    coldbeds: {
      title: 'Cold Beds',
      text: () => 'A third of the homes in the upper valley now belong to people from abroad and stand shuttered for forty-eight weeks of the year. House prices have trebled in ten years, and the school at Oberau has eleven pupils left. The villages want a cap, so that no commune may have more than one second home in every five. The building firms, which employ more people than anyone in the valley except the dams, say a cap would put them out of business.',
      options: [
        { id: 'a', label: 'Pass the cap', pitch: 'People who grew up here can no longer afford to stay.', fx: { trust: 2, treasury: -1 },
          out: 'Forty building permits are cancelled in one morning, and two construction firms move to Vara. In Oberau a family from the lower valley buys a house. Nobody local had bought one there for nine years.' },
        { id: 'b', label: 'No cap', pitch: 'The taxes on those chalets pay for the snowploughs.', fx: { treasury: 2, trust: -2 },
          out: 'The cranes stay where they are. By winter the upper valley has more heated swimming pools than children.' }
      ],
      real: 'In 2012 Swiss voters decided, by 50.6 per cent, that no commune may have more than one second home in five.'
    },
    repository: {
      title: 'The Granite',
      text: () => 'Arlen has forty years of nuclear waste and nowhere to store it. Its geologists have concluded that the best rock within five hundred kilometres is the granite under the Tarnhorn. Arlen offers $90 million a year for a hundred years. It would pay for the building and accept all liability. The waste would arrive by rail, at night, over thirty years, and would then have to be left undisturbed for a hundred thousand.',
      guard: f => f.rule === 'people' ? { options: ['a'], why: 'Under the Charter five hundred signatures can send a decision to a vote of the whole valley, and the petition against this one has four thousand. The Council can only agree if every minister votes for it.' }
        : f.rule === 'abbot' ? { options: ['a'], why: 'The Abbot has let it be known that this is the one decision he would veto. The Council can only agree if every minister votes for it.' } : null,
      options: [
        { id: 'a', label: 'Agree to host it', pitch: 'It has to go under somebody’s mountain, and nobody else is being paid this much.', fx: { treasury: 3, land: -2, trust: -2 }, flag: 'repository',
          out: 'The Council asks for the treaty to be signed in Arlen’s capital and not in Tarn. Drilling starts in spring. House prices in the lower valley fall by a third, and within two years the state has paid off its debts.' },
        { id: 'b', label: 'Refuse', pitch: 'I would not put it under this mountain for any money.', fx: { trust: 1, land: 1, standing: -1 },
          out: 'Arlen’s minister says the decision is “understood, if not understandable”. Arlen’s electricity company announces that it will review the price it pays for Tarn’s power.' }
      ],
      real: 'Finland’s Onkalo repository, cut more than 400 metres into bedrock, is the first in the world built to hold spent nuclear fuel for 100,000 years. The council of the town that hosts it voted to accept it.'
    },
    pack: {
      title: 'The Pack',
      text: () => 'Wolves have come back over the pass. There are two packs, eleven animals in all, and since May they have killed 140 sheep on the high pastures. The shepherds want one pack shot before the lambing season. A petition from Arlen, signed by 80,000 people, asks for the wolves to be left alone, and a film crew has taken rooms at the inn. Tarn has signed the convention that protects wolves.',
      options: [
        { id: 'a', label: 'Authorise the cull', pitch: 'People farmed this valley long before anybody came to photograph it.', fx: { trust: 2, land: -1, standing: -1 }, flag: 'cull',
          out: 'In October the state’s two gamekeepers shoot five wolves while the film crew watches. The shepherds bring all their sheep down from the pastures for the first time in three years. The documentary wins a prize.' },
        { id: 'b', label: 'Protect the wolves and pay for dogs and fences', pitch: 'We signed the convention, and we should keep to it.', fx: { land: 2, treasury: -1, trust: -1 },
          out: 'Forty guard dogs arrive from the Abruzzi. They keep the wolves off, and on three occasions they keep hikers off as well. Half as many sheep are lost, but the shepherds are no happier.' }
      ],
      real: 'Switzerland had no wolf packs before 2012 and about thirty a decade later. Since 2023 its wardens have been allowed to shoot whole packs before they do damage.'
    },
    ruling: {
      title: 'The Ruling',
      text: () => 'Tarn has won a case. A trade tribunal has ruled that Arlen broke its treaty when it shut Tarn’s online businesses out of its market. Arlen refuses to comply, so the tribunal has allowed Tarn to take its compensation another way, by ignoring Arlen’s copyrights up to a value of $21 million a year. A firm in Vara has offered to build an online shop that would sell Arlen’s films, music and software from Tarn, legally, at a tenth of the usual price. The state would keep a third of the takings.',
      options: [
        { id: 'a', label: 'Open the shop', pitch: 'The tribunal gave us this right, and it is worth $21 million a year.', fx: { treasury: 2, trust: 1, standing: -2 }, flag: 'shop',
          out: 'The shop opens with eleven thousand films. Arlen’s film industry buys a full page in every newspaper that Tarners read. The valley’s teenagers take a sudden interest in trade law.' },
        { id: 'b', label: 'Keep the right in reserve and negotiate', pitch: 'Arlen will offer us more while we still have this to use.', fx: { standing: 1, treasury: -1 },
          out: 'Talks begin in a hotel on the border and go on, with long gaps, for the rest of the year. Tarn’s negotiators report that Arlen now returns their calls.' }
      ],
      real: 'Antigua won a case against the United States at the World Trade Organization over online gambling. In 2013 it was authorised to suspend American copyrights worth up to $21 million a year.'
    },
    sanctions: {
      title: 'The Eleven',
      text: () => 'The great powers have imposed sanctions on the government of a distant country and on four hundred of its richest citizens. Eleven of those citizens bank in Tarn. They have $2.3 billion here between them, a sixth of everything the banks hold. Tarn has been neutral for as long as it has existed. Arlen asks the Council to freeze the accounts, and the eleven have made it known that they can move the money within an hour.',
      options: [
        { id: 'a', label: 'Freeze the accounts', pitch: 'Being neutral has never meant taking anybody’s money.', fx: { standing: 2, treasury: -1, trust: -1 }, flag: 'frozen',
          out: 'The accounts are frozen at four in the morning, while the eleven are asleep. Two of them sue. In the cafés the old men say the valley has taken sides for the first time in five hundred years, and that nobody asked them.' },
        { id: 'b', label: 'Stay neutral', pitch: 'The banks are there to look after money, and it is not for us to judge whose it is.', fx: { treasury: 2, standing: -2 },
          out: 'The money stays, and more arrives from the same country. Tarn’s ambassador is asked to explain the decision in three capitals, and none of them accepts his explanation.' }
      ],
      real: 'Switzerland, neutral since 1815, adopted the European Union’s sanctions against Russia four days after the invasion of Ukraine in 2022.'
    },
    visitors: {
      title: 'The Jetty',
      text: () => 'The last scene of a television drama watched by ninety million people was filmed on the jetty at Seehof, where the two lovers said goodbye. Since April two thousand visitors a day have come to stand on it. Seehof has four hundred inhabitants and one public lavatory. The commune wants to install a turnstile and charge ten dollars to walk onto the jetty, with residents going free. The tourist board says a country that charges people to look at a lake will be laughed at.',
      options: [
        { id: 'a', label: 'Install the turnstile', pitch: 'If two thousand people a day are coming, they can pay for the lavatories.', fx: { treasury: 2, land: 1, standing: -1 }, flag: 'turnstile',
          out: 'The turnstile takes $600,000 in its first summer. A photograph of it with the lake in the background is shared more widely than any picture of the jetty.' },
        { id: 'b', label: 'Keep the jetty free and build a car park and lavatories', pitch: 'Tarn lives on its visitors and should make them welcome.', fx: { standing: 1, treasury: -1, land: -1 },
          out: 'The car park is full by nine every morning. Visitors go home and tell their friends that Tarn did not charge them, and the producers announce a second series.' }
      ],
      real: 'After a Korean television drama made its lakeside jetty famous, the Swiss village of Iseltwald installed a turnstile in 2023 and began charging five francs to walk onto it.'
    },
    guard: {
      title: 'The Guard',
      text: () => 'Tarn has an army. It is called the Guard and consists of sixty-one men, a brass band and four mules. It costs $3 million a year. It last marched to war in 1866, when sixty-one men set out and, according to the story, sixty-two came home. Arlen has offered to guarantee Tarn’s borders for nothing if its mountain troops may train on the high pastures for six weeks every summer.',
      options: [
        { id: 'a', label: 'Disband the Guard and accept Arlen’s guarantee', pitch: 'We are paying $3 million a year for a brass band.', fx: { treasury: 2, land: -1, trust: -1 }, flag: 'disbanded',
          out: 'The Guard’s last parade draws a bigger crowd than independence day did. In July the shepherds report that Arlen’s mountain troops are polite and punctual and make a great deal of noise.' },
        { id: 'b', label: 'Keep the Guard', pitch: 'People are proud of the Guard, and $3 million is not much to pay for that.', fx: { trust: 1, treasury: -1 },
          out: 'The Guard stays and is given a new mule. The foreign ministry spends a week writing a polite letter to decline Arlen’s offer.' }
      ],
      real: 'Liechtenstein’s army last marched in 1866: eighty men went out and, the story goes, eighty-one came home, having made a friend on the way. It was disbanded two years later.'
    }
  };

  // Before these dispatches (counting from zero) the quarter's wages fall due: Treasury -1.
  const BILLS = [1, 3, 5, 7];
  const FIRST = 'offer';
  const PROMISE_CRISES = ['machines', 'cowbells', 'ridge', 'disc'];
  const POOL = ['coldbeds', 'repository', 'pack', 'ruling', 'sanctions', 'visitors', 'guard'];

  const RECKONING = {
    treasury: {
      title: 'The Pledge',
      text: () => 'The treasury cannot pay December’s wages. There are two ways to find the money. Arlen’s state bank will lend it with the three dams as security, which means that if Tarn misses two payments the dams become Arlen’s. Or the Council can find the money at home by closing the school at Oberau and the clinic’s night service and raising taxes by half.',
      options: [
        { id: 'a', label: 'Borrow against the dams', pitch: 'Nobody loses a school, and we only lose the dams if we fail to pay.', fx: { treasury: 3, standing: -1, trust: -1 }, flag: 'pledge',
          out: 'The loan agreement is four hundred pages long, and the Council’s lawyer advises reading page 212 twice. The teachers are paid on the twenty-second.' },
        { id: 'b', label: 'Cut and tax', pitch: 'I would sooner owe this money to our own people than to Arlen.', fx: { treasury: 3, trust: -2 },
          out: 'The school at Oberau closes at Christmas, and its eleven pupils now take the bus. The clinic shuts at eight in the evening. People in the upper valley say you have to fall ill before lunch.' }
      ],
      real: 'In 1934 Newfoundland, then a self-governing dominion, could not pay its debts. It gave up self-government and was run for fifteen years by a commission appointed from London.'
    },
    trust: {
      title: 'The Ring',
      text: () => 'The villages have called a Landsgemeinde for the first Sunday in May. Every adult in the valley will stand in a ring in the meadow at Oberau and vote by raising a hand, as their grandparents did under the Abbot. There is one motion, that the Council has lost the confidence of the valley. The Charter says nothing about meetings in meadows.',
      options: [
        { id: 'a', label: 'Attend, and accept the result', pitch: 'If the valley wants us out, we should let it say so.', fx: { trust: 3, treasury: -1 },
          out: 'Four thousand people stand in the meadow. The count takes an hour and the arguments about it take another. The Council survives by a margin that the chairman calls “visible, but only just”.' },
        { id: 'b', label: 'Stay away, because the Charter is the law', pitch: 'A show of hands in a field has no power to remove a government.', fx: { trust: -1, treasury: 1, standing: 1 },
          out: 'The ring votes without the Council. Legally nothing has changed, and foreign newspapers praise the Council for standing firm. In the valley, shopkeepers have started to count out the ministers’ change without a word.' }
      ],
      real: 'Two Swiss cantons, Glarus and Appenzell Innerrhoden, still pass their laws by a show of hands at an open-air assembly once a year.'
    },
    land: {
      title: 'The Slope',
      text: () => 'After the wettest spring on record, geologists report that the slope above the village of Hinterau is moving four centimetres a day and getting faster every week. It holds two million cubic metres of rock. They advise moving the village out now, permanently, and banning all building above 1,600 metres. Hinterau is seven hundred years old, and eighty people live there.',
      options: [
        { id: 'a', label: 'Evacuate, and close the high ground', pitch: 'The geologists have told us what is coming, and we should believe them.', fx: { land: 3, treasury: -2, trust: -1 },
          out: 'The eighty villagers leave with whatever fits in a trailer. One night in June the slope comes down and stops at the edge of the churchyard. Nobody is hurt, and nobody moves back.' },
        { id: 'b', label: 'Nets, drains and sensors, and the village stays', pitch: 'People have lived under that slope for seven hundred years.', fx: { land: 1, treasury: -1 },
          out: 'Engineers install forty sensors and a siren. The people of Hinterau sleep in their clothes all summer. The slope moves, stops for a while and moves again.' }
      ],
      real: 'In May 2023 the Swiss village of Brienz, in Graubünden, was evacuated. A month later well over a million cubic metres of rock came down in the night and stopped just short of the houses.'
    },
    standing: {
      title: 'The Grey List',
      text: () => 'The international body that polices money laundering has put Tarn on its grey list. Foreign banks have started to refuse transfers from the valley, and the dam company cannot pay the firm that supplies its turbines. To be taken off the list, Tarn must name the real owner of every company registered here and let inspectors read the banks’ files.',
      options: [
        { id: 'a', label: 'Comply in full', pitch: 'If nobody will take our payments, we are not independent in any way that matters.', fx: { standing: 3, treasury: -2 },
          out: 'The inspectors are given the old customs house, which has a view of the dams. Four hundred companies leave the register within a month. By spring Tarn is off the list.' },
        { id: 'b', label: 'Refuse', pitch: 'Who owns a company in Tarn is a matter for Tarn.', fx: { standing: -1, treasury: 1, trust: 1 },
          out: 'The companies stay, and nobody learns who owns them. Payments to and from the valley now pass through a bank in a country that most Tarners could not find on a map.' }
      ],
      real: 'In 2000 Liechtenstein was placed on the international blacklist of money-laundering havens. It rewrote its banking laws and was taken off the list the following year.'
    }
  };

  const EPILOGUE = {
    treasury: ['The state ends the year unable to pay its staff.', 'The state has just enough money to get through each month.', 'The state ends the year with money left over, and three ministries have already asked for it.'],
    trust: ['Ministers have stopped going to the Sunday market.', 'People complain about the Council much as they complain about the weather.', 'On the first anniversary of independence the square is full, and the band plays the anthem twice.'],
    land: ['The tourist brochures have stopped showing the glacier.', 'The mountain is much as it was a year ago.', 'Marmots have been seen on the lower pastures again, which the old guides say is a good sign.'],
    standing: ['Abroad, Tarn is mentioned mainly as a warning to other small states.', 'Abroad, people often confuse Tarn with somewhere else.', 'Abroad, Tarn is often held up as an example of a small state that works.'],
    flags: {
      rented: 'A second billionaire has asked whether Tarn is free in August.',
      machines: 'The hall at the head of the valley hums all night.',
      blast: 'There is a gap in the skyline where the top of the Kesselgrat used to be.',
      open: 'Every January Tarn’s banks send a report to forty governments.',
      visser: 'Mrs Visser has announced that she will stand for the village council.',
      repository: 'The first tunnel under the Tarnhorn is four hundred metres deep.',
      cull: 'One pack of wolves is left, and it stays on the far side of the pass.',
      shop: 'Most of the copyright shop’s customers are in Arlen.',
      frozen: 'Tarn still describes itself as neutral, and Arlen is satisfied.',
      turnstile: 'The turnstile at Seehof now appears on a postcard.',
      disbanded: 'The Guard’s four mules have been found a home in the upper valley.',
      pledge: 'A bank in Arlen’s capital holds the deeds to the three dams.'
    }
  };

  const CLOSERS = [
    'The telegram you send home on your last day in office.',
    'The plaque the valley puts up to this Council, in thirty words.',
    'The entry for “Tarn” in a guidebook published in 2076.'
  ];

  function portfoliosFor(room, n) {
    return root.K.shuffle(['fin', 'home', 'land', 'for'], root.K.rng(room + ':portfolios')).slice(0, n);
  }
  function orderFor(room) {
    const r = root.K.rng(room + ':order');
    const mid = root.K.shuffle(PROMISE_CRISES.concat(root.K.sample(POOL, 3, r)), r);
    return [FIRST].concat(mid);
  }

  root.COUNCIL = { META, INTRO, FIRST, GAUGES, RULES, CHARTER, PORTFOLIOS, CRISES, RECKONING, EPILOGUE, CLOSERS, PROMISE_CRISES, POOL, BILLS, portfoliosFor, orderFor };
})(typeof window !== 'undefined' ? window : globalThis);
