/**
 * Copyright © 2023 Mateusz Piwek
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the “Software”), to deal in 
 * the Software without restriction, including without limitation the rights to 
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do 
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

function draw_flower_of_life( div_el, options ) {

    let canvas = document.createElement("canvas"),
        r, center_x, center_y,
        colors = [],
        level_cnt;

    function set_def_coordinates() {
        r = Math.round(Math.min( canvas.width, canvas.height ) / 6 );

        center_x = Math.round(canvas.width / 2);
        center_y = Math.round(canvas.height / 2);
    }

    function set_def_level_cnt() {
        level_cnt = 4;
    }

    canvas.width  = div_el.width();
    canvas.height = div_el.height();

    var last_c = { f: 'rgba(140, 185, 32, 0.1)', s: 'rgba(40, 85, 0, 0.1)' };

    if( typeof options === 'object' ) {
        let pos = options[ 'position' ],
            lev = options[ 'levels' ]
            col = options[ 'colors' ];

        if( pos !== undefined &&
            typeof pos.r === 'number' &&
            typeof pos.cx === 'number' &&
            typeof pos.cy === 'number' ) {

            r = pos.r;
            center_x = pos.cx;
            center_y = pos.cy;

        } else {
            set_def_coordinates();
        }

        if( typeof lev === 'number' &&
            lev >= 0 && lev < 16 ) {
            level_cnt = lev;
        } else {
            set_def_level_cnt();
        }


        if( Array.isArray( col ) ) {
            for( cc of col ) {
                let fill, stroke;

                if( typeof cc === 'object' ) {
                    fill = ( cc[ 'f' ] !== undefined ) ? cc[ 'f' ] : (cc[ 1 ] !== undefined ? cc[ 1 ] : last_c.f );

                    stroke = ( cc[ 's' ] !== undefined ) ? cc[ 's' ] : (cc[ 0 ] !== undefined ? cc[ 0 ] : last_c.s );

                    last_c = { f: fill, s: stroke };
                }

                colors.push( last_c );
            }
        }

    } else {
        set_def_coordinates();
        set_def_level_cnt();
    }

    // finish initiation:
    for( let pushed_cnt = colors.length; pushed_cnt < level_cnt; ++pushed_cnt ) {
        colors.push( last_c );
    }

    (function (ctx) {

        function draw_petals( dist, rad_idx ) {
            const sin_arr = [ 0, Math.sin(Math.PI/6), Math.sin(2*Math.PI/6), 1, Math.sin(4*Math.PI/6), Math.sin(5*Math.PI/6) ];

            let x_shift,
                y_shift,
                i = 1;

            do {
                // cosine is a shifted sinus, instead of calling ' Math.cos(...)' just
                // use 'sin_arr' and shift index by 3 (Math.PI / 2 rad.)
                let rad_cosidx = (rad_idx + 3) % 12;

                x_shift = dist * ( ( rad_idx > 5 ) ? ( -1*sin_arr[ rad_idx - 6 ] ) : sin_arr[ rad_idx ] );
                y_shift = dist * ( ( rad_cosidx > 5 ) ? (-1*sin_arr[ rad_cosidx - 6 ]) : sin_arr[ rad_cosidx ] );

                ctx.beginPath();
                ctx.arc( center_x + x_shift, center_y + y_shift, r, 0, 2*Math.PI, true );
                ctx.fill();
                ctx.stroke();

                if( i++ == 6 ) {
                    break;
                }

                rad_idx += 2;
                rad_idx %= 12;
            }
            while( true );
        }


        let   l_dist = [ null, r, 2 * Math.sqrt( ( 3*r*r ) / 4 ), 2 * r ];
        const l_radi = [ null, 0, 1, 0 ];

        ctx.strokeStyle = colors[0].s;
        ctx.fillStyle = colors[0].f;

        // draw central circle
        ctx.beginPath();
        ctx.arc( center_x, center_y, r, 0, 2*Math.PI, true );
        ctx.fill();
        ctx.stroke();

        for( c_level = 1; c_level < colors.length; ++c_level ) {
            ctx.strokeStyle = colors[ c_level ].s;
            ctx.fillStyle = colors[ c_level ].f;

            draw_petals( l_dist[ c_level ], l_radi[ c_level ] );
        }

    } )( canvas.getContext( '2d' ) );

    if( div_el.tagName === 'IMG' ) {
        div_el.src = canvas.toDataURL( "image/png" );
    } else {
        div_el.css( {
            'background-image' : "url(" + canvas.toDataURL( "image/png" ) + ")",
            'background-repeat': 'no-repeat'
        } );
    }
}
