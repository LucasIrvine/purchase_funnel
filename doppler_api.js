if (typeof (NI) == "undefined") NI = {};

(function ($) {
    NI.Doppler = {
        callbacks: [],
        dopplerId: -1,
        baseImgUrl: '',
        sizeSliderValue: 0.0,
        noiseSliderValue: 0.0,
        useTempData: false,
        initialize: function (dopplerId, baseImgUrl, callbacks, useTempData) {
            this.dopplerId = dopplerId;
            this.baseImgUrl = baseImgUrl + (useTempData ? "" : "/inc/");
            this.callbacks = callbacks;
            this.useTempData = useTempData;
            var sketch = new Processing.Sketch;
            sketch.imageCache.add(baseImgUrl, 'pin-blank.png');
            sketch.imageCache.add(baseImgUrl, 'pin-slice-left.png');
            sketch.imageCache.add(baseImgUrl, 'pin-slice-middle.png');
            sketch.imageCache.add(baseImgUrl, 'pin-slice-point.png');
            sketch.imageCache.add(baseImgUrl, 'pin-slice-right.png');
            sketch.imageCache.add(baseImgUrl, 'pin-slice-point-top.png');
            sketch.imageCache.add(baseImgUrl, 'button-pin-delete.png');
            sketch.imageCache.add(baseImgUrl, 'button-pin-edit.png');
            sketch.imageCache.add(baseImgUrl, 'graph-back.png');
            sketch.imageCache.add(baseImgUrl, 'button-close.png');
            if (Processing.instances.length > 0) {
                $.each(Processing.instances, function (index, value) {
                    value.exit();
                });
            }
            Processing.init();
            $("#sliders #topicSizeSlider").trigger('initTopicSizeSlider');
            $("#sliders #noiseFilterSlider").trigger('initNoiseFilterSlider');
        },
        getProcessingSketchID: function () {
            return 'doppler';
        },
        testCallbacks: function () {},
        loadGraph: function (dopplerId) {
            if (this.useTempData) {
                return NI.tempdata.getInitialResponse();
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["loadGraph"] + '&dopplerId=' + dopplerId,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        updateGraph: function (dopplerId, sizeSlider, noiseSlider) {
            if (this.useTempData) {
                return NI.tempdata.getUpdateResponse();
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["updateGraph"] + '&dopplerId=' + dopplerId + '&sizeSlider=' + sizeSlider + '&noiseSlider=' + noiseSlider,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        saveGraph: function (dopplerId, sizeSlider, noiseSlider, hiddenClusters) {
            if (this.useTempData) {
                return '{"success": true, "message": "Successfully saved graph"}';
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["saveGraph"] + '&dopplerId=' + dopplerId + '&sizeSlider=' + sizeSlider + '&noiseSlider=' + noiseSlider + '&hiddenClusters=' + hiddenClusters,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        getPost: function (postId) {
            if (this.useTempData) {
                var p = NI.tempdata.getPost();
                return '{"title": "' + p[0] + '", "body": "' + p[1] + '"}';
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["getPost"] + '&postId=' + postId,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        exploreCluster: function (sizeSlider, noiseSlider, clusterId) {
            var self = this;
            var url = self.callbacks["exploreCluster"] + '&dopplerId=' + this.dopplerId + '&sizeSlider=' + sizeSlider + '&noiseSlider=' + noiseSlider + '&clusterId=' + clusterId;
            if (this.useTempData) {
                alert("Explore Cluster, in demo mode.  This doesn't do anything");
            }
            window.open(url, "_blank");
        },
        savePin: function (dopplerId, x, y, name) {
            if (this.useTempData) {
                return '{"success": true, "pinId": ' + Math.floor(Math.random() * 100) + ', "message": "Successfully added pin"}';
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["savePin"] + '&dopplerId=' + dopplerId + '&x=' + x + '&y=' + y + '&name=' + name,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        editPin: function (pinId, name) {
            if (this.useTempData) {
                return '{"success": true, "message": "Successfully edited pin"}';
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["editPin"] + '&pinId=' + pinId + '&name=' + name,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        movePin: function (pinId, latitude, longitude) {
            if (this.useTempData) {
                return '{"success": true, "message": "Successfully moved pin"}';
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["movePin"] + '&pinId=' + pinId + '&latitude=' + latitude + '&longitude=' + longitude,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        deletePin: function (dopplerId, pinId) {
            if (this.useTempData) {
                return '{"success": true, "message": "Successfully deleted pin"}';
            }
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["deletePin"] + '&dopplerId=' + dopplerId + '&pinId=' + pinId,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        enableAutoLabeling: function (dopplerId) {
            console.log('enableAutoLabeling called');
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["enableAutoLabeling"] + '&dopplerId=' + dopplerId,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        disableAutoLabeling: function (dopplerId) {
            console.log('disableAutoLabeling called');
            var self = this;
            var response;
            $.ajax({
                url: self.callbacks["disableAutoLabeling"] + '&dopplerId=' + dopplerId,
                success: function (data) {
                    response = self.parseResponse(data);
                },
                async: false
            });
            return response;
        },
        parseResponse: function (envelope) {
            try {
                var root = envelope.getElementsByTagName("evaluate")[0];
                if (root == null || root.tagName != "evaluate") {
                    return "{'message': 'Could not find <evaluate> element'}";
                }
                return root.firstChild.nodeValue.replace(/\^/g, '').replace(/\]\]/g, '\]').replace(/\[\[/g, '\[');
            } catch (e) {
                return "{'message': 'could not parse response'}";
            }
        }
    };
})(jQuery);

(function (b, j) {
    if (b.cleanData) {
        var k = b.cleanData;
        b.cleanData = function (a) {
            for (var c = 0, d;
            (d = a[c]) != null; c++) try {
                b(d).triggerHandler("remove")
            } catch (e) {}
            k(a)
        }
    } else {
        var l = b.fn.remove;
        b.fn.remove = function (a, c) {
            return this.each(function () {
                if (!c) if (!a || b.filter(a, [this]).length) b("*", this).add([this]).each(function () {
                    try {
                        b(this).triggerHandler("remove")
                    } catch (d) {}
                });
                return l.call(b(this), a, c)
            })
        }
    }
    b.widget = function (a, c, d) {
        var e = a.split(".")[0],
            f;
        a = a.split(".")[1];
        f = e + "-" + a;
        if (!d) {
            d = c;
            c = b.Widget
        }
        b.expr[":"][f] = function (h) {
            return !!b.data(h, a)
        };
        b[e] = b[e] || {};
        b[e][a] = function (h, g) {
            arguments.length && this._createWidget(h, g)
        };
        c = new c;
        c.options = b.extend(true, {}, c.options);
        b[e][a].prototype = b.extend(true, c, {
            namespace: e,
            widgetName: a,
            widgetEventPrefix: b[e][a].prototype.widgetEventPrefix || a,
            widgetBaseClass: f
        }, d);
        b.widget.bridge(a, b[e][a])
    };
    b.widget.bridge = function (a, c) {
        b.fn[a] = function (d) {
            var e = typeof d === "string",
                f = Array.prototype.slice.call(arguments, 1),
                h = this;
            d = !e && f.length ? b.extend.apply(null, [true, d].concat(f)) : d;
            if (e && d.charAt(0) === "_") return h;
            e ? this.each(function () {
                var g = b.data(this, a),
                    i = g && b.isFunction(g[d]) ? g[d].apply(g, f) : g;
                if (i !== g && i !== j) {
                    h = i;
                    return false
                }
            }) : this.each(function () {
                var g = b.data(this, a);
                g ? g.option(d || {})._init() : b.data(this, a, new c(d, this))
            });
            return h
        }
    };
    b.Widget = function (a, c) {
        arguments.length && this._createWidget(a, c)
    };
    b.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function (a, c) {
            b.data(c, this.widgetName, this);
            this.element = b(c);
            this.options = b.extend(true, {}, this.options, this._getCreateOptions(), a);
            var d = this;
            this.element.bind("remove." + this.widgetName, function () {
                d.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function () {
            return b.metadata && b.metadata.get(this.element[0])[this.widgetName]
        },
        _create: function () {},
        _init: function () {},
        destroy: function () {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function () {
            return this.element
        },
        option: function (a, c) {
            var d = a;
            if (arguments.length === 0) return b.extend({}, this.options);
            if (typeof a === "string") {
                if (c === j) return this.options[a];
                d = {};
                d[a] = c
            }
            this._setOptions(d);
            return this
        },
        _setOptions: function (a) {
            var c = this;
            b.each(a, function (d, e) {
                c._setOption(d, e)
            });
            return this
        },
        _setOption: function (a, c) {
            this.options[a] = c;
            if (a === "disabled") this.widget()[c ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", c);
            return this
        },
        enable: function () {
            return this._setOption("disabled", false)
        },
        disable: function () {
            return this._setOption("disabled", true)
        },
        _trigger: function (a, c, d) {
            var e = this.options[a];
            c = b.Event(c);
            c.type = (a === this.widgetEventPrefix ? a : this.widgetEventPrefix + a).toLowerCase();
            d = d || {};
            if (c.originalEvent) {
                a = b.event.props.length;
                for (var f; a;) {
                    f = b.event.props[--a];
                    c[f] = c.originalEvent[f]
                }
            }
            this.element.trigger(c, d);
            return !(b.isFunction(e) && e.call(this.element[0], c, d) === false || c.isDefaultPrevented())
        }
    }
})(jQuery);;
(function (b) {
    var d = false;
    b(document).mouseup(function () {
        d = false
    });
    b.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var a = this;
            this.element.bind("mousedown." + this.widgetName, function (c) {
                return a._mouseDown(c)
            }).bind("click." + this.widgetName, function (c) {
                if (true === b.data(c.target, a.widgetName + ".preventClickEvent")) {
                    b.removeData(c.target, a.widgetName + ".preventClickEvent");
                    c.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName)
        },
        _mouseDown: function (a) {
            if (!d) {
                this._mouseStarted && this._mouseUp(a);
                this._mouseDownEvent = a;
                var c = this,
                    f = a.which == 1,
                    g = typeof this.options.cancel == "string" && a.target.nodeName ? b(a.target).closest(this.options.cancel).length : false;
                if (!f || g || !this._mouseCapture(a)) return true;
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) this._mouseDelayTimer = setTimeout(function () {
                    c.mouseDelayMet = true
                }, this.options.delay);
                if (this._mouseDistanceMet(a) && this._mouseDelayMet(a)) {
                    this._mouseStarted = this._mouseStart(a) !== false;
                    if (!this._mouseStarted) {
                        a.preventDefault();
                        return true
                    }
                }
                true === b.data(a.target, this.widgetName + ".preventClickEvent") && b.removeData(a.target, this.widgetName + ".preventClickEvent");
                this._mouseMoveDelegate = function (e) {
                    return c._mouseMove(e)
                };
                this._mouseUpDelegate = function (e) {
                    return c._mouseUp(e)
                };
                b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                a.preventDefault();
                return d = true
            }
        },
        _mouseMove: function (a) {
            if (b.browser.msie && !(document.documentMode >= 9) && !a.button) return this._mouseUp(a);
            if (this._mouseStarted) {
                this._mouseDrag(a);
                return a.preventDefault()
            }
            if (this._mouseDistanceMet(a) && this._mouseDelayMet(a))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, a) !== false) ? this._mouseDrag(a) : this._mouseUp(a);
            return !this._mouseStarted
        },
        _mouseUp: function (a) {
            b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                a.target == this._mouseDownEvent.target && b.data(a.target, this.widgetName + ".preventClickEvent", true);
                this._mouseStop(a)
            }
            return false
        },
        _mouseDistanceMet: function (a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function () {
            return this.mouseDelayMet
        },
        _mouseStart: function () {},
        _mouseDrag: function () {},
        _mouseStop: function () {},
        _mouseCapture: function () {
            return true
        }
    })
})(jQuery);;
(function (c) {
    c.ui = c.ui || {};
    var n = /left|center|right/,
        o = /top|center|bottom/,
        t = c.fn.position,
        u = c.fn.offset;
    c.fn.position = function (b) {
        if (!b || !b.of) return t.apply(this, arguments);
        b = c.extend({}, b);
        var a = c(b.of),
            d = a[0],
            g = (b.collision || "flip").split(" "),
            e = b.offset ? b.offset.split(" ") : [0, 0],
            h, k, j;
        if (d.nodeType === 9) {
            h = a.width();
            k = a.height();
            j = {
                top: 0,
                left: 0
            }
        } else if (d.setTimeout) {
            h = a.width();
            k = a.height();
            j = {
                top: a.scrollTop(),
                left: a.scrollLeft()
            }
        } else if (d.preventDefault) {
            b.at = "left top";
            h = k = 0;
            j = {
                top: b.of.pageY,
                left: b.of.pageX
            }
        } else {
            h = a.outerWidth();
            k = a.outerHeight();
            j = a.offset()
        }
        c.each(["my", "at"], function () {
            var f = (b[this] || "").split(" ");
            if (f.length === 1) f = n.test(f[0]) ? f.concat(["center"]) : o.test(f[0]) ? ["center"].concat(f) : ["center", "center"];
            f[0] = n.test(f[0]) ? f[0] : "center";
            f[1] = o.test(f[1]) ? f[1] : "center";
            b[this] = f
        });
        if (g.length === 1) g[1] = g[0];
        e[0] = parseInt(e[0], 10) || 0;
        if (e.length === 1) e[1] = e[0];
        e[1] = parseInt(e[1], 10) || 0;
        if (b.at[0] === "right") j.left += h;
        else if (b.at[0] === "center") j.left += h / 2;
        if (b.at[1] === "bottom") j.top += k;
        else if (b.at[1] === "center") j.top += k / 2;
        j.left += e[0];
        j.top += e[1];
        return this.each(function () {
            var f = c(this),
                l = f.outerWidth(),
                m = f.outerHeight(),
                p = parseInt(c.curCSS(this, "marginLeft", true)) || 0,
                q = parseInt(c.curCSS(this, "marginTop", true)) || 0,
                v = l + p + (parseInt(c.curCSS(this, "marginRight", true)) || 0),
                w = m + q + (parseInt(c.curCSS(this, "marginBottom", true)) || 0),
                i = c.extend({}, j),
                r;
            if (b.my[0] === "right") i.left -= l;
            else if (b.my[0] === "center") i.left -= l / 2;
            if (b.my[1] === "bottom") i.top -= m;
            else if (b.my[1] === "center") i.top -= m / 2;
            i.left = Math.round(i.left);
            i.top = Math.round(i.top);
            r = {
                left: i.left - p,
                top: i.top - q
            };
            c.each(["left", "top"], function (s, x) {
                c.ui.position[g[s]] && c.ui.position[g[s]][x](i, {
                    targetWidth: h,
                    targetHeight: k,
                    elemWidth: l,
                    elemHeight: m,
                    collisionPosition: r,
                    collisionWidth: v,
                    collisionHeight: w,
                    offset: e,
                    my: b.my,
                    at: b.at
                })
            });
            c.fn.bgiframe && f.bgiframe();
            f.offset(c.extend(i, {
                using: b.using
            }))
        })
    };
    c.ui.position = {
        fit: {
            left: function (b, a) {
                var d = c(window);
                d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                b.left = d > 0 ? b.left - d : Math.max(b.left - a.collisionPosition.left, b.left)
            },
            top: function (b, a) {
                var d = c(window);
                d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                b.top = d > 0 ? b.top - d : Math.max(b.top - a.collisionPosition.top, b.top)
            }
        },
        flip: {
            left: function (b, a) {
                if (a.at[0] !== "center") {
                    var d = c(window);
                    d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                    var g = a.my[0] === "left" ? -a.elemWidth : a.my[0] === "right" ? a.elemWidth : 0,
                        e = a.at[0] === "left" ? a.targetWidth : -a.targetWidth,
                        h = -2 * a.offset[0];
                    b.left += a.collisionPosition.left < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            },
            top: function (b, a) {
                if (a.at[1] !== "center") {
                    var d = c(window);
                    d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                    var g = a.my[1] === "top" ? -a.elemHeight : a.my[1] === "bottom" ? a.elemHeight : 0,
                        e = a.at[1] === "top" ? a.targetHeight : -a.targetHeight,
                        h = -2 * a.offset[1];
                    b.top += a.collisionPosition.top < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            }
        }
    };
    if (!c.offset.setOffset) {
        c.offset.setOffset = function (b, a) {
            if (/static/.test(c.curCSS(b, "position"))) b.style.position = "relative";
            var d = c(b),
                g = d.offset(),
                e = parseInt(c.curCSS(b, "top", true), 10) || 0,
                h = parseInt(c.curCSS(b, "left", true), 10) || 0;
            g = {
                top: a.top - g.top + e,
                left: a.left - g.left + h
            };
            "using" in a ? a.using.call(b, g) : d.css(g)
        };
        c.fn.offset = function (b) {
            var a = this[0];
            if (!a || !a.ownerDocument) return null;
            if (b) return this.each(function () {
                c.offset.setOffset(this, b)
            });
            return u.call(this)
        }
    }
})(jQuery);;
(function (d) {
    d.widget("ui.slider", d.ui.mouse, {
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null
        },
        _create: function () {
            var a = this,
                b = this.options,
                c = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                f = b.values && b.values.length || 1,
                e = [];
            this._mouseSliding = this._keySliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all" + (b.disabled ? " ui-slider-disabled ui-disabled" : ""));
            this.range = d([]);
            if (b.range) {
                if (b.range === true) {
                    if (!b.values) b.values = [this._valueMin(), this._valueMin()];
                    if (b.values.length && b.values.length !== 2) b.values = [b.values[0], b.values[0]]
                }
                this.range = d("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (b.range === "min" || b.range === "max" ? " ui-slider-range-" + b.range : ""))
            }
            for (var j = c.length; j < f; j += 1) e.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>");
            this.handles = c.add(d(e.join("")).appendTo(a.element));
            this.handle = this.handles.eq(0);
            this.handles.add(this.range).filter("a").click(function (g) {
                g.preventDefault()
            }).hover(function () {
                b.disabled || d(this).addClass("ui-state-hover")
            }, function () {
                d(this).removeClass("ui-state-hover")
            }).focus(function () {
                if (b.disabled) d(this).blur();
                else {
                    d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                    d(this).addClass("ui-state-focus")
                }
            }).blur(function () {
                d(this).removeClass("ui-state-focus")
            });
            this.handles.each(function (g) {
                d(this).data("index.ui-slider-handle", g)
            });
            this.handles.keydown(function (g) {
                var k = true,
                    l = d(this).data("index.ui-slider-handle"),
                    i, h, m;
                if (!a.options.disabled) {
                    switch (g.keyCode) {
                    case d.ui.keyCode.HOME:
                    case d.ui.keyCode.END:
                    case d.ui.keyCode.PAGE_UP:
                    case d.ui.keyCode.PAGE_DOWN:
                    case d.ui.keyCode.UP:
                    case d.ui.keyCode.RIGHT:
                    case d.ui.keyCode.DOWN:
                    case d.ui.keyCode.LEFT:
                        k = false;
                        if (!a._keySliding) {
                            a._keySliding = true;
                            d(this).addClass("ui-state-active");
                            i = a._start(g, l);
                            if (i === false) return
                        }
                        break
                    }
                    m = a.options.step;
                    i = a.options.values && a.options.values.length ? (h = a.values(l)) : (h = a.value());
                    switch (g.keyCode) {
                    case d.ui.keyCode.HOME:
                        h = a._valueMin();
                        break;
                    case d.ui.keyCode.END:
                        h = a._valueMax();
                        break;
                    case d.ui.keyCode.PAGE_UP:
                        h = a._trimAlignValue(i + (a._valueMax() - a._valueMin()) / 5);
                        break;
                    case d.ui.keyCode.PAGE_DOWN:
                        h = a._trimAlignValue(i - (a._valueMax() - a._valueMin()) / 5);
                        break;
                    case d.ui.keyCode.UP:
                    case d.ui.keyCode.RIGHT:
                        if (i === a._valueMax()) return;
                        h = a._trimAlignValue(i + m);
                        break;
                    case d.ui.keyCode.DOWN:
                    case d.ui.keyCode.LEFT:
                        if (i === a._valueMin()) return;
                        h = a._trimAlignValue(i - m);
                        break
                    }
                    a._slide(g, l, h);
                    return k
                }
            }).keyup(function (g) {
                var k = d(this).data("index.ui-slider-handle");
                if (a._keySliding) {
                    a._keySliding = false;
                    a._stop(g, k);
                    a._change(g, k);
                    d(this).removeClass("ui-state-active")
                }
            });
            this._refreshValue();
            this._animateOff = false
        },
        destroy: function () {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
            this._mouseDestroy();
            return this
        },
        _mouseCapture: function (a) {
            var b = this.options,
                c, f, e, j, g;
            if (b.disabled) return false;
            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();
            c = this._normValueFromMouse({
                x: a.pageX,
                y: a.pageY
            });
            f = this._valueMax() - this._valueMin() + 1;
            j = this;
            this.handles.each(function (k) {
                var l = Math.abs(c - j.values(k));
                if (f > l) {
                    f = l;
                    e = d(this);
                    g = k
                }
            });
            if (b.range === true && this.values(1) === b.min) {
                g += 1;
                e = d(this.handles[g])
            }
            if (this._start(a, g) === false) return false;
            this._mouseSliding = true;
            j._handleIndex = g;
            e.addClass("ui-state-active").focus();
            b = e.offset();
            this._clickOffset = !d(a.target).parents().andSelf().is(".ui-slider-handle") ? {
                left: 0,
                top: 0
            } : {
                left: a.pageX - b.left - e.width() / 2,
                top: a.pageY - b.top - e.height() / 2 - (parseInt(e.css("borderTopWidth"), 10) || 0) - (parseInt(e.css("borderBottomWidth"), 10) || 0) + (parseInt(e.css("marginTop"), 10) || 0)
            };
            this.handles.hasClass("ui-state-hover") || this._slide(a, g, c);
            return this._animateOff = true
        },
        _mouseStart: function () {
            return true
        },
        _mouseDrag: function (a) {
            var b = this._normValueFromMouse({
                x: a.pageX,
                y: a.pageY
            });
            this._slide(a, this._handleIndex, b);
            return false
        },
        _mouseStop: function (a) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;
            this._stop(a, this._handleIndex);
            this._change(a, this._handleIndex);
            this._clickOffset = this._handleIndex = null;
            return this._animateOff = false
        },
        _detectOrientation: function () {
            this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function (a) {
            var b;
            if (this.orientation === "horizontal") {
                b = this.elementSize.width;
                a = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
            } else {
                b = this.elementSize.height;
                a = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
            }
            b = a / b;
            if (b > 1) b = 1;
            if (b < 0) b = 0;
            if (this.orientation === "vertical") b = 1 - b;
            a = this._valueMax() - this._valueMin();
            return this._trimAlignValue(this._valueMin() + b * a)
        },
        _start: function (a, b) {
            var c = {
                handle: this.handles[b],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                c.value = this.values(b);
                c.values = this.values()
            }
            return this._trigger("start", a, c)
        },
        _slide: function (a, b, c) {
            var f;
            if (this.options.values && this.options.values.length) {
                f = this.values(b ? 0 : 1);
                if (this.options.values.length === 2 && this.options.range === true && (b === 0 && c > f || b === 1 && c < f)) c = f;
                if (c !== this.values(b)) {
                    f = this.values();
                    f[b] = c;
                    a = this._trigger("slide", a, {
                        handle: this.handles[b],
                        value: c,
                        values: f
                    });
                    this.values(b ? 0 : 1);
                    a !== false && this.values(b, c, true)
                }
            } else if (c !== this.value()) {
                a = this._trigger("slide", a, {
                    handle: this.handles[b],
                    value: c
                });
                a !== false && this.value(c)
            }
        },
        _stop: function (a, b) {
            var c = {
                handle: this.handles[b],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                c.value = this.values(b);
                c.values = this.values()
            }
            this._trigger("stop", a, c)
        },
        _change: function (a, b) {
            if (!this._keySliding && !this._mouseSliding) {
                var c = {
                    handle: this.handles[b],
                    value: this.value()
                };
                if (this.options.values && this.options.values.length) {
                    c.value = this.values(b);
                    c.values = this.values()
                }
                this._trigger("change", a, c)
            }
        },
        value: function (a) {
            if (arguments.length) {
                this.options.value = this._trimAlignValue(a);
                this._refreshValue();
                this._change(null, 0)
            } else return this._value()
        },
        values: function (a, b) {
            var c, f, e;
            if (arguments.length > 1) {
                this.options.values[a] = this._trimAlignValue(b);
                this._refreshValue();
                this._change(null, a)
            } else if (arguments.length) if (d.isArray(arguments[0])) {
                c = this.options.values;
                f = arguments[0];
                for (e = 0; e < c.length; e += 1) {
                    c[e] = this._trimAlignValue(f[e]);
                    this._change(null, e)
                }
                this._refreshValue()
            } else return this.options.values && this.options.values.length ? this._values(a) : this.value();
            else return this._values()
        },
        _setOption: function (a, b) {
            var c, f = 0;
            if (d.isArray(this.options.values)) f = this.options.values.length;
            d.Widget.prototype._setOption.apply(this, arguments);
            switch (a) {
            case "disabled":
                if (b) {
                    this.handles.filter(".ui-state-focus").blur();
                    this.handles.removeClass("ui-state-hover");
                    this.handles.propAttr("disabled", true);
                    this.element.addClass("ui-disabled")
                } else {
                    this.handles.propAttr("disabled", false);
                    this.element.removeClass("ui-disabled")
                }
                break;
            case "orientation":
                this._detectOrientation();
                this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                this._refreshValue();
                break;
            case "value":
                this._animateOff = true;
                this._refreshValue();
                this._change(null, 0);
                this._animateOff = false;
                break;
            case "values":
                this._animateOff = true;
                this._refreshValue();
                for (c = 0; c < f; c += 1) this._change(null, c);
                this._animateOff = false;
                break
            }
        },
        _value: function () {
            var a = this.options.value;
            return a = this._trimAlignValue(a)
        },
        _values: function (a) {
            var b, c;
            if (arguments.length) {
                b = this.options.values[a];
                return b = this._trimAlignValue(b)
            } else {
                b = this.options.values.slice();
                for (c = 0; c < b.length; c += 1) b[c] = this._trimAlignValue(b[c]);
                return b
            }
        },
        _trimAlignValue: function (a) {
            if (a <= this._valueMin()) return this._valueMin();
            if (a >= this._valueMax()) return this._valueMax();
            var b = this.options.step > 0 ? this.options.step : 1,
                c = (a - this._valueMin()) % b;
            a = a - c;
            if (Math.abs(c) * 2 >= b) a += c > 0 ? b : -b;
            return parseFloat(a.toFixed(5))
        },
        _valueMin: function () {
            return this.options.min
        },
        _valueMax: function () {
            return this.options.max
        },
        _refreshValue: function () {
            var a = this.options.range,
                b = this.options,
                c = this,
                f = !this._animateOff ? b.animate : false,
                e, j = {},
                g, k, l, i;
            if (this.options.values && this.options.values.length) this.handles.each(function (h) {
                e = (c.values(h) - c._valueMin()) / (c._valueMax() - c._valueMin()) * 100;
                j[c.orientation === "horizontal" ? "left" : "bottom"] = e + "%";
                d(this).stop(1, 1)[f ? "animate" : "css"](j, b.animate);
                if (c.options.range === true) if (c.orientation === "horizontal") {
                    if (h === 0) c.range.stop(1, 1)[f ? "animate" : "css"]({
                        left: e + "%"
                    }, b.animate);
                    if (h === 1) c.range[f ? "animate" : "css"]({
                        width: e - g + "%"
                    }, {
                        queue: false,
                        duration: b.animate
                    })
                } else {
                    if (h === 0) c.range.stop(1, 1)[f ? "animate" : "css"]({
                        bottom: e + "%"
                    }, b.animate);
                    if (h === 1) c.range[f ? "animate" : "css"]({
                        height: e - g + "%"
                    }, {
                        queue: false,
                        duration: b.animate
                    })
                }
                g = e
            });
            else {
                k = this.value();
                l = this._valueMin();
                i = this._valueMax();
                e = i !== l ? (k - l) / (i - l) * 100 : 0;
                j[c.orientation === "horizontal" ? "left" : "bottom"] = e + "%";
                this.handle.stop(1, 1)[f ? "animate" : "css"](j, b.animate);
                if (a === "min" && this.orientation === "horizontal") this.range.stop(1, 1)[f ? "animate" : "css"]({
                    width: e + "%"
                }, b.animate);
                if (a === "max" && this.orientation === "horizontal") this.range[f ? "animate" : "css"]({
                    width: 100 - e + "%"
                }, {
                    queue: false,
                    duration: b.animate
                });
                if (a === "min" && this.orientation === "vertical") this.range.stop(1, 1)[f ? "animate" : "css"]({
                    height: e + "%"
                }, b.animate);
                if (a === "max" && this.orientation === "vertical") this.range[f ? "animate" : "css"]({
                    height: 100 - e + "%"
                }, {
                    queue: false,
                    duration: b.animate
                })
            }
        }
    });
    d.extend(d.ui.slider, {
        version: "1.8.16"
    })
})(jQuery);;