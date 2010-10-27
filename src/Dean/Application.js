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

Dean.namespace('Dean.Application');

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
Dean.Application = new Class({

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
    _arounds: [],

    /**
     *
     * @var Function
     */
    _defaultPlugin: function() {
        
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
            }
        });
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
        
        if(typeOf(args[0]) == 'string') {
            this._element = args[0];
            args.shift();
        }
        
        if (args.length > 0) {
            Array.each(arguments, function(arg) {
                this.utilise(arg);
            }, this);
        }
        
        this.utilise(this._defaultPlugin);
    },

    /**
     *
     * @return void
     */
    run: function(url, base)
    {          
        this.fireEvent('run');
        this._initElement();
        
        var base    = base || '#/';
        var request = this.getRequest();        
        var router  = this.getRouter();

        var url = url || request.getRequestUrl();
        if(String.contains(url, base)) {
            url = url.replace(base, '');
        }
        
        var route   = router.getRoute(url, base);
        
        if(null == route) {
            throw Error(404);
        }

        this._executeHooks(route, this._befores);
        this._executeArounds(route.execute.pass([url, base],route));
        this._executeHooks(route, this._afters);
    },
   
    /**
     *
     * @param Function fn
     * @return void
     */
    _executeArounds: function(fn)
    {
        fn.call();
    }.protect(),

    /**
     *
     * @return void
     */
    _executeHooks: function(route, hooks)
    {
        Array.each(hooks, function(hook) {
            this._executeHook(route, hook.options, hook.fn);
        }.bind(this));
    }.protect(),

    /**
     *
     * @return void
     */
    _executeHook: function(route, options, fn)
    {
        var context = new Dean.ApplicationContext(this);

        if(Object.getLength(options) == 0) {
            context.execute(fn, {});
        } else 

        if(options.only) {
            if(options.only.path && options.only.path.length > 0) {
                var paths = options.only.path;
                var match = false;
                
                Array.each(paths, function(path) {
                    if(typeOf(path) != 'string') {
                        throw new Error('only string paths are currently supported!');
                    }
                    route.match(path) ? match = true : null;
                });
               
               if(true === match) {
                   context.execute(fn, {});
               }
            }
        }
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
     * @return void
     */
    utilise: function(arg)
    {
        if(typeOf(arg) == 'function') {
            var args = Array.clone(arguments);
                args.shift();                
            var context = new Dean.ApplicationContext(this);
                arg.implement(context);
                arg.apply(context, args);
        }
    },

    /**
     *
     * @param mixed
     * @return Dean.Router
     */
    getRouter: function()
    {
        if(null === this._router) {
            this._router = new Dean.Router();
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
    addHook: function(data, options, fn)
    {
        if(typeOf(options) == 'function') {
            fn = options;
            options = {};
        }

        if(typeOf(options) == 'string') {
            options = {only: {path: [options]}};
        } else

        if(typeOf(options) == 'array') {
            options = {only: {path: options}};
        }

        if(options.only && typeOf(options.only.path) != 'array') {
            options.only.path = [options.only.path];
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
            this._request = new Dean.RequestHash(this.run.bind(this));
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
        if(typeOf(name) == 'object') {
            var stack = [];
            Object.each(name, function(fnc, key) {
                stack.push(this.addHelper(key, fnc));
            }.bind(this));  
            return stack;
        }        
            
        var helperContext = new Dean.ApplicationHelper(this);
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
        
        var params = params || {};
        var helper = this.getHelper(name);
        
        return helper.apply(null, [params]);        
    }
});