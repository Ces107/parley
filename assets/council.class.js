/* The Council — class scenario. A mountain valley, one year. */
(function (root) {
  'use strict';

  const META = {
    title: 'The Free State of Tarn',
    lead: 'A new country and its first year. Bring pencils, paper and two coins each.',
    bill: 'The teachers, the road crews and the Guard have been paid.',
    verdicts: {
      fell: 'The government fell before the year was out.',
      dead: 'The Free State did not see its first anniversary.',
      just: 'The Free State of Tarn enters its second year. Just.',
      ok: 'The Free State of Tarn enters its second year.'
    }
  };

  const GAUGES = [
    { id: 'treasury', name: 'Treasury' },
    { id: 'trust', name: 'Trust' },
    { id: 'land', name: 'Mountain' },
    { id: 'standing', name: 'Standing' }
  ];

  const RULES = [
    'You are the first Council of Ministers of the Free State of Tarn: one valley, 7,200 people, independent since January.',
    'For each dispatch the Chair reads it aloud, you argue, and at the bell you vote by hand. A majority carries it. The Chair breaks a tie.',
    'Four gauges, from 0 to 10. Every second dispatch the wages fall due and the Treasury loses a point. If any gauge reaches zero the state is in emergency. A second emergency and the government falls.',
    'Everyone holds two markers (coins will do). Spend one and your vote counts double. Markers can be given away: that is what they are for.',
    'First you write the Charter. Only afterwards does your phone tell you which ministry is yours, and what you promised to get it.'
  ];

  const CHARTER = [
    {
      id: 'cit', title: 'Article 1', question: 'Who becomes a citizen of Tarn?',
      text: 'Seven thousand two hundred people live in the valley. A quarter of them were born somewhere else: they run the hotels, the dams and the clinic. The Charter must say how a newcomer becomes one of us.',
      options: [
        { id: 'descent', label: 'By descent', pitch: 'Only the children of citizens. Everybody else is a guest, however long they stay.', fx: { trust: 1, treasury: -1 } },
        { id: 'state', label: 'By the state', pitch: 'Ten years’ residence and a language test, decided by an office in the capital.', fx: { standing: 1, trust: -1 } },
        { id: 'village', label: 'By the village', pitch: 'Ten years’ residence, and then the neighbours vote.', fx: { trust: 2, standing: -1 } }
      ]
    },
    {
      id: 'water', title: 'Article 2', question: 'Who owns the water?',
      text: 'Three dams and forty kilometres of river produce far more electricity than the valley uses. It is the one thing Tarn has that everybody wants.',
      options: [
        { id: 'state', label: 'The state', pitch: 'The government owns the dams and sells the power.', fx: { treasury: 1, trust: -1 } },
        { id: 'commune', label: 'The communes', pitch: 'Each village owns the water that runs through it, as it always has.', fx: { trust: 1, treasury: -1 } },
        { id: 'concession', label: 'Whoever pays', pitch: 'A sixty-year concession, sold now to Arlen’s power company.', fx: { treasury: 2, land: -1 } }
      ]
    },
    {
      id: 'tax', title: 'Article 3', question: 'How does Tarn pay its way?',
      text: 'Roads, a school, a clinic and avalanche barriers cost about $50 million a year. The valley’s taxes have never raised half of that.',
      options: [
        { id: 'income', label: 'A flat income tax', pitch: 'Twelve per cent of what everybody earns.', fx: { treasury: 2, trust: -1 } },
        { id: 'haven', label: 'No income tax', pitch: 'Companies and their owners are welcome, and are asked few questions.', fx: { treasury: 2, standing: -1 } },
        { id: 'visitor', label: 'Tax the visitors', pitch: 'A levy on every hotel bed and every second home. Less money, fewer cranes.', fx: { treasury: 1, land: 1 } }
      ]
    },
    {
      id: 'rule', title: 'Article 4', question: 'Who has the last word?',
      text: 'For six hundred years the valley answered to the Abbot of Saint Aurel, who never came. Somebody must now be able to say no to the Council.',
      options: [
        { id: 'abbot', label: 'The Abbot', pitch: 'Keep him as head of state, with a veto he has promised not to use.', fx: { trust: 1, standing: -1 } },
        { id: 'people', label: 'The people', pitch: 'Five hundred signatures can force any decision to a vote of the whole valley.', fx: { trust: 2, treasury: -1 } },
        { id: 'council', label: 'Nobody', pitch: 'The Council governs for five years and answers at the election.', fx: { treasury: 1, trust: -1 } }
      ]
    }
  ];

  const PORTFOLIOS = {
    fin: {
      title: 'Minister of Finance', gauge: 'treasury',
      promise: { crisis: 'machines', keeps: ['a'], short: 'Halcyon gets its electricity.' },
      brief: [
        'Your gauge is the TREASURY. Wherever it stands at the end of the year, that is your score.',
        'Your promise: Tarn’s first budget was paid with a loan arranged by the backers of Halcyon Compute, and you signed for it. In return you gave your word that Halcyon would get its electricity. When “The Machines” comes before the Council, option A must pass.',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    },
    home: {
      title: 'Minister for Home Affairs', gauge: 'trust',
      promise: { crisis: 'coldbeds', keeps: ['a'], short: 'Second homes are capped.' },
      brief: [
        'Your gauge is TRUST: whether the valley believes in its own government. Wherever it stands at the end of the year, that is your score.',
        'Your promise: the upper villages won you your seat. You gave them your word that the buying-up of the valley would stop. When “Cold Beds” comes before the Council, the cap must pass (option A).',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    },
    land: {
      title: 'Minister for Land and Water', gauge: 'land',
      promise: { crisis: 'ridge', keeps: ['a', 'c'], short: 'The ski areas are joined.' },
      brief: [
        'Your gauge is the MOUNTAIN: the health of the valley’s land, water and ice. Wherever it stands at the end of the year, that is your score.',
        'Your promise: half your village works for Tarnbahn, the lift company, which paid for your campaign. You gave your word that the two ski areas would be joined. When “The Ridge” comes before the Council, the link must be approved (option A or C). You know what that does to your own gauge.',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    },
    'for': {
      title: 'Minister for Foreign Affairs', gauge: 'standing',
      promise: { crisis: 'disc', keeps: ['a'], short: 'Bank secrecy ends.' },
      brief: [
        'Your gauge is STANDING: how the rest of the world sees Tarn. Wherever it stands at the end of the year, that is your score.',
        'Your promise: Arlen’s finance minister backed Tarn’s independence when nobody else would. In return you gave your word that the valley’s banks would open their books. When “The Disc” comes before the Council, option A must pass.',
        'A promise kept is worth 5 points. Each marker you still hold at the end is worth 1.'
      ]
    }
  };

  const CRISES = {
    offer: {
      title: 'The Booking',
      text: () => 'A man who made nine billion dollars from a phone app wishes to rent Tarn. All of it, for the four days of his fiftieth birthday in June: $9 million. The pass road closed to anybody not on his list; his flag beside ours on the town hall; fireworks from the three summits; the high street renamed for the weekend. His office points out, helpfully, that this has been done before, and for less.',
      options: [
        { id: 'a', label: 'Accept', pitch: 'Nine million for four days, and the valley has its road back on Monday.', fx: { treasury: 2, trust: -1 }, flag: 'rented',
          out: 'The guests arrive in forty helicopters. The fireworks start an avalanche on the north face, which hurts nobody and is added to the bill. The villagers, kept behind a rope in their own high street, do not forget it.' },
        { id: 'b', label: 'Decline', pitch: 'A country is not a venue.', fx: { standing: 1, trust: 1, treasury: -1 },
          out: 'He rents a castle in Vara instead, and tells an interviewer that Tarn “lacked ambition”. The remark is printed on tea towels and sold to tourists all summer.' }
      ],
      real: 'In 2011 the whole of Liechtenstein could be rented through Airbnb for $70,000 a night, with a two-night minimum.'
    },
    machines: {
      title: 'The Machines',
      text: () => 'Halcyon Compute wants forty megawatts, a third of everything the Tarn dams produce, for a hall of machines at the head of the valley that mine cryptocurrency and rent out computing power. It will pay half as much again as Arlen’s grid pays, for fifteen years, and employ eleven people. With that surplus sold, the valley’s own power would cost more every February, when the rivers run low. And the hall hums, day and night.',
      guard: f => f.water === 'commune' ? { options: ['a'], why: 'The Charter gave the water to the communes. Selling a third of their power needs every minister’s vote.' }
        : f.water === 'concession' ? { options: ['b'], why: 'The Charter sold the dams’ output to Arlen’s power company, which has already agreed terms with Halcyon. Blocking the contract needs every minister’s vote.' } : null,
      options: [
        { id: 'a', label: 'Sign the power contract', pitch: 'Sell the surplus to whoever pays most.', fx: { treasury: 3, land: -1, trust: -1 }, flag: 'machines',
          out: 'The hall goes up in eleven weeks: grey, windowless, as long as the village it stands beside. The treasury receives its first payment in a currency the finance ministry has to look up.' },
        { id: 'b', label: 'Refuse', pitch: 'The water is for the valley, not for arithmetic.', fx: { trust: 1, treasury: -1 },
          out: 'Halcyon builds its hall across the border in Vara, where the river goes next. On a still night the hum can be heard from the customs post.' }
      ],
      real: 'Bhutan has used its surplus hydropower to mine bitcoin since about 2019. The kingdom’s holdings have been worth hundreds of millions of dollars.'
    },
    coldbeds: {
      title: 'Cold Beds',
      text: () => 'One home in three in the upper valley now belongs to somebody from abroad, and stands shuttered for forty-eight weeks of the year. Prices have trebled in a decade; the school at Oberau is down to eleven pupils. The villages want a cap: no commune to have more than one second home in five. The builders, the valley’s largest employer after the dams, say that would finish them.',
      options: [
        { id: 'a', label: 'Pass the cap', pitch: 'A village is for living in.', fx: { trust: 2, treasury: -1 },
          out: 'Forty building permits are cancelled in a morning, and two construction firms move to Vara. In Oberau a family from the lower valley buys a house: the first local buyers in nine years.' },
        { id: 'b', label: 'No cap', pitch: 'The chalets pay for the snowploughs.', fx: { treasury: 2, trust: -2 },
          out: 'The cranes stay. That winter the upper valley has more heated swimming pools than children.' }
      ],
      real: 'In 2012 Swiss voters decided, by 50.6 per cent, that no commune may have more than one second home in five.'
    },
    ridge: {
      title: 'The Ridge',
      text: () => 'Tarnbahn, the lift company, wants to join the valley’s two ski areas into the largest in the region. In the way stands the Kesselgrat: the plan removes the top thirty metres of the ridge and runs a cable car across the glacier beneath it. Six hundred jobs depend on the lifts. The glacier has lost a third of its length since 1980, and the hydrologists observe that it is also the valley’s water tower.',
      options: [
        { id: 'a', label: 'Approve the link', pitch: 'Six hundred jobs outweigh thirty metres of rock.', fx: { treasury: 2, land: -2 }, flag: 'blast',
          out: 'The blasting takes nine days and is filmed from four countries. The first joint season sells out. Climbers leave a wreath where the summit cross used to stand.' },
        { id: 'b', label: 'Refuse', pitch: 'Nobody blows up a mountain to move skiers.', fx: { land: 2, treasury: -1, trust: -1 },
          out: 'Tarnbahn cancels its order for the cable car and lays off sixty people before Christmas. The ridge is still there, and appears on that year’s stamps.' },
        { id: 'c', label: 'The cable car, but the ridge stays', pitch: 'Go round it. It needs every minister’s vote.', fx: { treasury: 1, land: -1 }, unanimous: true,
          out: 'The cable car takes the long way round, at twice the cost and with a view the brochure calls “uninterrupted”. Nobody is entirely pleased, and the ridge is intact.' }
      ],
      real: 'A plan to join two glacier ski areas in the Austrian Tyrol, Pitztal and Ötztal, which involved blasting away part of a mountain ridge, was abandoned in 2022 after one village voted narrowly against it.'
    },
    disc: {
      title: 'The Disc',
      text: () => 'A former clerk of the Tarner Kantonalbank has sold a disc to Arlen’s tax office: the names of 1,400 Arleners with accounts in the valley. Arlen’s finance minister now asks, with great courtesy, for the rest: an end to bank secrecy, and a yearly report on every account held by a foreigner. The banks hold thirty times the state’s budget. They say the money would be in Singapore by Friday.',
      options: [
        { id: 'a', label: 'End bank secrecy', pitch: 'It is over anyway. Better to open the door than have it broken.', fx: { standing: 2, treasury: -2 }, flag: 'open',
          out: 'A fifth of the deposits leave within the month, and one of the three banks closes. At the next summit Tarn’s minister is seated, for the first time, at the table and not behind it.' },
        { id: 'b', label: 'Refuse, and charge the clerk', pitch: 'A promise to a depositor is a promise.', fx: { treasury: 1, standing: -2 },
          out: 'The clerk is convicted in his absence. Arlen’s customs officers begin opening every car that leaves the valley, which they describe as routine.' }
      ],
      real: 'In 2008 it emerged that Germany had paid an informant more than four million euros for client data stolen from LGT, a bank owned by Liechtenstein’s ruling family. A year later Liechtenstein agreed to share tax information with other countries.'
    },
    cowbells: {
      title: 'The Cowbells',
      text: () => 'Anneke Visser was born in Rotterdam and has lived in the village of Sennach for thirty-four of her forty-two years. She speaks the dialect and has raised three children there. She has also campaigned against cowbells, against the church bell at six in the morning, and against the piglet race at the summer fair. Her neighbours have voted, for the second time, not to make her a citizen: she “does not respect our way of life”. She appeals to the Council.',
      guard: f => f.cit === 'village' ? { options: ['a'], why: 'The Charter leaves citizenship to the villages. Overruling one needs every minister’s vote.' }
        : f.cit === 'descent' ? { options: ['a'], why: 'The Charter keeps citizenship for the children of citizens. Making an exception needs every minister’s vote.' }
        : f.cit === 'state' ? { options: ['b'], why: 'The Charter gives this decision to the state, not to the neighbours. Letting the village’s refusal stand needs every minister’s vote.' } : null,
      options: [
        { id: 'a', label: 'Make her a citizen', pitch: 'Thirty-four years is long enough to be allowed an opinion.', fx: { standing: 2, trust: -2 }, flag: 'visser',
          out: 'Mrs Visser receives her passport from a clerk who does not look up. The following Sunday the bell at Sennach rings at half past five.' },
        { id: 'b', label: 'Let the village’s vote stand', pitch: 'Belonging is not something a ministry can issue.', fx: { trust: 1, standing: -1 },
          out: 'The story runs in nine languages under some version of the headline “Too annoying to be Tarner”. In Sennach the piglet race draws a record crowd.' }
      ],
      real: 'Nancy Holten, born in the Netherlands and raised in Switzerland from the age of eight, was twice refused citizenship by her village after campaigning against cowbells. The canton overruled the village in 2017.'
    },
    repository: {
      title: 'The Granite',
      text: () => 'Arlen has forty years of nuclear waste and nowhere to put it. Its geologists have concluded that the best rock within five hundred kilometres is the granite under the Tarnhorn. Arlen offers $90 million a year for a century, pays for the building, and accepts all liability. The waste would arrive by rail, at night, for thirty years. It must then be left alone for a hundred thousand.',
      guard: f => f.rule === 'people' ? { options: ['a'], why: 'Under the Charter five hundred signatures can force a vote, and the petition against this already has four thousand. Agreeing needs every minister’s vote.' }
        : f.rule === 'abbot' ? { options: ['a'], why: 'The Abbot has let it be known that this is the one thing he would veto. Agreeing needs every minister’s vote.' } : null,
      options: [
        { id: 'a', label: 'Agree to host it', pitch: 'Somebody’s mountain will hold it. Ours is paid for.', fx: { treasury: 3, land: -2, trust: -2 }, flag: 'repository',
          out: 'The treaty is signed in Arlen’s capital, not ours, at the Council’s request. Drilling begins in spring. House prices in the lower valley fall by a third; the state’s debt is cleared in two years.' },
        { id: 'b', label: 'Refuse', pitch: 'Not under this mountain, at any price.', fx: { trust: 1, land: 1, standing: -1 },
          out: 'Arlen’s minister calls the decision “understood, if not understandable”. Arlen’s electricity company announces a review of the price it pays for Tarn’s power.' }
      ],
      real: 'Finland’s Onkalo repository, cut more than 400 metres into bedrock, is the first in the world built to hold spent nuclear fuel for 100,000 years. The council of the town that hosts it voted to accept it.'
    },
    pack: {
      title: 'The Pack',
      text: () => 'Wolves have come back over the pass: two packs, eleven animals. Since May they have killed 140 sheep on the high pastures. The shepherds want one pack shot before the lambing; a petition from Arlen with 80,000 signatures wants the wolves left alone, and a film crew has taken rooms at the inn. Tarn has signed the convention that protects them.',
      options: [
        { id: 'a', label: 'Authorise the cull', pitch: 'The valley was farmed before it was photographed.', fx: { trust: 2, land: -1, standing: -1 }, flag: 'cull',
          out: 'Five wolves are shot in October by the state’s two gamekeepers, watched by the film crew. The shepherds bring their flocks down intact for the first time in three years. The documentary wins a prize.' },
        { id: 'b', label: 'Protect the wolves; pay for dogs and fences', pitch: 'We signed. And the wolves were here first.', fx: { land: 2, treasury: -1, trust: -1 },
          out: 'Forty guard dogs arrive from the Abruzzi. They prove effective against wolves and, in three recorded cases, against hikers. The losses halve; the shepherds’ temper does not improve.' }
      ],
      real: 'Switzerland had no wolf packs before 2012 and about thirty a decade later. Since 2023 its wardens have been allowed to shoot whole packs before they do damage.'
    },
    ruling: {
      title: 'The Ruling',
      text: () => 'Tarn has won. A trade tribunal has ruled that Arlen broke its treaty by shutting Tarn’s online businesses out of its market, and that since Arlen will not comply, Tarn may take its compensation another way: by ignoring Arlen’s copyrights, up to $21 million a year. A firm in Vara offers to build the shop: Arlen’s films, music and software, sold lawfully from Tarn at a tenth of the price, the state taking a third.',
      options: [
        { id: 'a', label: 'Open the shop', pitch: 'It is the law, and it is ours to use.', fx: { treasury: 2, trust: 1, standing: -2 }, flag: 'shop',
          out: 'The site opens with eleven thousand films. Arlen’s film industry takes a full page in every newspaper Tarners read. The valley’s teenagers have never been so interested in trade law.' },
        { id: 'b', label: 'Keep the right in reserve, and negotiate', pitch: 'A threat is worth more unspent.', fx: { standing: 1, treasury: -1 },
          out: 'Talks open in a hotel on the border and continue, at intervals, for the rest of the year. Tarn’s negotiators report that Arlen’s are now returning their calls.' }
      ],
      real: 'Antigua won a case against the United States at the World Trade Organization over online gambling. In 2013 it was authorised to suspend American copyrights worth up to $21 million a year.'
    },
    sanctions: {
      title: 'The Eleven',
      text: () => 'The great powers have placed sanctions on the government of a distant state and on four hundred of its richest citizens. Eleven of those citizens bank in Tarn: $2.3 billion between them, a sixth of everything the banks hold. Tarn has been neutral for as long as it has existed in any form. Arlen asks the Council to freeze the accounts. The eleven have let it be known that the money can leave within the hour.',
      options: [
        { id: 'a', label: 'Freeze the accounts', pitch: 'Neutral does not mean open to anybody.', fx: { standing: 2, treasury: -1, trust: -1 }, flag: 'frozen',
          out: 'The accounts are frozen at four in the morning, before the eleven are awake. Two of them sue. In the cafés the old men say the valley has taken a side for the first time in five hundred years, and are not sure they were asked.' },
        { id: 'b', label: 'Stay neutral', pitch: 'We keep money. We do not judge it.', fx: { treasury: 2, standing: -2 },
          out: 'The money stays, and more arrives from the same direction. Tarn’s ambassador is asked to explain the valley’s position in three capitals, and does so, to nobody’s satisfaction.' }
      ],
      real: 'Switzerland, neutral since 1815, adopted the European Union’s sanctions against Russia four days after the invasion of Ukraine in 2022.'
    },
    visitors: {
      title: 'The Jetty',
      text: () => 'A television drama watched by ninety million people ended on the jetty at Seehof, where the lovers parted. Since April two thousand visitors a day have come to stand on it. Seehof has four hundred inhabitants and one public lavatory. The commune wants a turnstile: ten dollars to walk onto the jetty, residents free. The tourist board replies that a country which charges people to look at a lake will be laughed at.',
      options: [
        { id: 'a', label: 'Install the turnstile', pitch: 'If they must come, they can pay for the lavatory.', fx: { treasury: 2, land: 1, standing: -1 }, flag: 'turnstile',
          out: 'The turnstile takes $600,000 in its first summer. A photograph of it, with the lake behind, is shared more widely than the jetty ever was.' },
        { id: 'b', label: 'Keep the jetty free; build a car park and lavatories', pitch: 'Hospitality is what the valley sells.', fx: { standing: 1, treasury: -1, land: -1 },
          out: 'The car park is full by nine each morning, and the visitors go home saying that Tarn is the one place that did not charge them. A second season of the drama is announced.' }
      ],
      real: 'After a Korean television drama made its lakeside jetty famous, the Swiss village of Iseltwald installed a turnstile in 2023 and began charging five francs to walk onto it.'
    },
    guard: {
      title: 'The Guard',
      text: () => 'Tarn has an army: the Guard, sixty-one men, a brass band and four mules. It costs $3 million a year and last marched in 1866, when it went out sixty-one strong and, the story goes, came home sixty-two. Arlen offers to guarantee Tarn’s borders for nothing, in exchange for the use of the high pastures for its mountain troops’ exercises, six weeks every summer.',
      options: [
        { id: 'a', label: 'Disband the Guard; accept Arlen’s guarantee', pitch: 'Three million a year, for a band.', fx: { treasury: 2, land: -1, trust: -1 }, flag: 'disbanded',
          out: 'The Guard parades for the last time, to a larger crowd than independence drew. In July the shepherds report that Arlen’s mountain troops are courteous, punctual, and very loud.' },
        { id: 'b', label: 'Keep the Guard', pitch: 'A country that cannot afford a band is not one.', fx: { trust: 1, treasury: -1 },
          out: 'The Guard is kept, and given a new mule. Arlen’s offer is declined in a letter which the foreign ministry spends a week making polite.' }
      ],
      real: 'Liechtenstein’s army last marched in 1866: eighty men went out and, the story goes, eighty-one came home, having made a friend on the way. It was disbanded two years later.'
    }
  };

  // Before these dispatches (counting from zero) the quarter's wages fall due: Treasury -1.
  const BILLS = [1, 3, 5, 7];
  const FIRST = 'offer';
  const PROMISE_CRISES = ['machines', 'coldbeds', 'ridge', 'disc'];
  const POOL = ['cowbells', 'repository', 'pack', 'ruling', 'sanctions', 'visitors', 'guard'];

  const RECKONING = {
    treasury: {
      title: 'The Pledge',
      text: () => 'The treasury cannot pay December’s wages. Two lifelines are on the table. Arlen’s state bank will lend, against the three dams as security: miss two payments and the dams are Arlen’s. Or the Council can find the money at home: close the school at Oberau and the clinic’s night service, and raise the income tax by half.',
      options: [
        { id: 'a', label: 'Borrow against the dams', pitch: 'Nobody loses a school. We might lose the river.', fx: { treasury: 3, standing: -1, trust: -1 }, flag: 'pledge',
          out: 'The loan agreement runs to four hundred pages; the Council is advised to read page 212 twice. The teachers are paid on the twenty-second.' },
        { id: 'b', label: 'Cut, and tax', pitch: 'What we owe, we owe to ourselves.', fx: { treasury: 3, trust: -2 },
          out: 'The school at Oberau closes at Christmas, and its eleven pupils take the bus. The clinic now shuts at eight. People in the upper valley have learned to fall ill in the mornings.' }
      ],
      real: 'In 1934 Newfoundland, then a self-governing dominion, could not pay its debts. It gave up self-government and was run for fifteen years by a commission appointed from London.'
    },
    trust: {
      title: 'The Ring',
      text: () => 'For the first Sunday of May the villages have called a Landsgemeinde: every adult in the valley standing in a ring in the meadow at Oberau, voting by raised hand, as their grandparents did under the Abbot. One motion is on the paper: that the Council has lost the confidence of the valley. The Charter says nothing about meadows.',
      options: [
        { id: 'a', label: 'Go, and accept the result', pitch: 'If the valley wants us gone it has only to raise its hands.', fx: { trust: 3, treasury: -1 },
          out: 'Four thousand people stand in the meadow. The count takes an hour and is disputed for another. The Council survives by a margin the chair describes as “visible, but only just”.' },
        { id: 'b', label: 'Stay away: the Charter is the law', pitch: 'A government is not unmade in a field.', fx: { trust: -1, treasury: 1, standing: 1 },
          out: 'The ring votes without the Council. Nothing in law has changed, and the foreign newspapers call it firmness. In the valley the ministers find that shopkeepers have begun counting out their change in silence.' }
      ],
      real: 'Two Swiss cantons, Glarus and Appenzell Innerrhoden, still pass their laws by a show of hands at an open-air assembly once a year.'
    },
    land: {
      title: 'The Slope',
      text: () => 'After the wettest spring on record the geologists report that the slope above the village of Hinterau is moving: four centimetres a day, and faster every week. Two million cubic metres of rock. Their advice: move the village out now, for good, and forbid all building above 1,600 metres. Hinterau has stood for seven hundred years, and eighty people live there.',
      options: [
        { id: 'a', label: 'Evacuate, and close the high ground', pitch: 'The mountain has given notice.', fx: { land: 3, treasury: -2, trust: -1 },
          out: 'The eighty leave with what fits in a trailer. In June the slope comes down in a single night and stops at the edge of the churchyard. Nobody is hurt, and nobody goes back.' },
        { id: 'b', label: 'Nets, drains and sensors; the village stays', pitch: 'Seven hundred years of people who did not leave.', fx: { land: 1, treasury: -1 },
          out: 'The engineers install forty sensors and a siren. Hinterau sleeps in its clothes all summer. The slope moves, pauses, and moves again.' }
      ],
      real: 'In May 2023 the Swiss village of Brienz, in Graubünden, was evacuated. A month later well over a million cubic metres of rock came down in the night and stopped just short of the houses.'
    },
    standing: {
      title: 'The Grey List',
      text: () => 'The world’s money-laundering watchdog has put Tarn on its grey list. Foreign banks have begun refusing transfers from the valley, and the dam company cannot pay its turbine supplier. To come off the list Tarn must name the true owner of every company registered here, and let inspectors read the banks’ files.',
      options: [
        { id: 'a', label: 'Comply in full', pitch: 'A valley that cannot pay anybody is not sovereign.', fx: { standing: 3, treasury: -2 },
          out: 'The inspectors are given the old customs house and a view of the dams. Four hundred companies leave the register within the month. By spring Tarn is off the list, and the banks’ lawyers have stopped using the word “sovereignty”.' },
        { id: 'b', label: 'Refuse', pitch: 'Our register is our business.', fx: { standing: -1, treasury: 1, trust: 1 },
          out: 'The companies stay, and their owners stay anonymous. Payments to and from the valley now travel through a bank in a country most Tarners could not find on a map.' }
      ],
      real: 'In 2000 Liechtenstein was placed on the international blacklist of money-laundering havens. It rewrote its banking laws and was taken off the list the following year.'
    }
  };

  const EPILOGUE = {
    treasury: ['The treasury ends the year unable to pay for the paper its accounts are printed on.', 'The accounts balance, as the finance ministry puts it, “on a good day”.', 'The treasury ends the year with money left over, and three ministries with ideas for it.'],
    trust: ['The ministers have stopped going to the Sunday market.', 'The valley complains about its Council as it complains about the weather: constantly, and without expecting a change.', 'On the anniversary of independence the square is full, and the band plays the anthem twice.'],
    land: ['The tourist brochure now mentions the glacier in the past tense.', 'The mountain is much as it was. The old guides say “for now”, and are asked not to.', 'The marmots are back on the lower pastures, which the old guides take as a verdict.'],
    standing: ['Abroad, “doing a Tarn” has entered the language, and it is not a compliment.', 'Abroad, Tarn is confused with two other places, one of which does not exist.', 'Abroad, Tarn is held up as a model small state, chiefly by people who have only changed trains there.'],
    flags: {
      rented: 'A second billionaire has enquired about August.',
      machines: 'At the head of the valley the hall hums through the night.',
      blast: 'There is a gap in the skyline where the Kesselgrat used to be.',
      open: 'Every January Tarn’s banks now send a report to forty governments.',
      visser: 'Mrs Visser has announced that she will stand for the village council.',
      repository: 'Under the Tarnhorn the first tunnel is four hundred metres deep.',
      cull: 'One pack of wolves remains, and keeps to the far side of the pass.',
      shop: 'The copyright shop sells more films to Arleners than to anybody else.',
      frozen: 'Tarn’s neutrality now comes with a footnote.',
      turnstile: 'The turnstile at Seehof has its own postcard.',
      disbanded: 'The Guard’s four mules have been found a home in the upper valley.',
      pledge: 'Somewhere in Arlen’s capital a bank holds the deeds to three dams.'
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

  root.COUNCIL = { META, FIRST, GAUGES, RULES, CHARTER, PORTFOLIOS, CRISES, RECKONING, EPILOGUE, CLOSERS, PROMISE_CRISES, POOL, BILLS, portfoliosFor, orderFor };
})(typeof window !== 'undefined' ? window : globalThis);
