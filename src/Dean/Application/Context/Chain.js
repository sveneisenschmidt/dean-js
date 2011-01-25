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
        _routeContext: null,

        /**
         *
         * @var Dean.ApplicationContext
         */
        _applicationContext: null,

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
         * @param Object routeContext
         * @param Object applicationContext
         * @return void
         */
        setRouteContext: function(routeContext, applicationContext)
        {
            var keys = Object.keys(routeContext);
                keys.filter(function(key) {
                    return !Object.keys(this).contains(key);
                }.bind(this));

            this._routeContext       = Object.subset(Object.clone(routeContext), keys);
            this._applicationContext = applicationContext;
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
                    var returned = fn.apply(this._routeContext, [this._content, this._last_content]);
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
            options = options || {};
            
            var cb   = Function.from(),
                next = this.next.bind(this);
            
            if(options.onSuccess) {
                cb   = options.onSuccess;
                options.onSuccess = function() {
                    cb();
                    next();
                }
            }
            
            this.wait();
            this.getContext().getApplication().getViewRenderer().load(resource, options, this);

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
         * @return Dean.ApplicationContext
         */
        getContext: function()
        {
            return this._applicationContext;
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
    
}(Dean));