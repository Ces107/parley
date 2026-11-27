/* The Council — class scenario. A mountain valley and its first year. */
(function (root) {
  'use strict';

  const TIMES = ['', 'once', 'twice', 'three times', 'four times', 'five times'];

  const META = {
    title: 'The Free State of Tarn',
    lead: 'You govern a new country for its first year. Each player needs a pencil, some paper and two markers. Cut the markers from the printed sheet, or use two coins.',
    bill: 'The teachers, the road crews and the clinic staff have been paid.',
    verdicts: {
      fell: 'The government fell before the year was out.',
      dead: 'The Free State did not reach its first anniversary.',
      just: 'The Free State of Tarn has made it into a second year, but only just.',
      ok: 'The Free State of Tarn begins its second year.'
    },
    charterLine: n => n ? 'The Council set its own Charter aside ' + (TIMES[n] || 'many times') + ' during the year.' : 'The Council got through the year without setting the Charter aside.'
  };

  const GAUGES = [
    { id: 'treasury', name: 'Treasury', what: 'The government’s money. Wages come out of it four times a year, whatever else happens.' },
    { id: 'trust', name: 'Trust', what: 'How much the people of the valley support their government. It drops when the Council does something the villages dislike.' },
    { id: 'land', name: 'Mountain', what: 'The condition of the valley’s land and water. The farms and the ski areas depend on it, and so do the dams.' },
    { id: 'standing', name: 'Standing', what: 'Tarn’s reputation in other countries. It affects whether they trade with the valley and lend the government money.' }
  ];

  const INTRO = {
    story: [
      'Tarn is a mountain valley with 7,200 people in it. For six hundred years it belonged to the Abbey of Saint Aurel, and the Abbot ruled it without ever visiting. At midnight it became an independent country, and you are its government.',
      'Tarn has three dams, which make more electricity than the valley can use, two ski areas and three banks. The banks hold thirty times what the government spends in a year. The government itself is short of money. It spends about $50 million a year and has never collected half of that in taxes.',
      'Two neighbours will come up again and again. Arlen is a big country that buys Tarn’s electricity and supported its independence. Vara is a small one just across the border, and businesses that are turned away from Tarn usually end up there.'
    ],
    sheet: 'Tarn in brief',
    facts: [
      ['People', '7,200, a quarter of them born abroad'],
      ['Land', 'one valley, with 40 km of river'],
      ['Languages', 'German and the valley’s own dialect'],
      ['Currency', 'the US dollar'],
      ['Income', 'electricity, skiing and banking'],
      ['The state spends', '$50 million a year'],
      ['The state raises', 'less than half of that']
    ],
    game: 'You govern Tarn for one year. In that time seven or eight problems reach the Council, one after another. Each one is called a dispatch. You argue about it and vote, and then the screen tells you what happened. The screen also keeps four scores for the country, which are called gauges.',
    charter: {
      title: 'The Charter of the Free State of Tarn',
      date: 'Tarn, 1 January',
      lead: 'Before the first dispatch you write the Charter, which is Tarn’s constitution. It has four articles. For each article the screen offers three versions, and you vote for one of them.',
      points: [
        'The Charter comes back later. Four of the dispatches are about something it covers, and in those you can only go against the Charter if all of you vote to.',
        'When the Charter is finished, each of you scans a code with your phone and is given a ministry. Keep it secret. Your ministry has one of the four gauges, and your score is whatever that gauge shows at the end of the year.',
        'Your phone also names one decision that you have promised somebody the Council will take. If the Council takes it, you score 5 more points. Each marker you have not used is worth 1 point. The highest score wins.'
      ]
    }
  };

  const RULES = [
    'Every dispatch has a Chair, and the screen shows who it is. The Chair reads the dispatch aloud and then reads out the options.',
    'You have three minutes to argue. When the bell goes, everybody votes by raising a hand. The option with the most votes wins, and if two options are level the Chair chooses.',
    'Under each option the screen shows how it will change the gauges. A few options show question marks instead, and then you have to guess.',
    'Each of you has two markers. Hand one in when you vote and your vote counts as two. You can also give a marker to another minister, for example in return for a vote.',
    'Four times in the year the state pays its wages, and the Treasury loses a point.',
    'If a gauge falls to 0, you have to take two points from another gauge to bring it back to 2. The second time this happens, your government has fallen. You play on to the end of the year, but the final screen will say that it fell.'
  ];

  // Each article binds one of the four dispatches on which a minister has made a private promise.
  const CHARTER = [
    {
      id: 'cit', title: 'Article 1', binds: 'cowbells', question: 'Who can become a citizen of Tarn?',
      text: 'A quarter of the people in the valley were born somewhere else, and many of them have lived here for decades. The Charter has to say how a newcomer becomes a citizen.',
      options: [
        { id: 'descent', label: 'By descent', pitch: 'Only the children of citizens. Anyone else remains a guest, however long they stay.', law: 'The citizens of Tarn are the people born in the valley before independence, and their children. Nobody else can become one.', fx: { trust: 1, treasury: -1 } },
        { id: 'state', label: 'By the state', pitch: 'After ten years in the valley and a language test, an office in the capital decides.', law: 'A person who has lived in the valley for ten years and speaks its language may be made a citizen by the state.', fx: { standing: 1, trust: -1 } },
        { id: 'village', label: 'By the village', pitch: 'After ten years in the valley, the neighbours vote on it.', law: 'A person who has lived in the valley for ten years may be made a citizen by a vote of their village.', fx: { trust: 2, standing: -1 } }
      ]
    },
    {
      id: 'water', title: 'Article 2', binds: 'machines', question: 'Who owns the water?',
      text: 'Three dams on forty kilometres of river produce far more electricity than the valley uses. Arlen buys all the surplus and would buy more.',
      options: [
        { id: 'state', label: 'The state', pitch: 'The government owns the dams and sells the power.', law: 'The rivers of the valley and the dams on them belong to the state.', fx: { treasury: 1, trust: -1 } },
        { id: 'commune', label: 'The communes', pitch: 'Each village owns the water that runs through it, as it always has.', law: 'Each commune owns the water that runs through it.', fx: { trust: 1, treasury: -1 } },
        { id: 'concession', label: 'Whoever pays for it', pitch: 'Arlen’s power company buys a sixty-year concession now.', law: 'The use of the valley’s water is granted for sixty years to Arlen’s power company, which has paid for the concession.', fx: { treasury: 2, land: -1 } }
      ]
    },
    {
      id: 'tax', title: 'Article 3', binds: 'disc', question: 'How does Tarn pay for itself?',
      text: 'Running the valley costs about $50 million a year, and its taxes have never raised half of that.',
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
      text: () => 'A man who made $9 billion from a phone app wants to rent Tarn for four days around his fiftieth birthday in June. He offers $9 million. For that he wants the pass road closed to anyone who is not on his guest list, his company’s flag flown next to ours on the town hall, fireworks from all three summits and the high street renamed for the weekend. His office points out that a country has been rented before, and for much less.',
      options: [
        { id: 'a', label: 'Accept', pitch: 'It is $9 million for four days, and on Monday the valley has its road back.', fx: { treasury: 2, trust: -1 }, flag: 'rented',
          out: 'The guests arrive in two dozen helicopters. The fireworks set off an avalanche on the north face, which hurts nobody and is added to his bill. The villagers spend the weekend behind a rope in their own high street.' },
        { id: 'b', label: 'Decline', pitch: 'We should not hire out the country like a hotel.', fx: { standing: 1, trust: 1, treasury: -1 },
          out: 'He rents a castle in Vara instead and tells an interviewer that Tarn “lacked ambition”. A shop in the valley prints the remark on tea towels and sells them to tourists all summer.' }
      ],
      real: 'In 2011 the whole of Liechtenstein could be rented through Airbnb for $70,000 a night, with a two-night minimum.'
    },
    machines: {
      title: 'The Machines',
      text: () => 'Halcyon Compute wants 25 megawatts, a third of the electricity the dams produce, for a hall of computers at the head of the valley. The machines would mine cryptocurrency and be rented out for computing. Halcyon would pay half as much again as Arlen’s grid pays, for fifteen years, and would employ twelve people. Once that power was sold, the valley’s own electricity would cost more every February, when the rivers are low. The hall would also hum day and night.',
      guard: f => f.water === 'commune' ? { options: ['a'], why: 'The Charter gave the water to the communes. A third of their electricity can only be sold if every minister votes for it.' }
        : f.water === 'concession' ? { options: ['b'], why: 'Under the Charter the use of the water belongs to Arlen’s power company, which wants to sell to Halcyon and would pay the state a share. The contract can only be blocked if every minister votes against it.' }
        : { options: [], why: 'Under the Charter the dams belong to the state, so the Council may sell their power or keep it. A majority decides.' },
      options: [
        { id: 'a', label: 'Sign the power contract', pitch: 'We should sell our surplus to whoever pays most for it.', fx: { treasury: 3, land: -1, trust: -1 }, flag: 'machines',
          out: 'The hall is built in nine weeks. It is grey, has no windows and is as long as the village beside it. The first payment arrives in a currency that the finance ministry has to look up.' },
        { id: 'b', label: 'Refuse', pitch: 'The valley needs that power in February more than Halcyon needs it all year.', fx: { trust: 1, treasury: -1 },
          out: 'Halcyon builds its hall in Vara, a little further down the same river. On a still night the customs officers at the border can hear it.' }
      ],
      real: 'Bhutan has used its surplus hydropower to mine bitcoin since about 2019. The kingdom’s holdings have been worth hundreds of millions of dollars.'
    },
    cowbells: {
      title: 'The Cowbells',
      text: () => 'Anneke Visser was born in Rotterdam and has lived in the village of Sennach for thirty-four of her forty-two years. She speaks the dialect and has brought up three children there. She has also campaigned against cowbells, against the church bell that rings at six in the morning and against the piglet race at the summer fair. She has applied for citizenship twice, and both times the village meeting has voted against her, because she “does not respect our way of life”. She has appealed to the Council.',
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
          out: 'Tarnbahn cancels its order for the cable car and lays off seventy people within a month. The ridge is on that year’s postage stamps.' },
        { id: 'c', label: 'Allow the cable car but keep the ridge', pitch: 'Tarnbahn gets its link, and the ridge keeps its top.', fx: { treasury: 1, land: -1 }, unanimous: true,
          out: 'The cable car takes the long way round and costs twice as much. The ridge is untouched, and the climbers still complain about the cable.' }
      ],
      real: 'A plan to join two glacier ski areas in the Austrian Tyrol, Pitztal and Ötztal, which involved blasting away part of a mountain ridge, was abandoned in 2022 after one village voted narrowly against it.'
    },
    disc: {
      title: 'The Disc',
      text: () => 'A former clerk at the Tarner Landesbank has sold Arlen’s tax office a disc with the names of 1,400 Arleners who have accounts in the valley. Arlen’s finance minister has now asked, very politely, for everything else. He wants bank secrecy ended and a report every year on every account held by a foreigner. The banks hold thirty times the state’s budget, and they say the money would be in Singapore by Friday.',
      guard: f => f.tax === 'haven' ? { options: ['a'], why: 'The Charter promised people who bring their business to the valley that their affairs would be private. Bank secrecy can only be ended if every minister votes for it.' }
        : f.tax === 'income' ? { options: [], why: 'The Charter taxes what people in the valley earn. It makes no promise to foreigners who bank here, so a majority decides.' }
        : { options: [], why: 'The Charter taxes hotel beds and second homes and says nothing about bank accounts. A majority decides.' },
      options: [
        { id: 'a', label: 'End bank secrecy', pitch: 'Secrecy is finished whatever we do. We may as well get the credit for ending it.', fx: { standing: 2, treasury: -2 }, flag: 'open',
          out: 'A fifth of the deposits leave within a month, and one of the three banks closes. At the next summit Tarn is given a seat at the table. Until now its minister has sat behind it.' },
        { id: 'b', label: 'Refuse, and prosecute the clerk', pitch: 'The banks gave their customers a promise, and so did we.', fx: { treasury: 1, standing: -2 },
          out: 'The clerk is convicted in his absence. Arlen’s customs officers begin to search every car that leaves the valley and say it is routine.' }
      ],
      real: 'In 2008 it emerged that Germany had paid an informant more than four million euros for client data stolen from LGT, a bank owned by Liechtenstein’s ruling family. A year later Liechtenstein agreed to share tax information with other countries.'
    },
    coldbeds: {
      title: 'Cold Beds',
      text: () => 'A third of the homes in the upper valley now belong to people from abroad and stand shuttered for forty-eight weeks of the year. House prices have trebled in ten years, and the school at Oberau has eleven pupils left. The villages want a cap, so that second homes may make up no more than a fifth of the houses in any commune. The building firms, the valley’s biggest employers after Tarnbahn, say a cap would put them out of business.',
      options: [
        { id: 'a', label: 'Pass the cap', pitch: 'People who grew up here can no longer afford to stay.', fx: { trust: 2, treasury: -1 },
          out: 'Thirty-five building permits are cancelled in one morning, and two construction firms move to Vara. In Oberau a family from the lower valley buys a house. Nobody local had bought one there for nine years.' },
        { id: 'b', label: 'No cap', pitch: 'The taxes on those chalets pay for the snowploughs.', fx: { treasury: 2, trust: -2 },
          out: 'The cranes stay where they are. Before long the upper valley has more heated swimming pools than children.' }
      ],
      real: 'In 2012 Swiss voters decided, by 50.6 per cent, that second homes may make up no more than a fifth of the housing in any commune.'
    },
    repository: {
      title: 'The Granite',
      text: () => 'Arlen has fifty years of nuclear waste and nowhere to store it. Its geologists have concluded that the best rock within five hundred kilometres is the granite under the Tarnhorn. Arlen offers $90 million a year for a hundred years. It would pay for the building and accept all liability. The waste would arrive by rail, at night, over thirty years, and would then have to be left undisturbed for a hundred thousand.',
      guard: f => f.rule === 'people' ? { options: ['a'], why: 'Under the Charter five hundred signatures can send a decision to a vote of the whole valley, and the petition against this one has four thousand. The Council can only agree if every minister votes for it.' }
        : f.rule === 'abbot' ? { options: ['a'], why: 'The Abbot promised not to use his veto, but he has let it be known that he would break that promise over this. The Council can only agree if every minister votes for it.' } : null,
      options: [
        { id: 'a', label: 'Agree to host it', pitch: 'It has to go under somebody’s mountain, and nobody else is being paid this much.', fx: { treasury: 3, land: -2, trust: -2 }, flag: 'repository',
          out: 'The Council asks for the treaty to be signed in Arlen’s capital and not in Tarn. Drilling starts within months. House prices in the lower valley fall by a third. The first payment is nearly twice what the state spends in a year.' },
        { id: 'b', label: 'Refuse', pitch: 'I would not put it under this mountain for any money.', fx: { trust: 1, land: 1, standing: -1 },
          out: 'Arlen’s minister says the decision is “understood, if not understandable”. Arlen’s electricity company announces that it will review the price it pays for Tarn’s power.' }
      ],
      real: 'Finland’s Onkalo repository, cut more than 400 metres into bedrock, is the first in the world built to hold spent nuclear fuel for 100,000 years. The council of the town that hosts it voted to accept it.'
    },
    pack: {
      title: 'The Pack',
      text: () => 'Wolves have come back over the pass. There are two packs, fourteen animals in all, and they have killed 140 sheep on the high pastures. The shepherds want one pack shot. A petition from Arlen, signed by 80,000 people, asks for the wolves to be left alone, and a film crew has taken rooms at the inn. We have signed the convention that protects wolves.',
      options: [
        { id: 'a', label: 'Authorise the cull', pitch: 'People farmed this valley long before anybody came to photograph it.', fx: { trust: 2, land: -1, standing: -1 }, flag: 'cull',
          out: 'The state’s two gamekeepers shoot five wolves while the film crew watches. For the rest of the season the shepherds lose no more sheep. The documentary wins a prize.' },
        { id: 'b', label: 'Protect the wolves and pay for dogs and fences', pitch: 'We signed the convention, and we should keep to it.', fx: { land: 2, treasury: -1, trust: -1 },
          out: 'Twenty-five guard dogs arrive from Abruzzo. They keep the wolves off, and on three occasions they keep hikers off as well. Half as many sheep are lost, but the shepherds are no happier.' }
      ],
      real: 'Switzerland had no wolf packs before 2012 and about thirty a decade later. Since 2023 its wardens have been allowed to shoot whole packs before they do damage.'
    },
    ruling: {
      title: 'The Ruling',
      text: () => 'A trade tribunal has ruled on a complaint the valley brought in the Abbot’s time. It found that Arlen broke its treaty when it shut the valley’s online businesses out of its market. Arlen refuses to comply, so the tribunal has allowed us to take our compensation another way, by ignoring Arlen’s copyrights up to a value of $21 million a year. A firm in Vara has offered to build an online shop that would sell Arlen’s films, music and software from Tarn, legally, at a tenth of the usual price. The state would keep a third of the takings.',
      options: [
        { id: 'a', label: 'Open the shop', pitch: 'The tribunal gave us this right, and it is worth $21 million a year.', fx: { treasury: 2, trust: 1, standing: -2 }, flag: 'shop',
          out: 'The shop opens with six thousand films. Arlen’s film industry buys a full page in every newspaper that Tarners read.' },
        { id: 'b', label: 'Keep the right in reserve and negotiate', pitch: 'Arlen will offer us more while we still have this to use.', fx: { standing: 1, treasury: -1 },
          out: 'Talks begin in a hotel on the border and go on, with long gaps, for the rest of the year. Tarn’s negotiators report that Arlen now returns their calls.' }
      ],
      real: 'Antigua won a case against the United States at the World Trade Organization over online gambling. In 2013 it was authorised to suspend American copyrights worth up to $21 million a year.'
    },
    sanctions: {
      title: 'The Eleven',
      text: () => 'The great powers have imposed sanctions on the government of a distant country and on three hundred of its richest citizens. Eleven of those citizens bank in Tarn. They have $250 million here between them, a sixth of everything the banks hold. Tarn has not taken sides in a war since 1866. Arlen asks the Council to freeze the accounts, and the eleven have made it known that they can move the money within an hour.',
      options: [
        { id: 'a', label: 'Freeze the accounts', pitch: 'Being neutral has never meant taking anybody’s money.', fx: { standing: 2, treasury: -1, trust: -1 }, flag: 'frozen',
          out: 'The accounts are frozen at four in the morning, while the eleven are asleep. Two of them sue. In the cafés the old men say the valley has taken sides for the first time since 1866, and that nobody asked them.' },
        { id: 'b', label: 'Stay neutral', pitch: 'The banks are there to look after money, and it is not for us to judge whose it is.', fx: { treasury: 2, standing: -2 },
          out: 'The money stays, and more arrives from the same country. Arlen calls in Tarn’s ambassador and does not accept his explanation.' }
      ],
      real: 'Switzerland, neutral since 1815, adopted the European Union’s sanctions against Russia four days after the invasion of Ukraine in 2022.'
    },
    visitors: {
      title: 'The Jetty',
      text: () => 'The last scene of a television drama watched by ninety million people was filmed on the jetty at Seehof, where the two lovers said goodbye. For months now two thousand visitors a day have come to stand on it. Seehof has 350 inhabitants and one public lavatory. The commune wants to install a turnstile and charge ten dollars to walk onto the jetty, with residents going free. The tourist board says a country that charges people to look at a lake will be laughed at.',
      options: [
        { id: 'a', label: 'Install the turnstile', pitch: 'If two thousand people a day are coming, they can pay for the lavatories.', fx: { treasury: 2, land: 1, standing: -1 }, flag: 'turnstile',
          out: 'The turnstile takes more than $1 million in its first three months. A photograph of it with the lake in the background is shared more widely than any picture of the jetty.' },
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
          out: 'The Guard’s last parade draws a bigger crowd than Independence Day did. The following summer the shepherds report that Arlen’s mountain troops are polite and punctual and make a great deal of noise.' },
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
      text: () => 'The treasury cannot pay December’s wages. There are two ways to find the money. Arlen’s state bank will lend it with the pass road as security, which means that if we miss two payments Arlen takes over the road. Or the Council can find the money at home by closing the school at Oberau and the clinic’s night service and raising taxes by half.',
      options: [
        { id: 'a', label: 'Borrow against the pass road', pitch: 'Nobody loses a school, and we only lose the road if we fail to pay.', fx: { treasury: 3, standing: -1, trust: -1 }, flag: 'pledge',
          out: 'The loan agreement is three hundred pages long, and the Council’s lawyer advises reading page 212 twice. The teachers are paid on the twenty-second.' },
        { id: 'b', label: 'Cut and tax', pitch: 'I would sooner ask our own people for the money than risk the road.', fx: { treasury: 3, trust: -2 },
          out: 'The school at Oberau closes at Christmas, and its eleven pupils now take the bus. The clinic shuts at eight in the evening. People in the upper valley say you now have to fall ill before supper.' }
      ],
      real: 'In 1933 Newfoundland, then a self-governing dominion, could not pay its debts. The next year it gave up self-government and was run for fifteen years by a commission appointed from London.'
    },
    trust: {
      title: 'The Ring',
      text: () => 'The villages have called a Landsgemeinde for the Sunday before Christmas. Every adult in the valley will stand in a ring in the meadow at Oberau and vote by raising a hand, as their grandparents did under the Abbot. There is one motion, that the Council has lost the confidence of the valley. The Charter says nothing about meetings in meadows.',
      options: [
        { id: 'a', label: 'Attend, and accept the result', pitch: 'If the valley wants us out, we should let it say so.', fx: { trust: 3, treasury: -1 },
          out: 'Nearly five thousand people stand in the snow. The count takes an hour and the arguments about it take another. The Council survives by a margin that the man counting the hands calls “visible, but only just”.' },
        { id: 'b', label: 'Stay away and stand by the Charter', pitch: 'A show of hands in a field has no power to remove a government.', fx: { trust: -1, treasury: 1, standing: 1 },
          out: 'The ring votes without the Council. Legally nothing has changed, and foreign newspapers praise the Council for standing firm. In the valley, shopkeepers have started to count out the ministers’ change without a word.' }
      ],
      real: 'Two Swiss cantons, Glarus and Appenzell Innerrhoden, still pass their laws by a show of hands at an open-air assembly once a year.'
    },
    land: {
      title: 'The Slope',
      text: () => 'After the wettest autumn on record, geologists report that the slope above the village of Hinterau is moving four centimetres a day and getting faster every week. It holds two million cubic metres of rock. They advise moving the village out now, permanently, and banning all building above 1,600 metres. Hinterau is seven hundred years old, and eighty people live there.',
      options: [
        { id: 'a', label: 'Evacuate, and close the high ground', pitch: 'The geologists have told us what is coming, and we should believe them.', fx: { land: 3, treasury: -2, trust: -1 },
          out: 'The eighty villagers leave with whatever fits in a trailer. A month later the slope comes down in the night and stops at the edge of the churchyard. Nobody is hurt, and nobody moves back.' },
        { id: 'b', label: 'Shore up the slope and stay', pitch: 'People have lived under that slope for seven hundred years.', fx: { land: 1, treasury: -1 },
          out: 'Engineers install sensors and a siren. The people of Hinterau sleep in their clothes for the rest of the winter. The slope moves, stops for a while and moves again.' }
      ],
      real: 'In May 2023 the Swiss village of Brienz, in Graubünden, was evacuated. A month later well over a million cubic metres of rock came down in the night and stopped just short of the houses.'
    },
    standing: {
      title: 'The Grey List',
      text: () => 'The international body that polices money laundering has put us on its grey list. Foreign banks have started to refuse transfers from the valley, and the dam company cannot pay the firm that supplies its turbines. To be taken off the list, we must name the real owner of every company registered here and let inspectors read the banks’ files.',
      options: [
        { id: 'a', label: 'Comply in full', pitch: 'If nobody will take our payments, we are not independent in any way that matters.', fx: { standing: 3, treasury: -2 },
          out: 'The inspectors are given the old customs house, which has a view of the dams. Six hundred companies leave the register within a month. By spring Tarn is off the list.' },
        { id: 'b', label: 'Refuse', pitch: 'Who owns a company in Tarn is a matter for Tarn.', fx: { standing: -1, treasury: 1, trust: 1 },
          out: 'The companies stay, and nobody learns who owns them. Payments to and from the valley now go through a bank on the other side of the world, and take a week.' }
      ],
      real: 'In 2000 Liechtenstein was put on the Financial Action Task Force’s list of countries that would not cooperate against money laundering. It rewrote its banking laws and was taken off the list the following year.'
    }
  };

  const EPILOGUE = {
    treasury: ['The state ends the year unable to pay its staff.', 'The state pays its bills, though seldom on the day they fall due.', 'The state ends the year with money left over, and three ministries have already asked for it.'],
    trust: ['Ministers have stopped going to the Sunday market.', 'People complain about the Council much as they complain about the weather.', 'On the first anniversary of independence the square is full, and the band plays the anthem twice.'],
    land: ['The tourist brochures have stopped showing the glacier.', 'The mountain is much as it was a year ago.', 'Marmots have been seen on the lower pastures again, which the old guides say is a good sign.'],
    standing: ['Abroad, nobody has a good word to say for Tarn.', 'Abroad, people often confuse Tarn with somewhere else.', 'Abroad, other small countries send delegations to see how Tarn does it.'],
    flags: {
      rented: 'A second billionaire has asked whether Tarn is free in August.',
      machines: 'The hall at the head of the valley hums all night.',
      blast: 'There is a gap in the skyline where the top of the Kesselgrat used to be.',
      open: 'Every January Tarn’s banks send their reports to tax offices abroad.',
      visser: 'Mrs Visser has announced that she will stand for the village council.',
      repository: 'The first shaft under the Tarnhorn is four hundred metres deep.',
      cull: 'One pack of wolves is left, and it stays on the far side of the pass.',
      shop: 'Most of the copyright shop’s customers are in Arlen.',
      frozen: 'Tarn still describes itself as neutral, and Arlen is satisfied.',
      turnstile: 'The turnstile at Seehof now appears on a postcard.',
      disbanded: 'The Guard’s four mules have been found a home in the upper valley.',
      pledge: 'A bank in Arlen’s capital holds the deeds to the pass road.'
    }
  };

  const CLOSERS = [
    'The postcard you send home on your last day in office.',
    'The plaque the valley puts up to this Council.',
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
