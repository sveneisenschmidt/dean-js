/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(w) {
    
    /**
     * Dean
     *
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    
    w.Dean = {

        /**
         *
         * @var String
         */
        version: '0.1',

        /**
         *
         * @return Object
         */
        ns: function() {
            var a=arguments, o=null, i, j, d;
            for (i=0; i<a.length; i=i+1) {
                d=(""+a[i]).split(".");
                o=Dean;
                for (j=(d[0] == "Dean") ? 1 : 0; j<d.length; j=j+1) {
                    o[d[j]]=o[d[j]] || {};
                    o=o[d[j]];
                }
            }
            return o;
        }
    }
    
}(window));


/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Application
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Application');

    /**
     * Application
     *
     * @category Application
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Application = new Class({

        Implements: [Events],

        /**
         *
         * @var Dean.Router
         */
        _router: null,

        /**
         *
         * @var Dean.RequestHash
         */
        _request: null,

        /**
         *
         * @var Dean.LoggerProxy
         */
        _loggerProxy: null,

        /**
         *
         * @var Object
         */
        _helper: {},

        /**
         *
         * @var Array
         */
        _befores: [],

        /**
         *
         * @var Array
         */
        _afters: [],

        /**
         *
         * @var Array
         */
        _requires: [],

        /**
         *
         * @var Array
         */
        _required: [],

        /**
         *
         * @var Array
         */
        _arounds: [],

        /**
         *
         * @var Object
         */
        _options: {},

        /**
         *
         * @var Object
         */
        _defaultOptions: {

            /**
             *
             * @var Boolean
             */
            throw_errors: true,

            /**
             *
             * @var Boolean
             */
            base: '#/'
        },

        /**
         *
         * @var Object
         */
        _tmp: {

            /**
             *
             * @var Array
             */
            formbinds: []
        },

        /**
         *
         * @var Function
         */
        _defaultPlugin: function() {

            this.use([
                d.Plugin.Title,
                d.Plugin.Request
            ]);

            // default helpers
            this.helper({

                /**
                 *
                 * @param String route
                 * @return void
                 */
                forward: function(route) {
                    this.getApplication().run(route);
                },            

                /**
                 *
                 * @param String route
                 * @return void
                 */
                redirect: function(route) {
                    window.location.hash = route;
                },

                /**
                 *
                 * @param String selector
                 * @return void
                 */
                clear: function(selector)
                {
                    var $element;

                    if(typeOf(selector) == 'string') {
                        $element = $$(selector).shift();
                    } else                
                    if(typeOf(selector) == 'element'  ||
                       typeOf(selector) == 'elements' 
                    ) {
                        $element = selector;
                    } else {
                        $element = this.getApplication().getElement();
                    }

                    $element.empty();
                },

                /**
                 *
                 * @param String string
                 * @param Boolean secure
                 * @return Object
                 */
                fromJson: function()
                {
                    return JSON.decode.apply(JSON, arguments);
                },

                /**
                 *
                 * @param String string
                 * @param Boolean secure
                 * @return Object
                 */
                toJson: function()
                {
                    return JSON.encode.apply(JSON, arguments);
                },

                /**
                 *
                 * @return void
                 */
                log: function()
                {
                    var logger = this.getApplication().getLoggerProxy();
                    return logger.log.apply(logger, arguments);
                }
            });

            this.options({}, true);
        },

        /**
         *
         * @var Object
         */
        _element: 'body:first',

        /**
         *
         * @return void
         */
        initialize: function()
        {
            var args  = Array.clone(arguments);
            this.use(this._defaultPlugin);

            if(typeOf(args[0]) == 'string') {
                this._element = args[0];
                args.shift();
            }

            if (args.length > 0) {
                Array.each(arguments, function(arg) {
                    this.use(arg);
                }, this);
            }
        },

        /**
         *
         * @return void
         */
        run: function()
        {
            var fn = this._run.pass(arguments, this);      

            Array.each(this._requires, function(path, index) {
                if(!this._required.contains(path)) {
                    fn = Asset.javascript.pass([path, {
                        events: {
                            load: fn
                        }    
                    }], Asset);
                    this._required.push(path);
                }
            }.bind(this));

            fn.call();
        },

        _run: function(url, base, mode, params)
        {
            var params  = params || {},
                mode    = mode   || 'get',
                base    = base || this._options.base,
                request = this.getRequest(),
                router  = this.getRouter(),
                url     = url || request.getRequestUrl(),
                route   = null;

            this.fireEvent('run');
            this._initElement();

            if(String.contains(url, base)) {
                url = url.replace(base, '');
            }

            route = router.getRoute(mode, url, base);

            try {
                if(null == route) {
                    this.error('Not found!', 404);
                } else {
                    route.setParams(params);
                    if(!this._executeHooks(route, this._befores)) {
                        this._executeArounds(route, route.execute.pass([url, base], route));
                        this._executeHooks(route, this._afters);
                    }
                }
            } catch (e) {
                this.error(e);
            }

            window.addEvent('dean-form-rebind', this.initForms.bind(this));
            this.initForms();
        },

        /**
         *
         * @return void
         */
        initForms: function()
        {
            this._initForms.delay(100, this);
        },

        /**
         *
         * @return void
         */
        _initForms: function()
        {
            var els = this.getElements('form input[type="submit"]'),
                fn  = this._postSubmit.bind(this);
                      this._tmp.formbinds.push({name: 'click', func: fn});

            Array.each(this._tmp.formbinds, function(bind) {
                els.removeEvent(bind.name, bind.func)
            });

            els.addEvent('click', fn);
        },

        /**
         *
         * @return void
         */
        _postSubmit: function(event)
        {
            event.preventDefault();

            var base = this._options.base,
                form = event.target.getParent('form'),
                mode = (form.getProperty('method') || 'POST').toLowerCase(),
                hash = (form.getProperty('action') || '').replace(this._options.base, ''),
                data = this._toPairs(form);

            if(hash.trim() == '') {
                hash = this.getRequest().getRequestUrl();
            }
            
            this.run(hash, base, mode, data);
        },

        /**
         *
         * @param Function fn
         * @return void
         */
        _executeArounds: function(route, fn)
        {
            var context = new d.ApplicationContext(this),
                wrapper = fn;

            if(this._arounds.length < 1) {
                wrapper.call();
                return;
            }

            Array.each(this._arounds.reverse(), function(around) {
                if(this._isExecutable(route, around.options)) {
                    var last = wrapper;
                        wrapper = function() { 
                            return around.fn.apply(fn, [last, context.getBase()]); 
                        }; 
                }
            }.bind(this));

            wrapper.apply([context.getBase()]);
        }.protect(),

        /**
         *
         * @return void
         */
        _executeHooks: function(route, hooks)
        {
            var abort = false;
            Array.each(hooks, function(hook) {
                if(abort === false && !this._executeHook(route, hook.options, hook.fn)) {
                    abort = true;
                }
            }.bind(this));

            return abort;
        }.protect(),

        /**
         *
         * @return void
         */
        _executeHook: function(route, options, fn)
        {
            if(this._isExecutable(route, options)) {
                var context = new d.ApplicationContext(this);
                var result  = context.execute(fn, {});

                return !(typeOf(result) == 'boolean' && result === false);
            }

            return true;
        }.protect(),

        /**
         *
         * @param Dean.RouterRoute route
         * @param Object options
         * @return void
         */
        _isExecutable: function(route, options)
        {
            if(Object.getLength(options) == 0) {
                return true;
            } else 

            if('only' in options || 'exclude' in options) {
                if(('only' in options && options.only.path && options.only.path.length > 0) ||
                   ('exclude' in options && options.exclude.path && options.exclude.path.length > 0)
                ) {
                    var type  = function(obj) {
                        if('only' in obj) return obj.only;
                        return obj.exclude;
                    }(options),
                        paths = type.path,
                        match = false;

                        if(typeOf(paths) == 'string' || typeOf(paths) == 'regexp') {
                            paths = [paths];
                        }
                        
                    Array.each(paths, function(path) {
                        if(typeOf(path) != 'string' && typeOf(path) != 'regexp') {
                            this.error('only string or regex paths are currently supported!');
                        }

                        if(typeOf(path) == 'regexp') {
                            this.getRequest().getRequestUrl().match(path) ? match = true : null;
                        } else {
                            route.match(path) ? match = true : null;
                        }
                    }.bind(this));

                   if('exclude' in options) match = !match;
                   return match;
                }
            }

            return false;
        }.protect(),

        /**
         *
         * @return void
         */
        _initElement: function()
        {
            var $element = this._element;

            if(typeOf($element) !== 'elements' && 
               typeOf($element) !== 'element'
            ) {
               $element = $$(this._element).shift();
            } 

            this._element = $element;
        }.protect(),

        /**
         *
         * @return Element
         */
        getElement: function(selector)
        {
            if(typeOf(selector) !== 'string') {
                return this._element;
            }

            return this._element.getElement.apply(null, arguments);
        },

        /**
         *
         * @param String selector
         * @return Array of Element
         */
        getElements: function(selector)
        {
            return this._element.getElements.apply(null, arguments);
        },

        /**
         *
         * @param mixed 
         * @return Dean.Application
         */
        use: function(arg)
        {
            if(typeOf(arg) == 'array') {
                Array.each(arg, this.use.bind(this));
                return this;
            }        

            if(typeOf(arg) == 'function') {
                var args    = (Array.clone(arguments)).shift(),
                    context = new d.ApplicationContext(this);
                    
                    arg.implement(context);
                    arg.apply(context, args);
            }

            return this;
        },

        /**
         *
         * @param mixed
         * @return Dean.Router
         */
        getRouter: function()
        {
            if(null === this._router) {
                this._router = new d.Router();
            }

            return this._router;
        },

        /**
         *
         * @param mixed
         * @return Dean.Router
         */
        addRoute: function(mode, hash, fn, params, context)
        {
            return this.getRouter().addRoute.apply(this.getRouter(), arguments)
        },

        /**
         *
         * @param String|Object|RegEx|Function options
         * @param Function fn
         * @return Object
         */
        addBefore: function(options, fn)
        {
            this.addHook(this._befores, options, fn)
        },

        /**
         *
         * @param String|Object|RegEx|Function options
         * @param Function fn
         * @return Object
         */
        addAfter: function(options, fn)
        {
            this.addHook(this._afters, options, fn);
        },

        /**
         *
         * @param String|Object|RegEx|Function options
         * @param Function fn
         * @return Object
         */
        addAround: function(options, fn)
        {
            this.addHook(this._arounds, options, fn);
        },

        /**
         *
         * @param String|Object|RegEx|Function options
         * @param Function fn
         * @return Object
         */
        addHook: function(data, options, fn)
        {
            if(typeOf(options) == 'function') {
                fn = options;
                options = {};
            }

            if(typeOf(options) == 'string' || typeOf(options) == 'regexp') {
                options = {only: {path: [options]}};
            } else

            if(typeOf(options) == 'array') {
                options = {only: {path: options}};
            }

            if(options.only && typeOf(options.only.path) != 'array') {
                options.only.path = [options.only.path];
            }

            if(options.exclude && typeOf(options.exclude.path) != 'array') {
                options.exclude.path = [options.exclude.path];
            }

            data.push({
                fn: fn,
                options: options
            });
        },

        /**
         *
         * @return Dean.RequestHash
         */
        getRequest: function()
        {
            if(null === this._request) {
                this._request = new d.RequestHash(this.run.bind(this), this._options.base);
            }

            return this._request;
        },

        /**
         *
         * @param String|Object name
         * @param Function fn
         * @return void
         */
        addHelper: function(name, fn)
        {        
            var stack = [],
                helperContext = new d.ApplicationHelper(this);
           
            if(typeOf(name) == 'object') {
                Object.each(name, function(fnc, key) {
                    stack.push(this.addHelper(key, fnc));
                }.bind(this));  
                return stack;
            }        

            Object.append(fn, helperContext);

            return this._helper[name] = fn.bind(helperContext);
        },

        /**
         *
         * @param String name
         * @return Dean.ApplicationHelper|null
         */
        getHelper: function(name)
        {
            if(false === this.hasHelper(name)) {
                return null;
            }

            return this._helper[name];
        },

        /**
         *
         * @return Object
         */
        getHelpers: function()
        {
            return this._helper;
        },

        /**
         *
         * @param String name
         * @return Boolean
         */
        hasHelper: function(name)
        {
            return (typeOf(this._helper[name]) == 'function');
        },

        /**
         *
         * @param String name
         * @param Object params
         * @return void
         */
        runHelper: function(name, params)
        {
            if(false === this.hasHelper(name)) {
                return null;
            }

            var params = params || {},
                helper = this.getHelper(name);

            return helper.apply(null, [params]);        
        },

        /**
         *
         * @return Function
         */
        addLogger: function()
        {
            return this.getLoggerProxy().addLogger.apply(this.getLoggerProxy(), arguments);
        },

        /**
         *
         * @param String name
         * @return void
         */
        removeLogger: function()
        {
            return this.getLoggerProxy().removeLogger.apply(this.getLoggerProxy(), arguments);
        },

        /**
         *
         * @return Dean.LoggerProxy
         */
        getLoggerProxy: function()
        {
            if(null === this._loggerProxy) {
                this._loggerProxy = new d.LoggerProxy();
            }

            return this._loggerProxy;
        },

        /**
         *
         * @return Dean.Application
         */
        setOptions: function(data, flush)
        {
            if(typeOf(data) == 'boolean') {
                flush = data;
                data  = this._defaultOptions;
            }

           flush = flush || false;
           data  = data || {};

            if(flush) {
                this._options = this._defaultOptions;
            }

            this._options = Object.merge(this._options, data);
            return this;
        },

        /**
         *
         * @return Boolean
         */
        throwErrors: function()
        {
            return this._options.throw_errors;
        },

        /**
         *
         * @param String message
         * @param Integer code
         * @param Boolean rethrow
         * @return void
         */
        error: function(message, code, rethrow)
        {
            code = code || 500;

            if(this.throwErrors()) {
                if(typeOf(message) == 'object') {
                    throw message;
                } else {
                    throw new Error(code + ': ' + message);
                }
            } else {
                this.getLoggerProxy().log(code, message);
            }
        },

        /**
         *
         * @param String|Array paths
         * @return void
         */
        require: function(paths)
        {
            paths = paths || [];

            if(typeOf(paths) == 'string') {
                paths = Array.from(paths);
            }

            if(typeOf(paths) != 'array') {
                return;
            }

            Array.each(paths, function(path) {
                if(!this._requires.contains(path)) {
                    this._requires.push(path);
                }
            }.bind(this));
        },

        /**
         * From http://mootools.net/blog/2010/05/18/a-magical-journey-into-the-base-fx-class/
         *
         * @param Element Form
         * @return Object
         */
        _toPairs: function(form)
        {
            var json  = {},
                multi = {};

            form.getElements('input, select, textarea', true).each(function(el){
                if (!el.name || el.disabled || el.type == 'submit' || el.type == 'reset' || el.type == 'file') return;
                var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
                    return opt.value;
                }) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
                $splat(value).each(function(val){
                    if (typeof val != 'undefined') json[el.name] = val;
                });
            });

            Object.each(json, function(value, key) {
                var obj = {};
                if(key.test(/\[(.*)\]/)) {
                    key = key.replace(/\[/g, '.').replace(/\]/g, '');
                    var string = '${part}';
                    Array.each(key.split('.'), function(part) {
                        string = string.replace('${part}', '{' + part +  ': ${part}}');
                    });
                    string = string.replace('${part}', JSON.encode(value));
                    obj = JSON.decode(string);
                } else {
                    obj[key] = value;
                }
                multi = Object.merge(multi, obj);
            });

            return multi;
        }
    });
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Application
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.ApplicationContext');

    /**
     * Dean.ApplicationContext
     *
     * @category Application
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.ApplicationContext = new Class({

        /**
         *
         * @var Dean.Application
         */
        _application: null,

        /*
         *
         * @return void
         */
        initialize: function(application)
        {
            this._application = application;
        },

        /**
         * 
         * @param String mode
         * @param String hash
         * @param Function fn
         * @param Object params
         * @return void
         */
        route: function(mode, hash, fn, defaultParams)
        {        
            this.getApplication().addRoute(mode, hash, fn, defaultParams, this);
        },

        /**
         *
         * @param String name
         * @param Function fn
         * @return Object
         */
        helper: function(name, fn)
        {
            return this.register(name, this.getApplication().addHelper(name, fn));
        },

        /**
         *
         * @param String path
         * @return Object
         */
        require: function(path)
        {
            this.getApplication().require.apply(this.getApplication(), arguments);
            return this;
        },

        /**
         *
         * @param String name
         * @param Function fn
         * @return Object
         */
        logger: function(name, fn)
        {
            return this.getApplication().addLogger(name, fn);
        },

        /**
         *
         * @param String name
         * @param String|Array option
         * @return Object
         */
        option: function(name, option)
        {
            var options = {};
                options[name] = option;

            return this.options(options);
        },

        /**
         *
         * @param Object options
         * @return Object
         */
        options: function(poptions, flush)
        {
            return this.getApplication().setOptions.apply(this.getApplication(), arguments);
        },

        /**
         *
         * @param String name
         * @param Function fn
         * @return Object
         */
        register: function(name, fn)
        {
            return this[name] = fn;
        },

        /**
         *
         * @param String|Object|RegEx route
         * @param Function fn
         * @return Object
         */
        before: function()
        {
            return this.getApplication().addBefore.apply(this.getApplication(), arguments);
        },

        /**
         *
         * @param String|Object|RegEx route
         * @param Function fn
         * @return Object
         */
        after: function()
        {
            return this.getApplication().addAfter.apply(this.getApplication(), arguments);
        },

        /**
         *
         * @param String|Object|RegEx route
         * @param Function fn
         * @return Object
         */
        around: function()
        {
            return this.getApplication().addAround.apply(this.getApplication(), arguments);
        },

        /**
         *
         * @return void
         */
        execute: function(fn, routeParams)
        {

            if(!typeOf(fn) == 'function') {
                throw Error('Callback is no valid function!');
            }

            return fn.apply(this.getBase(routeParams), Array.from(this.getArguments()));
        },

        /**
         *
         * @return Object
         */    
        getBase: function(params)
        {
            params = params || {};
            
            var app  = this.getApplication(),
                base = Object.append({
                    getHelper:      app.getHelper.bind(app),
                    runHelper:      app.runHelper.bind(app),
                    getElement:     app.getElement.bind(app),
                    getElements:    app.getElements.bind(app),
                    getParams:      function() {return params || {};},
                    $chain:          new d.ApplicationContextChain(this)
                }, app.getHelpers());

            base.$chain.setRouteContext(base);
            Object.append(base, {
                then:  base.$chain.then.bind(base.$chain),
                next:  base.$chain.next.bind(base.$chain),
                load:  base.$chain.load.bind(base.$chain),
                wait:  base.$chain.wait.bind(base.$chain)
            });

            return base;        
        },

        /**
         *
         * @return Dean.Application
         */
        getApplication: function()
        {
            return this._application;
        },

        /**
         *
         * @return void
         */
        addEvent: function()
        {
            return this.getApplication().addEvent.apply(this.getApplication(), arguments);
        },

        /**
         *
         * @return void
         */
        use: function()
        {
            this.getApplication().use.apply(this.getApplication(), arguments);
        },

        /**
         *
         * @return Object
         */
        getArguments: function()
        {
            return [];
        },

        /**
         * 
         * @param String hash
         * @param Function fn
         * @param Object params
         * @return void
         */
        get: function(hash, fn, params)
        {
            return this._applyRoute('get', arguments);
        },

        /**
         * 
         * @param String hash
         * @param Function fn
         * @param Object params
         * @return void
         */
        put: function(hash, fn, params)
        {
            throw new Error('put not yet implemented');
        },

        /**
         * 
         * @param String hash
         * @param Function fn
         * @param Object params
         * @return void
         */
        post: function(hash, fn, params)
        {
            return this._applyRoute('post', arguments);
        },

        /**
         * 
         * @param String hash
         * @param Function fn
         * @param Object params
         * @return void
         */
        del: function(hash, fn, params)
        {
            throw new Error('del not yet implemented');
        },

        /**
         * 
         * @param String mode
         * @param Mode args
         * @return void
         */
        _applyRoute: function(mode, args)
        {
            var args = Array.clone(args);
                args.unshift(mode);

            return this.route.apply(this, args);
        }.protect()
    });
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Application
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.ApplicationContextChain');

    /**
     * Dean.ApplicationContextChain
     * 
     * Based on Sammy.js RenderContext <http://github.com/quirkey/sammy> 
     * Special thanks to Aaron Quint
     *
     * @category Application
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.ApplicationContextChain = new Class({

        /**
         *
         * @var Boolean
         */
        _wait: false,

        /**
         *
         * @var Array
         */
        _queue: [],

        /**
         *
         * @var Object
         */
        _context: null,

        /**
         *
         * @var Mixed
         */
        _last_content: '',

        /**
         *
         * @var Mixed
         */
        _content: '',

        /**
         *
         * @param Object context
         * @return void
         */
        setRouteContext: function(context)
        {
            var keys = Object.keys(context);
                keys.filter(function(key) {
                    return !Object.keys(this).contains(key);
                }.bind(this));

            this._context = Object.subset(Object.clone(context), keys);
        },

        /**
         *
         * @param Function fn
         * @return void
         */
        then: function(fn)
        {
            if(this.isWaiting()) {
                this._queue.push(fn);
            } else {
                this.wait();
                setTimeout(function() {
                    var returned = fn.apply(this._context, [this._content, this._last_content]);
                    if (returned !== false) {
                        this.next(returned);
                    }
                }.bind(this), 25);
            }
            return this;
        },

        /**
         *
         * @param String content
         * @return void
         */
        next: function(content)
        {
            this._wait = false;
            if (typeof content !== 'undefined') {
                this._last_content = this.content;
                this._content = content;
            }

            if (this._queue.length > 0) {
                this.then(this._queue.shift(), this._queue.length);
            }
        },

        /**
         *
         * @param String resource
         * @param Object options
         * @return string
         */
        load: function(resource, options)
        {
            options = options || {}
            
            if(typeOf(resource) != 'string') {
                throw new Error('resource is no string!');
            }
            
            this.wait();

            var fn       = this.next.bind(this),
                complete = options.onComplete || Function.from();

            new Request(Object.append(options, {
                url: resource,
                async: true,
                method: 'get',
                onSuccess: fn,
                onComplete: function() {
                    complete.pass(arguments).call();
                    window.fireEvent('dean-form-rebind');
                }
            })).send();

            return this;
        },

        /**
         * 
         * @return Boolean
         */
        isWaiting: function()
        {
            return this._wait;
        },

        /**
         * 
         * @return void
         */
        wait: function()
        {
            this._wait = true;
        }
    });
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Application
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */


(function(d) {
    
    d.ns('Dean.ApplicationHelper');

    /**
     * Dean.ApplicationHelper
     *
     * @category Application
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.ApplicationHelper = new Class({

        /**
         *
         * @var Dean.Application
         */
        _application: null,

        /*
         *
         * @return void
         */
        initialize: function(application)
        {
            this._application = application;
        },

        /**
         *
         * @return Dean.Application
         */
        getApplication: function()
        {
            return this._application;
        }

    });
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Browser
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

Element.Events.hashchange = {
    onAdd: function(){
        var _hash  = window.location.hash;
        var _timer = function() {
            if(window.location.hash != _hash) {
                _hash = window.location.hash;
                this.fireEvent('hashchange');
            }
        };
        _timer.periodical(100, this);
    }
};/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Logger
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Logger.Firebug');

    /**
     * Dean.Logger.Firebug
     *
     * @category Logger
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Logger.Firebug = function() {
        try {
            this.logger('firebug', function() {
                console.log.pass(arguments).call();
            });

            this.helper('firebugClear', console.clear);
        } catch(e) {}
    }

}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Logger
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.LoggerProxy');

    /**
     * Dean.LoggerProxy
     *
     * @category Logger
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.LoggerProxy = new Class({

        /**
         *
         * @var Object
         */
        _logger: {},

        /**
         *
         * @return void
         */
        log: function()
        {
            var args = Array.clone(arguments);
            Object.each(this._logger, function(logger) {
                logger.apply(logger, args);
            });
        },

        /**
         *
         * @param Function fn
         * @return void
         */
        addLogger: function(name, fn)
        {
            if(typeOf(fn) != 'function') {
                throw new Error('param is no function!');
            }

            this._logger[name] = fn;
            return fn;
        }
    });

}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Plugin
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Plugin.FlashMessage');

    /**
     * Dean.Plugin.FlashMessage
     *
     * @category Plugin
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Plugin.FlashMessage = function(namespace, callback) {    

        this.require('https://github.com/arieh/Mootools-Storage/raw/1.2.1a/Source/LocalStorage.js');

        if(typeOf(namespace) == 'function') {
            callback = namespace;
            delete(namespace);
        }

        namespace = namespace || window.location.host;
        callback  = callback || Function.from();
        
        var getStorage = function() {    
            return new LocalStorage({
                name: namespace,
                duration: 3600
            });
        }

        this.helper('flash', function(msg) {  
            var data = getStorage().get('flash.messages') || [];
                data.push(msg);
            getStorage().set('flash.messages', data);
            return;
        });


        this.before(function() {      
            var data = getStorage().get('flash.messages') || false;

            if(typeOf(data) != 'array' || (typeOf(data) == 'array' && data.length < 1)) {
                getStorage().set('flash.messages', []);
                return;
            }    

            callback.apply(null, [data]);        
            getStorage().set('flash.messages', []);
            return;
        });
    }

}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Plugin
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Plugin.Request');

    /**
     * Dean.Plugin.Request
     *
     * @category Plugin
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Plugin.Request = function() {   

        this.helper('request', function(method, options) { 

            var methods = Dean.Plugin.Request.methods; 

            if(typeOf(method) == 'object') {
                options = method;
                delete method;
            }    

            method  = method  || 'get';
            options = options || {};        

            if(method in methods) {
                return methods[method].pass([options]);
            }   

            throw new Error('Unsupported request method: ' + method);
        });
    }

    /**
     * Dean.Plugin.Request.methods
     *
     * @category Plugin
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Plugin.Request.methods = { 

        /**
         * 
         * @return Request
         */
        get: function(options) {
            new Request(Object.merge({method: 'get'}, options));
        },

        /**
         * 
         * @return Request
         */
        post: function(options) {
            new Request(Object.merge({method: 'post'}, options));
        }  
    }

}(Dean));


/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Plugin
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */


/**
 * Dean.Plugin.Request.JSONP
 *
 * @category Plugin
 * @package Dean
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @license MIT-Style License
 * @link www.unsicherheitsagent.de
 */
Dean.Plugin.Request.JSONP = function() {   
    
    Dean.Plugin.Request.methods = Object.merge(Dean.Plugin.Request.methods, {     
        /**
         * 
         * @return Request.JSONP
         */
        jsonp: function(options) {
            new Request.JSONP(options);
        }  
    });    
}/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Plugin
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Plugin.Title');
    
    /**
     * Dean.Plugin.FlashMessage
     *
     * @category Plugin
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Plugin.Title = function() {    


        this.helper('title', function(title) { 

            var set = function(text) {   
                if(typeOf(text) == 'string') {
                    document.title = text;
                }
            }

            if(arguments.length < 1) {
                return {
                    set: set, 
                    append: function(text) {
                        set.apply(null, [document.title + text]);
                    },    
                    clear: function() {
                        document.title = '';
                    }
                }
            }

            set.apply(null, [title]);
        });

    }

}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Application
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.RequestAbstract');
    
    /**
     * Dean.RequestAbstract
     *
     * @category Application
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.RequestAbstract = new Class({

        Implements: [Events],

        _requestUrl: null,

        _protocol: null,

        _host: null,

        _fullPath: null,

        _fullUrl: null,

        _requestParams: {},

        initialize: function() {},

        /**
         *
         * @param string url The Request url
         * @scope public
         * @return void
         */
        setRequestUrl: function(url)
        {
            this._requestUrl = url;
        },

        /**
         *
         * @param string url The Host url
         * @scope public
         * @return void
         */
        setHost: function(host)
        {
            this._host = host;
        },

        /**
         *
         * @param string url The Protocol Type
         * @scope public
         * @return void
         */
        setProtocol: function (protocol)
        {
            this._protocol = protocol;
        },

        /**
         *
         * @param string path The Full Path fo the Request
         * @scope public
         * @return void
         */
        setFullPath: function (path)
        {
            this._fullPath = path;
        },

        /**
         *
         * @param string path The Full Url fo the Request
         * @scope public
         * @return void
         */
        setFullUrl: function (url)
        {
            this._fullUrl = url;
        },

        /**
         *
         * @param string path The Full Url fo the Request
         * @scope public
         * @return void
         */
        setQuery: function (queryObj)
        {
            this._requestParams = queryObj;

        },

        /**
         *
         * @scope public
         * @return string
         */
        getRequestUrl: function()
        {
            return this._requestUrl;
        },

        /**
         *
         * @scope public
         * @return string
         */
        getHost: function()
        {
            return this._host;
        },

        /**
         *
         * @scope public
         * @return string
         */
        getProtocol: function ()
        {
            return this._protocol;
        },

        /**
         *
         * @scope public
         * @return string
         */
        getFullPath: function (path)
        {
            return this._fullPath;
        },

        /**
         *
         * @scope public
         * @return string
         */
        getFullUrl: function (url)
        {
            return  this._fullUrl;
        },

        /**
         *
         * @scope public
         * @return string
         */
        getAllParams: function()
        {
            return this._requestParams;
        },

        /**
         * Mvc_Request_Abstract::setParams
         *
         * @scope public
         * @return string
         */
        setParams: function(params)
        {
            this._requestParams = params;
        }
    });
    
}(Dean));


/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Application
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {

    d.ns('Dean.RequestHash');

    /**
     * Dean.RequestHash
     *
     * @category Application
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.RequestHash = new Class({

        Implements: [Dean.RequestAbstract],

        _requestData: null,

        _base: '',

        /**
         *
         * @param function fn
         * @scope public
         * @return void
         */
        initialize: function(fn, base)
        {
            this._base = base || this._base;

            if(!window.location.hash) window.location.hash = this._base;
            this.setRequestData(window.location);

            window.addEvent('hashchange', function() {
                this.setRequestData(window.location);
                this.fireEvent('changed');
            }.bind(this));

            this.removeEvents().addEvent('changed', fn);
        },

        /**
         *
         * @scope public
         * @return string
         */
        getRequestUrl: function()
        {
            return this._base + this._requestUrl;
        },

        /**
         *
         * @scope public
         * @return void
         */
        _processData: function()
        {
            this.setRequestUrl(this.getHash());
            this.setProtocol(this._requestData.protocol.replace(':', ''));
            this.setHost(this._requestData.host);
            this.setFullPath(
                this.getProtocol() + '://' + this.getHost() + this._requestData.pathname);

            this.setFullUrl(this._requestData.href);

            if(this._requestData.search || this._requestData.search != '') {
                this.setQuery(
                    this._requestData.search.toString().parseQueryString());
            }
        }.protect(),

        /**
         *
         * @scope public
         * @return String
         */
        getHash: function()
        {
            var hash = this._requestData.hash.replace(this._base, '');

            if(hash.substr(-1) == '/') {
                hash = hash.substr(0, hash.length -1)
            }

            return hash;
        },

        /**
         *
         * @param data Object The window location object
         * @scope public
         * @return void
         */
        setRequestData: function(data)
        {
            this._requestData = data;
            this._processData();
        }
    });

}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Router
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Router');

    /**
     * Application
     *
     * @category Router
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Router = new Class({

        /**
         *
         * @var Object
         */
        _routes: {
            get: [],
            post: [],
            put: [],
            del: []
        },

        /**
         *
         * @param String mode
         * @param String hash
         * @return Dean.RouterRoute
         */
        addRoute: function(mode, hash, fn, params, context)
        {
            if(this._routes[mode] == undefined) {
                throw new Error('Mode "'+ mode +'" is not supported!');
            }

            var route = new d.RouterRoute(mode, hash, fn, params, context);
            this._routes[mode].push(route);

            return route;
        },

        /**
         *
         * @return Array
         */
        getRoutes: function(mode)
        {
            if(mode == undefined) {
                return this._routes;
            }

            if(this._routes[mode] == undefined) {
                return null;
            }

            return this._routes[mode];
        },

        /**
         *
         * @return Dean.RouterRoute|null
         */
        getRoute: function(mode, search, base)
        {            
            var routeToReturn = null;
            
            mode = mode || 'get';
            base = base || '';

            this.getRoutes(mode).each(function(route) {
               if(route.match(search, base) == true && routeToReturn == null) {
                   routeToReturn = route;
                   route._context._fn = route._fn;
               }
            });

            return routeToReturn;
        }
    });
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Route
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.RouterRoute');

    /**
     * Application
     *
     * @category Route
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.RouterRoute = new Class({

        /**
         *
         * @var Dean.ApplicationContext
         */
        _context: null,

        /**
         *
         * @var String
         */
        _mode: 'get',

        /**
         *
         * @var String
         */
        _hash: '',

        /**
         *
         * @var Object
         */
        _params: {},

        /**
         *
         * @var Function
         */
        _fn: Function.from,

        /**
         *
         * @param String mode
         * @param String hash
         * @param Object params
         * @return void
         */
        initialize: function(mode, hash, fn, params, context)
        {
            this._mode      = mode || 'get',
            this._hash      = hash || '',
            this._params    = params || {},
            this._fn        = fn,
            this._context   = context;
        },

        /**
         *
         * @return Object
         */
        getCallback: function()
        {
            return this._fn;
        },

        /**
         *
         * @return Dean.ApplicationContext
         */
        getContext: function()
        {
            return this._context;
        },

        /**
         *
         * @param String search
         * @param String base
         * @return Boolean
         */
        match: function(search, base)
        {
            var match = null;
            
            base   = base || '';
            match  = base + search;

            if(typeOf(this._hash) == 'regexp') {
                return match.test(this._hash);
            } else

            if(this._hash == match) {
                return true;
            } else

            if(this._isParametrised()) {  
                return match.test(new RegExp('^' + this._getRegexString() + '$'));  
            }

            return false;
        },

        /**
         * 
         * @return Boolean
         */
        _isParametrised: function()
        {
            return String.contains(this._hash, ':');
        }.protect(),

        /**
         *
         * @param String search
         * @param String base
         * @return void
         */
        execute: function(search, base)
        {
            base   = base || '';
            
            var match  = base + search,
                params = this._params || {};

            if(typeOf(this._hash) !== 'regexp') {
                var regex = new RegExp('^' + this._getRegexString() + '$');
                var urlParams = match.match(regex);
                    urlParams.shift();

                var keys = this._hash.match(new RegExp(/:([a-zA-Z0-9_-]+)/g)) || [];

                if(keys.length > 0) {
                    Array.each(keys, function(key, index) {
                        keys[index] = key.replace(':', '');
                    });
                    params = Object.merge(params, urlParams.associate(keys));
                }
            }

            this.getContext().execute(this.getCallback(), params);
        },

        /**
         * 
         * @return String
         */
        _getRegexString: function()
        {
            var regex = this._hash.replace(/:[a-zA-Z0-9_-]+/g, "([a-zA-Z0-9_-]+)");
                regex = regex.replace(/[/]+/g, '\\/');

                return regex;
        },

        /**
         *
         * @param Object params
         * @return void
         */
        setParams: function(params)
        {
            this._params = Object.merge(this._params, params || {});
        }
    });

}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Service
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Service.YQL');

    /**
     * Dean.Service.YQL
     *
     * @category Logger
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Service.YQL = function() { 

        this.require('https://github.com/fate/mootools-yql/raw/0.1c/request.yql-min-yc.js');

        this.helper('yql', function(query, fn, options) {
            new Request.YQL(query, fn, options).send();
        });
    }
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Template
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Template.Mooml');

    /**
     * Dean.Template.Moooml
     *
     * @requires http://mootools.net/forge/p/mooml
     *
     * @category Template
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Template.Mooml = function() {

        this.require('https://github.com/eneko/mooml/raw/1.3.0/Source/mooml.js');

        this.helper('mooml', function(name, template, data) {

            var data = data || {};

            if(typeOf(name) == 'function') {
                data     = template || {};
                template = name;
                name     = 'default';
            }

            if (typeOf(template) == 'function' ||
                typeOf(template) == 'array' 
            ) {
                Mooml.register(name, template);
            }
            if (typeOf(template) == 'object') {
                data = template;
                delete(template);
            }

            var el = Mooml.render(name, data);
            return el;
        });
    }
    
}(Dean));/**
 *
 * Copyright (c) 2010, Sven Eisenschmidt.
 * All rights reserved.
 *
 * Redistribution with or without modification, are permitted.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @category Template
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

(function(d) {
    
    d.ns('Dean.Template.Mustache');

    /**
     * Dean.Template.Mustache
     *
     * @requires http://mustache.github.com/
     * 
     * @category Template
     * @package Dean
     * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
     * @copyright 2010, Sven Eisenschmidt
     * @license MIT-Style License
     * @link www.unsicherheitsagent.de
     */
    d.Template.Mustache = function() {

        this.require('https://github.com/janl/mustache.js/raw/0.3.0/mustache.js');

        this.helper('mustache', function(template, view, partials, fn) {
            return Mustache.to_html(template, view, partials, fn);
        }); 
    }
    
}(Dean));