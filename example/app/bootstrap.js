

var app = new Dean.Application('#main', function() {

    this.options({
        base: '#!/',
        throw_errors: true
    });

    this.around('#!/about', function(callback, context) {
        var json = context.toJson({data: ["1","2","3"]});
        console.log(json);
        callback();
    });

    this.before(function() {
        this.clear();
        this.title('Dean.js - Example App');
    });

    this.before(/#!\/hello/g, function() {
        this.log('before: Hello from regex!');
    });
    
    this.before({exclude: {path: '#!/'}}, function() {
        this.log('log everywhere except on route #!/');
    });

    this.get('#!/', function() {
        new Element('div', {text: 'Startpage'}).inject(this.getElement());
        
        this.title().append(' - Index');

        this.log(this);
    });
    
    this.get('#!/article/:id', function() {
        this.log(this.getParams());
    }, {id: 10});
    
    this.get('#!/about', function() {

    });
    
    this.get('#!/redirect', function() {
        this.redirect('#!/about');
    });

    this.get(/#!\/hello/g, function() {
        this.log('Hello from regex!');
    });
    
    this.get('#!/forward', function() {
        this.forward('#!/');
    });

    this.get('#!/example/form', function() {
        this.load('app/templates/form.html')
            .then(function(html) {
                new Element('div', {html: html}).inject(this.getElement());
            });
    });

    this.post('#!/example/form', function() {
        var params = this.getParams();
        var json   = this.toJson(params);

        new Element('h3', {text: 'Post data, formatted in Json for readability:'}).inject(this.getElement());
        new Element('div', {text: json}).inject(this.getElement());


    });
    
    // examples
    
    /**
     *
     * Context chain
     */
    this.get('#!/example/chain', function() {
        this.load('app/templates/chain.html')
            .then(function(html) {
                new Element('div', {html: html}).inject(this.getElement());
            });
    });
    
    /**
     * Templates with Mustache
     */
    this.use(Dean.Template.Mustache);
    this.get('#!/example/template/mustache', function() {
        var html = this.mustache('<h2>Mustache: You have a nice beard, {{name}}!</h2>', {name: 'Dude'});            
        new Element('div', {html: html}).inject(this.getElement());
    });  
    
    /**
     * Templates with Mooml
     */
    this.use(Dean.Template.Mooml);
    this.get('#!/example/template/mooml', function() {
        var html = this.mooml(function(data) {
            h2('Mooml: Remember the Milk, ' + data.name + '!');
        }, {name: 'Dude'});     
        
        html.inject(this.getElement());
    });  
    
    /**
     *  Firebug Logging
     */
    this.use(Dean.Logger.Firebug);
    this.get('#!/example/logger/firebug', function() {
        this.log('Show me in Firebug :)');
    });   
    
    /**
     *  YQL Request
     */
    this.use(Dean.Service.YQL);
    this.use(Dean.Template.Mustache);
    this.get('#!/example/service/yql', function() {
        this.yql('SELECT id, name, url from music.artist.similar WHERE id="306489" LIMIT 5', function(response) {
 
            var tpl  = "<h3>Artists simliar to Alexisonfire (pulled with YQL)</h3>" +
                       "<ul> {{#Artist}}<li>" +
                       "<a href=\"{{url}}\">{{name}}</a>" + 
                       "</li>{{/Artist}} </ul>";
                
            var html = this.mustache(tpl, response.query.results);
            new Element('div', {html: html}).inject(this.getElement());   

        }.bind(this));
    });
    
    /**
     *  Flash Message Plugin
     */
    this.use(Dean.Plugin.FlashMessage, '/example/main/app', function(messages) {        
        console.log(messages);        
    });
    this.get('#!/example/plugin/flash-messages', function() {
        new Element('div', {text: 'After next request, the flash message will appear in your console.'})
            .inject(this.getElement());
        this.flash('Hey! i\'m a flash message!');
    });
    
});

window.addEvent('domready', function() {
    app.run();
});






