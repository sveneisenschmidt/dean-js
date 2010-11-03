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
 * @category Route
 * @package Dean
 *
 * @license MIT-Style License
 * @author Sven Eisenschmidt <sven.eisenschmidt@gmail.com>
 * @copyright 2010, Sven Eisenschmidt
 * @link www.unsicherheitsagent.de
 *
 */

Dean.namespace('Dean.RouterRoute');

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
Dean.RouterRoute = new Class({
    
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
        var base   = base || '';
        var match  = base + search;

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
        var base   = base || '';
        var match  = base + search;
        var params = this._params || {};

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
        var params = params || {};
        this._params = Object.merge(this._params, params);
    }
});