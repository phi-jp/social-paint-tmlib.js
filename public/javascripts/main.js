
;(function() {
    var socket  = null;
    var canvas  = null;
    var element = null;

    var initCanvas = function() {
        canvas = tm.graphics.Canvas("#world");
        canvas.resize(465, 465);
        canvas.lineWidth = 8;
        canvas.setLineStyle(8);
    };

    var send = function(act, startX, startY, endX, endY, color) {
        socket.emit(act, {
            startX:startX,
            startY:startY,
            endX:endX,
            endY:endY,
            color:color
        });
    };

    var initSocketIO = function() {
        socket  = io.connect('http://'+location.host+':'+port);
        console.log('http://'+location.host+'/');
    };



    tm.main(function() {
        initCanvas();
        initSocketIO();
        
        var element = tm.dom.Element("#world");
        var x, y;
        var touch = false;
        var color = "hsl({0}, 75%, 50%)".format(Math.rand(0, 360));

        element.event.pointstart(function(e) {
            touch = true;
            x = e.pointX; y = e.pointY;
            send("start");
        });
        element.event.pointmove(function(e) {
            if (!touch) { return ; }

            canvas.strokeStyle = color;
            canvas.drawLine(x, y, e.pointX, e.pointY);
            send("move", x, y, e.pointX, e.pointY, color);
            x = e.pointX; y = e.pointY;

            e.stop();
        });
        element.event.pointend(function() {
            touch = false;
            send("end");
        });
        
        socket.on('connect', function() {
            console.log('Cliant-connect');
        });
        
        socket.on('start', function(data) {
            console.dir(data);
        });
        
        socket.on('move', function(e) {
            var d = e.data;
            canvas.strokeStyle = e.data.color;
            canvas.drawLine(d.startX, d.startY, d.endX, d.endY);
        });

        window.scrollTo(0,0);
    });

})();
