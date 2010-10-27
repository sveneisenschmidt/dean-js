var mustachePlugin = function() {;

    this.helper('mustache', Mustache.to_html);
    
    this.get('#/mustache', function() {
        this.clear();        
        var html = this.mustache('<h2>You have a nice beard, {{name}}!</h2>', {name: 'Dude'});            
        new Element('div', {html: html}).inject(this.getElement());
    });    
}


var app = new Dean.Application('#main', function() {
    
    this.around('#/about', function(callback, context) {
        
        var json = context.toJson({data: ["1","2","3"]});
        console.log(json);
        
        callback();
    });
    
    this.before(['#/about', '#/mustache'], function() {
        console.log('before: ', this);
    });
    
    this.after(['#/about', '#/mustache'], function() {
        console.log('after: ', this);
    });

    this.get('#/', function() {
        this.clear();        
        new Element('div', {text: 'Startpage'}).inject(this.getElement()); 
    });
    
    this.get('#/article/:id', function() {  
        this.clear(); 
        console.log(this.getParams());
    }, {id: 10});
    
    this.get('#/about', function() {
        this.clear();
        console.log('about');
    });
    
    this.get('#/redirect', function() {
        this.redirect('#/about');
    });

    this.get(/#\/hello/g, function() {
        console.log('hello');
    });
    
    this.get('#/forward', function() {
        this.forward('#/');
    });
    this.utilise(mustachePlugin);
});

window.addEvent('domready', function() {
    try {
        app.run();
    } catch (e) {
        console.log(e);
    }
});








