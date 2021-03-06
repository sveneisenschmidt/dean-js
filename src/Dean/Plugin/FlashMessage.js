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

}(Dean));