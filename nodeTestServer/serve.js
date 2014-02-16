'use strict';

var WebSocket = require( "ws" );
var fs = require( 'fs' );


var WebSocketServer = WebSocket.Server;


var wss = new WebSocketServer({port: 8080, autoAcceptConnections: true});


var nextJob = (function(){


    var jobs = [] ;
    fs.readFile( '../out.txt', 'ascii', function( err, txt ){
        for( var i = 0; i < txt.length / 10000; i++ ){
            jobs.push( txt.substring( i * 10000, (i + 1) * 10000) );
            jobs.push( '' );
        }

        console.log( 'created %d jobs', jobs.length / 2 );
        // for( var k = 0; k < 100; k++ ){
        //     if ( k % 2  == 0 ){

        //         jobs.push( 'A' );
        //         jobs.push('');
        //     }
        //     else{
        //         jobs.push( 'B' );
        //         jobs.push('');
        //     }
        // }

    });


    var i = -1;
    return function(){
        i++; i = i % 10000;
        console.log( 'getting job %d', i );
        return jobs[ i ];
    }
})()

var runningTotal = {}
var reduceFn = (function(  ){
    return function( r, total ){
        for( var k in  r ){
            total[ k ] = (total[k] || 0) + r[k];
        }
    }
})();





var webSockets = {};
wss.on( 'connection', function( ws ){
    console.log( 'new connection' );
    var project;


    var userID = ws.upgradeReq.url.substr(1);
    webSockets[userID] = ws;


    ws.on( 'message', function( msg ){
        var msgData;
        try{
            msgData = JSON.parse( msg );
        }catch( e ){
            //
        }


        if( msgData && msgData.project ){
            project = msgData.project;
            ws.send( JSON.stringify( msgData ) );
        }

        else if( msg == 'getjob' ){
            var j = nextJob();
            if( j ){

                ws.send( JSON.stringify({
                    job: j
                }));
            }else{
                console.log( 'DONE' );
                console.log( runningTotal );
            }
        }


        else if( msgData && msgData.result ){
            var job = nextJob();
            reduceFn( msgData.result, runningTotal );

        }


    });

});
console.log( 'listening' );



