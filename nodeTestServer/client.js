'use strict';

var io = require( 'socket.io-client' );




var sock = io.connect( 'ws://localhost:8080' );

var jobsDone = 0;
sock.emit( 'mr', {project: 'theproj' } );

var project;
var fnMap = function( e ){
    var o = {};
    for( var i = 0; i < e.length; i++ ){
        o[ e[ i ] ] = (o[ e[i] ] || 0) + 1;
    }

    return o;
};

sock.on( 'mr', function( msg ){



   var msgData = msg;
   // try{
   // msgData = JSON.parse( msg );
   // }catch( e ){
   // //
   // }

   if( msgData  &&  msgData.project ){
        project = msgData.project;
        sock.emit( 'mr', 'getjob' );
   }

   else if( msgData && msgData.job ){
        console.log( 'got job %d', jobsDone );
        jobsDone += 1;
        var mapped = fnMap( msgData.job );
        sock.emit( 'mr', {
            'result': mapped
        });
    sock.emit( 'mr', 'getjob' );
   }


});



