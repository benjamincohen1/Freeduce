'use strict';

var WebSocket = require( "ws" );
var fs = require( 'fs' );


var WebSocketServer = WebSocket.Server;


var wss = new WebSocketServer({port: 8080});


var nextJob = (function(){


    var jobs = [] ;
    fs.readFile( '../out.txt', 'ascii', function( err, txt ){
        // for( var i = 0; i < txt.length / 10000; i++ ){
        //     jobs.push( txt.substring( i * 10000, (i + 1) * 10000) );
        // }

        // console.log( 'created %d jobs', jobs.length );
        for( var i = 0; i < 10000; i++ ){
            jobs.push( 'ASDFASDFASDF' );
        }

    });


    var i = -1;
    return function(){
        i++;
        console.log( 'getting job %d', i );
        return jobs[ i ];
    }
})()

var runningTotal = {}
var reduceFn = (function(  ){
    return function( r, total ){
        for( var k in  r ){
            total[ k ] += (total[k] || 0) + r[k];
        }
    }
})();






wss.on( 'connection', function( ws ){

    var project;

    ws.on( 'message', function( msg ){
        var msgData;
        try{
            msgData = JSON.parse( msg );
            console.log( msgData );
        }catch( e ){
            //
        }


        if( msgData && msgData.project ){
            console.log( 'got a project name' );
            project = msgData.project;
            ws.send( JSON.stringify( msgData ) );
        }

        else if( msg == 'getjob' ){
            console.log( 'sending job' );
            ws.send( JSON.stringify({
                job: nextJob()
            }));
        }


        else if( msgData && msgData.result ){
            var job = nextJob();
            console.log( 'sending a new job' );
            var j = nextJob();
            if( typeof j == 'undefined' ){
                console.log( 'DONE' );
                console.log( runningTotal );
            }else{
                ws.send( JSON.stringify({
                    job: j
                }));
            }
            reduceFn( msgData.result, runningTotal );

        }


    });

});




