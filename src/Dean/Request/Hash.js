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

Dean.namespace('Dean.RequestHash');

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
Dean.RequestHash = new Class({

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