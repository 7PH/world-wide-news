!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=THREE},function(e,t,n){"use strict";n.r(t);var o=n(0);class r extends o.PointLight{}class i{constructor(){throw new Error("Utility class, non instantiable")}static start(){const e=new o.WebGLRenderer,t=window.innerWidth,n=window.innerHeight;e.setSize(t,n);const i=t/n,a=new o.PerspectiveCamera(45,i,.1,1e4);a.position.set(0,0,-1e3);const s=new o.Scene;s.background=new o.Color(0),s.add(a),document.getElementById("animation").appendChild(e.domElement);const d=new o.Group;let c;s.add(d),(c=new o.Mesh(new o.SphereGeometry(4,50,50),new o.MeshBasicMaterial({color:8947848}))).position.y=200,d.add(c),(c=new o.Mesh(new o.SphereGeometry(4,50,50),new o.MeshBasicMaterial({color:8947848}))).position.y=-200,d.add(c),(c=new o.Mesh(new o.SphereGeometry(4,50,50),new o.MeshBasicMaterial({color:8947848}))).position.x=200,d.add(c);const l=new o.TextureLoader;let u=new o.SphereGeometry(6e3,64,64),p=new o.MeshBasicMaterial({side:o.BackSide}),w=new o.Mesh(u,p);l.load("textures/starfield.png",e=>{p.map=e,s.add(w)}),l.load("textures/earth.jpg",e=>{const t=new o.SphereGeometry(200,50,50),n=new o.MeshBasicMaterial({map:e}),r=new o.Mesh(t,n);d.add(r)});const f=new o.OrbitControls(a);f.update();const y=new r(16777215);y.position.x=10,y.position.y=50,y.position.z=400,s.add(y);let m=100,h=Date.now();!function t(){let n=Date.now();const o=.001*(n-h);m+=-.85*m*o,d.rotation.y+=m*o,w.rotation.y+=.004*o,f.update(),e.render(s,a),h=n,requestAnimationFrame(t)}()}}window.addEventListener("load",()=>{document.getElementById("page-intro").addEventListener("click",()=>(document.getElementById("page-intro").style.display="none",document.getElementById("page-content").classList.remove("hidden"),void i.start()))})}]);