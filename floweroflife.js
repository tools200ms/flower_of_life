
function draw_flower_of_life(div_el, r, center_x, center_y) {

    var canvas = document.createElement("canvas");

    canvas.width = div_el.width();
    canvas.height = div_el.height();

    (function (ctx) {

        function draw_petals(dist, rad_idx) {
            const sin_arr = [0, Math.sin(Math.PI/6), Math.sin(2*Math.PI/6), 1, Math.sin(4*Math.PI/6), Math.sin(5*Math.PI/6)];
            const cos_arr = [1, Math.cos(Math.PI/6), Math.cos(2*Math.PI/6), 0, Math.cos(4*Math.PI/6), Math.cos(5*Math.PI/6)];

            var x_shift, y_shift;
            var i = 1;

            do {
                x_shift = dist;
                y_shift = dist;

                if( (rad_idx > 5) ) {
                    x_shift *= (-1 * sin_arr[rad_idx - 6]);
                    y_shift *= (-1 * cos_arr[rad_idx - 6]);
                } else {
                    x_shift *= sin_arr[rad_idx];
                    y_shift *= cos_arr[rad_idx];
                }

                ctx.beginPath();
                ctx.arc(center_x + x_shift, center_y + y_shift, r, 0, 2*Math.PI, true);
                ctx.fill();
                ctx.stroke();

                if( i++ == 6 ) {
                    break;
                }

                rad_idx += 2;
                rad_idx %= 12;
            }
            while(true);
        }

        ctx.strokeStyle = 'rgb(235, 28, 36)';
        ctx.fillStyle = 'rgba(235, 28, 36, 0.1)';

        // draw central circle
        ctx.beginPath();
        ctx.arc(center_x, center_y, r, 0, 2*Math.PI, true );
        ctx.fill();
        ctx.stroke();

        draw_petals(r, 0);

        ctx.strokeStyle = 'rgb(255, 127, 39)';
        ctx.fillStyle = 'rgba(255, 127, 39, 0.1)';
        draw_petals(2*Math.sqrt((3*r*r)/4), 1);

        ctx.strokeStyle = 'rbg(255, 242, 00)';
        ctx.fillStyle ='rbga(255, 242, 00, 0.1)';
        draw_petals(2*r, 0);

    } )(canvas.getContext('2d'));

    div_el.css( {
        'background-image' : "url(" + canvas.toDataURL("image/png") + ")",
        'background-repeat': 'no-repeat'
    } );
}
