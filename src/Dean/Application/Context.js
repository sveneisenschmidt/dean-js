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

Dean.namespace('Dean.ApplicationContext');

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
Dean.ApplicationContext = new Class({

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
        var params = params || {};
        var app   = this.getApplication();
        
        var base = Object.append({
            getHelper:      app.getHelper.bind(app),
            runHelper:      app.runHelper.bind(app),
            getElement:     app.getElement.bind(app),
            getElements:    app.getElements.bind(app),
            getParams:      function() {return params || {};},
            $chain:          new Dean.ApplicationContextChain(this)
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