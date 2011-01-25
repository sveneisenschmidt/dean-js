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


