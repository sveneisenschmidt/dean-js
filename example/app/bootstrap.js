

var app = new Dean.Application('#main', function() {

    console.log(this);
//    this.options({
//        raise_errors: true
//    });

    this.around('#/about', function(callback, context) {
        var json = context.toJson({data: ["1","2","3"]});
        console.log(json);
        callback();
    });
    
    this.get('#/mustache', function() {      
        var html = this.mustache('<h2>You have a nice beard, {{name}}!</h2>', {name: 'Dude'});            
        new Element('div', {html: html}).inject(this.getElement());
    });   
    
    this.before(function() {
        this.clear();
    });
    
    this.before(['#/about', '#/mustache'], function() {

    });
    
    this.after(['#/about', '#/mustache'], function() {

    });

    this.get('#/', function() {
        new Element('div', {text: 'Startpage'}).inject(this.getElement());
    });
    
    this.get('#/article/:id', function() { 
        this.log(this.getParams());
    }, {id: 10});
    
    this.get('#/about', function() {

    });
    
    this.get('#/redirect', function() {
        this.redirect('#/about');
    });

    this.get(/#\/hello/g, function() {

    });
    
    this.get('#/forward', function() {
        this.forward('#/');
    });
    
    this.use(Dean.Template.Mustache);
    this.use(Dean.Logger.Firebug);



    this.use(Dean.Service.YQL);
    this.get('#/yql', function() {
        this.yql('SELECT * FROM flickr.photos.search WHERE text="cat"', function(response) {
            this.log(response.query.results.photo);
            this.log('look at my wonderful kitten pictures');
        }.bind(this));
    });
    
});

window.addEvent('domready', function() {
    try {
        app.run();
    } catch (e) {
        console.log(e);
    }
});








