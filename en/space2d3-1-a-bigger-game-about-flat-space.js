(()=>{var p=class{static id;get mytype(){return this.constructor}get typename(){return this.mytype.id}toJSON(){return{type:this.typename}}static fromJSON(t,r){return new t}};function d(e){let t=w[e.type];return t.fromJSON(t,e)}var w={};function f(e,t){w[t]=e,e.id=t}var T=class extends p{},m=class extends T{},A=class extends m{};f(A,"Rocket");var J=class extends m{};f(J,"Fuel");var S=class extends p{},v=class extends S{},l=class extends v{};f(l,"Ballast");var k=class e extends v{original="";toJSON(){return{type:this.typename,original:this.original}}static fromJSON(t,r){let o=new e;return o.original=r.original,o}};f(k,"Debris");var g=class extends S{},x=class e extends g{cargo=[];toJSON(){return{type:this.typename,cargo:this.cargo.map(t=>t.toJSON())}}static fromJSON(t,r){let o=new e;return o.cargo=r.cargo.map(s=>d(s)),o}};f(x,"CargoBay");function O(e,t){return e>t&&([e,t]=[t,e]),Math.floor(Math.random()*(t-e+1))+e}function j(e){return e[Math.floor(Math.random()*e.length)]}var c=class e{isAlien=!1;rows=[];offsets=[];toJSON(){return{isAlien:this.isAlien,offsets:this.offsets,rows:this.rows.map(t=>t.map(r=>r.toJSON()))}}static fromJSON(t){let r=new e;return r.isAlien=t.isAlien,r.offsets=t.offsets,r.rows=t.rows.map(o=>o.map(s=>d(s))),r}get gridSize(){if(!this.isAlien){let t=0,r=0;for(let o=0;o<this.rows.length;o++)t=Math.max(t,this.rows[o].length-this.offsets[o]),r=Math.max(r,this.offsets[o]);return{x0:0,x1:this.rows.length,y0:t,y1:r}}}rowToXY(t,r){return this.isAlien?{x:0,y:0}:r>=this.offsets[t]?{x:t,y:1+(r-this.offsets[t])}:{x:t,y:r-this.offsets[t]}}get passage(){return this.isAlien?{x:0,y:0,w:0,h:0}:{x:0,y:0,w:this.rows.length,h:1}}static randomShip(t){let o=Object.values(w).filter(i=>i.prototype instanceof g),s=Object.values(w).filter(i=>i.prototype instanceof m),a=new e;a.rows=[[],[],[],[]],a.offsets=[0,0,0,0];for(let i=0;i<t;i++){let y=O(0,3),C=j(o),N=new C;if(N instanceof x){let _=O(0,4);for(let E=0;E<_;E++){let z=j(s);N.cargo.push(new z)}}a.rows[y].push(N)}for(let i=0;i<a.rows.length;i++)a.offsets[i]=O(0,a.rows[i].length);return a.balanceBallast(),a}balanceBallast(){if(!this.isAlien){let r=this.rows.length-1;for(var t=0;t<=r;t++)for(;this.offsets[t]<this.offsets[r-t];)this.rows[t].unshift(new l),this.offsets[t]++;for(var t=0;t<=r;t++)for(;this.rows[t].length<this.rows[r-t].length;)this.rows[t].push(new l);for(var t=0;t<=r;t++)for(;this.rows[t][0]instanceof l&&this.rows[r-t][0]instanceof l;)this.rows[t].shift(),this.rows[r-t].shift(),this.offsets[t]--,this.offsets[r-t]++;for(var t=0;t<=r;t++)for(;this.rows[t].at(-1)instanceof l&&this.rows[r-t].at(-1)instanceof l;)this.rows[t].pop(),this.rows[r-t].pop()}}};var n=50,h=5;function D(e,t,r,o,s,a,i){o.isAlien?e.rect(t*n,r*n+h,n,n-2*h):e.rect(t*n+h,r*n,n-2*h,n),e.strokeStyle="white",e.fillStyle="white",e.stroke(),e.textBaseline="top",e.fillText(a,t*n+h,r*n),e.fillText(s.typename[0],t*n+h,r*n+16)}function I(e,t,r,o){let s=o.passage;e.rect((t+s.x)*n,(r+s.y)*n,s.w*n,s.h*n),e.strokeStyle="white",e.fillStyle="white",e.stroke(),e.textBaseline="top"}function R(e,t,r,o){for(let s=0;s<o.rows.length;s++)for(let a=0;a<o.rows[s].length;a++){let i=o.rows[s][a],y=o.rowToXY(s,a),C=String.fromCharCode(65+s)+y.y;D(e,t+y.x,r-y.y,o,i,C,a==o.offsets[s])}I(e,t,r,o)}function b(e){let t=document.getElementById(e);if(!t)throw ReferenceError(`element ${e} not found`);return t}function nt(e){let t=b(e);if(!(t instanceof HTMLInputElement))throw ReferenceError(`element ${e} is not input`);return t}(location.hostname=="localhost"||location.hostname=="127.0.0.1")&&new EventSource("/esbuild").addEventListener("change",()=>location.reload());var u=c.randomShip(15),M=b("myCanvas"),L=M.getContext("2d");function B(e){let t=e.gridSize;M.width=n*(t?.x0+t?.x1+2),M.height=n*(t?.y0+t?.y1+3),R(L,t?.x0+1,t?.y0+1,e)}function F(){u=c.randomShip(15),B(u)}function H(){localStorage.space2d3_1_ship=JSON.stringify(u.toJSON())}function P(){u=c.fromJSON(JSON.parse(localStorage.space2d3_1_ship)),B(u)}B(u);b("save").onclick=H;b("load").onclick=P;b("random").onclick=F;})();
//# sourceMappingURL=space2d3-1-a-bigger-game-about-flat-space.js.map