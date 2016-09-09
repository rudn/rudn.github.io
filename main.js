/*global $, prompt */
/*jslint continue: true */
/*jslint plusplus: true */

$(function () {
    'use strict';
    var fsize, cell_name, timeline, field;
    fsize = 20;
    cell_name = function (i, j) {
        return 'c_' + i + '_' + j;
    };
    timeline = (function () {
        var line, idx, b_prev, n_generation;
        line = [];
        idx = 0;
        b_prev = $('#go-prev');
        n_generation = $('#n_generation');
        b_prev.prop('disabled', true);
        return {
            update: function () {
                b_prev.prop('disabled', idx <= 0);
                n_generation.text(idx + 1);
                line[idx].show();
            },
            init: function (f) {
                line = [f];
                idx = 0;
                this.update();
            },
            next: function () {
                var f;
                ++idx;
                if (idx < line.length) {
                    this.update();
                } else {
                    if (line.length === 0) {
                        return;
                    }
                    f = line[line.length - 1].next_gen();
                    line.push(f);
                    idx = line.length - 1;
                    this.update();
                }
            },
            prev: function () {
                --idx;
                if (idx < 0) {
                    idx = 0;
                }
                this.update();
            },
        };
    }());
    field = function () {
        return {
            black: {},
            drop: function () {
                this.black = {};
            },
            set_black: function (a, b) {
                this.black[cell_name(a, b)] = [a, b];
            },
            random: function (p) {
                var i, j;
                this.drop();
                for (i = 1; i <= fsize; ++i) {
                    for (j = 1; j <= fsize; ++j) {
                        if (Math.random() < p) {
                            this.set_black(i, j);
                        }
                    }
                }
            },
            fix: function () {
                this.drop();
                var t = this;
                $.each(
                    [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]],
                    function (i, v) {
                        t.set_black(v[0] + 9, v[1] + 9);
                    }
                );
            },
            show: function () {
                var i, j, c, mt;
                mt = $('#main-table');
                $('td', mt).css('background-color', '#fff');
                for (i = 1; i <= fsize; ++i) {
                    for (j = 1; j <= fsize; ++j) {
                        c = cell_name(i, j);
                        if (this.black[c]) {
                            $('td#' + c, mt).css('background-color', '#000');
                        }
                    }
                }
                $('#n_elements').text(Object.keys(this.black).length);
            },
            next_gen: function () {
                var neighbor, to_kill, white, c, r, k, v, ao, bo, nc, i, a, b, to_birth;
                neighbor = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
                to_kill = [];
                white = {};
                r = field();
                r.black = $.extend({}, this.black);
                for (k in r.black) {
                    v = r.black[k];
                    ao = v[0];
                    bo = v[1];
                    nc = 0;
                    for (i = 0; i < 8; ++i) {
                        a = ao + neighbor[i][0];
                        if (a < 1 || a > fsize) {
                            continue;
                        }
                        b = bo + neighbor[i][1];
                        if (b < 1 || b > fsize) {
                            continue;
                        }
                        c = cell_name(a, b);
                        if (r.black[c]) {
                            ++nc;
                        } else {
                            white[c] = [a, b];
                        }
                    }
                    if (!(nc === 2 || nc === 3)) {
                        to_kill.push(cell_name(ao, bo));
                    }
                }
                to_birth = [];
                for (k in white) {
                    v = white[k];
                    ao = v[0];
                    bo = v[1];
                    nc = 0;
                    for (i = 0; i < 8; ++i) {
                        a = ao + neighbor[i][0];
                        b = bo + neighbor[i][1];
                        c = cell_name(a, b);
                        if (r.black[c]) {
                            ++nc;
                        }
                    }
                    if (nc === 3) {
                        to_birth.push(v);
                    }
                }
                for (i = 0; i < to_birth.length; ++i) {
                    r.set_black(to_birth[i][0], to_birth[i][1]);
                }
                for (i = 0; i < to_kill.length; ++i) {
                    delete r.black[to_kill[i]];
                }
                return r;
            },
        };
    };
    (function () {
        var mt, inp, inp_ok, inp_cancel, i, j, c, r;
        mt = $('#main-table');
        inp = $('#population-input');
        inp_ok = $('#population-ok');
        inp_cancel = $('#population-cancel');
        for (i = 1; i <= fsize; ++i) {
            r = $('<tr>');
            for (j = 1; j <= fsize; ++j) {
                c = cell_name(i, j);
                r.append($('<td></td>').attr('id', c)).css('background-color', '#fff');
            }
            mt.append(r);
        }
        inp.keypress(function (e) {
            if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
                inp_ok.click();
                return false;
            }
            return true;
        });
        inp_ok.click(function () {
            var p, f;
            inp_cancel.click();
            p = inp.val();
            p = parseInt(p, 10);
            p = Math.max(Math.min(p, 100), 0) / 100;
            f = field();
            f.random(p);
            timeline.init(f);
        });
        inp_cancel.click(function () {
            $('#dialogs').fadeOut();
        });
        $('#fill-random').click(function () {
            var t;
            $('#dialogs').fadeIn();
            inp.focus();
            t = inp.val();
            inp.val('');
            inp.val(t);
        });
        $('#fill-fix').click(function () {
            var f = field();
            f.fix();
            timeline.init(f);
        });
        $('#go-next').click(function () {
            timeline.next();
        });
        $('#go-prev').click(function () {
            timeline.prev();
        });
        $('#intro-close').click(function () {
            $('#intro-outer').fadeOut();
        });
        $('#intro-open').click(function () {
            $('#intro-outer').fadeIn();
        });
    }());
});
