

var app = new Dean.Application('#main', function() {

    this.around('#/about', function(callback, context) {
        var json = context.toJson({data: ["1","2","3"]});
        console.log(json);
        callback();
    });
    
    this.before(function() {
        this.clear();
    });

    this.get('#/', function() {
        new Element('div', {text: 'Startpage'}).inject(this.getElement());
    });
    
    this.get('#/article/:id', function() { 
        this.log(this.getParams());
    }, {id: 10});
    
    this.get('#/about', function() {

    });

    this.get('#/ola', function() {
        alert('ola!');
    });
    
    this.get('#/redirect', function() {
        this.redirect('#/about');
    });

    this.get(/#\/hello/g, function() {

    });
    
    this.get('#/forward', function() {
        this.forward('#/');
    });
    
    
    
    
    // examples
    
    /**
     *
     * Context chain
     */
    this.get('#/example/chain', function() {
        this.load('app/templates/chain.html')
            .then(function(html) {
                new Element('div', {html: html}).inject(this.getElement());
            });
    });
    
    /**
     * Templates with Mustache
     */
    this.use(Dean.Template.Mustache);
    this.get('#/example/template/mustache', function() {      
        var html = this.mustache('<h2>Mustache: You have a nice beard, {{name}}!</h2>', {name: 'Dude'});            
        new Element('div', {html: html}).inject(this.getElement());
    });  
    
    /**
     * Templates with Mooml
     */
    this.use(Dean.Template.Mooml);
    this.get('#/example/template/mooml', function() {      
        var html = this.mooml(function(data) {
            h2('Mooml: Remember the Milk, ' + data.name + '!');
        }, {name: 'Dude'});     
        
        html.inject(this.getElement());
    });  
    
    
    this.use(Dean.Logger.Firebug);
    this.get('#/example/logger/firebug', function() {      
        this.log('Show me in Firebug :)');
    });   
    

    this.use(Dean.Service.YQL);
    this.use(Dean.Template.Mustache);
    this.get('#/example/service/yql', function() {
        this.yql('SELECT id, name, url from music.artist.similar WHERE id="306489" LIMIT 5', function(response) {
 
            var tpl  = "<h3>Artists simliar to Alexisonfire (pulled with YQL)</h3>" +
                       "<ul> {{#Artist}}<li>" +
                       "<a href=\"{{url}}\">{{name}}</a>" + 
                       "</li>{{/Artist}} </ul>";
                
            var html = this.mustache(tpl, response.query.results);
            new Element('div', {html: html}).inject(this.getElement());   

        }.bind(this));
    });
    
});

window.addEvent('domready', function() {
    try {
        app.run();
    } catch (e) {
        throw new Error(e);
    }
});








