

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
    this.use(Dean.Template.Mustache);
    this.get('#/example/template/mustache', function() {      
        var html = this.mustache('<h2>Mustache: You have a nice beard, {{name}}!</h2>', {name: 'Dude'});            
        new Element('div', {html: html}).inject(this.getElement());
    });  
    
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
        this.yql('SELECT * FROM flickr.photos.search WHERE text="cat" LIMIT 5', function(response) {
            
            var html = '<h2>Images from Flickt with text `cat`</h2>';  
            
            Array.each(response.query.results.photo, function(photo) {
                var img   = '<img width="100" height="100" src="http://farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}.jpg" title="{{title}}"/>';
                    html += this.mustache(img, photo);
            }.bind(this));      
            
            new Element('div', {html: html}).inject(this.getElement());  
        }.bind(this));
    });
    
});

window.addEvent('domready', function() {
    try {
        app.run();
    } catch (e) {
        app.log(e);
    }
});








