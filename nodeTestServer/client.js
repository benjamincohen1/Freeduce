'use strict';

var WebSocket = require( 'ws' );



// var sock = new WebSocket( 'ws://107.170.33.72:8080' );
var sock = new WebSocket( 'ws://localhost:8080' );
sock.on( 'open', function(){

    var jobsDone = 0;
    sock.send( JSON.stringify ( {project: 'theproj' } ) );

    var project;
    var fnMap = function( e ){
        var o = {};
        for( var i = 0; i < e.length; i++ ){
            o[ e[ i ] ] = (o[ e[i] ] || 0) + 1;
        }

        return o;
    };

    sock.on( 'message', function( msg ){

        var msgData;
        try{
            msgData = JSON.parse( msg );
        }catch( e ){
            //
        }

        if( msgData  &&  msgData.project ){
            project = msgData.project;
            sock.send( 'getjob' );
        }

        else if( msgData && msgData.job ){
            console.log( 'got job %d', jobsDone );
            jobsDone += 1;
            var mapped = fnMap( msgData.job );
            sock.send( JSON.stringify({
                'result': mapped
            }));
            sock.send( 'getjob' );
        }


    });
});



