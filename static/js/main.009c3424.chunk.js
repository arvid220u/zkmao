(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{22:function(e,n,t){},23:function(e,n,t){},32:function(e,n){},33:function(e,n,t){},34:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t(1),c=t.n(a),s=t(14),o=t.n(s),u=(t(22),t(2)),i=(t(23),t(15)),l={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302"]}]};function d(e){console.log("opened chat!!"),console.log(e.messageHandlers);var n={type:"info",value:"successfully opened connection!!"};for(var t in e.messageHandlers)e.messageHandlers[t](n)}function f(e,n){console.log("received message!"),console.log(e.messageHandlers);var t=JSON.parse(n.data);for(var r in console.log(t),e.messageHandlers)e.messageHandlers[r](t)}function j(e,n){var t=e.messageHandlersIndx;return e.messageHandlers[t]=n,e.messageHandlersIndx="".concat(parseInt(t)+1),t}function h(e,n){e&&(console.log("removing key ".concat(n," from conn ").concat(e)),delete e.messageHandlers[n])}function b(e,n){e.dc.send(JSON.stringify(n))}function p(e){return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function O(e){var n=e;return n.length%4!==0&&(n+="===".slice(0,4-n.length%4)),n=n.replace(/-/g,"+").replace(/_/g,"/"),atob(n)}var g=t(3),m=t.n(g),R=t(6),v=t(12),y=t(5),x=t(7),A=t(16),S=t.n(A);function T(e,n){e||(console.error("assertion failed"),console.error(n))}function E(e,n){for(var t,r,a=e.length;0!==a;)r=Math.floor(n()*a),t=e[a-=1],e[a]=e[r],e[r]=t;return e}function P(){T(!1,"not implemented yet!!")}function C(e){return k.apply(this,arguments)}function k(){return(k=Object(R.a)(m.a.mark((function e(n){var t,r,a,c,s;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new TextEncoder,r=t.encode(n),e.next=4,crypto.subtle.digest("SHA-256",r);case 4:return a=e.sent,c=Array.from(new Uint8Array(a)),s=c.map((function(e){return e.toString(16).padStart(2,"0")})).join(""),e.abrupt("return",s);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Y="Q",_="K",w=["A","2","3","4","5","6","7","8","9","10","J",Y,_],L=["spades","hearts","diamonds","clubs"],N="VOID_CARD";function I(e,n){return E(function(e){e||(e=0);var n,t=[],r=0,a=0,c=Object(y.a)(L);try{for(c.s();!(n=c.n()).done;){var s,o=n.value,u=0,i=Object(y.a)(w);try{for(i.s();!(s=i.n()).done;){var l=s.value;u>=e&&t.push({rank:l,suit:o,rank_index:u,suit_index:r,index:a}),u++,a++}}catch(d){i.e(d)}finally{i.f()}r++}}catch(d){c.e(d)}finally{c.f()}return t}(n),e)}function D(e){var n="\ud83c\udca1".charCodeAt(0),t="\ud83c\udca1".charCodeAt(1);return String.fromCharCode(n)+String.fromCharCode(t+e.rank_index+16*e.suit_index+(e.rank===Y||e.rank===_?1:0))}function H(e){return e.rank+e.suit.charAt(0).toUpperCase()}function M(e){var n,t="",r=Object(y.a)(e);try{for(r.s();!(n=r.n()).done;){t+=D(n.value)}}catch(a){r.e(a)}finally{r.f()}return t}function F(e,n){return e===N||n===N?e===N&&n===N:e.index===n.index}var U,G="everyone";function J(e,n,t){return W.apply(this,arguments)}function W(){return(W=Object(R.a)(m.a.mark((function e(n,t,r){var a;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={name:n,source:t,owner:r,compiled:K(t),hash:null},e.next=3,V(a.compiled);case 3:return a.hash=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e){return{name:e.name,owner:e.owner,hash:e.hash}}function K(e){return console.log("compiling source:"),console.log(e),P(),[1,1,1,1,1,1*e.length]}function V(e){return z.apply(this,arguments)}function z(){return(z=Object(R.a)(m.a.mark((function e(n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C(JSON.stringify(n));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Q(e,n){return e.hash===n.hash}function $(e,n,t,r){return r.map((function(e){return{rule:B(e),proof:"this is supposed to be a snark proof",penalty:0}}))}var q={SETUP:"SETUP",PLAY:"PLAY",GAMEOVER:"GAMEOVER",ABORT:"ABORT"},X=Object.values(q),Z={PRE_READY:"PRE_READY",SENT_READY:"SENT_READY",SENT_START:"SENT_START"},ee=(Object.values(Z),{WAIT_FOR_PLAY:"WAIT_FOR_PLAY",WAIT_FOR_PLAYACK:"WAIT_FOR_PLAYACK"}),ne=(Object.values(ee),{READY:"READY",START:"START",PLAY:"PLAY",PLAYACK:"PLAYACK",ABORT:"ABORT"}),te=Object.values(ne),re=(U={},Object(x.a)(U,ne.READY,(function(e,n){if(e.phase!==q.SETUP&&e.phase!==q.GAMEOVER)return fe(e);var t=e.data[q.SETUP];if(t.state!==Z.PRE_READY&&t.state!==Z.SENT_READY)return fe(e);var r=n.from,a=n.hash;if(t.players.includes(r))return fe(e);t.players.push(r),t.readyHashes[r]=a,Re(e),ie(e)})),Object(x.a)(U,ne.START,(function(e,n){return de.apply(this,arguments)})),Object(x.a)(U,ne.PLAY,(function(e,n){if(e.phase!==q.PLAY)return fe(e,"wrong phase");var t=e.data[e.phase];if(t.state!==ee.WAIT_FOR_PLAY)return fe(e,"wrong state");var r=n.from,a=n.card;n.rules;if(r!==t.players[t.nextTurn])return fe(e,"user tried to make move but it's not their turn");if(a!==N&&!t.playerHands[r].some((function(e){return F(e,a)})))return fe(e,"user tried to play card not in their hand");if(!he(e,a))return fe(e,"user tried to play illegal card");je(e,r,a),function(e,n,t,r){T(e.phase===q.PLAY,e);var a=e.data[e.phase];T(a.state===ee.WAIT_FOR_PLAYACK,e);var c=$(0,a.playedCards.slice(0,a.playedCards.length-1),0,e.myRules);le(e,{method:ne.PLAYACK,card:t,user:n,provedRules:c}),T(!a.acksReceived.includes(e.userId),e),a.acksReceived.push(e.userId),ge(e),ie(e)}(e,r,a),ie(e)})),Object(x.a)(U,ne.PLAYACK,(function(e,n){if(e.phase!==q.PLAY)return fe(e,"wrong phase");var t=e.data[e.phase];if(t.state!==ee.WAIT_FOR_PLAYACK)return fe(e,"wrong state");var r=n.user,a=n.from,c=n.card;if(r!==t.lastPlayedUser)return fe(e,"tried to ack the wrong user");if(!F(c,t.lastPlayedCard))return fe(e,"tried to ack the wrong card");if(t.acksReceived.includes(a))return fe(e,"already received ack from this user");t.acksReceived.push(a),ge(e),ie(e)})),Object(x.a)(U,ne.ABORT,(function(e,n){console.log("ABORTING :(((( SAD"),P(),ie(e)})),U);function ae(e){var n,t={conn:e,listeners:{},listenerIndex:"0",userId:Math.random().toString(36).substr(2,9),phase:null,data:{},myRules:[],allRules:[]},r=Object(y.a)(X);try{for(r.s();!(n=r.n()).done;){var a=n.value;t.data[a]={}}}catch(c){r.e(c)}finally{r.f()}return se(t,q.SETUP),function(e){J("spades","card.suit == spades",G).then((function(n){e.myRules.push(n);var t=B(n);e.allRules.push(t),ie(e)})).then((function(){return J("lastcard","isLastCard()",G)})).then((function(n){e.myRules.push(n);var t=B(n);e.allRules.push(t),ie(e)}))}(t),t}function ce(e,n,t){T(X.includes(n),e);var r={};n===q.SETUP?r={state:Z.PRE_READY,players:[e.userId],readyHashes:{},startNumbers:{},myRandom:null}:n===q.PLAY&&(r.players=E(Object(v.a)(e.data[q.SETUP].players).sort(),t.rng),r.nextTurn=0,r.playedCards=[],r.playerHands=function(e,n,t){var r,a=I(n,t),c={},s=0,o=Object(y.a)(e);try{for(o.s();!(r=o.n()).done;)c[r.value]=[]}catch(l){o.e(l)}finally{o.f()}for(;s<a.length;){var u,i=Object(y.a)(e);try{for(i.s();!(u=i.n()).done;)c[u.value].push(a[s]),s++}catch(l){i.e(l)}finally{i.f()}}return c}(E(r.players,t.rng),t.rng,12),r.state=ee.WAIT_FOR_PLAY,r.acksReceived=[],r.lastPlayedCard=null,r.lastPlayedUser=null),e.data[n]=r}function se(e,n,t){T(X.includes(n),e),ce(e,n,t),e.phase=n}function oe(e,n){var t=e.listenerIndex;return e.listeners[t]=n,e.listenerIndex="".concat(parseInt(t)+1),t}function ue(e,n){e&&(console.log("removing key ".concat(n," from game ").concat(e)),console.log(e),delete e.listeners[n])}function ie(e){for(var n=0,t=Object.values(e.listeners);n<t.length;n++){(0,t[n])()}}function le(e,n){var t,r;n.from=e.userId,t=e.conn,r=n,b(t,Object(i.a)({type:"data"},r))}function de(){return(de=Object(R.a)(m.a.mark((function e(n,t){var r,a,c,s;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.phase===q.SETUP){e.next=2;break}return e.abrupt("return",fe(n,"wrong phase"));case 2:if((r=n.data[q.SETUP]).state===Z.SENT_READY||r.state===Z.SENT_START){e.next=5;break}return e.abrupt("return",fe(n));case 5:if(a=t.from,c=t.randomNumber,!Object.keys(r.startNumbers).includes(a)){e.next=9;break}return e.abrupt("return",fe(n));case 9:if(r.players.includes(a)){e.next=11;break}return e.abrupt("return",fe(n,"unknown user ".concat(a)));case 11:return e.next=13,C("".concat(c));case 13:if(s=e.sent,r.readyHashes[a]===s){e.next=16;break}return e.abrupt("return",fe(n,"incorrect hash ".concat(s," received for random number ").concat(c," from user ").concat(a)));case 16:r.startNumbers[a]=c,me(n),ie(n);case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function fe(e,n){console.error("ABORT GAME :(("),console.error(n),le(e,{method:ne.ABORT,reason:n}),e.phase=q.ABORT,ie(e)}function je(e,n,t){var r=e.data[e.phase];r.nextTurn=(r.nextTurn+1)%r.players.length,r.state=ee.WAIT_FOR_PLAYACK,r.lastPlayedCard=t,r.lastPlayedUser=n,t!==N&&(r.playedCards.push(t),r.playerHands[n]=r.playerHands[n].filter((function(e){return e.index!==t.index}))),ie(e)}function he(e,n){var t=e.data[e.phase];if(n===N)return!0;if(0===t.playedCards.length)return!0;var r=t.playedCards[t.playedCards.length-1];return r.suit===n.suit||r.rank===n.rank}function be(e,n,t){T(e.phase===q.PLAY&&Se(e),e);var r=e.data[e.phase];T(r.state===ee.WAIT_FOR_PLAY,e),T(n===N||r.playerHands[e.userId].some((function(e){return F(e,n)})),e),T(t.every((function(n){return e.allRules.filter((function(e){return Q(e,n)}))>0}))),console.log("play card!"),console.log(n),console.log(t),T(he(e,n),e);var a=$(0,r.playedCards.slice(0,r.playedCards.length-1),0,e.myRules);le(e,{method:ne.PLAY,card:n,rules:t,provedRules:a}),je(e,e.userId,n),ie(e)}function pe(e){return Oe.apply(this,arguments)}function Oe(){return(Oe=Object(R.a)(m.a.mark((function e(n){var t,r;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return T(n.phase===q.SETUP,n),T((t=n.data[q.SETUP]).state===Z.PRE_READY,n),t.myRandom=Math.floor(Math.random()*Math.pow(2,64)),e.next=6,C("".concat(t.myRandom));case 6:r=e.sent,console.log(r),t.readyHashes[n.userId]=r,le(n,{method:ne.READY,hash:r}),t.state=Z.SENT_READY,Re(n),ie(n);case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ge(e){var n=e.data[e.phase];n.acksReceived.length===n.players.length-1&&(n.state=ee.WAIT_FOR_PLAY,n.acksReceived=[],n.lastPlayedCard=null,n.lastPlayedUser=null,function(e){T(e.phase===q.PLAY,e);var n=e.data[e.phase];T(n.state===ee.WAIT_FOR_PLAY,e);var t,r=Object(y.a)(n.players);try{for(r.s();!(t=r.n()).done;){var a=t.value;0===n.playerHands[a].length&&(T(1===Object.values(n.playerHands).filter((function(e){return 0===e.length})).length),e.phase=q.GAMEOVER,e.data[q.GAMEOVER].winner=a)}}catch(c){r.e(c)}finally{r.f()}}(e),ie(e))}function me(e){var n=e.data[e.phase];n.players.length===Object.keys(n.startNumbers).length&&function(e){T(e.phase===q.SETUP);var n=e.data[e.phase];T(n.state===Z.SENT_START,e);var t=0;Object.values(n.startNumbers).forEach((function(e){t^=e})),console.log("final randomness: ".concat(t));var r=S()("".concat(t));se(e,q.PLAY,{rng:r}),ce(e,q.SETUP),console.log("STARTING GAME!!!! exciting :)))"),console.log(e),ie(e)}(e)}function Re(e){var n=e.data[q.SETUP];e.conn,1===Object.keys(n.readyHashes).length-1&&(T(n.players.length===Object.keys(n.readyHashes).length,e),function(e){T(e.phase===q.SETUP,e);var n=e.data[e.phase];T(n.state===Z.SENT_READY,e),le(e,{method:ne.START,randomNumber:n.myRandom}),n.startNumbers[e.userId]=n.myRandom,n.state=Z.SENT_START,me(e),ie(e)}(e))}function ve(e){return e.userId}function ye(e){var n=e.data[q.PLAY].players.filter((function(n){return n!==ve(e)}))[0];return console.log("opp user id: ".concat(n)),n}function xe(e){return e.data[q.PLAY].playerHands[ve(e)]}function Ae(e){var n=e.data[q.PLAY].playerHands[ye(e)];return console.log("player hand!"),console.log(JSON.stringify(n)),n}function Se(e){var n=e.data[q.PLAY];return ve(e)===n.players[n.nextTurn]}function Te(e){var n=e.data[q.PLAY];return Se(e)&&n.state===ee.WAIT_FOR_PLAY}function Ee(e){return e.data[q.PLAY].playedCards}function Pe(e){return e.allRules}T(JSON.stringify(te)===JSON.stringify(Object.keys(re)),{methods:te,handlers:re});t(33);function Ce(e){var n=Object(a.useState)(""),t=Object(u.a)(n,2),c=t[0],s=t[1],o=Object(a.useState)(""),i=Object(u.a)(o,2),l=i[0],d=i[1];function f(){b(e.connRef.current,{type:"message",message:c}),p(c),s("")}function p(e){d((function(n){return""===n?e:e+"\n"+n}))}return Object(a.useEffect)((function(){var n=j(e.connRef.current,(function(e){if("message"===e.type)return p(e.message);p(JSON.stringify(e))}));return function(){console.log("cleaning up chat!!! index ".concat(n)),h(e.connRef.current,n)}}),[e.connRef]),Object(r.jsxs)("div",{children:[Object(r.jsx)("input",{type:"text",value:c,onChange:function(e){return s(e.target.value)},onKeyUp:function(e){return"Enter"===e.key?f():0}}),Object(r.jsx)("button",{onClick:f,children:"Send message"}),Object(r.jsx)("p",{style:{whiteSpace:"pre-line"},children:l})]})}function ke(){return Object(r.jsx)("div",{children:"Waiting for everyone else to press start..."})}function Ye(e){var n=Object(a.useState)(Ee(e.gameRef.current)),t=Object(u.a)(n,2),c=t[0],s=t[1],o=Object(a.useState)(xe(e.gameRef.current)),i=Object(u.a)(o,2),l=i[0],d=i[1],f=Object(a.useState)(Ae(e.gameRef.current)),j=Object(u.a)(f,2),h=j[0],b=j[1],p=Object(a.useState)(ve(e.gameRef.current)),O=Object(u.a)(p,2),g=O[0],m=O[1],R=Object(a.useState)(ye(e.gameRef.current)),y=Object(u.a)(R,2),x=y[0],A=y[1],S=Object(a.useState)(null),T=Object(u.a)(S,2),E=T[0],P=T[1],C=Object(a.useState)(Te(e.gameRef.current)),k=Object(u.a)(C,2),Y=k[0],_=k[1],I=Object(a.useState)([]),D=Object(u.a)(I,2),H=D[0],M=D[1],F=Object(a.useCallback)((function(e){P(e.currentTarget.value)}),[]),U=Object(a.useCallback)((function(e){var n=JSON.parse(e.currentTarget.value);console.log("toggling rule ".concat(n.name)),H.filter((function(e){return Q(e,n)})).length>0?M(H.filter((function(e){return!Q(e,n)}))):M([n].concat(Object(v.a)(H)))}),[H]),G=Object(a.useCallback)((function(){s(Ee(e.gameRef.current)),d(xe(e.gameRef.current)),b(Ae(e.gameRef.current)),m(ve(e.gameRef.current)),A(ye(e.gameRef.current)),_(Te(e.gameRef.current))}),[e.gameRef]);return Object(a.useEffect)((function(){var n=oe(e.gameRef.current,G);return function(){ue(e.gameRef.current,n)}}),[e.gameRef,G]),Object(r.jsxs)("div",{children:[Object(r.jsx)(Ne,{cards:h,user:x}),Object(r.jsx)(Le,{cards:c}),Object(r.jsx)(Ie,{cards:l,user:g,changeCard:F,selectedCard:E}),Object(r.jsx)(_e,{rules:e.rules,selectedRules:H,toggleRule:U}),Object(r.jsx)(we,{disabled:!Y||e.disabled,play:function(){be(e.gameRef.current,function(e){var n="\ud83c\udca1".charCodeAt(1),t=e.charCodeAt(1)-n,r=Math.floor(t/16),a=t%16;return a>=12&&a--,{suit:L[r],rank:w[a],suit_index:r,rank_index:a,index:13*r+a}}(E),H),M([])},pass:function(){be(e.gameRef.current,N,H),M([])}})]})}function _e(e){return Object(r.jsxs)("div",{style:{marginTop:"5px",marginBottom:"7px"},children:["rules:",Object(r.jsx)("div",{className:"SelectRule",children:e.rules.map((function(n,t){return Object(r.jsxs)(c.a.Fragment,{children:[Object(r.jsx)("input",{type:"checkbox",name:"rules",value:JSON.stringify(n),checked:e.selectedRules.filter((function(e){return Q(e,n)})).length>0,onChange:e.toggleRule,id:n.hash},"rulesradio".concat(t)),Object(r.jsx)("label",{htmlFor:n.hash,children:n.name},"ruleslabel".concat(t))]},"rulesfragment".concat(t))}))})]})}function we(e){return Object(r.jsxs)("div",{children:[Object(r.jsx)("button",{onClick:e.play,disabled:e.disabled,children:"Play!"}),Object(r.jsx)("button",{onClick:e.pass,disabled:e.disabled,children:"Pass"})]})}function Le(e){return Object(r.jsxs)("div",{children:["played cards: ",Object(r.jsx)(De,{cards:e.cards})]})}function Ne(e){return Object(r.jsxs)("div",{children:[e.user,"'s cards:",Object(r.jsx)(De,{cards:e.cards})]})}function Ie(e){return Object(r.jsxs)("div",{children:["my cards:",Object(r.jsx)(He,{cards:e.cards,changeCard:e.changeCard,selectedCard:e.selectedCard})]})}function De(e){return 0===e.cards.length?Object(r.jsx)("div",{children:"(none)"}):Object(r.jsx)("div",{style:{fontSize:"3em"},children:M(e.cards)})}function He(e){return 0===e.cards.length?Object(r.jsx)("div",{children:"(none)"}):Object(r.jsx)("div",{style:{fontSize:"3em"},className:"SelectableDeck",children:e.cards.map((function(n,t){return Object(r.jsxs)(c.a.Fragment,{children:[Object(r.jsx)("input",{type:"radio",name:"mycards",value:D(n),checked:e.selectedCard===D(n),onChange:e.changeCard,id:H(n)},"mycardsradio".concat(t)),Object(r.jsx)("label",{htmlFor:H(n),children:D(n)},"mycardslabel".concat(t))]},"mycardsfragment".concat(t))}))})}function Me(e){return Object(r.jsxs)("div",{children:[Object(r.jsxs)("div",{style:{fontSize:"2em"},children:["Game is over!!!! ",e.winner," won!"]}),Object(r.jsx)("button",{onClick:function(){return(n=e.gameRef.current).phase=q.SETUP,void pe(n);var n},children:"Play again!"})]})}function Fe(e){return Object(r.jsxs)("div",{children:["Rules:",Object(r.jsx)("ul",{children:e.rules.map((function(e){return Object(r.jsx)("li",{children:JSON.stringify(e)})}))})]})}function Ue(e){var n,t=Object(a.useState)(e.gameRef.current.phase),s=Object(u.a)(t,2),o=s[0],i=s[1],l=Object(a.useState)(ve(e.gameRef.current)),d=Object(u.a)(l,2),f=d[0],j=d[1],h=Object(a.useState)(Pe(e.gameRef.current)),b=Object(u.a)(h,2),p=b[0],O=b[1],g=Object(a.useCallback)((function(){i(e.gameRef.current.phase),j(ve(e.gameRef.current)),O(Pe(e.gameRef.current))}),[e.gameRef]);return Object(a.useEffect)((function(){var n=oe(e.gameRef.current,g);return function(){ue(e.gameRef.current,n)}}),[e.gameRef,g]),Object(r.jsxs)("div",{children:["welcome to the game, ",f,"!",Object(r.jsx)("hr",{}),o===q.GAMEOVER&&Object(r.jsxs)(c.a.Fragment,{children:[Object(r.jsx)(Me,{gameRef:e.gameRef,winner:(n=e.gameRef.current,n.data[q.GAMEOVER].winner)}),Object(r.jsx)("hr",{})]}),o===q.SETUP&&Object(r.jsxs)(c.a.Fragment,{children:[Object(r.jsx)(ke,{}),Object(r.jsx)("hr",{})]}),Object(r.jsx)(Fe,{rules:p}),Object(r.jsx)("hr",{}),(o===q.PLAY||o===q.GAMEOVER)&&Object(r.jsxs)(c.a.Fragment,{children:[Object(r.jsx)(Ye,{gameRef:e.gameRef,disabled:o===q.GAMEOVER,rules:p}),Object(r.jsx)("hr",{})]}),Object(r.jsx)(Ce,{connRef:e.connRef})]})}function Ge(e){return Object(r.jsx)("div",{children:Object(r.jsx)("button",{onClick:function(){return n=e.connRef.current,t=e.setMyOffer,console.log("create offer"),console.log(n.pc.signalingState),n.dc=n.pc.createDataChannel("chat"),n.dc.onopen=function(){return d(n)},n.dc.onmessage=function(e){return f(n,e)},n.pc.createOffer().then((function(e){return n.pc.setLocalDescription(e)})).catch(console.log),void(n.pc.onicecandidate=function(e){e.candidate||t(p(JSON.stringify(n.pc.localDescription)))});var n,t},children:"Create game"})})}function Je(e){var n=Object(a.useState)(""),t=Object(u.a)(n,2),c=t[0],s=t[1];return Object(r.jsxs)("div",{children:["send this message to your friends: ",Object(r.jsx)("code",{children:e.offer}),Object(r.jsx)("br",{}),"input their answer:",Object(r.jsx)("input",{type:"text",value:c,onChange:function(e){return s(e.target.value)}}),Object(r.jsx)("button",{onClick:function(){return function(e,n){console.log("join"),console.log(e.pc.signalingState);var t=new RTCSessionDescription(JSON.parse(O(n)));e.pc.setRemoteDescription(t).catch(console.log)}(e.connRef.current,c)},children:"Add player"})]})}function We(e){var n=Object(a.useState)(""),t=Object(u.a)(n,2),c=t[0],s=t[1];return Object(r.jsxs)("div",{children:[Object(r.jsx)("input",{type:"text",value:c,onChange:function(e){return s(e.target.value)}}),Object(r.jsx)("button",{onClick:function(){return function(e,n,t){console.log("join"),console.log(e.pc.signalingState);var r=new RTCSessionDescription(JSON.parse(O(n)));e.pc.setRemoteDescription(r).then((function(){return e.pc.createAnswer()})).then((function(n){return e.pc.setLocalDescription(n)})).catch(console.log),e.pc.onicecandidate=function(n){n.candidate||t(p(JSON.stringify(e.pc.localDescription)))}}(e.connRef.current,c,e.setMyAnswer)},children:"Join"})]})}function Be(e){return Object(r.jsxs)("div",{children:["send this message to your friends: ",Object(r.jsx)("code",{children:e.answer}),Object(r.jsx)("br",{})]})}function Ke(e){return console.log(e.connRef),Object(r.jsxs)("div",{children:[Object(r.jsx)(Ge,{connRef:e.connRef,setMyOffer:e.setMyOffer}),Object(r.jsx)("br",{}),Object(r.jsx)(We,{connRef:e.connRef,setMyAnswer:e.setMyAnswer}),Object(r.jsx)("br",{})]})}function Ve(e){return Object(r.jsxs)("div",{children:[e.offer?Object(r.jsx)(Je,{connRef:e.connRef,offer:e.offer}):Object(r.jsx)(Be,{connRef:e.connRef,answer:e.answer}),Object(r.jsx)("hr",{}),"Participants list: idk",Object(r.jsx)("br",{}),Object(r.jsx)("hr",{}),Object(r.jsx)("button",{onClick:e.startGame,children:"Start game!"}),Object(r.jsx)("hr",{}),Object(r.jsx)(Ce,{connRef:e.connRef})]})}function ze(e){var n=Object(a.useState)(null),t=Object(u.a)(n,2),s=t[0],o=t[1],i=Object(a.useState)(null),l=Object(u.a)(i,2),d=l[0],f=l[1];return s||d?Object(r.jsx)(Ve,{connRef:e.connRef,offer:s,answer:d,startGame:e.startGame}):Object(r.jsx)(c.a.Fragment,{children:Object(r.jsx)(Ke,{connRef:e.connRef,setMyOffer:o,setMyAnswer:f})})}var Qe=function(){var e=Object(a.useState)(!0),n=Object(u.a)(e,2),t=n[0],c=n[1],s=Object(a.useRef)(),o=Object(a.useRef)(),i=Object(a.useCallback)((function(){c(!1),pe(o.current)}),[o]);return Object(a.useEffect)((function(){s.current=function(){var e={pc:new RTCPeerConnection(l),dc:null,messageHandlers:{},messageHandlersIndx:"0"};return e.pc.ondatachannel=function(n){e.dc=n.channel,e.dc.onopen=function(){return d(e)},e.dc.onmessage=function(n){return f(e,n)}},e.pc.oniceconnectionstatechange=function(n){return console.log(e.pc.iceConnectionState)},e}(),o.current=ae(s.current)}),[]),Object(a.useEffect)((function(){var e=j(s.current,(function(e){return function(e,n){console.log("game receiving message!"),console.log(n),"data"===n.type?(T(te.includes(n.method)),console.log(re),re[n.method](e,n)):console.log("ignoring non-data message")}(o.current,e)}));return function(){h(s.current,e)}}),[s,o]),Object(r.jsxs)("div",{className:"App",children:[t&&Object(r.jsx)(ze,{connRef:s,startGame:i}),!t&&Object(r.jsx)(Ue,{connRef:s,gameRef:o})]})},$e=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,35)).then((function(n){var t=n.getCLS,r=n.getFID,a=n.getFCP,c=n.getLCP,s=n.getTTFB;t(e),r(e),a(e),c(e),s(e)}))};o.a.render(Object(r.jsx)(c.a.StrictMode,{children:Object(r.jsx)(Qe,{})}),document.getElementById("root")),$e()}},[[34,1,2]]]);
//# sourceMappingURL=main.009c3424.chunk.js.map