(()=>{var ce=["black","darkslategray","darkolivegreen","saddlebrown","darkred","olive","darkslateblue","cadetblue","green","mediumseagreen","steelblue","chocolate","yellowgreen","indianred","darkblue","limegreen","goldenrod","darkseagreen","purple","maroon3","red","darkturquoise","darkorange","gold","yellow","mediumblue","burlywood","lime","mediumspringgreen","blueviolet","crimson","deepskyblue","greenyellow","tomato","orchid","lightsteelblue","fuchsia","khaki","cornflower","plum","deeppink","mediumslateblue","lightsalmon","paleturquoise","palegreen","aquamarine","lightgoldenrod","hotpink","lightpink","lavenderblush"];var T=class{static id;get mytype(){return this.constructor}get typename(){return this.mytype.id}toJSON(){return{type:this.typename}}static fromJSON(e,t){return new e}};function W(o){let e=S[o.type];return e.fromJSON(e,o)}var S={};function u(o,e){S[e]=o,o.id=e}var E=class extends T{cellName="";ship;onEnter(e){}};function fe(o){return o.prototype instanceof E}var P=class extends E{},N=class extends P{onEnter(e){l("Airlock_Locked").style.display=e.playerShip.toPlanet==e.playerShip.onPlanet?"":"none",l("Airlock_UnLocked").style.display=e.playerShip.toPlanet==e.playerShip.onPlanet?"none":"",l("Airlock_Detach").onclick=()=>{e.depart()}}};u(N,"Airlock");var H=class extends P{};u(H,"Passage");var f=class extends P{opposite="";onEnter(e){document.querySelector("#Ballast b").innerText=this.opposite||""}};u(f,"Ballast");var oe=class o extends P{original="";toJSON(){return{type:this.typename,original:this.original}}static fromJSON(e,t){let r=new o;return r.original=t.original,r}};u(oe,"Debris");var b=class extends E{},_=class o extends b{cargo=[];toJSON(){return{type:this.typename,cargo:this.cargo.map(e=>e.toJSON())}}static fromJSON(e,t){let r=new o;return r.cargo=t.cargo.map(n=>W(n)),r}onEnter(e){document.querySelector("#CargoBay ul").innerHTML=this.cargo.map(t=>`<li>${t.typename}</li>`).join(""),document.getElementById("CargoBay_Empty").style.display=this.cargo.length==0?"":"none",document.getElementById("CargoBay_NonEmpty").style.display=this.cargo.length==0?"none":""}};u(_,"CargoBay");function z(o){return o instanceof _}var M=class extends b{onEnter(e){let r=document.querySelector("#Radar canvas").getContext("2d");ye()}};u(M,"Radar");function ye(o){let e=document.querySelector("#Radar canvas");if(e.offsetParent===null)return;let t=e.getContext("2d");p.tick(o)&&window.requestAnimationFrame(ye),de(t,p.star),ge(t,p.star.ships,p.playerShip.componentTypes[M.id])}var C=class extends b{};u(C,"Cloak");var D=class extends b{},I=class extends D{planetTr(e){let t=e.planet,r=e.i;if(t==p.playerShip.onPlanet)return"";let n=Math.ceil(t.distanceTo(p.playerShip)/.1),i=t==p.playerShip.toPlanet?"checked":"";return`<tr><td>
            <label for="NavigationComputer_to_${r}"><canvas id="NavigationComputer_canvas_${r}" width=30 height=30></canvas></label>
        </td><td>
            <label><input type="radio" name="NavigationComputer_to" value="${r}" id="NavigationComputer_to_${r}" ${i}>
            <b>${t.name}</b> (${n}d)<br>
            ${t.buys?`wants: ${t.buys.id}`:""} ${t.sells?`gives: ${t.sells.id}`:""}
        </label></td></tr>`}showDiv(e){l("currentComponentPage").innerHTML=`#NavigationComputer_${e}{display:block !important}`}onEnter(e){if(e.timeFlies){this.showDiv("Flying");return}this.showDiv("Select"),document.querySelector("#NavigationComputer table").innerHTML=e.star.planets.map((t,r)=>({planet:t,i:r,dist:t.distanceTo(e.playerShip)})).sort((t,r)=>t.dist-r.dist).map(this.planetTr).join(""),e.star.planets.forEach((t,r)=>{let n=document.getElementById(`NavigationComputer_canvas_${r}`);if(!n)return;let i=n.getContext("2d");ne(i,t,n.width/.2/2,n.width/2,n.height/2)}),l("NavigationComputer_Plot").style.display=this.ship instanceof d?"none":"",l("NavigationComputer_Fly").style.display=this.ship instanceof d?"":"none",l("NavigationComputer_Plot").onclick=()=>{let t=document.querySelector('input[name="NavigationComputer_to"]:checked');return!t||!e.playerShip.onPlanet?!1:(e.playerShip.planTrip(e.playerShip.onPlanet,e.star.planets[parseInt(t.value)],e.now),this.showDiv("Detach"),!0)},l("NavigationComputer_Fly").onclick=()=>{if(!l("NavigationComputer_Plot").onclick())return!1;this.showDiv("Departed"),e.depart()}}};u(I,"NavigationComputer");var $=class extends D{showDiv(e){l("currentComponentPage").innerHTML=`#TradingComputer_${e}{display:block !important}`}onEnter(e){let t=e.playerShip.onPlanet;if(t===null){this.showDiv("None");return}if(e.playerShip.countCargo(),t.buys===null){let n=Math.min(e.playerShip.freeCargo,t.ratio);if(n==0){this.showDiv("NoGift");return}this.showDiv("Gift"),l("TradingComputer_gift_number").innerText=n.toString(),l("TradingComputer_gift_type").innerText=t.sells.id,l("TradingComputer_gift_take").onclick=()=>{e.playerShip.putCargo(t.sells,n),this.showDiv("Done")};return}if(e.playerShip.cargoTypes[t.buys.id]<1){this.showDiv("NothingToTradde");return}this.showDiv("Trade");let r=l("TradingComputer_give_slider");l("TradingComputer_give_type").innerText=t.buys.id,l("TradingComputer_get_type").innerText=t.sells.id,r.max=r.value=e.playerShip.cargoTypes[t.buys.id].toString(),r.style.display=e.playerShip.cargoTypes[t.buys.id]==1?"none":"",r.onchange=()=>{let n=parseInt(r.value),i=Math.round(n*t.ratio);l("TradingComputer_max_cargo_warning").style.display=i-n>e.playerShip.freeCargo?"":"none",i=Math.min(i,e.playerShip.freeCargo+n),l("TradingComputer_give_number").innerText=n.toString(),l("TradingComputer_get_number").innerText=i.toString()},r.onchange(),l("TradingComputer_deal").onclick=()=>{let n=parseInt(r.value),i=Math.round(n*t.ratio);i=Math.min(i,e.playerShip.freeCargo+n),e.playerShip.getCargo(t.buys,n),e.playerShip.putCargo(t.sells,i),this.showDiv("Done")}}};u($,"TradingComputer");var a=50,c=5;function Te(o,e,t,r,n,i){r.isAlien?o.rect(e*a,t*a+c,a,a-2*c):o.rect(e*a+c,t*a,a-2*c,a),o.strokeStyle="white",o.fillStyle="white",o.stroke(),o.textBaseline="top",o.fillText(n.cellName||"",e*a+c,t*a);let s=n.typename[0];n instanceof D&&(s+="C"),n instanceof C&&(s+="l"),o.fillText(s,e*a+c,t*a+16),i&&(i.map[e][t].canBeHere=!0,i.map[e][t].canGoX=r.isAlien,i.map[e][t].canGoY=!r.isAlien,i.map[e][t].ship=r,i.map[e][t].component=n)}function Pe(o,e,t,r,n){let i=r.passage;if(o.rect((e+i.x)*a,(t+i.y)*a,i.w*a,i.h*a),o.strokeStyle="white",o.fillStyle="white",o.stroke(),o.textBaseline="top",n){let s=new H;for(let m=0;m<i.w;m++)for(let h=0;h<i.h;h++)n.map[m+e][h+t].canBeHere=!0,n.map[m+e][h+t].canGoX=!0,n.map[m+e][h+t].canGoY=!0,n.map[m+e][h+t].ship=r,n.map[m+e][h+t].component=s}}function Se(o,e,t,r){o.strokeStyle="white",o.strokeStyle="white",o.fillStyle="white",o.beginPath(),o.moveTo(e*a+c,t*a),o.lineTo(e*a+c*2,(t+.5)*a),o.lineTo(e*a+c,(t+1)*a),o.lineTo((e+1)*a-c,(t+1)*a),o.lineTo((e+1)*a-c*2,(t+.5)*a),o.lineTo((e+1)*a-c,t*a),o.closePath(),o.stroke(),r&&(r.map[e][t].canBeHere=!0,r.map[e][t].canGoY=!0,r.map[e][t].component=new N)}function X(o,e,t,r,n){for(let i=0;i<r.rows.length;i++)for(let s=0;s<r.rows[i].length;s++){let m=r.rows[i][s],h=r.rowToXY(i,s);m.cellName=String.fromCharCode(65+i)+h.y,Te(o,e+h.x,t-h.y,r,m,n)}Pe(o,e,t,r,n)}function _e(o,e,t){let r=e.x*t,n=e.y*t;if(o.fillStyle=e.color,o.fillRect(r-1,n-1,3,3),e instanceof d)for(let i=1;i<=e.componentTypes.Radar;i++)o.beginPath(),o.arc(r,n,t*i,0,7),o.strokeStyle="red",o.stroke()}function ne(o,e,t,r,n){r===void 0&&(r=e.x*t),n===void 0&&(n=e.y*t);var i=o.createRadialGradient(r-1,n-1,2,r,n,.2*t);i.addColorStop(0,e.color_in),i.addColorStop(1,e.color_out),o.fillStyle=i,o.beginPath(),o.arc(r,n,.2*t,0,7),o.fill()}function de(o,e){let t=o.canvas.width,r=t/e.size,n=t/2;if(o.clearRect(0,0,t,t),e.bright){let i=o.createRadialGradient(n,n,0,n,n,r/2);i.addColorStop(0,"white"),i.addColorStop(.5,e.color),i.addColorStop(1,"transparent"),o.fillStyle=i,o.fillRect(0,0,t,t)}else{let i=o.createRadialGradient(n,n,10,n,n,r/2);i.addColorStop(0,e.color),i.addColorStop(1,"transparent"),o.fillStyle=i,o.fillRect(0,0,t,t)}for(let i of e.planets)ne(o,i,r)}function ge(o,e,t){let n=o.canvas.width/p.star.size;for(let i of e)(i instanceof d||i.seenBy(p.playerShip,t))&&_e(o,i,n)}function ie(o){l("now-day").innerText=(o+1).toString();let e=Math.floor(o/300)+3e3,t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"][Math.floor(o%300/30)],r=Math.floor(o%30)+1;l("now-date").innerText=`${r} ${t} ${e}`}var ae=class{star;playerShip;walkManager;walkCTX;now=0;lastTickTimestamp;lastDate;_timeFlies=!1;tickInterval=0;get timeFlies(){return this._timeFlies}set timeFlies(e){if(this._timeFlies!=e)if(this._timeFlies=e,e){let t=this;this.lastTickTimestamp=performance.now(),this.tickInterval=setInterval(function(){t.tick()},1e3)}else clearInterval(this.tickInterval)}tick(e){if(!this._timeFlies)return!1;if(e||(e=performance.now()),e<=this.lastTickTimestamp)return!0;this.now+=Math.max(0,Math.min(e-this.lastTickTimestamp,1e3))/1e3,this.lastTickTimestamp=e;let t=Math.floor(this.now);if(this.lastDate!=t){ie(t),this.lastDate=t;let r=Math.ceil(this.playerShip.toTime-this.now);se(`Approaching ${this.playerShip.toPlanet.name} planet in ${r} days`)}for(let r of this.star.ships)r.updateSpaceXY(this.now);return!0}depart(){this.timeFlies=!0,this.playerShip.flying=!0,this.playerShip.onPlanet=null,this.walkManager.detach(this.walkCTX),this.lastDate=-1,this.tick()}arrive(){this.playerShip.onPlanet=this.playerShip.toPlanet,this.playerShip.x=this.playerShip.onPlanet.x,this.playerShip.y=this.playerShip.onPlanet.y,this.playerShip.flying=!1,this.timeFlies=!1,this.walkManager.attach(this.walkCTX,this.playerShip.onPlanet.base),se(`Docked to base at ${this.playerShip.onPlanet.name} planet`)}},p=new ae;ie(0);var v=class extends T{};function we(o){return o.prototype instanceof v}var V=class extends v{},le=class extends V{};u(le,"Rocket");var pe=class extends V{};u(pe,"Fuel");var x=class extends v{},R=class extends x{static color="blue"};u(R,"Water");var Y=class extends x{static color="yellow"};u(Y,"Iron");var j=class extends x{static color="green"};u(j,"Food");var q=class extends x{static color="red"};u(q,"Radioactives");function y(o,e){return o>e&&([o,e]=[e,o]),Math.floor(Math.random()*(e-o+1))+o}function L(o){return o[Math.floor(Math.random()*o.length)]}function O(o){return o.map(e=>({sort:Math.random(),value:e})).sort((e,t)=>e.sort-t.sort).map(e=>e.value)}function A(o){return[...Array(o).keys()]}var w=class o{color;isAlien=!1;rows=[];offsets=[];componentTypes;cargoTypes;freeCargo;isPlayerShip=!1;playerOnShip=!1;playerX;playerY;x;y;fromPoint;toPlanet;fromTime;toTime;updateSpaceXY(e,t=!0){for(;e>=this.toTime&&t;)this.toPlanet.dispatch(this,this.toTime);let r=(e-this.fromTime)/(this.toTime-this.fromTime);this.x=this.fromPoint.x+(this.toPlanet.x-this.fromPoint.x)*r,this.y=this.fromPoint.y+(this.toPlanet.y-this.fromPoint.y)*r}planTrip(e,t,r){this.fromPoint=e,this.toPlanet=t,this.fromTime=r;let i=t.distanceTo(e)/.1;this.toTime=r+i,this.updateSpaceXY(this.fromTime)}countComponents(){this.componentTypes={};let e=Object.values(S).filter(fe).forEach(r=>this.componentTypes[r.id]=0),t=this.rows.flat();for(let r of t)this.componentTypes[r.typename]++}countCargo(){let e=this.rows.flat().filter(z);this.freeCargo=0,this.cargoTypes={},Object.values(S).filter(we).forEach(t=>this.cargoTypes[t.id]=0);for(let t of e){this.freeCargo+=4-t.cargo.length;for(let r of t.cargo)this.cargoTypes[r.typename]++}}getCargo(e,t){if(t>this.cargoTypes[e.id])return!1;this.cargoTypes[e.id]-=t,this.freeCargo+=t;let r=this.rows.flat().filter(z).filter(n=>n.cargo.length);for(let n of r)if(n.cargo=n.cargo.filter(i=>!(i instanceof e&&t-- >0)),t<=0)return!0}putCargo(e,t){if(t>this.freeCargo)return!1;this.cargoTypes[e.id]+=t,this.freeCargo-=t;let r=this.rows.flat().filter(z).filter(n=>n.cargo.length<4);for(let n of r){for(;t>0&&n.cargo.length<4;)n.cargo.push(new e),t--;if(t<=0)return!0}}seenBy(e,t){let r=Math.hypot(e.x-this.x,e.y-this.y);return t>=r+this.componentTypes[C.id]}toJSON(){return{isAlien:this.isAlien,offsets:this.offsets,rows:this.rows.map(e=>e.map(t=>t.toJSON()))}}static fromJSON(e){let t=new o;return t.isAlien=e.isAlien,t.offsets=e.offsets,t.rows=e.rows.map(r=>r.map(n=>W(n))),t}get gridSize(){if(this.isAlien)return{x0:0,x1:0,y0:0,y1:0,w:0,h:0};{let e=0,t=0;for(let r=0;r<this.rows.length;r++)e=Math.max(e,this.rows[r].length-this.offsets[r]),t=Math.max(t,this.offsets[r]);return{x0:0,x1:this.rows.length-1,y0:e,y1:t,w:this.rows.length,h:e+t+1}}}rowToXY(e,t){return this.isAlien?{x:0,y:0}:t>=this.offsets[e]?{x:e,y:1+(t-this.offsets[e])}:{x:e,y:t-this.offsets[e]}}get passage(){return this.isAlien?{x:0,y:0,w:0,h:0}:{x:0,y:0,w:this.rows.length,h:1}}oppositeComponent(e){for(let t=0;t<=this.rows.length;t++){let r=this.rows[t].indexOf(e);if(r>=0)return this.rows[this.rows.length-1-t][r]}}static randomShip(e,t){let n=Object.values(S).filter(s=>s.prototype instanceof b),i=Object.values(S).filter(s=>s.prototype instanceof v);t===void 0&&(t=new o),t.color=L(ce),t.rows=[[],[],[],[]],t.offsets=[0,0,0,0];for(let s=0;s<e;s++){let m=y(0,3),h=L(n),k=new h;if(k.ship=t,k instanceof _){let re=y(0,4);for(let ue=0;ue<re;ue++){let ke=L(i);k.cargo.push(new ke)}}t.rows[m].push(k)}for(let s=0;s<t.rows.length;s++)t.offsets[s]=y(0,t.rows[s].length);return t.balanceBallast(),t.countComponents(),t}static newBase(e){let t=new o;return t.color="black",t.rows=[[],[]],t.rows[y(0,1)].push(new I),t.rows[y(0,1)].push(new M),t.rows[y(0,1)].push(new $),t.offsets=[y(0,t.rows[0].length),y(0,t.rows[1].length)],t.balanceBallast(),t.countComponents(),t}balanceBallast(){if(!this.isAlien){let r=this.rows.length-1;for(var e=0;e<=r;e++)for(;this.offsets[e]<this.offsets[r-e];)this.rows[e].unshift(new f),this.offsets[e]++;for(var e=0;e<=r;e++)for(;this.rows[e].length<this.rows[r-e].length;)this.rows[e].push(new f);for(var e=0;e<=r;e++)for(;this.rows[e][0]instanceof f&&this.rows[r-e][0]instanceof f;)this.rows[e].shift(),this.rows[r-e].shift(),this.offsets[e]--,this.offsets[r-e]++;for(var e=0;e<=r;e++)for(;this.rows[e].at(-1)instanceof f&&this.rows[r-e].at(-1)instanceof f;)this.rows[e].pop(),this.rows[r-e].pop();for(var e=0;e<=r;e++)for(var t=0;t<=this.rows[e].length;t++)this.rows[e][t]instanceof f&&(this.rows[e][t].opposite=this.rows[r-e][t].typename)}}get topAirlock(){if(this.isAlien)return 0;{let e=0;for(let t=0;t<this.rows.length;t++)e=Math.max(e,this.rows[t].length-this.offsets[t]);for(let t=0;t<this.rows.length;t++)if(this.rows[t].length-this.offsets[t]==e)return t;return 0}}get bottomAirlock(){if(this.isAlien)return 0;{let e=Math.max(...this.offsets);return this.offsets.lastIndexOf(e)}}};var d=class o extends w{flying=!1;onPlanet;updateSpaceXY(e){super.updateSpaceXY(e,!1),e>=this.toTime&&p.arrive()}static randomShip(e){let t=new o;return w.randomShip(e,t),t.color="white",t}};var he=class{canBeHere=!1;canGoX=!1;canGoY=!1;ship;component},J=class{map=[];constructor(e,t){for(let r=0;r<=e;r++){this.map[r]=[];for(let n=0;n<=t;n++)this.map[r][n]=new he}}},U=class{x;y;map;box;human;canvas;onEnter;goX(e){return!this.map.map[this.x][this.y].canGoX||!this.map.map[this.x+e][this.y].canBeHere?!1:(this.x+=e,this.reposition(),this.onEnter(this.map.map[this.x][this.y].component),!0)}goY(e,t){return!t&&!this.map.map[this.x][this.y].canGoY||!this.map.map[this.x][this.y+e].canBeHere?!1:(this.y+=e,this.reposition(),this.onEnter(this.map.map[this.x][this.y].component),!0)}goUp(){this.goY(-1),this.human.style.transform="rotate(0deg)"}goDn(e){this.goY(1,e),this.human.style.transform="rotate(180deg)"}goLt(){this.goX(-1),this.human.style.transform="rotate(-90deg)"}goRt(){this.goX(1),this.human.style.transform="rotate(90deg)"}jumpTo(e,t,r=!0){this.x=e,this.y=t,this.reposition(!0),r&&this.onEnter(this.map.map[e][t].component)}reposition(e){e&&this.canvas.classList.add("notransition");let t=(this.x+.5)*a,n=this.box.offsetWidth/2-t;this.canvas.style.left=n+"px";let i=(this.y+.5)*a,m=this.box.offsetHeight/2-i;this.canvas.style.top=m+"px",e&&(this.canvas.offsetHeight,this.canvas.classList.remove("notransition"))}};var Z=class{walker;oneShipData;twoShipsData;hasSecondShip=!1;myShip;secondShip;putTwoShips(e,t){let r=e.gridSize,n=t.gridSize,i=e.bottomAirlock,s=t.topAirlock,m=Math.max(i,s)+1,h=r.h+1,k=m+Math.max(r.w-i,n.w-s),re=h+n.h+1;this.myShip=t,this.secondShip=e,this.hasSecondShip=!0,this.twoShipsData={ax0:m-i+r.x0,ay0:r.y0+1,airlock_x:m,airlock_y:h,bx0:m-s+n.x0,by0:h+n.y0+1,max_x:k,max_y:re}}drawTwoShips(e,t,r){this.putTwoShips(t,r);let n=this.twoShipsData,i=new J(n.max_x,n.max_y);this.walker.map=i,e.canvas.width=a*(n.max_x+1),e.canvas.height=a*(n.max_y+1),X(e,n.ax0,n.ay0,t,i),X(e,n.bx0,n.by0,r,i),Se(e,n.airlock_x,n.airlock_y,i)}drawMyShip(e){this.hasSecondShip=!1;let t=this.oneShipData=this.myShip.gridSize,r=this.walker.map=new J(t.w+1,t.h+1);e.canvas.width=a*(t.w+2),e.canvas.height=a*(t.h+2),X(e,t.x0+1,t.y0+1,this.myShip,r)}detach(e){if(!this.hasSecondShip)return!1;let t=!1;if(this.walker.y==this.twoShipsData.airlock_y&&(this.walker.y++,t=!0),this.secondShip.playerOnShip=this.walker.y<this.twoShipsData.airlock_y,this.myShip.playerOnShip=this.walker.y>this.twoShipsData.airlock_y,!(this.walker.y<this.twoShipsData.airlock_y)){let r=this.myShip.playerX=this.walker.x-this.twoShipsData.bx0,n=this.myShip.playerY=this.walker.y-this.twoShipsData.by0;this.drawMyShip(e),t?(this.walker.jumpTo(this.oneShipData.x0+1+r,this.oneShipData.y0+n,!1),this.walker.goDn(!0)):this.walker.jumpTo(this.oneShipData.x0+1+r,this.oneShipData.y0+1+n,!1)}}attach(e,t){if(this.hasSecondShip)return!1;let r=this.walker.x-1-this.oneShipData.x0,n=this.walker.y-1-this.oneShipData.y0;this.drawTwoShips(e,t,this.myShip),this.walker.jumpTo(this.twoShipsData.bx0+r,this.twoShipsData.by0+n)}};function Me(o,e){let t=Math.hypot(o,e);return[o/t,e/t]}function De(o,e){return o[0]*e[0]+o[1]*e[1]}function Be(o,e,t){let r=Me(o.x-e.x,o.y-e.y),n=De(r,[t.x-e.x,t.y-e.y]);return[e.x+r[0]*n,e.y+r[1]*n]}function me(o,e,t,r){let[n,i]=Be(o,e,t);return n>=Math.min(o.x,e.x)&&n<=Math.max(o.x,e.x)&&i>=Math.min(o.y,e.y)&&i<=Math.max(o.y,e.y)&&Math.hypot(n-t.x,i-t.y)<r}var be=function(){let o=[R,Y,j,q];for(var e=[[null,"water-mining","farming","burning"],["ice",null,"hunting","fire"],["fishy","bio-mining",null,"nuclear"],["frozen","hot mining","ice-farming",null]],t=[["ocean",null,R,"navy","blue"]],r=0;r<4;r++)for(var n=0;n<4;n++)r!=n&&t.push([e[r][n],o[r],o[n],o[r].color,o[n].color]);return t}(),Q=class{x;y;type;name;buys;sells;ratio;color_in;color_out;neighbours;base;constructor(e,t,r){var n=be[r];this.x=e,this.y=t,this.type=r,this.name=n[0],this.buys=n[1],this.sells=n[2],this.color_in=n[3],this.color_out=n[4],this.base=w.newBase(this)}distanceTo(e){return Math.hypot(this.x-e.x,this.y-e.y)}save(){return[this.x,this.y,this.type]}dispatch(e,t){let r=this.neighbours.shift();this.neighbours.push(r),e.planTrip(this,r,t)}};function Re(o,e,t){var r=t/2;return o<r+.6&&o>r-.6&&e<r+.6&&e>r-.6}function xe(o){for(var e=O(A(be.length)),t=0;t<100;t++){for(var r=!1,n=[],i=O(A(o)),s=O(A(o)),m=o/2,h=0;h<o;h++)Re(i[h]+.5,s[h]+.5,o)&&(r=!0),n.push([i[h]+.5,s[h]+.5,e[h]]);if(!r)return n}return console.error("should not be here"),[]}var Le=["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkGray","DarkGrey","DarkKhaki","DarkOrange","DarkOrchid","DarkSalmon","DarkSeaGreen","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","Fuchsia","Gainsboro","GhostWhite","Gold","Goldenrod","Gray","GreenYellow","Grey","Honeydew","HotPink","IndianRed","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenrodYellow","LightGray","LightGreen","LightGrey","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","MediumAquamarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MintCream","MistyRose","Moccasin","NavajoWhite","OldLace","Orange","OrangeRed","Orchid","PaleGoldenrod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Red","RosyBrown","RoyalBlue","Salmon","SandyBrown","Seashell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];function Oe(o,e){for(var t=A(e).map(s=>[]),r=(e-1)/2,n=Math.floor(r);n<=Math.ceil(r);n++)for(var i=Math.floor(r);i<=Math.ceil(r);i++)t[n+1][i+1]=o;return t}var ee=class{color;size;visited;x;y;bright;name;grid;planets;ships;constructor(e){e||(e={c:L(Le),s:y(5,9),p:!1,v:!1}),this.color=e.c,this.size=e.s,this.visited=e.v,this.x=this.y=this.size/2,this.bright=!1,this.name=this.color,this.ships=[],this.size%2==0&&(this.bright=!0,this.name="bright "+this.name),this.grid=Oe(this,this.size),e.p||(e.p=xe(this.size)),this.planets=e.p.map(r=>new Q(...r));for(var t of this.planets)t.neighbours=O(this.planets.filter(r=>r!=t&&!this.pathCollides(r,t))),this.grid[Math.floor(t.x)][Math.floor(t.y)]=t;this.setRatios()}pathCollides(e,t){if(me(e,t,this,.5))return!0;for(var r of this.planets)if(r!=e&&r!=t&&me(e,t,r,.2))return!0;return!1}computeRareResources(e){e===void 0&&(e=this.planets);let t=e.map(i=>i.sells),r=Object.values(S).filter(i=>i instanceof x&&!t.includes(i)),n=e.filter(i=>i.buys===null).map(i=>i.sells);return{exotic:r,abundant:n}}setRatios(){let e=this.computeRareResources();for(let t of this.planets)t.buys===null?t.ratio=2:e.abundant.includes(t.buys)?t.ratio=1:e.exotic.includes(t.buys)?t.ratio=2:t.ratio=1.4}addRandomShips(e){this.ships=[];for(let t=0;t<this.planets.length;t++)for(let r=0;r<t;r++){if(this.planets[t].neighbours.indexOf(this.planets[r])<0)continue;let n=w.randomShip(15),s=Math.hypot(this.planets[t].x-this.planets[r].x,this.planets[t].y-this.planets[r].y)/.1;this.planets[t].dispatch(n,e-s),this.ships.push(n)}}save(){return{c:this.color,s:this.size,p:this.planets.map(e=>e.save()),v:this.visited}}};function l(o){let e=document.getElementById(o);if(!e)throw ReferenceError(`element ${o} not found`);return e}function qt(o){let e=l(o);if(!(e instanceof HTMLInputElement))throw ReferenceError(`element ${o} is not input`);return e}(location.hostname=="localhost"||location.hostname=="127.0.0.1")&&new EventSource("/esbuild").addEventListener("change",()=>location.reload());var te=d.randomShip(15);window.gs=p;p.star=new ee;p.star.addRandomShips(0);p.star.ships.push(te);p.playerShip=te;var g=new U,G=new Z;G.walker=g;p.walkManager=G;var Ce=l("myCanvas"),ve=Ce.getContext("2d");g.box=l("canvasBox");g.human=l("human");g.canvas=Ce;g.onEnter=Ge;p.walkCTX=ve;function Ae(){G.myShip=te,G.drawMyShip(ve),g.jumpTo(G.oneShipData.x0+1,G.oneShipData.y0+1),te.planTrip({x:p.star.planets[0].x-.1,y:p.star.planets[0].y},p.star.planets[0],-1),p.now=0,p.arrive()}Ae();window.onkeypress=o=>{switch(o.key){case"w":g.goUp();break;case"a":g.goLt();break;case"s":g.goDn();break;case"d":g.goRt();break}};function Ge(o){o&&(l("currentComponent").innerHTML=`#${o.typename} {display:block}`,o.cellName?l("componentLegend").innerText=`${o.cellName}: ${o.typename}`:l("componentLegend").innerText=`${o.typename}`,o.onEnter(p))}function se(o){l("status").innerText=o}})();
//# sourceMappingURL=space2d3-5-trading-stuff.js.map