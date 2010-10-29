var Dean={version:"0.1",namespace:function(){var b=arguments,g=null,e,c,f;for(e=0;e<b.length;e=e+1){f=(""+b[e]).split(".");g=Dean;for(c=(f[0]=="Dean")?1:0;c<f.length;c=c+1){g[f[c]]=g[f[c]]||{};g=g[f[c]]}}return g}};Dean.namespace("Dean.Application");Dean.Application=new Class({Implements:[Events],_router:null,_request:null,_loggerProxy:null,_helper:{},_befores:[],_afters:[],_arounds:[],_defaultPlugin:function(){this.helper({forward:function(a){this.getApplication().run(a)},redirect:function(a){window.location.hash=a},clear:function(a){var b;if(typeOf(a)=="string"){b=$$(a).shift()}else{if(typeOf(a)=="element"||typeOf(a)=="elements"){b=a}else{b=this.getApplication().getElement()}}b.empty()},fromJson:function(){return JSON.decode.apply(JSON,arguments)},toJson:function(){return JSON.encode.apply(JSON,arguments)},log:function(){var a=this.getApplication().getLoggerProxy();return a.log.apply(a,arguments)}})},_element:"body:first",initialize:function(){var a=Array.clone(arguments);if(typeOf(a[0])=="string"){this._element=a[0];a.shift()}if(a.length>0){Array.each(arguments,function(b){this.use(b)},this)}this.use(this._defaultPlugin)},run:function(c,e){this.fireEvent("run");this._initElement();var e=e||"#/";var d=this.getRequest();var b=this.getRouter();var c=c||d.getRequestUrl();if(String.contains(c,e)){c=c.replace(e,"")}var a=b.getRoute(c,e);if(null==a){throw Error(404)}if(!this._executeHooks(a,this._befores)){this._executeArounds(a,a.execute.pass([c,e],a));this._executeHooks(a,this._afters)}},_executeArounds:function(a,c){var b=new Dean.ApplicationContext(this);var d=c;if(this._arounds.length<1){d.call();return}Array.each(this._arounds.reverse(),function(f){if(this._isExecutable(a,f.options)){var e=d;d=function(){return f.fn.apply(c,[e,b.getBase()])}}}.bind(this));d.apply([b.getBase()])}.protect(),_executeHooks:function(b,a){var c=false;Array.each(a,function(d){if(c===false&&!this._executeHook(b,d.options,d.fn)){c=true}}.bind(this));return c}.protect(),_executeHook:function(b,c,e){if(this._isExecutable(b,c)){var d=new Dean.ApplicationContext(this);var a=d.execute(e,{});return !(typeOf(a)=="boolean"&&a===false)}return true}.protect(),_isExecutable:function(a,c){if(Object.getLength(c)==0){return true}else{if(c.only){if(c.only.path&&c.only.path.length>0){var d=c.only.path;var b=false;Array.each(d,function(e){if(typeOf(e)!="string"){throw new Error("only string paths are currently supported!")}a.match(e)?b=true:null});return b}}}return false}.protect(),_initElement:function(){var a=this._element;if(typeOf(a)!=="elements"&&typeOf(a)!=="element"){a=$$(this._element).shift()}this._element=a}.protect(),getElement:function(a){if(typeOf(a)!=="string"){return this._element}return this._element.getElement.apply(null,arguments)},getElements:function(a){return this._element.getElements.apply(null,arguments)},use:function(a){if(typeOf(a)=="function"){var b=Array.clone(arguments);b.shift();var c=new Dean.ApplicationContext(this);a.implement(c);a.apply(c,b)}},getRouter:function(){if(null===this._router){this._router=new Dean.Router()}return this._router},addRoute:function(e,c,b,d,a){return this.getRouter().addRoute.apply(this.getRouter(),arguments)},addBefore:function(a,b){this.addHook(this._befores,a,b)},addAfter:function(a,b){this.addHook(this._afters,a,b)},addAround:function(a,b){this.addHook(this._arounds,a,b)},addHook:function(c,a,b){if(typeOf(a)=="function"){b=a;a={}}if(typeOf(a)=="string"){a={only:{path:[a]}}}else{if(typeOf(a)=="array"){a={only:{path:a}}}}if(a.only&&typeOf(a.only.path)!="array"){a.only.path=[a.only.path]}c.push({fn:b,options:a})},getRequest:function(){if(null===this._request){this._request=new Dean.RequestHash(this.run.bind(this))}return this._request},addHelper:function(c,d){if(typeOf(c)=="object"){var a=[];Object.each(c,function(f,e){a.push(this.addHelper(e,f))}.bind(this));return a}var b=new Dean.ApplicationHelper(this);Object.append(d,b);return this._helper[c]=d.bind(b)},getHelper:function(a){if(false===this.hasHelper(a)){return null}return this._helper[a]},getHelpers:function(){return this._helper},hasHelper:function(a){return(typeOf(this._helper[a])=="function")},runHelper:function(a,c){if(false===this.hasHelper(a)){return null}var c=c||{};var b=this.getHelper(a);return b.apply(null,[c])},addLogger:function(){return this.getLoggerProxy().addLogger.apply(this.getLoggerProxy(),arguments)},removeLogger:function(){return this.getLoggerProxy().removeLogger.apply(this.getLoggerProxy(),arguments)},getLoggerProxy:function(){if(null===this._loggerProxy){this._loggerProxy=new Dean.LoggerProxy()}return this._loggerProxy}});Dean.namespace("Dean.ApplicationContext");Dean.ApplicationContext=new Class({_application:null,initialize:function(a){this._application=a},route:function(d,c,a,b){this.getApplication().addRoute(d,c,a,b,this)},helper:function(a,b){return this.register(a,this.getApplication().addHelper(a,b))},logger:function(a,b){return this.getApplication().addLogger(a,b)},option:function(b,c){var a={};a[b]=c;return this.options(a)},options:function(){return this.getApplication().setOptions.pass(arguments).call()},register:function(a,b){return this[a]=b},before:function(){return this.getApplication().addBefore.apply(this.getApplication(),arguments)},after:function(){return this.getApplication().addAfter.apply(this.getApplication(),arguments)},around:function(){return this.getApplication().addAround.apply(this.getApplication(),arguments)},execute:function(b,a){if(!typeOf(b)=="function"){throw Error("Callback is no valid function!")}return b.apply(this.getBase(a),Array.from(this.getArguments()))},getBase:function(c){var c=c||{};var b=this.getApplication();var a=Object.append({getHelper:b.getHelper.bind(b),runHelper:b.runHelper.bind(b),getElement:b.getElement.bind(b),getElements:b.getElements.bind(b),getParams:function(){return c||{}},$chain:new Dean.ApplicationContextChain(this)},b.getHelpers());a.$chain.setRouteContext(a);Object.append(a,{then:a.$chain.then.bind(a.$chain),next:a.$chain.next.bind(a.$chain),load:a.$chain.load.bind(a.$chain),wait:a.$chain.wait.bind(a.$chain)});return a},getApplication:function(){return this._application},addEvent:function(){return this.getApplication().addEvent.apply(this.getApplication(),arguments)},use:function(){this.getApplication().use.apply(this.getApplication(),arguments)},getArguments:function(){return[]},get:function(b,a,c){return this._applyRoute("get",arguments)},put:function(b,a,c){throw new Error("put not yet implemented")},post:function(b,a,c){throw new Error("post not yet implemented")},del:function(b,a,c){throw new Error("del not yet implemented")},_applyRoute:function(b,a){var a=Array.clone(a);a.unshift(b);return this.route.apply(this,a)}.protect()});Dean.namespace("Dean.ApplicationContextChain");Dean.ApplicationContextChain=new Class({_wait:false,_queue:[],_context:null,_last_content:"",_content:"",setRouteContext:function(a){var b=Object.keys(a);b.filter(function(c){return !Object.keys(this).contains(c)}.bind(this));this._context=Object.subset(Object.clone(a),b)},then:function(a){if(this.isWaiting()){this._queue.push(a)}else{this.wait();setTimeout(function(){var b=a.apply(this._context,[this._content,this._last_content]);if(b!==false){this.next(b)}}.bind(this),25)}return this},next:function(a){this._wait=false;if(typeof a!=="undefined"){this._last_content=this.content;this._content=a}if(this._queue.length>0){this.then(this._queue.shift())}},load:function(c,a){if(typeOf(c)!="string"){throw new Error("resource is no string!")}this.wait();var a=a||{};var b=new Request(Object.append(a,{url:c,async:true,method:"get",onSuccess:this.next.bind(this)})).send();return this},isWaiting:function(){return this._wait},wait:function(){this._wait=true}});Dean.namespace("Dean.ApplicationHelper");Dean.ApplicationHelper=new Class({_application:null,initialize:function(a){this._application=a},getApplication:function(){return this._application}});Element.Events.hashchange={onAdd:function(){var b=window.location.hash;var a=function(){if(window.location.hash!=b){b=window.location.hash;this.fireEvent("hashchange")}};a.periodical(100,this)}};Dean.namespace("Dean.Logger.Firebug");Dean.Logger.Firebug=function(){try{this.logger("firebug",function(){console.log.pass(arguments).call()});this.helper("firebugClear",console.clear)}catch(a){}};Dean.namespace("Dean.LoggerProxy");Dean.LoggerProxy=new Class({_logger:{},log:function(){var a=Array.clone(arguments);Object.each(this._logger,function(b){b.apply(b,a)})},addLogger:function(a,b){if(typeOf(b)!="function"){throw new Error("param is no function!")}this._logger[a]=b;return b}});Dean.namespace("Dean.RequestAbstract");Dean.RequestAbstract=new Class({Implements:[Events],_requestUrl:null,_protocol:null,_host:null,_fullPath:null,_fullUrl:null,_requestParams:{},initialize:function(){},setRequestUrl:function(a){this._requestUrl=a},setHost:function(a){this._host=a},setProtocol:function(a){this._protocol=a},setFullPath:function(a){this._fullPath=a},setFullUrl:function(a){this._fullUrl=a},setQuery:function(a){this._requestParams=a},getRequestUrl:function(){return this._requestUrl},getHost:function(){return this._host},getProtocol:function(){return this._protocol},getFullPath:function(a){return this._fullPath},getFullUrl:function(a){return this._fullUrl},getAllParams:function(){return this._requestParams},setParams:function(a){this._requestParams=a}});Dean.namespace("Dean.RequestHash");Dean.RequestHash=new Class({Implements:[Dean.RequestAbstract],_requestData:null,initialize:function(a){if(!window.location.hash){window.location.hash="#/"}this.setRequestData(window.location);window.addEvent("hashchange",function(){this.setRequestData(window.location);this.fireEvent("changed")}.bind(this));this.removeEvents().addEvent("changed",a)},_processData:function(){this.setRequestUrl(this.getHash());this.setProtocol(this._requestData.protocol.replace(":",""));this.setHost(this._requestData.host);this.setFullPath(this.getProtocol()+"://"+this.getHost()+this._requestData.pathname);this.setFullUrl(this._requestData.href);if(this._requestData.search||this._requestData.search!=""){this.setQuery(this._requestData.search.toString().parseQueryString())}}.protect(),getHash:function(){var a=this._requestData.hash.replace("#/","").replace("#","");if(a.substr(-1)=="/"){a=a.substr(0,a.length-1)}return a},setRequestData:function(a){this._requestData=a;this._processData()}});Dean.namespace("Dean.Router");Dean.Router=new Class({_routes:[],addRoute:function(f,d,c,e,b){var a=new Dean.RouterRoute(f,d,c,e,b);this._routes.push(a);return a},getRoutes:function(){return this._routes},getRoute:function(a,b){var b=b||"";var c=null;this.getRoutes().each(function(d){if(d.match(a,b)==true&&c==null){c=d;d._context._fn=d._fn}});return c}});Dean.namespace("Dean.RouterRoute");Dean.RouterRoute=new Class({_context:null,_mode:"get",_hash:"",_params:{},_fn:Function.from,initialize:function(e,c,b,d,a){this._mode=e||"get",this._hash=c||"",this._params=d,this._fn=b,this._context=a},getCallback:function(){return this._fn},getContext:function(){return this._context},match:function(b,c){var c=c||"";var a=c+b;if(typeOf(this._hash)=="regexp"){return a.test(this._hash)}else{if(this._hash==a){return true}else{if(this._isParametrised()){return a.test(new RegExp("^"+this._getRegexString()+"$"))}}}return false},_isParametrised:function(){return String.contains(this._hash,":")}.protect(),execute:function(c,f){var f=f||"";var b=f+c;var g=this._params||{};if(typeOf(this._hash)!=="regexp"){var e=new RegExp("^"+this._getRegexString()+"$");var a=b.match(e);a.shift();var d=this._hash.match(new RegExp(/:([a-zA-Z0-9_-]+)/g))||[];if(d.length>0){Array.each(d,function(i,h){d[h]=i.replace(":","")});g=Object.merge(g,a.associate(d))}}this.getContext().execute(this.getCallback(),g)},_getRegexString:function(){var a=this._hash.replace(/:[a-zA-Z0-9_-]+/g,"([a-zA-Z0-9_-]+)");a=a.replace(/[/]+/g,"\\/");return a}});Dean.namespace("Dean.Service.YQL");Dean.Service.YQL=function(){this.helper("yql",function(a,c,e,b){var e=e||"json",d=b||false;if(typeOf(c)=="function"){c={onComplete:c}}new Request.JSONP(Object.append({url:"http://query.yahooapis.com/v1/public/yql",data:{q:a,diagnostics:d,format:e}},c)).send()})};Dean.namespace("Dean.Template.Mooml");Dean.Template.Mooml=function(){this.helper("mooml",function(a,c,d){var d=d||{};if(typeOf(a)=="function"){d=c||{};c=a;a="default"}if(typeOf(c)=="function"||typeOf(c)=="array"){Mooml.register(a,c)}if(typeOf(c)=="object"){d=c;delete (c)}var b=Mooml.render(a,d);return b})};Dean.namespace("Dean.Template.Mustache");Dean.Template.Mustache=function(){this.helper("mustache",Mustache.to_html)};Dean.namespace("Dean.Template.Mooml");Dean.Template.Pure=function(){this.helper("pure",function(b,c){var a=new Element("div",{html:b});a=a.getChildren();a.append(document.body);console.log(a)})};