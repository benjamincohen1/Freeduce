var fs = require( 'fs' );


var o = {};
fs.readFile( 'out.txt', 'ascii', function( err, txt ){

    for(var i = 0; i < txt.length; i++){
        o[ txt[i] ] = (o[ txt[i] ] || 0) + 1;
    }

    console.log( o );

});
