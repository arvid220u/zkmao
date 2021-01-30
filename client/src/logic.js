// logic.js is intended to hold all game logic

import seedrandom from "seedrandom";

import * as p2p from "./p2p.js";
import * as utils from "./utils.js";
import * as cards from "./cards.js";
import * as config from "./config.js";
import * as rules from "./rules.js";
import * as tokens from "./tokens.js";

import assert from "./assert.js";

// TODO: later version: add signatures to actually be secure

// WIRE PROTOCOL:
// always assume broadcast messages!!!!!! this allows us to assume synchronicity which makes everything so much simpler
// 1. setup:
//  1.1 everyone: READY hashOfRandomNumber userID (number is a 64-bit integers, user id is randomly generated (later should be public key))
//  1.2 when everyone you have open connections with say READY: START randomNumber  (userID is sent with every message)
//  1.3 when received all STARTs: verifies all hashes, xors all numbers, seed rng with this, then just pick cards
//  1.4 using same seed just choose order
// 2. play:
//  2.1 someone: PLAY card userID rules provedRules (same as for playack, need to show you enforce rules consistently even for yourself)
//  2.2 everyone else: PLAYACK card user userID provedRules (rulehash, snark proof, for each rule you know)
// 3. gameover: (when someone gets 0 cards)
//  3.1 everyone: FINALIZE tokenHash drawTokenProof newRule (rule, power, spendTokenProof)
//      (can then send READY to transition into setup phase)
// 4. abort:
//  3.1 send ABORT userID to every user, be sad

// we assume that messages come to people in the order they are sent
// i.e. we assume that channels are FIFO

// ok so we have:
// phase = {"setup", "play", "gameover", "abort"}
// each phase has some metadata, which can be public or private
// the public metadata is always sent over for debugging purposes

// transitions
// setup:
//      state = {"preReady","sentReady","sentStart"},
//      players, readyHashes, startNumbers, myRandom
//
// play:
//      nextTurn = index into players
//      players (order matters),
//      playedCards (0 bottom, n-1 top),
//      playerHands (id -> array),
//      state = {"waitforplay", "waitforack"}
//      acksReceived = []
//      lastPlayedCard
//      lastPlayedUser
//      lastSelectedRules
//      penaltyRules
//      snarkStatus
//
// gameover: (transitions directly to setup.sentReady (only if received all finalized))
//      winner = user_id
//      sentFinalize = true/false
//      finalizedReceived = []
//      readyToRestart = true/false
//      didDrawTokens = true/false
//      drawnTokens = []
//      compilingRule = true/false
//      snarkStatus
//
// abort:
//      (no data)

export const PHASE = {
  SETUP: "SETUP",
  PLAY: "PLAY",
  GAMEOVER: "GAMEOVER",
  ABORT: "ABORT",
};
const PHASES = Object.values(PHASE);
const SETUP_STATE = {
  PRE_READY: "PRE_READY",
  SENT_READY: "SENT_READY",
  SENT_START: "SENT_START",
};
const SETUP_STATES = Object.values(SETUP_STATE);
const PLAY_STATE = {
  WAIT_FOR_PLAY: "WAIT_FOR_PLAY",
  WAIT_FOR_PLAYACK: "WAIT_FOR_PLAYACK",
};
const PLAY_STATES = Object.values(PLAY_STATE);

const METHOD = {
  READY: "READY",
  START: "START",
  PLAY: "PLAY",
  PLAYACK: "PLAYACK",
  FINALIZE: "FINALIZE",
  ABORT: "ABORT",
};
const METHODS = Object.values(METHOD);
const METHOD_HANDLER = {
  [METHOD.READY]: handleReadyMethod,
  [METHOD.START]: handleStartMethod,
  [METHOD.PLAY]: handlePlayMethod,
  [METHOD.PLAYACK]: handlePlayAckMethod,
  [METHOD.FINALIZE]: handleFinalizeMethod,
  [METHOD.ABORT]: handleAbortMethod,
};
assert(
  JSON.stringify(METHODS) === JSON.stringify(Object.keys(METHOD_HANDLER)),
  {
    methods: METHODS,
    handlers: METHOD_HANDLER,
  }
);

export function createGame(conn) {
  // TODO: generate private/public keypair here and let userId be the public key
  const userId = Math.random().toString(36).substr(2, 9);
  const game = {
    conn,
    listeners: {},
    listenerIndex: "0",
    userId: userId,
    phase: null,
    data: {}, // contains data for every phase

    // rule data
    myRules: [],
    allRules: [],

    // token state (filled in first when all players are known)
    tokenState: null,

    numRounds: 0,

    playerRandoms: {},

    prevSalt: 0,
  };
  for (const phase of PHASES) {
    game.data[phase] = {};
  }
  initPhase(game, PHASE.SETUP);
  setUpPublicRules(game);
  console.log("PERSISTENT GAME OBJECT:");
  console.log(game);
  return game;
}
async function setUpPublicRules(game) {
  /*let cleanSlate = {
    spades: "return card1 < 13;",
    lastcard: "return lastcard;",
    "have a nice day": "return card1 % 13 === 6;",
    "thank you": "return card2 % 13 === 6;",
    "i salute the chair": "return (card1 % 13) > 9",
  };*/
  let answer = JSON.parse(
    // '[{"name":"spades","source":"return card1 < 13;","owner":"everyone","compiled":["5444517789605377000807312023119353348095","22300744866223624195306750046696871313797120","91343850972051964703976448191270384901313003520","374144413581524847427487531791443496555778062417920","1532495518029925775062988930217752561892466943663800320","6277101641850575974658002658171914493511544601246926110720","1606937661135105059069747502754722727590241779965516819988480","1605368768825143605351003146283434881209071198220234113679375","5316911903911500977350890647577493503","21778071158421508003229248092477413392380","89202979464894496781227000186787485255188480","365375403888207858815905792765081539605252014080","1496577654326099389709950127165773986223112249671680","6129982072119703100251955720871010247569867774655201280","25108406567402303898632010632687657974046178404987704442880","1606936511763449409653103733995403102794358138513688774049792","1600660942523603594778126308110251717269675811532557948813375","21267647615646003909403562590309974015","87112284633686032012916992369909653569520","356811917859577987124908000747149941020753920","1461501615552831435263623171060326158421008056320","5986310617304397558839800508663095944892448998686720","24519928288478812401007822883484040990279471098620805120","100433626269609215594528042530750631896184713619950817771520","1606931914276826811986528658958124603610823572706376590295040","1581829637317443552486618955417519061512094264781853289349375","85070590462584015637614250361239896063","348449138534744128051667969479638614278080","0","717022"],"hash":"17205012832311340811919375832927141639902470640718918663600937074630886418595"},{"name":"lastcard","source":"return lastcard;","owner":"everyone","compiled":["1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","1071292029505993517027974728227441735014801995855195223534250","174762","465140"],"hash":"21230679390951108096990554741869645482032749412231210854096376350304594975156"},{"name":"have a nice day","source":"return card1 % 13 === 6;","owner":"everyone","compiled":["301300887788293773446888249548557771191567189891548616601600","18389946764422227383232879752063607310570598236088696832","75325221947073443361721875464452535544097170375019302224640","4597486691105556080172894365904359035049782837534261248","18831305486768357704388175322744254607563910502540334072000","1149371659931159785689584661951516033716831152264445952","4707826319078030482184538775353409674104140399675170619440","71835729548524325715753614794864123151675984833609728","294239148230755638131726806199763448429264833878465445900","1205203551153175093787552998194231084766268759566194466406400","73559787057688909532931519008254429242282392944354787328","301300887788293773446887501857810142176388681500077208898560","18389946764422224320691577463617436140199131350137044992","75325221947073430817552701290977018430255642010161336288000","4597486639724639142758338647806064134867324609057783808","18831305276312121928738155101413638696416561598700682477760","287342918194097302863014459179456492606703939334438912","1176956592923022552526907224799053793717059335513861783600","71835729548524325715753436531498466056916399359721472","294239148230755638131726076033017716969129571777419149315","1205203551153175093787550007431240568705554726000308835594240","73559787057688897282766309854469744560796525400548179968","301300887788293723270210805163908073721022568040645345152000","18389946558898556571033354591224256539469298436231135232","75325221105248487714952620405654554785666246394802729911040","1149371672776389211452057836717825970426815757337755648","4707826371692090210107628899196215174868237342055447134400","287342918194097302863013746125993864227665597438885888","12","656804"],"hash":"2384772224768571088793082997670145304784266395039989777732184072162815188083"},{"name":"thank you","source":"return card2 % 13 === 6;","owner":"everyone","compiled":["0","0","0","5575186299632655785383929568162021657018368","0","0","0","0","0","0","1329227995784915872903807060280328192","0","0","0","0","0","1600660942523603594778126302917954936106100638338328800788480","316912650057057350374175801343","0","0","0","0","0","1606938042762412598915117504100589333820729181655117911293952","75557863725914323419135","0","0","0","0","28819"],"hash":"1790166872727187973982917880744434754227559549735937037239485954634777301283"},{"name":"i salute the chair","source":"return (card1 % 13) > 9","owner":"everyone","compiled":["24136805128304173440493154674583484595123910184866414592","98864353805533894412259961547093952901627536117212834169840","6034201282076042355226923855249471233502839974263717888","24716088451383469487009480111101834172427632534584188469500","1508550303659647218717579868811364794253340887347085312","6179022043789915007867207142651350197261684274573661438015","1205203627478637739094649071182491370150813881911824720588800","386188882052866775047891433137189526063410094465485897743","1581829660888542310596163310129928298755727746930630237158400","96547220513216693761972618698333938380495640739465658368","395457415222135577649039846188375811606510144468851336679360","24136805128304169420907695420997884934011359897054871552","98864353805533877948037920444407336689710530138336753878000","6034201214638588874870319475245459177013363549388341248","24716088175159660031468828570605400789046737098294645752060","377137580129752710007706477673036646546298920376451072","1544755528211467100191565732548758104253640377861943590975","1506504510777198415758766963496225387456302006374142442729472","386188882052866775047890474793335753521982562957862633475","1581829660888542310596159384753503246426040577875405346717440","96547220513216677683630781683991539736045439588219486208","395457415222135511792151681777629346758842120553347015512000","24136804858554355499481277900981836708053454197553364992","98864352700638640125875314282421603156186948393178583008240","1508550320519010840030825910692146586185195681505804288","6179022112845868400766262930195032417014561511447774363900","1205203910331822836409181576961413742258599044148191265013760","1544755528211467100191561899173343014087930251831450533903","64512","988211"],"hash":"10193634527461628677548098928674737437338433299539938568332421073540891325839"}]'
    '[{"name": "spades", "source": "return card1 < 13;", "owner": "everyone", "compiled": ["5444517789605377000807312023119353348095", "22300744866223624195306750046696871313797120", "91343850972051964703976448191270384901313003520", "374144413581524847427487531791443496555778062417920", "1532495518029925775062988930217752561892466943663800320", "6277101641850575974658002658171914493511544601246926110720", "1606937661135105059069747502754722727590241779965516819988480", "1605368768825143605351003146283434881209071198220234113679375", "5316911903911500977350890647577493503", "21778071158421508003229248092477413392380", "89202979464894496781227000186787485255188480", "365375403888207858815905792765081539605252014080", "1496577654326099389709950127165773986223112249671680", "6129982072119703100251955720871010247569867774655201280", "25108406567402303898632010632687657974046178404987704442880", "1606936511763449409653103733995403102794358138513688774049792", "1600660942523603594778126308110251717269675811532557948813375", "21267647615646003909403562590309974015", "87112284633686032012916992369909653569520", "356811917859577987124908000747149941020753920", "1461501615552831435263623171060326158421008056320", "5986310617304397558839800508663095944892448998686720", "24519928288478812401007822883484040990279471098620805120", "100433626269609215594528042530750631896184713619950817771520", "1606931914276826811986528658958124603610823572706376590295040", "1581829637317443552486618955417519061512094264781853289349375", "85070590462584015637614250361239896063", "348449138534744128051667969479638614278080", "0", "717022"], "hash": "17205012832311340811919375832927141639902470640718918663600937074630886418595", "penalty": 1}, {"name": "lastcard", "source": "return lastcard;", "owner": "everyone", "compiled": ["1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "1071292029505993517027974728227441735014801995855195223534250", "174762", "465140"], "hash": "21230679390951108096990554741869645482032749412231210854096376350304594975156", "penalty": 2}, {"name": "have a nice day", "source": "return card1 % 13 === 6;", "owner": "everyone", "compiled": ["301300887788293773446888249548557771191567189891548616601600", "18389946764422227383232879752063607310570598236088696832", "75325221947073443361721875464452535544097170375019302224640", "4597486691105556080172894365904359035049782837534261248", "18831305486768357704388175322744254607563910502540334072000", "1149371659931159785689584661951516033716831152264445952", "4707826319078030482184538775353409674104140399675170619440", "71835729548524325715753614794864123151675984833609728", "294239148230755638131726806199763448429264833878465445900", "1205203551153175093787552998194231084766268759566194466406400", "73559787057688909532931519008254429242282392944354787328", "301300887788293773446887501857810142176388681500077208898560", "18389946764422224320691577463617436140199131350137044992", "75325221947073430817552701290977018430255642010161336288000", "4597486639724639142758338647806064134867324609057783808", "18831305276312121928738155101413638696416561598700682477760", "287342918194097302863014459179456492606703939334438912", "1176956592923022552526907224799053793717059335513861783600", "71835729548524325715753436531498466056916399359721472", "294239148230755638131726076033017716969129571777419149315", "1205203551153175093787550007431240568705554726000308835594240", "73559787057688897282766309854469744560796525400548179968", "301300887788293723270210805163908073721022568040645345152000", "18389946558898556571033354591224256539469298436231135232", "75325221105248487714952620405654554785666246394802729911040", "1149371672776389211452057836717825970426815757337755648", "4707826371692090210107628899196215174868237342055447134400", "287342918194097302863013746125993864227665597438885888", "12", "656804"], "hash": "2384772224768571088793082997670145304784266395039989777732184072162815188083", "penalty": 1}, {"name": "thank you", "source": "return card2 % 13 === 6;", "owner": "everyone", "compiled": ["0", "0", "0", "5575186299632655785383929568162021657018368", "0", "0", "0", "0", "0", "0", "1329227995784915872903807060280328192", "0", "0", "0", "0", "0", "1600660942523603594778126302917954936106100638338328800788480", "316912650057057350374175801343", "0", "0", "0", "0", "0", "1606938042762412598915117504100589333820729181655117911293952", "75557863725914323419135", "0", "0", "0", "0", "28819"], "hash": "1790166872727187973982917880744434754227559549735937037239485954634777301283", "penalty": 1}, {"name": "i salute the chair", "source": "return (card1 % 13) > 9", "owner": "everyone", "compiled": ["24136805128304173440493154674583484595123910184866414592", "98864353805533894412259961547093952901627536117212834169840", "6034201282076042355226923855249471233502839974263717888", "24716088451383469487009480111101834172427632534584188469500", "1508550303659647218717579868811364794253340887347085312", "6179022043789915007867207142651350197261684274573661438015", "1205203627478637739094649071182491370150813881911824720588800", "386188882052866775047891433137189526063410094465485897743", "1581829660888542310596163310129928298755727746930630237158400", "96547220513216693761972618698333938380495640739465658368", "395457415222135577649039846188375811606510144468851336679360", "24136805128304169420907695420997884934011359897054871552", "98864353805533877948037920444407336689710530138336753878000", "6034201214638588874870319475245459177013363549388341248", "24716088175159660031468828570605400789046737098294645752060", "377137580129752710007706477673036646546298920376451072", "1544755528211467100191565732548758104253640377861943590975", "1506504510777198415758766963496225387456302006374142442729472", "386188882052866775047890474793335753521982562957862633475", "1581829660888542310596159384753503246426040577875405346717440", "96547220513216677683630781683991539736045439588219486208", "395457415222135511792151681777629346758842120553347015512000", "24136804858554355499481277900981836708053454197553364992", "98864352700638640125875314282421603156186948393178583008240", "1508550320519010840030825910692146586185195681505804288", "6179022112845868400766262930195032417014561511447774363900", "1205203910331822836409181576961413742258599044148191265013760", "1544755528211467100191561899173343014087930251831450533903", "64512", "988211"], "hash": "10193634527461628677548098928674737437338433299539938568332421073540891325839", "penalty": 1}]'
  );
  let index = 0;
  for (const rule of answer) {
    if (!config.CLEAN_SLATE_RULES.includes(rule.name)) continue;
    game.myRules.push(rule);
    const publicRule = rules.publicRule(rule);
    game.allRules.push(publicRule);
    update(game);
    index++;
  }
}
function resetPhase(game, phase, args) {
  assert(PHASES.includes(phase), game);
  let data = {};
  if (phase === PHASE.SETUP) {
    data = {
      state: SETUP_STATE.PRE_READY,
      players: [game.userId],
      readyHashes: {},
      startNumbers: {},
      myRandom: null,
    };
  } else if (phase === PHASE.PLAY) {
    // shuffle the player list
    // note: we need to sort it first before we do it so everyone gets the same list

    data.players = utils.shuffle(
      [...game.data[PHASE.SETUP].players].sort(),
      args.rng
    );

    data.nextTurn = 0;

    data.playedCards = []; // start empty

    // now deal cards
    data.playerHands = cards.dealShuffledCards(
      utils.shuffle(data.players, args.rng),
      args.rng,
      config.START_FROM_RANK
    );

    data.state = PLAY_STATE.WAIT_FOR_PLAY;

    data.acksReceived = [];
    data.lastPlayedCard = null;
    data.lastPlayedUser = null;
    data.lastSelectedRules = null;
    data.penaltyRules = [];
    data.snarkStatus = null;
  } else if (phase === PHASE.GAMEOVER) {
    data.winner = args.winner;
    data.sentFinalize = false;
    data.finalizedReceived = [];
    data.readyToRestart = false;
    data.didDrawTokens = false;
    data.drawnTokens = [];
    data.compilingRule = false;
    data.snarkStatus = null;
  }
  game.data[phase] = data;
}
function initPhase(game, phase, args) {
  assert(PHASES.includes(phase), game);
  resetPhase(game, phase, args);
  game.phase = phase;
}
export function addListener(game, listener) {
  const indx = game.listenerIndex;
  game.listeners[indx] = listener;
  game.listenerIndex = `${parseInt(indx) + 1}`;
  return indx;
}
export function removeListener(game, key) {
  if (!game) return;
  console.log(`removing key ${key} from game ${game}`);
  console.log(game);
  delete game.listeners[key];
}
// this function needs to be called every time the game state is updated!!!!!!!!
function update(game) {
  for (let listener of Object.values(game.listeners)) {
    listener();
  }
}

// m should be on form {data: , method: , ...}
export function receive(game, m) {
  console.log("game receiving message!");
  console.log(m);
  if (m.type !== "data") {
    console.log("ignoring non-data message");
    return;
  }
  assert(METHODS.includes(m.method));
  console.log(METHOD_HANDLER);
  METHOD_HANDLER[m.method](game, m);
}
function send(game, m) {
  // TODO: sign the message
  m["from"] = game.userId;
  p2p.sendData(game.conn, m);
}

function handleReadyMethod(game, m) {
  // should be in setup phase, or gameover phase
  if (!(game.phase === PHASE.SETUP || game.phase === PHASE.GAMEOVER))
    return abort(game);
  const data = game.data[PHASE.SETUP];
  // should not have sent start already
  if (
    !(
      data.state === SETUP_STATE.PRE_READY ||
      data.state === SETUP_STATE.SENT_READY
    )
  ) {
    return abort(game);
  }

  const user = m.from;
  const hash = m.hash;

  // shouldn't receive twice; should have different IDs
  if (data.players.includes(user)) return abort(game);

  data.players.push(user);
  data.readyHashes[user] = hash;

  // if we have received all, send start
  maybeSendStart(game);

  update(game);
}
async function handleStartMethod(game, m) {
  // should be in setup phase
  if (game.phase !== PHASE.SETUP) return abort(game, "wrong phase");
  const data = game.data[PHASE.SETUP];
  // should have sent ready (not necessarily should have sent start though)
  if (
    !(
      data.state === SETUP_STATE.SENT_READY ||
      data.state === SETUP_STATE.SENT_START
    )
  ) {
    return abort(game);
  }

  const user = m.from;
  const randomNumber = m.randomNumber;

  // shouldn't receive twice
  if (Object.keys(data.startNumbers).includes(user)) return abort(game);

  // should receive from verified user
  if (!data.players.includes(user)) return abort(game, `unknown user ${user}`);

  // assert that the hash is ok
  const randomNumberHash = await utils.hash(`${randomNumber}`);
  if (data.readyHashes[user] !== randomNumberHash)
    return abort(
      game,
      `incorrect hash ${randomNumberHash} received for random number ${randomNumber} from user ${user}`
    );

  // add to numbers
  data.startNumbers[user] = randomNumber;

  // if we have received all, go to the game!!
  maybeStartGame(game);

  update(game);
}
async function handlePlayMethod(game, m) {
  if (game.phase !== PHASE.PLAY) return abort(game, "wrong phase");
  const data = game.data[game.phase];
  if (data.state !== PLAY_STATE.WAIT_FOR_PLAY)
    return abort(game, "wrong state");

  const user = m.from;
  const card = m.card;
  const selectedRules = m.rules;
  const provedRules = m.provedRules;

  // make sure it is this user's turn
  if (user !== data.players[data.nextTurn]) {
    return abort(game, "user tried to make move but it's not their turn");
  }

  // make sure this user owns this card (or it is voidcard)
  if (
    card !== cards.VOID_CARD &&
    !data.playerHands[user].some((c) => cards.sameCard(c, card))
  ) {
    return abort(game, "user tried to play card not in their hand");
  }

  // make sure the card move is legal
  if (!legalToPlayCard(game, card)) {
    return abort(game, "user tried to play illegal card");
  }

  // verify that provedRules contains all the (1) public rules and (2) user's rules
  const userRulesHashes = game.allRules
    .filter((r) => r.owner === rules.EVERYONE || r.owner === user)
    .map((r) => r.hash);
  const provedRulesHashes = provedRules.map((r) => r.rule.hash);
  // these arrays need to contain the same set
  if (
    JSON.stringify(userRulesHashes.sort()) !==
    JSON.stringify(provedRulesHashes.sort())
  ) {
    return abort(game, "did not prove outcomes for all rules user knows of");
  }
  const penalties = await rules.verifyPenalties(
    card,
    data.playedCards,
    data.playerHands[user].filter((c) => !cards.sameCard(c, card)),
    selectedRules,
    provedRules
  );
  if (penalties === rules.INCORRECT_PENALTIES) {
    return abort(game, "proofs were incorrect somehow :(");
  }
  recordPenalties(game, penalties);

  // actually do the move
  actuallyPlayCard(game, user, card, selectedRules);

  sendPlayAck(game, user, card, selectedRules);

  update(game);
}
async function handlePlayAckMethod(game, m) {
  if (game.phase !== PHASE.PLAY) return abort(game, "wrong phase");
  const data = game.data[game.phase];
  if (data.state !== PLAY_STATE.WAIT_FOR_PLAYACK)
    return abort(game, "wrong state");

  const user = m.user;
  const from = m.from;
  const card = m.card;
  const provedRules = m.provedRules;

  // make sure the right user n right card was acked
  if (user !== data.lastPlayedUser) {
    return abort(game, "tried to ack the wrong user");
  }
  if (!cards.sameCard(card, data.lastPlayedCard)) {
    return abort(game, "tried to ack the wrong card");
  }

  if (data.acksReceived.includes(from)) {
    return abort(game, "already received ack from this user");
  }

  // verify that provedRules contains all the (1) public rules and (2) user's rules
  const userRulesHashes = game.allRules
    .filter((r) => r.owner === rules.EVERYONE || r.owner === from)
    .map((r) => r.hash);
  const provedRulesHashes = provedRules.map((r) => r.rule.hash);
  // these arrays need to contain the same set
  if (
    JSON.stringify(userRulesHashes.sort()) !==
    JSON.stringify(provedRulesHashes.sort())
  ) {
    return abort(game, "did not prove outcomes for all rules user knows of");
  }

  const penalties = await rules.verifyPenalties(
    card,
    data.playedCards.slice(0, data.playedCards.length - 1),
    data.playerHands[user],
    data.lastSelectedRules,
    provedRules
  );
  if (penalties === rules.INCORRECT_PENALTIES) {
    return abort(game, "proofs were incorrect somehow :(");
  }
  recordPenalties(game, penalties);

  data.acksReceived.push(from);

  maybeStopWaitingForAcks(game);

  update(game);
}
function recordPenalties(game, penalties) {
  const data = game.data[game.phase];
  for (const penalty of penalties) {
    if (!data.penaltyRules.includes(penalty)) {
      data.penaltyRules.push(penalty);
    }
  }
}
function enforcePenalties(game, user, penalties) {
  console.log("enforce penalties:");
  console.log(penalties);
  const data = game.data[game.phase];
  // just take cards from the played cards as long as we can do so
  // take from the bottom
  for (let i = 0; i < penalties.length && data.playedCards.length > 0; i++) {
    for (
      let j = 0;
      j < penalties[i].penalty && data.playedCards.length > 0;
      j++
    ) {
      const bottomCard = data.playedCards[0];
      data.playerHands[user].push(bottomCard);
      data.playedCards.splice(0, 1);
    }
  }
  const totalPenalty = penalties.reduce((acc, v) => acc + v.penalty, 0);
  console.log(`total penalty is: ${totalPenalty}`);
  console.log("right before updating the game:");
  console.log(utils.objectify(game));
  update(game);
}
async function handleFinalizeMethod(game, m) {
  console.log("FINALIZE message received");
  console.log(m);

  if (game.phase !== PHASE.GAMEOVER) return abort(game, "wrong phase");
  const data = game.data[game.phase];

  const user = m.from;
  const rule = m.rule;
  const drawnTokens = m.drawnTokens;
  const tokenID = m.tokenID;
  const playedToken = m.playedToken;

  if (data.finalizedReceived.includes(user)) {
    return abort(game, "received two finalized from the same user");
  }

  // verify that the drawn tokens are correct
  for (const drawnToken of drawnTokens) {
    const verification = await tokens.verifyDrawnToken(
      game.tokenState,
      drawnToken,
      user,
      game.playerRandoms[game.userId],
      game.numRounds,
      game.playerRandoms[user]
    );
    if (verification === tokens.INCORRECTLY_DRAWN_TOKEN) {
      return abort(game, "token was not drawn correctly");
    }
  }

  if (rule) {
    game.allRules.push(rule);
    const verification = await tokens.verifyPlayedToken(
      game.tokenState,
      playedToken,
      tokenID,
      user
    );
    if (verification === tokens.INCORRECTLY_PLAYED_TOKEN) {
      return abort(game, "token was not played correctly");
    }
    // check that the rule has the correct penalty given the played tokenID
    if (rule.penalty !== tokens.tokenIdToPower(tokenID)) {
      return abort(
        game,
        "token was played correctly, but an unrelated penalty was used for the rule lol"
      );
    }
  }

  data.finalizedReceived.push(user);

  maybeFinishFinalize(game);

  update(game);
}
function maybeFinishFinalize(game) {
  assert(game.phase === PHASE.GAMEOVER, "duh");
  const data = game.data[game.phase];
  if (
    data.finalizedReceived.length ===
      game.data[PHASE.PLAY].players.length - 1 &&
    data.sentFinalize
  ) {
    console.log("finish finalize");
    console.log(game);
    // yay transition out of this
    data.readyToRestart = true;
    update(game);
  }
}
function handleAbortMethod(game, m) {
  console.log("ABORTING :(((( SAD");
  utils.unimplemented();

  update(game);
}

function abort(game, reason) {
  console.error("ABORT GAME :((");
  console.error(reason);
  send(game, { method: METHOD.ABORT, reason });
  game.phase = PHASE.ABORT;

  update(game);
}

function actuallyPlayCard(game, user, card, selectedRules) {
  const data = game.data[game.phase];
  data.nextTurn = (data.nextTurn + 1) % data.players.length;
  data.state = PLAY_STATE.WAIT_FOR_PLAYACK;
  data.lastPlayedCard = card;
  data.lastPlayedUser = user;
  data.lastSelectedRules = selectedRules;
  if (card !== cards.VOID_CARD) {
    data.playedCards.push(card);
    data.playerHands[user] = data.playerHands[user].filter(
      (c) => c.index !== card.index
    );
  }
  update(game);
}

function legalToPlayCard(game, card) {
  const data = game.data[game.phase];
  // always ok to pass
  if (card === cards.VOID_CARD) return true;
  // first move always legal
  if (data.playedCards.length === 0) return true;
  // either suit or rank must be the same
  const lastcard = data.playedCards[data.playedCards.length - 1];
  return lastcard.suit === card.suit || lastcard.rank === card.rank;
}

export async function playCard(game, card, selectedRules) {
  assert(game.phase === PHASE.PLAY && isMyTurn(game), game);
  const data = game.data[game.phase];
  assert(data.state === PLAY_STATE.WAIT_FOR_PLAY, game);
  assert(
    card === cards.VOID_CARD ||
      data.playerHands[game.userId].some((c) => cards.sameCard(c, card)),
    game
  );
  assert(
    selectedRules.every(
      (rule) => game.allRules.filter((x) => rules.sameRule(x, rule)).length > 0
    ),
    game
  );
  console.log(`play card!`);
  console.log(card);
  console.log(selectedRules);

  assert(legalToPlayCard(game, card), game);

  // we do this for ourselves. we need to run the snarks
  // to prove to others that we enforce our own rules correctly even on ourselves
  const provedRules = await rules.determinePenalties(
    card,
    data.playedCards,
    data.playerHands[game.userId].filter((c) => !cards.sameCard(c, card)),
    selectedRules,
    game.myRules,
    (status) => updateSnarkStatus(game, status)
  );
  const penalties = await rules.verifyPenalties(
    card,
    data.playedCards,
    data.playerHands[game.userId].filter((c) => !cards.sameCard(c, card)),
    selectedRules,
    provedRules
  );
  assert(
    penalties !== rules.INCORRECT_PENALTIES,
    "your own penalty calculations were wrong lololol"
  );
  recordPenalties(game, penalties);

  send(game, { method: METHOD.PLAY, card, rules: selectedRules, provedRules });

  actuallyPlayCard(game, game.userId, card, selectedRules);
  update(game);
}

export function restartGame(game) {
  game.phase = PHASE.SETUP;
  game.numRounds++;

  sendReady(game);
}

export async function sendReady(game) {
  assert(game.phase === PHASE.SETUP, game);
  const data = game.data[PHASE.SETUP];
  assert(data.state === SETUP_STATE.PRE_READY, game);
  // generate a random number
  data.myRandom = Math.floor(Math.random() * 2 ** 64);
  // hash the random number
  const hash_r = await utils.hash(`${data.myRandom}`);
  console.log(hash_r);
  data.readyHashes[game.userId] = hash_r;
  send(game, { method: METHOD.READY, hash: hash_r });
  data.state = SETUP_STATE.SENT_READY;
  maybeSendStart(game);

  update(game);
}

function checkIfWon(game) {
  assert(game.phase === PHASE.PLAY, game);
  const data = game.data[game.phase];
  assert(data.state === PLAY_STATE.WAIT_FOR_PLAY, game);

  for (const user of data.players) {
    if (data.playerHands[user].length === 0) {
      // someone won!!!!
      // assert only one player won
      assert(
        Object.values(data.playerHands).filter((l) => l.length === 0).length ===
          1
      );

      initPhase(game, PHASE.GAMEOVER, { winner: user });
    }
  }
}

function maybeStopWaitingForAcks(game) {
  const data = game.data[game.phase];
  // everyone except the player needs to ack the card
  if (data.acksReceived.length === data.players.length - 1) {
    enforcePenalties(game, data.lastPlayedUser, data.penaltyRules);

    data.state = PLAY_STATE.WAIT_FOR_PLAY;
    data.acksReceived = [];
    data.lastPlayedCard = null;
    data.lastPlayedUser = null;
    data.lastSelectedRules = null;
    data.penaltyRules = [];

    // check if someone won
    checkIfWon(game);

    update(game);
  }
}

async function sendPlayAck(game, user, card, selectedRules) {
  assert(game.phase === PHASE.PLAY, game);
  const data = game.data[game.phase];
  assert(data.state === PLAY_STATE.WAIT_FOR_PLAYACK, game);

  const provedRules = await rules.determinePenalties(
    card,
    data.playedCards.slice(0, data.playedCards.length - 1),
    data.playerHands[user],
    selectedRules,
    game.myRules,
    (status) => updateSnarkStatus(game, status)
  );
  const penalties = await rules.verifyPenalties(
    card,
    data.playedCards.slice(0, data.playedCards.length - 1),
    data.playerHands[user],
    selectedRules,
    provedRules
  );
  assert(
    penalties !== rules.INCORRECT_PENALTIES,
    "my own proofs were incorrect lolol im stupid"
  );
  recordPenalties(game, penalties);

  send(game, { method: METHOD.PLAYACK, card, user, provedRules });

  assert(!data.acksReceived.includes(game.userId), game);
  data.acksReceived.push(game.userId);

  maybeStopWaitingForAcks(game);

  update(game);
}

export async function drawTokens(game) {
  assert(game.phase === PHASE.GAMEOVER, "pls be in gameover state sir");
  const data = game.data[game.phase];
  assert(!data.didDrawTokens, "cannot draw tokens twice!!!!!");

  data.didDrawTokens = true;

  update(game);

  const numtokens = myAwardedTokens(game);

  console.log(`drawing ${numtokens} tokens!`);

  for (let i = 0; i < numtokens; i++) {
    const newSalt = Math.floor(Math.random() * 2 ** 64);
    updateTokenSnarkStatus(game, `drawing token ${i + 1} of ${numtokens}`);
    const drawnToken = await tokens.draw(
      game.tokenState,
      game.prevSalt,
      newSalt,
      game.playerRandoms[game.userId],
      game.playerRandoms[getOppUserId(game)],
      game.numRounds,
      game.userId
    );
    game.prevSalt = newSalt;
    data.drawnTokens.push(drawnToken);
    const verification = await tokens.verifyDrawnToken(
      game.tokenState,
      drawnToken,
      game.userId,
      game.playerRandoms[getOppUserId(game)],
      game.numRounds,
      game.playerRandoms[game.userId]
    );
    assert(
      verification !== tokens.INCORRECTLY_DRAWN_TOKEN,
      "verification is wrong"
    );
    update(game);
  }
  updateTokenSnarkStatus(game, null);
}

function maybeStartGame(game) {
  const data = game.data[game.phase];
  if (data.players.length === Object.keys(data.startNumbers).length) {
    startGame(game);
  }
}
export async function submitRule(game, rule, name, selectedToken) {
  assert(game.phase === PHASE.GAMEOVER, "submit rule only when game over lol");
  const data = game.data[game.phase];
  assert(!data.sentFinalize, "cannot submit rules twice!");

  console.log("creating a rule:");
  console.log(rule);

  data.compilingRule = true;

  update(game);

  let rulethings = {};
  if (rule) {
    // assert that we own the selected token!!!
    assert(
      game.tokenState.myTokens.filter(
        (tok) =>
          tok.id === selectedToken.id && tok.state === tokens.TOKEN_STATE.HAND
      ),
      "we need to own the token to use it"
    );

    // play the token
    const newSalt = Math.floor(Math.random() * 2 ** 64);
    const playedToken = await tokens.play(
      game.tokenState,
      selectedToken,
      game.prevSalt,
      newSalt,
      game.userId
    );
    game.prevSalt = newSalt;
    const verification = await tokens.verifyPlayedToken(
      game.tokenState,
      playedToken,
      selectedToken.id,
      game.userId
    );
    assert(
      verification !== tokens.INCORRECTLY_PLAYED_TOKEN,
      "token must be drawn correctly"
    );
    assert(
      selectedToken.tokenPower === tokens.tokenIdToPower(selectedToken.id),
      "id must match the power"
    );

    // create a rule
    const compiledRule = await rules.createPrivateRule(
      name,
      rule,
      game.userId,
      selectedToken.tokenPower
    );
    game.myRules.push(compiledRule);
    const publicRule = rules.publicRule(compiledRule);
    game.allRules.push(publicRule);
    update(game);

    rulethings = {
      rule: publicRule,
      tokenID: selectedToken.id,
      playedToken,
    };
  }

  send(game, {
    method: METHOD.FINALIZE,
    drawnTokens: data.drawnTokens,
    ...rulethings,
  });

  data.sentFinalize = true;

  maybeFinishFinalize(game);

  update(game);
}
function startGame(game) {
  assert(game.phase === PHASE.SETUP);
  const data = game.data[game.phase];
  assert(data.state === SETUP_STATE.SENT_START, game);

  // xor all the random numbers (which means that as long as at least 1 person honest, it is random)
  let finalRandomNumber = 0;
  Object.values(data.startNumbers).forEach((randomNumber) => {
    finalRandomNumber ^= randomNumber;
  });

  console.log(`final randomness: ${finalRandomNumber}`);
  // use this random number as the seed of an rng
  let rng = seedrandom(`${finalRandomNumber}`);

  game.playerRandoms = { ...data.startNumbers };

  // now we can transition to the game phase
  // delete the old game object properties
  initPhase(game, PHASE.PLAY, { rng });
  resetPhase(game, PHASE.SETUP);

  console.log("STARTING GAME!!!! exciting :)))");
  console.log(game);

  update(game);
}

function maybeSendStart(game) {
  const data = game.data[PHASE.SETUP];
  if (
    p2p.numConnections(game.conn) ===
    Object.keys(data.readyHashes).length - 1
  ) {
    assert(data.players.length === Object.keys(data.readyHashes).length, game);
    sendStart(game);
  }
}
async function sendStart(game) {
  assert(game.phase === PHASE.SETUP, game);
  const data = game.data[game.phase];
  assert(data.state === SETUP_STATE.SENT_READY, game);

  send(game, { method: METHOD.START, randomNumber: data.myRandom });

  data.startNumbers[game.userId] = data.myRandom;
  data.state = SETUP_STATE.SENT_START;

  // here we want to create a token object if one doesn't already exist
  if (game.tokenState === null) {
    game.tokenState = await tokens.createTokenState(data.players);
  }

  maybeStartGame(game);

  update(game);
}

// convenience for 2 players
// TODO: update this for more players

export function getMyUserId(game) {
  return game.userId;
}
export function getOppUserId(game) {
  const data = game.data[PHASE.PLAY];
  const oppUserId = data.players.filter((x) => x !== getMyUserId(game))[0];
  return oppUserId;
}
export function getMyHand(game) {
  const data = game.data[PHASE.PLAY];
  return [...data.playerHands[getMyUserId(game)]];
}
export function getOppHand(game) {
  const data = game.data[PHASE.PLAY];
  const playerHand = data.playerHands[getOppUserId(game)];
  return [...playerHand];
}
function isMyTurn(game) {
  const data = game.data[PHASE.PLAY];
  return getMyUserId(game) === data.players[data.nextTurn];
}
export function isMyTurnEnabled(game) {
  const data = game.data[PHASE.PLAY];
  return isMyTurn(game) && data.state === PLAY_STATE.WAIT_FOR_PLAY;
}

export function getPlayedCards(game) {
  const data = game.data[PHASE.PLAY];
  return [...data.playedCards];
}

export function getWinner(game) {
  const data = game.data[PHASE.GAMEOVER];
  return data.winner;
}

export function getRules(game) {
  return [...game.allRules];
}

export function getMyTokens(game) {
  if (game.tokenState === null) {
    return null;
  }
  return [...game.tokenState.myTokens];
}

export function isReadyToRestart(game) {
  const data = game.data[PHASE.GAMEOVER];
  if (game.phase !== PHASE.GAMEOVER) return false;
  return data.readyToRestart;
}

export function isReadyToDrawTokens(game) {
  const data = game.data[PHASE.GAMEOVER];
  if (game.phase !== PHASE.GAMEOVER) return false;
  return !data.didDrawTokens;
}

export function myAwardedTokens(game) {
  assert(
    game.phase === PHASE.GAMEOVER,
    "u need to be in gameover to get tokens"
  );
  const desiredamt = tokens.awardFunction(getMyHand(game).length);
  const numtokensleft = game.tokenState.myTokens.filter(
    (tok) => tok.state === tokens.TOKEN_STATE.STOCK
  ).length;
  return Math.min(desiredamt, numtokensleft);
}

export function myAvailableTokens(game) {
  if (!game.tokenState) return [];
  return [
    ...game.tokenState.myTokens.filter(
      (tok) => tok.state === tokens.TOKEN_STATE.HAND
    ),
  ];
}

export function canSubmitRule(game) {
  if (game.phase !== PHASE.GAMEOVER) return false;
  const data = game.data[PHASE.GAMEOVER];
  return !data.sentFinalize && !data.compilingRule;
}

export function getSnarkStatus(game) {
  if (game.phase !== PHASE.PLAY) return null;
  const data = game.data[game.phase];
  return data.snarkStatus;
}

export function updateSnarkStatus(game, status) {
  if (game.phase !== PHASE.PLAY) return;
  game.data[game.phase].snarkStatus = status;
  update(game);
}

export function getTokenSnarkStatus(game) {
  if (game.phase !== PHASE.GAMEOVER) return null;
  const data = game.data[game.phase];
  return data.snarkStatus;
}

export function updateTokenSnarkStatus(game, status) {
  if (game.phase !== PHASE.GAMEOVER) return;
  game.data[game.phase].snarkStatus = status;
  update(game);
}
