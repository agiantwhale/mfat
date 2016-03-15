"use strict";$(document).ready(function(){var t=_.map(MFat.shortCodes,function(t,e){return{text:t.name,value:e}});t.push({text:"serving",value:"portion"});var e=_.map(MFat.shortCodes,function(t,e){return{text:"("+t.unit+") "+t.name,value:e}});e.push({text:"(g) serving",value:"portion"});var n=$("#meal").selectize({highlight:!1,openOnFocus:!0});n[0].selectize.setValue("LUNCH");var i=$("#location").selectize({highlight:!1,openOnFocus:!0}),r=$("#goal").selectize({highlight:!1,openOnFocus:!0,options:t,items:["portion"]}),a=$("#counterpart").selectize({highlight:!1,openOnFocus:!0,options:e,items:["kcal"]}),o=$("#repeats").selectize({highlight:!1,openOnFocus:!0}),u=$("#portion").html();$("#portion").blur(function(){u!==$(this).html()&&(u=$(this).html().replace(/\D/g,""),""===u&&(u="0"),$(this).html(u))}),$("#return-btn").click(function(){$("#query").removeClass("hidden"),$("#table").addClass("hidden")}),$("#plan-btn").click(function(){swal({title:"One second...",text:"Loading latest dining hall menu...",type:"info",allowEscapeKey:!1,showConfirmButton:!1});var t=n[0].selectize.getValue(),e=i[0].selectize.getValue(),s=r[0].selectize.getValue(),l=a[0].selectize.getValue(),c="yes"===o[0].selectize.getValue();return s===l?void swal({title:"Oops..",text:"You have to select two different nutritions!",type:"warning",confirmButtonText:"Alright..."}):void MFat.scrap(e).then(function(n){if(!_.isArray(n[t]))return void swal({title:"Oops..",text:"Seems like "+e+" isn't serving "+t.toLowerCase()+" today!",type:"error",confirmButtonText:"Alright..."});MFat.collection(n[t],l,s,c);var i=MFat.optimize(parseInt(u));if("portion"===l)$("#control-hd").html("Serving");else{var r=MFat.shortCodes[l].name;$("#control-hd").html(r[0].toUpperCase()+_.rest(r).join(""))}if("portion"===s)$("#response-hd").html("Serving");else{var a=MFat.shortCodes[s].name;$("#response-hd").html(a[0].toUpperCase()+_.rest(a).join(""))}var o=_.reduce(i.collection,function(t,e){return t+e[l]},0),m=_.reduce(i.collection,function(t,e){return t+e[s]},0),h=function(t,e){return"portion"!==e?"<td>"+t[e]+" "+MFat.shortCodes[e].unit+"</td>":"<td>"+t.serving+" ("+t.portion+" g)</td>"},p="";_.each(i.collection,function(t){p+="<tr>",p+="<td>"+t.name+"</td>",p+=h(t,l),p+=h(t,s)});var d=function(t,e){return"portion"===e?"<td>"+t+" g</td>":"<td>"+t+" "+MFat.shortCodes[e].unit+"</td>"};p+="<tr>",p+="<td>Total</td>",p+=d(o,l),p+=d(m,s),p+="</tr>",$("#table-body").html(p),$("#query").addClass("hidden"),$("#table").removeClass("hidden"),swal.close()}).fail(function(){swal({title:"Oops..",text:"There was an error retrieving the latest menu information. Give Jae a message!",type:"error",confirmButtonText:"Alright..."})})})}),this.MFat=function(t,e){var n=!1,i=[],r="",a="",o={},u=[],s=function(t,n){var a={};a[r]=t;var o=e.sortedIndex(i,a,r);return o<i.length&&i[o][r]===t&&o++,Math.min(o,n)},l=function(t,e){return 0>t?-1:t>=e?t*t+t+e:t+e*e},c=function(t,c){var m=s(t,c);if(0>=m||0>t)return o[l(t,c)]={collection:[],accumulator:0},!0;if(!e.isUndefined(o[l(t,m)]))return o[l(t,c)]=o[l(t,m)],!0;var h=o[l(t,m-1)];if(e.isUndefined(h))return u.push([t,m-1]),!1;var p=i[m-1],d=o[l(t-p[r],n?m:m-1)];return e.isUndefined(d)?(u.push([t-p[r],n?m:m-1]),!1):(d={collection:d.collection.slice(0),accumulator:d.accumulator},d.collection.push(p),d.accumulator+=p[a],d.accumulator>h.accumulator?o[l(t,c)]=d:o[l(t,c)]=h,!0)};return t.optimize=function(t){var n=s(t,i.length);for(u.push([t,n]);0!==u.length;)c.apply(null,e.last(u))&&(u=e.initial(u));return o[l(t,n)]},t.collection=function(t,s,l,c){o={},u=[],r=s,a=l,n=c,i=e.sortBy(t,r)},t}(this.MFat||{},_),this.MFat=function(t,e,n){var i={b1:{name:"vitamin B1",unit:"mg"},b12:{name:"vitamin B12",unit:"mcg"},b2:{name:"vitamin B2",unit:"mg"},b6:{name:"vitamin B6",unit:"mg"},ca:{name:"calcium",unit:"mg"},cho:{name:"carbohydrate",unit:"gm"},chol:{name:"cholesterol",unit:"mg"},fat:{name:"fat",unit:"gm"},fatrn:{name:"trans fat",unit:"gm"},fe:{name:"iron",unit:"gm"},kcal:{name:"calories",unit:"kcal"},mg:{name:"magnesium",unit:"mg"},na:{name:"sodium",unit:"mg"},pro:{name:"protein",unit:"gm"},sfa:{name:"saturated fat",unit:"gm"},sugar:{name:"sugar",unit:"gm"},tdfb:{name:"dietary fiber",unit:"gm"},vitc:{name:"vitamin C",unit:"mg"},vite:{name:"vitamin E",unit:"mg"},vtaiu:{name:"vitamin A",unit:"iu"},zn:{name:"zinc",unit:"mg"}},r=n.map(i,function(t,e){return e});t.shortCodes=i;var a=function(t){try{var e=t.name,i=parseInt(t.itemsize.portion_size),a=t.itemsize.serving_size,o={name:e,portion:i,serving:a};for(var u in r){var s=r[u],l=parseInt(t.itemsize.nutrition[s]);if(!n.isNumber(l)||n.isNaN(l))return null;o[s]=parseInt(t.itemsize.nutrition[s])}return o}catch(c){console.log(c)}return null},o=function(t){var n={};for(var i in t.menu.meal){var r=t.menu.meal[i],o=r.name,u=[];for(var s in r.course){var l=r.course[s],c=null,m=null;if(e.isArray(l.menuitem))for(var h in l.menuitem)c=l.menuitem[h],m=a(c),m&&u.push(m);else e.isPlainObject(l.menuitem)&&(c=l.menuitem,m=a(c),m&&u.push(m))}n[o]=u}for(var p in n)0===n[p].length&&delete n[p];return n};return t.scrap=function(t){var n=new e.Deferred,i="https://query.yahooapis.com/v1/public/yql",r="http://api.studentlife.umich.edu/menu/xml2print.php?controller=print&view=json&location="+encodeURI(t);return e.ajax({url:i,data:{q:'SELECT * FROM json WHERE url="'+r+'"',format:"json",jsonCompat:"new"},dataType:"jsonp",success:function(t){t=t.query.results.json;var e=o(t);n.resolve(e)},error:function(){n.reject()}}),n.promise()},t}(this.MFat||{},jQuery,_);