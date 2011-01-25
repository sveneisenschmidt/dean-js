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
    
}(Dean));