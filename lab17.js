//Kyle Vasconcellos
//CS355 Project 2

// Module dependencies                                                                                                                                  
var express    = require('express'),
    mysql      = require('mysql');
    ejs        = require('ejs');
    connect    = require('connect');

// Application initialization                                                                                                                              

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'kvasconcellos',
        password : '3475503'

    });

//var app = module.exports = express.createServer();                                                                                                       

var app = express()
app.set('subtitle', 'Lab 18');
app.set('view engine','ejs');
app.set('views', 'views');

// Database setup                                                                                                                                          

        connection.query('CREATE DATABASE IF NOT EXISTS kvasconcellos', function (err) {
            if (err) throw err;
            connection.query('USE kvasconcellos', function (err) {
                if (err) throw err;
                connection.query('CREATE TABLE IF NOT EXISTS Artists('
                    + 'id INT NOT NULL AUTO_INCREMENT,'
                    + 'PRIMARY KEY(id),'
                    + 'username VARCHAR(30),'
                    + 'password VARCHAR(30)'
                    +  ')', function (err) {
                        if (err) throw err;
                    });
            });
        });

// Configuration                                                                                                                                           

console.log(__dirname + '/views');

//app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));                                                             
app.use(connect.urlencoded());
app.use(connect.json());

// Main route sends our HTML file                                                                                                                          

//gets for various files needed to load different pages
app.get('/', function(req, res) {
    res.render('lab18');
});

app.get('/viewArtists', function(req,res) {
    res.render('viewArtists');
});

app.get('/enterArtists', function(req,res) {
    res.render('lab18Artists');
});

app.get('/enterLabel', function(req,res) {
    res.render('enterLabel');
});

app.get('/enterReleases', function(req, res) {
    res.render('enterReleases');
});

app.get('/enterMembers', function(req, res) {
    res.render('lab18Members');
});

app.get('/enterMultiple', function(req,res) {
    res.render('enterMultiple');
});

app.get('/about', function(req, res) {
    res.render('project2About');
});

app.get('/viewEditable', function(req, res) {
    res.render('viewEditable');
});

app.get('/edit', function(req,res) {
    res.render('edit');
});

app.get('/lab18', function(req,res) {
    console.log(__dirname);
    res.render('lab18');                                                                                                                            
});

//post to enter an artist into db
app.post('/enterArtists', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Artists (ArtistName,Genre,FormedIn,NumMembers) VALUES(?,?,?,?)', [req.body.ArtistName,req.body.Genre,req.body.FormedIn,req.body.NumMembers],
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Artists where ArtistName = ?', req.body.ArtistName,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Artist: ' + result[0].ArtistName + '<br />' +
                               'Genre: ' + result[0].Genre + '<br />' +
                               'Formed In: ' + result[0].FormedIn + '<br />' +
                               'Number of Members: ' + result[0].NumMembers
                      );
                    }
                    else
                      res.send('Artist was not inserted.');
                });
        }
    );
});

//edit an entry
app.post('/edit', function (req, res) {
    console.log(req.body);
    connection.query('UPDATE Releases SET Artist = ? WHERE  ReleaseName = ?', [req.body.Artist,req.body.ReleaseName],
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Releases where ReleaseName = ?', req.body.ReleaseName,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Release: ' + result[0].ReleaseName + '<br />' +
                               'Type: ' + result[0].ReleaseType + '<br />' +
                               'Year: ' + result[0].ReleaseYear + '<br />' +
                               'Artist: ' + result[0].Artist
                      );
                    }
                    else
                      res.send('Artist was not inserted.');
                });
        }
    );
});

//post to enter data into multiple tables. enter an artist and a release at the same time
app.post('/enterMultiple', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Artists (ArtistName,Genre,FormedIn,NumMembers) VALUES(?,?,?,?)', [req.body.ArtistName,req.body.Genre,req.body.FormedIn,req.body.NumMembers],
  function(err,result) {
  connection.query('INSERT INTO Releases (ReleaseName,ReleaseType,ReleaseYear,Artist) VALUES(?,?,?,?)', [req.body.ReleaseName,req.body.ReleaseType,req.body.ReleaseYear,req.body.ArtistName],
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Artists a JOIN Releases r on a.ArtistName = r.Artist where a.ArtistName = ? and r.ReleaseName = ?', [req.body.ArtistName,req.body.ReleaseName],
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Artist: ' + result[0].ArtistName + '<br />' +
                               'Genre: ' + result[0].Genre + '<br />' +
                               'Formed In: ' + result[0].FormedIn + '<br />' +
                               'Number of Members: ' + result[0].NumMembers + '<br />' +
			       'Release: ' + result[0].ReleaseName + '<br />' +
			       'Type: ' + result[0].ReleaseType + '<br />' +
			       'Year: ' + result[0].ReleaseYear + '<br />' 
                      );
                    }
                    else
                      res.send('Artist was not inserted.');
                });
	    });
		});
    });

//post to enter a release into db
app.post('/enterReleases', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Releases (ReleaseName,ReleaseType,ReleaseYear,Artist) VALUES(?,?,?,?)', [req.body.ReleaseName,req.body.ReleaseType,req.body.ReleaseYear,req.body.Artist],
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Releases where ReleaseName = ?', req.body.ReleaseName,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Release: ' + result[0].ReleaseName + '<br />' +
                               'Type: ' + result[0].ReleaseType + '<br />' +
                               'Year Released: ' + result[0].ReleaseYear + '<br />' +
                               'Artist: ' + result[0].Artist + '<br />' +
			       'ID: ' + result[0].ID
                      );
                    }
                    else
                      res.send('Release was not inserted. Artist may not currently exist in database.');
                });
        }
    );
});

//post to enter label info into db
app.post('/enterLabel', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Label (CurrentLabel,ReleaseName) VALUES(?,?)', [req.body.CurrentLabel,req.body.ReleaseName],
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Label where ID = ?', req.body.ID,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Current Label: ' + result[0].CurrentLabel + '<br />' +
                               'Release Name: ' + result[0].ReleaseName + '<br />'
                      );
                    }
                    else
                      res.send('Label was not inserted. Release may not currently exist in database.');
                });
        }
    );
});


//gets html table for artist selected in drop down
app.post('/view', function (req, res) {
    console.log(req.body);
    // get user by id
    if(typeof req.body.ID != 'undefined') {
        connection.query('select * from Artists where ID = ?', req.body.ID,
            function (err, result) {
                console.log(result);
                if(result.length > 0) {
                    var responseHTML = '<html><head><title>Selected Artist</title><link a href="/project2.css" rel="stylesheet"></head><body>';
                    responseHTML += '<table class ="title"><tr><th>Artist</th><th>Genre</th><th>Year Formed</th><th>Number of Members</th></tr>';
                    responseHTML += '<tr><td><a href="http://www.google.com/search?q=band+' + result[0].ArtistName + '">' + result[0].ArtistName + '</a></td>' +
                                    '<td>' + result[0].Genre + '</td>' +
                                    '<td>' + result[0].FormedIn + '</td>' +
			            '<td>' + result[0].NumMembers + '</td>' +
                                    '</tr></table></body></html>';
                    res.send(responseHTML);
                }
                else
                  res.send('Artist does not exist.');
            }
        );
    }
});


//view from sql
//sql view query: mysql> create view project2View as select ArtistName,Genre,ReleaseName,ReleaseYear from Artists a JOIN Releases r on a.ArtistName = r.Artist where Genre like '%Prog%';
//gets all bands with genre Prog
app.get('/project2View', function (req, res) {
    connection.query('select * from project2View',
                function (err, result) {
            if(result.length > 0) {
                var responseHTML = '<html><head><title>Progressive Bands</title><link a href="/project2.css" rel="stylesheet"></head><body>';
                responseHTML += '<h2>Progressive Bands</h2>';
                responseHTML += '<table><tr><th>Artist</th><th>Genre</th><th>Release Name</th><th>Release Year</th></tr>';
                for (var i=0; result.length > i; i++) {
                    responseHTML += '<tr>' +
                                    '<td>' + result[i].ArtistName + '</td>' + 
			            '<td>' + result[i].Genre + '</td>' + 
			            '<td>' + result[i].ReleaseName + '</td>' +
			            '<td>' + result[i].ReleaseYear + '</td>' +
                                    '</tr>';
                }
                responseHTML += '</table>';
                responseHTML += '</body><footer><%include footer %></html>';
                res.send(responseHTML);
                        }
                        else
                          res.send('View not loading.');
                }
        );
});


// get all artists for drop down
app.post('/viewArtists', function (req, res) {
    console.log(req.body);
        connection.query('select * from Artists',
                function (err, result) {
                        console.log(result);
                        var responseHTML = '<select id="list">';
                        for (var i=0; result.length > i; i++) {
                                var option = '<option value="' + result[i].ID + '">' + result[i].ArtistName +'</option>';
                                console.log(option);
                                responseHTML += option;
                        }
            responseHTML += '</select>';
                        res.send(responseHTML);
                });
});


//post to enter members into db
app.post('/enterMembers', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO Members (Artist,MemberName,Instrument) VALUES(?,?,?)', [req.body.Artist,req.body.Member,req.body.Instrument],
        function (err, result) {
            if (err) throw err;
            connection.query('select * from Members where Artist = ?', req.body.Artist,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('ID: ' + result[0].ID + '<br />' +
                               'Artist: ' + result[0].Artist + '<br />' +
                               'Member: ' + result[0].Member + '<br />' +
                               'Instrument: ' + result[0].Instrument + '<br />'
                      );
                    }
                    else
                      res.send('Member was not inserted.');
                });
        }
    );
});

// Begin listening                                                                                                                                         

app.listen(8026);
console.log("Express server listening on port %d in %s mode",  app.settings.env);
