(function(a){a.Dean={version:"0.1",ns:function(){var b=arguments,g=null,e,c,f;for(e=0;e<b.length;e=e+1){f=(""+b[e]).split(".");g=Dean;for(c=(f[0]=="Dean")?1:0;c<f.length;c=c+1){g[f[c]]=g[f[c]]||{};g=g[f[c]]}}return g}}}(window));(function(a){a.ns("Dean.Application");a.Application=new Class({Implements:[Events],_router:null,_request:null,_loggerProxy:null,_helper:{},_befores:[],_afters:[],_requires:[],_required:[],_arounds:[],_options:{},_defaultOptions:{throw_errors:true,base:"#/"},_tmp:{formbinds:[]},_defaultPlugin:function(){this.use([a.Plugin.Title,a.Plugin.Request]);this.helper({forward:function(b){this.getApplication().run(b)},redirect:function(b){window.location.hash=b},clear:function(b){var c;if(typeOf(b)=="string"){c=$$(b).shift()}else{if(typeOf(b)=="element"||typeOf(b)=="elements"){c=b}else{c=this.getApplication().getElement()}}c.empty()},fromJson:function(){return JSON.decode.apply(JSON,arguments)},toJson:function(){return JSON.encode.apply(JSON,arguments)},log:function(){var b=this.getApplication().getLoggerProxy();return b.log.apply(b,arguments)}});this.options({},true)},_element:"body:first",initialize:function(){var b=Array.clone(arguments);this.use(this._defaultPlugin);if(typeOf(b[0])=="string"){this._element=b[0];b.shift()}if(b.length>0){Array.each(arguments,function(c){this.use(c)},this)}},run:function(){var b=this._run.pass(arguments,this);Array.each(this._requires,function(d,c){if(!this._required.contains(d)){b=Asset.javascript.pass([d,{events:{load:b}}],Asset);this._required.push(d)}}.bind(this));b.call()},_run:function(d,g,j,i){var i=i||{},j=j||"get",g=g||this._options.base,f=this.getRequest(),c=this.getRouter(),d=d||f.getRequestUrl(),b=null;this.fireEvent("run");this._initElement();if(String.contains(d,g)){d=d.replace(g,"")}b=c.getRoute(j,d,g);try{if(null==b){this.error("Not found!",404)}else{b.setParams(i);if(!this._executeHooks(b,this._befores)){this._executeArounds(b,b.execute.pass([d,g],b));this._executeHooks(b,this._afters)}}}catch(h){this.error(h)}window.addEvent("dean-form-rebind",this.initForms.bind(this));this.initForms()},initForms:function(){this._initForms.delay(100,this)},_initForms:function(){var b=this.getElements('form input[type="submit"]'),c=this._postSubmit.bind(this);this._tmp.formbinds.push({name:"click",func:c});Array.each(this._tmp.formbinds,function(d){b.removeEvent(d.name,d.func)});b.addEvent("click",c)},_postSubmit:function(c){c.preventDefault();var e=this._options.base,b=c.target.getParent("form"),g=(b.getProperty("method")||"POST").toLowerCase(),f=(b.getProperty("action")||"").replace(this._options.base,""),d=this._toPairs(b);if(f.trim()==""){f=this.getRequest().getRequestUrl()}this.run(f,e,g,d)},_executeArounds:function(b,d){var c=new a.ApplicationContext(this),e=d;if(this._arounds.length<1){e.call();return}Array.each(this._arounds.reverse(),function(g){if(this._isExecutable(b,g.options)){var f=e;e=function(){return g.fn.apply(d,[f,c.getBase()])}}}.bind(this));e.apply([c.getBase()])}.protect(),_executeHooks:function(c,b){var d=false;Array.each(b,function(e){if(d===false&&!this._executeHook(c,e.options,e.fn)){d=true}}.bind(this));return d}.protect(),_executeHook:function(c,d,f){if(this._isExecutable(c,d)){var e=new a.ApplicationContext(this);var b=e.execute(f,{});return !(typeOf(b)=="boolean"&&b===false)}return true}.protect(),_isExecutable:function(b,d){if(Object.getLength(d)==0){return true}else{if("only" in d||"exclude" in d){if(("only" in d&&d.only.path&&d.only.path.length>0)||("exclude" in d&&d.exclude.path&&d.exclude.path.length>0)){var e=function(g){if("only" in g){return g.only}return g.exclude}(d),f=e.path,c=false;if(typeOf(f)=="string"||typeOf(f)=="regexp"){f=[f]}Array.each(f,function(g){if(typeOf(g)!="string"&&typeOf(g)!="regexp"){this.error("only string or regex paths are currently supported!")}if(typeOf(g)=="regexp"){this.getRequest().getRequestUrl().match(g)?c=true:null}else{b.match(g)?c=true:null}}.bind(this));if("exclude" in d){c=!c}return c}}}return false}.protect(),_initElement:function(){var b=this._element;if(typeOf(b)!=="elements"&&typeOf(b)!=="element"){b=$$(this._element).shift()}this._element=b}.protect(),getElement:function(b){if(typeOf(b)!=="string"){return this._element}return this._element.getElement.apply(null,arguments)},getElements:function(b){return this._element.getElements.apply(null,arguments)},use:function(b){if(typeOf(b)=="array"){Array.each(b,this.use.bind(this));return this}if(typeOf(b)=="function"){var c=(Array.clone(arguments)).shift(),d=new a.ApplicationContext(this);b.implement(d);b.apply(d,c)}return this},getRouter:function(){if(null===this._router){this._router=new a.Router()}return this._router},addRoute:function(f,d,c,e,b){return this.getRouter().addRoute.apply(this.getRouter(),arguments)},addBefore:function(b,c){this.addHook(this._befores,b,c)},addAfter:function(b,c){this.addHook(this._afters,b,c)},addAround:function(b,c){this.addHook(this._arounds,b,c)},addHook:function(d,b,c){if(typeOf(b)=="function"){c=b;b={}}if(typeOf(b)=="string"||typeOf(b)=="regexp"){b={only:{path:[b]}}}else{if(typeOf(b)=="array"){b={only:{path:b}}}}if(b.only&&typeOf(b.only.path)!="array"){b.only.path=[b.only.path]}if(b.exclude&&typeOf(b.exclude.path)!="array"){b.exclude.path=[b.exclude.path]}d.push({fn:c,options:b})},getRequest:function(){if(null===this._request){this._request=new a.RequestHash(this.run.bind(this),this._options.base)}return this._request},addHelper:function(d,e){var b=[],c=new a.ApplicationHelper(this);if(typeOf(d)=="object"){Object.each(d,function(g,f){b.push(this.addHelper(f,g))}.bind(this));return b}Object.append(e,c);return this._helper[d]=e.bind(c)},getHelper:function(b){if(false===this.hasHelper(b)){return null}return this._helper[b]},getHelpers:function(){return this._helper},hasHelper:function(b){return(typeOf(this._helper[b])=="function")},runHelper:function(b,d){if(false===this.hasHelper(b)){return null}var d=d||{},c=this.getHelper(b);return c.apply(null,[d])},addLogger:function(){return this.getLoggerProxy().addLogger.apply(this.getLoggerProxy(),arguments)},removeLogger:function(){return this.getLoggerProxy().removeLogger.apply(this.getLoggerProxy(),arguments)},getLoggerProxy:function(){if(null===this._loggerProxy){this._loggerProxy=new a.LoggerProxy()}return this._loggerProxy},setOptions:function(c,b){if(typeOf(c)=="boolean"){b=c;c=this._defaultOptions}b=b||false;c=c||{};if(b){this._options=this._defaultOptions}this._options=Object.merge(this._options,c);return this},throwErrors:function(){return this._options.throw_errors},error:function(d,c,b){c=c||500;if(this.throwErrors()){if(typeOf(d)=="object"){throw d}else{throw new Error(c+": "+d)}}else{this.getLoggerProxy().log(c,d)}},require:function(b){b=b||[];if(typeOf(b)=="string"){b=Array.from(b)}if(typeOf(b)!="array"){return}Array.each(b,function(c){if(!this._requires.contains(c)){this._requires.push(c)}}.bind(this))},_toPairs:function(c){var b={},d={};c.getElements("input, select, textarea",true).each(function(e){if(!e.name||e.disabled||e.type=="submit"||e.type=="reset"||e.type=="file"){return}var f=(e.tagName.toLowerCase()=="select")?Element.getSelected(e).map(function(g){return g.value}):((e.type=="radio"||e.type=="checkbox")&&!e.checked)?null:e.value;$splat(f).each(function(g){if(typeof g!="undefined"){b[e.name]=g}})});Object.each(b,function(g,f){var h={};if(f.test(/\[(.*)\]/)){f=f.replace(/\[/g,".").replace(/\]/g,"");var e="${part}";Array.each(f.split("."),function(i){e=e.replace("${part}","{"+i+": ${part}}")});e=e.replace("${part}",JSON.encode(g));h=JSON.decode(e)}else{h[f]=g}d=Object.merge(d,h)});return d}})}(Dean));(function(a){a.ns("Dean.ApplicationContext");a.ApplicationContext=new Class({_application:null,initialize:function(b){this._application=b},route:function(e,d,b,c){this.getApplication().addRoute(e,d,b,c,this)},helper:function(b,c){return this.register(b,this.getApplication().addHelper(b,c))},require:function(b){this.getApplication().require.apply(this.getApplication(),arguments);return this},logger:function(b,c){return this.getApplication().addLogger(b,c)},option:function(c,d){var b={};b[c]=d;return this.options(b)},options:function(c,b){return this.getApplication().setOptions.apply(this.getApplication(),arguments)},register:function(b,c){return this[b]=c},before:function(){return this.getApplication().addBefore.apply(this.getApplication(),arguments)},after:function(){return this.getApplication().addAfter.apply(this.getApplication(),arguments)},around:function(){return this.getApplication().addAround.apply(this.getApplication(),arguments)},execute:function(c,b){if(!typeOf(c)=="function"){throw Error("Callback is no valid function!")}return c.apply(this.getBase(b),Array.from(this.getArguments()))},getBase:function(d){d=d||{};var c=this.getApplication(),b=Object.append({getHelper:c.getHelper.bind(c),runHelper:c.runHelper.bind(c),getElement:c.getElement.bind(c),getElements:c.getElements.bind(c),getParams:function(){return d||{}},$chain:new a.ApplicationContextChain(this)},c.getHelpers());b.$chain.setRouteContext(b);Object.append(b,{then:b.$chain.then.bind(b.$chain),next:b.$chain.next.bind(b.$chain),load:b.$chain.load.bind(b.$chain),wait:b.$chain.wait.bind(b.$chain)});return b},getApplication:function(){return this._application},addEvent:function(){return this.getApplication().addEvent.apply(this.getApplication(),arguments)},use:function(){this.getApplication().use.apply(this.getApplication(),arguments)},getArguments:function(){return[]},get:function(c,b,d){return this._applyRoute("get",arguments)},put:function(c,b,d){throw new Error("put not yet implemented")},post:function(c,b,d){return this._applyRoute("post",arguments)},del:function(c,b,d){throw new Error("del not yet implemented")},_applyRoute:function(c,b){var b=Array.clone(b);b.unshift(c);return this.route.apply(this,b)}.protect()})}(Dean));(function(a){a.ns("Dean.ApplicationContextChain");a.ApplicationContextChain=new Class({_wait:false,_queue:[],_context:null,_last_content:"",_content:"",setRouteContext:function(b){var c=Object.keys(b);c.filter(function(d){return !Object.keys(this).contains(d)}.bind(this));this._context=Object.subset(Object.clone(b),c)},then:function(b){if(this.isWaiting()){this._queue.push(b)}else{this.wait();setTimeout(function(){var c=b.apply(this._context,[this._content,this._last_content]);if(c!==false){this.next(c)}}.bind(this),25)}return this},next:function(b){this._wait=false;if(typeof b!=="undefined"){this._last_content=this.content;this._content=b}if(this._queue.length>0){this.then(this._queue.shift(),this._queue.length)}},load:function(e,c){c=c||{};if(typeOf(e)!="string"){throw new Error("resource is no string!")}this.wait();var d=this.next.bind(this),b=c.onComplete||Function.from();new Request(Object.append(c,{url:e,async:true,method:"get",onSuccess:d,onComplete:function(){b.pass(arguments).call();window.fireEvent("dean-form-rebind")}})).send();return this},isWaiting:function(){return this._wait},wait:function(){this._wait=true}})}(Dean));(function(a){a.ns("Dean.ApplicationHelper");a.ApplicationHelper=new Class({_application:null,initialize:function(b){this._application=b},getApplication:function(){return this._application}})}(Dean));Element.Events.hashchange={onAdd:function(){var b=window.location.hash;var a=function(){if(window.location.hash!=b){b=window.location.hash;this.fireEvent("hashchange")}};a.periodical(100,this)}};(function(a){a.ns("Dean.Logger.Firebug");a.Logger.Firebug=function(){try{this.logger("firebug",function(){console.log.pass(arguments).call()});this.helper("firebugClear",console.clear)}catch(b){}}}(Dean));(function(a){a.ns("Dean.LoggerProxy");a.LoggerProxy=new Class({_logger:{},log:function(){var b=Array.clone(arguments);Object.each(this._logger,function(c){c.apply(c,b)})},addLogger:function(b,c){if(typeOf(c)!="function"){throw new Error("param is no function!")}this._logger[b]=c;return c}})}(Dean));(function(a){a.ns("Dean.Plugin.FlashMessage");a.Plugin.FlashMessage=function(c,d){this.require("https://github.com/arieh/Mootools-Storage/raw/1.2.1a/Source/LocalStorage.js");if(typeOf(c)=="function"){d=c;delete (c)}c=c||window.location.host;d=d||Function.from();var b=function(){return new LocalStorage({name:c,duration:3600})};this.helper("flash",function(f){var e=b().get("flash.messages")||[];e.push(f);b().set("flash.messages",e);return});this.before(function(){var e=b().get("flash.messages")||false;if(typeOf(e)!="array"||(typeOf(e)=="array"&&e.length<1)){b().set("flash.messages",[]);return}d.apply(null,[e]);b().set("flash.messages",[]);return})}}(Dean));(function(a){a.ns("Dean.Plugin.Request");a.Plugin.Request=function(){this.helper("request",function(d,c){var b=Dean.Plugin.Request.methods;if(typeOf(d)=="object"){c=d;delete d}d=d||"get";c=c||{};if(d in b){return b[d].pass([c])}throw new Error("Unsupported request method: "+d)})};a.Plugin.Request.methods={get:function(b){new Request(Object.merge({method:"get"},b))},post:function(b){new Request(Object.merge({method:"post"},b))}}}(Dean));Dean.Plugin.Request.JSONP=function(){Dean.Plugin.Request.methods=Object.merge(Dean.Plugin.Request.methods,{jsonp:function(a){new Request.JSONP(a)}})}(function(a){a.ns("Dean.Plugin.Title");a.Plugin.Title=function(){this.helper("title",function(b){var c=function(d){if(typeOf(d)=="string"){document.title=d}};if(arguments.length<1){return{set:c,append:function(d){c.apply(null,[document.title+d])},clear:function(){document.title=""}}}c.apply(null,[b])})}}(Dean));(function(a){a.ns("Dean.RequestAbstract");a.RequestAbstract=new Class({Implements:[Events],_requestUrl:null,_protocol:null,_host:null,_fullPath:null,_fullUrl:null,_requestParams:{},initialize:function(){},setRequestUrl:function(b){this._requestUrl=b},setHost:function(b){this._host=b},setProtocol:function(b){this._protocol=b},setFullPath:function(b){this._fullPath=b},setFullUrl:function(b){this._fullUrl=b},setQuery:function(b){this._requestParams=b},getRequestUrl:function(){return this._requestUrl},getHost:function(){return this._host},getProtocol:function(){return this._protocol},getFullPath:function(b){return this._fullPath},getFullUrl:function(b){return this._fullUrl},getAllParams:function(){return this._requestParams},setParams:function(b){this._requestParams=b}})}(Dean));(function(a){a.ns("Dean.RequestHash");a.RequestHash=new Class({Implements:[Dean.RequestAbstract],_requestData:null,_base:"",initialize:function(b,c){this._base=c||this._base;if(!window.location.hash){window.location.hash=this._base}this.setRequestData(window.location);window.addEvent("hashchange",function(){this.setRequestData(window.location);this.fireEvent("changed")}.bind(this));this.removeEvents().addEvent("changed",b)},getRequestUrl:function(){return this._base+this._requestUrl},_processData:function(){this.setRequestUrl(this.getHash());this.setProtocol(this._requestData.protocol.replace(":",""));this.setHost(this._requestData.host);this.setFullPath(this.getProtocol()+"://"+this.getHost()+this._requestData.pathname);this.setFullUrl(this._requestData.href);if(this._requestData.search||this._requestData.search!=""){this.setQuery(this._requestData.search.toString().parseQueryString())}}.protect(),getHash:function(){var b=this._requestData.hash.replace(this._base,"");if(b.substr(-1)=="/"){b=b.substr(0,b.length-1)}return b},setRequestData:function(b){this._requestData=b;this._processData()}})}(Dean));(function(a){a.ns("Dean.Router");a.Router=new Class({_routes:{get:[],post:[],put:[],del:[]},addRoute:function(g,e,d,f,c){if(this._routes[g]==undefined){throw new Error('Mode "'+g+'" is not supported!')}var b=new a.RouterRoute(g,e,d,f,c);this._routes[g].push(b);return b},getRoutes:function(b){if(b==undefined){return this._routes}if(this._routes[b]==undefined){return null}return this._routes[b]},getRoute:function(e,b,c){var d=null;e=e||"get";c=c||"";this.getRoutes(e).each(function(f){if(f.match(b,c)==true&&d==null){d=f;f._context._fn=f._fn}});return d}})}(Dean));(function(a){a.ns("Dean.RouterRoute");a.RouterRoute=new Class({_context:null,_mode:"get",_hash:"",_params:{},_fn:Function.from,initialize:function(f,d,c,e,b){this._mode=f||"get",this._hash=d||"",this._params=e||{},this._fn=c,this._context=b},getCallback:function(){return this._fn},getContext:function(){return this._context},match:function(c,d){var b=null;d=d||"";b=d+c;if(typeOf(this._hash)=="regexp"){return b.test(this._hash)}else{if(this._hash==b){return true}else{if(this._isParametrised()){return b.test(new RegExp("^"+this._getRegexString()+"$"))}}}return false},_isParametrised:function(){return String.contains(this._hash,":")}.protect(),execute:function(d,g){g=g||"";var c=g+d,h=this._params||{};if(typeOf(this._hash)!=="regexp"){var f=new RegExp("^"+this._getRegexString()+"$");var b=c.match(f);b.shift();var e=this._hash.match(new RegExp(/:([a-zA-Z0-9_-]+)/g))||[];if(e.length>0){Array.each(e,function(j,i){e[i]=j.replace(":","")});h=Object.merge(h,b.associate(e))}}this.getContext().execute(this.getCallback(),h)},_getRegexString:function(){var b=this._hash.replace(/:[a-zA-Z0-9_-]+/g,"([a-zA-Z0-9_-]+)");b=b.replace(/[/]+/g,"\\/");return b},setParams:function(b){this._params=Object.merge(this._params,b||{})}})}(Dean));(function(a){a.ns("Dean.Service.YQL");a.Service.YQL=function(){this.require("https://github.com/fate/mootools-yql/raw/0.1c/request.yql-min-yc.js");this.helper("yql",function(d,c,b){new Request.YQL(d,c,b).send()})}}(Dean));(function(a){a.ns("Dean.Template.Mooml");a.Template.Mooml=function(){this.require("https://github.com/eneko/mooml/raw/1.3.0/Source/mooml.js");this.helper("mooml",function(b,d,e){var e=e||{};if(typeOf(b)=="function"){e=d||{};d=b;b="default"}if(typeOf(d)=="function"||typeOf(d)=="array"){Mooml.register(b,d)}if(typeOf(d)=="object"){e=d;delete (d)}var c=Mooml.render(b,e);return c})}}(Dean));(function(a){a.ns("Dean.Template.Mustache");a.Template.Mustache=function(){this.require("https://github.com/janl/mustache.js/raw/0.3.0/mustache.js");this.helper("mustache",function(e,b,c,d){return Mustache.to_html(e,b,c,d)})}}(Dean));