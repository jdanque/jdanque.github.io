"trello-markdown": [function(e, n, t) {
        var a, i, r, o = [].slice, s = [].indexOf || function(e) {
            for (var n = 0, t = this.length; t > n; n++)
                if (n in this && this[n] === e)
                    return n;
            return -1
        }
        ;
        r = e("underscore"),
        i = function() {
            function e(n) {
                var t, a, i;
                this.options = null != n ? n : {},
                null == (t = this.options).shouldOpenLinkInNewTab && (t.shouldOpenLinkInNewTab = function(e) {
                    return !0
                }
                ),
                this.lexerBlockRules = this.options.inlineOnly ? [e.lexerBlockRules.error] : this._expandRules(e.lexerBlockRules, null != (a = this.options.restrict) ? a.block : void 0),
                this.lexerInlineRules = this._expandRules(e.lexerInlineRules, null != (i = this.options.restrict) ? i.inline : void 0)
            }
            var n, t, i;
            return e.prototype._expandRules = function(e, n) {
                var t, a, i, o, s, u, h, l, c;
                s = r.sortBy(r.keys(e), function(e) {
                    return -e.length
                }),
                h = RegExp("" + s.join("|"), "g"),
                n = null != n ? n.concat(function() {
                    var n;
                    n = [];
                    for (c in e)
                        l = e[c],
                        (l.required || null == l.token) && n.push(c);
                    return n
                }()) : function() {
                    var n, t;
                    t = [];
                    for (o in e)
                        l = e[o],
                        (null != (n = l.nondefault) ? n : !1) || t.push(o);
                    return t
                }(),
                e = r.pick(e, r.intersection(r.keys(e), n)),
                t = function(n) {
                    return function(n) {
                        var a, i;
                        return a = e[n] = r.clone(e[n]),
                        a.compiled = !0,
                        i = a.match.source.replace(h, function(n) {
                            var a, i;
                            return i = e[n],
                            null != (null != i ? i.match : void 0) ? (i.compiled || t(n),
                            a = i.match) : a = /[]/,
                            a.source.replace(/(^|[^\[])\^/g, "$1")
                        }),
                        a.match = RegExp("" + i),
                        a.match_i = RegExp("" + i, "i"),
                        a.match_gim = RegExp("" + i, "gim"),
                        a
                    }
                }(this);
                for (c in e)
                    u = e[c],
                    i = u.match,
                    a = u.compiled,
                    null == i || a || t(c);
                return e
            }
            ,
            e.prototype._disallow = function() {
                var e, n, t;
                return t = arguments[0],
                e = 2 <= arguments.length ? o.call(arguments, 1) : [],
                t = r.extend({}, t),
                t.disallowed = (null != (n = t.disallowed) ? n : []).concat(e),
                t
            }
            ,
            e.lexerBlockRules = {
                newline: {
                    match: /^\n/,
                    token: function(e, n, t) {
                        var a;
                        return a = e[0],
                        {
                            type: "space",
                            canCondense: !0,
                            children: {
                                text: a,
                                ranges: t.slice(0, a)
                            }
                        }
                    }
                },
                code: {
                    match: /^(\x20{4}[^\n]+\n*)+/,
                    token: function(e) {
                        var n;
                        return n = e[0],
                        {
                            type: "code",
                            text: n.replace(/^ {4}/gm, "").replace(/\n+$/, "")
                        }
                    }
                },
                fencedCode: {
                    match: /^\x20*(`{3,}|~{3,})\x20*(\S+)?\x20*\n([\s\S]+?)\s*?\1\x20*(?:\n+|$)/,
                    token: function(e) {
                        var n, t, a, i;
                        return n = e[0],
                        t = e[1],
                        a = e[2],
                        i = e[3],
                        {
                            type: "code",
                            language: a,
                            text: i
                        }
                    }
                },
                heading: {
                    match: /^(\x20*(\#{1,6})\x20*)([^\n]+?)\x20*\#*\x20*(?:\n+|$)/,
                    token: function(e, n, t) {
                        var a, i, r, o;
                        return a = e[0],
                        i = e[1],
                        r = e[2],
                        o = e[3],
                        {
                            type: "heading",
                            depth: r.length,
                            children: {
                                text: o,
                                ranges: t.slice(i.length, o)
                            }
                        }
                    }
                },
                lheading: {
                    match: /^([^\n]+)\n\x20*(=|-){3,}\x20*\n*/,
                    token: function(e, n, t) {
                        var a, i, r;
                        return a = e[0],
                        r = e[1],
                        i = e[2],
                        {
                            type: "heading",
                            depth: "=" === i ? 1 : 2,
                            children: {
                                text: r,
                                ranges: t.slice(0, r)
                            }
                        }
                    }
                },
                hr: {
                    match: /^(?:\x20*[-*_]){3,}\x20*(?:\n|$)/,
                    token: function() {
                        return {
                            type: "hr"
                        }
                    }
                },
                blockquote: {
                    match: /^(\x20*>[^\n]+(\n[^\n]+)*\n*)+/,
                    token: function(e, n, t) {
                        var i, r, s, u;
                        return i = e[0],
                        u = [],
                        s = i.replace(/^ *> ?/gm, function(e, n) {
                            var a, i, r, o;
                            for (r = t.slice(n, e).spans,
                            a = 0,
                            i = r.length; i > a; a++)
                                o = r[a],
                                u.push(o);
                            return ""
                        }),
                        r = t.subtract(new a(u)),
                        [{
                            type: "blockquote_start"
                        }].concat(o.call(this.blockLex(s, n, r)), [{
                            type: "blockquote_end"
                        }])
                    }
                },
                num: {
                    match: /(?:\d+\.)/
                },
                dash: {
                    match: /(?:[*+-])/
                },
                bullet: {
                    match: /(?:dash|num)/
                },
                item: {
                    match: /^(\x20*)(bullet)\x20[^\n]*(?:\n(?!\1bullet\x20)[^\n]*)*/
                },
                list: {
                    match: /^(\x20*)(?:(dash)\x20[\s\S]+?(?:\nhr|\n{2,}(?=def|(?!\x20))(?!\1dash\x20)\n*|\s*$)|(num)\x20[\s\S]+?(?:\nhr|\n{2,}(?=def|(?!\x20))(?!\1num\x20)\n*|\s*$))/,
                    token: function(e, n, t) {
                        var a, i, s, u, h, l, c, d, p;
                        return a = e[0],
                        d = e[1],
                        i = e[2],
                        c = e[3],
                        l = !1,
                        s = 0,
                        h = [],
                        p = null != i ? "ul" : "ol",
                        u = a.match(this.lexerBlockRules.item.match_gim).length,
                        a.replace(this.lexerBlockRules.item.match_gim, function(e) {
                            return function() {
                                var a, i, r, c, d, m, g, f, y;
                                return c = arguments[0],
                                i = 4 <= arguments.length ? o.call(arguments, 1, r = arguments.length - 2) : (r = 1,
                                []),
                                d = arguments[r++],
                                a = arguments[r++],
                                m = t.slice(d, c),
                                f = l || /\n\n(?!\s*$)/.test(c),
                                s !== u - 1 && (l = "\n" === c[c.length - 1],
                                f || (f = l)),
                                y = c.length,
                                c = c.replace(/^\x20*([*+-]|\d+\.)\x20+/, function(e) {
                                    return m = m.subtract(m.slice(0, e)),
                                    ""
                                }),
                                y -= c.length,
                                g = m.clone(),
                                c = c.replace(RegExp("^\\x20{1," + y + "}", "gm"), function(e, n) {
                                    return m = m.subtract(g.slice(n, e)),
                                    ""
                                }),
                                h.push([{
                                    type: "list_item_start",
                                    tag: p,
                                    condense: !f,
                                    index: s
                                }].concat(o.call(e.blockLex(c, e._disallow(n, "top"), m)), [{
                                    type: "list_item_end"
                                }])),
                                s++,
                                ""
                            }
                        }(this)),
                        [{
                            type: "list_start",
                            tag: p
                        }].concat(o.call(r.flatten(h)), [{
                            type: "list_end"
                        }])
                    }
                },
                def: {
                    whenAllowed: "top",
                    match: /^\x20*\[([^\]]+)\]:\x20*<?([^\s>]+)>?(?:\x20+["(]([^\n]+)[")])?\x20*(?:\n+|$)/,
                    token: function(e, n) {
                        var t, a, i, r, o;
                        return t = e[0],
                        a = e[1],
                        o = e[2],
                        r = e[3],
                        i = n.references,
                        null != i && i.set(a, {
                            url: o,
                            title: r
                        }),
                        null
                    }
                },
                blockAtMention: {
                    nondefault: !0,
                    match: /^@([a-z0-9_]+)(?=\n|$)/,
                    token: function(e) {
                        var n, t;
                        return n = e[0],
                        t = e[1],
                        {
                            type: "atMention",
                            username: t
                        }
                    }
                },
                paragraph: {
                    whenAllowed: "top",
                    match: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|def|blockAtMention))+)\n*/,
                    token: function(e, n, t) {
                        var a, i, r;
                        return a = e[0],
                        i = e[1],
                        r = i.replace(/\n$/, ""),
                        {
                            type: "text",
                            children: {
                                text: r,
                                ranges: t.slice(0, r)
                            }
                        }
                    }
                },
                text: {
                    required: !0,
                    match: /^[^\n]+/,
                    token: function(e, n, t) {
                        var a;
                        return a = e[0],
                        {
                            type: "text",
                            canCondense: !0,
                            children: {
                                text: a,
                                ranges: t.slice(0, a)
                            }
                        }
                    }
                },
                error: {
                    required: !0,
                    match: /^[\s\S]+/,
                    token: function(e) {
                        var n;
                        throw n = e[0],
                        Error("invalid block input " + n)
                    }
                }
            },
            n = function(e) {
                var n, t, a, i, r, o;
                return n = e.image,
                a = e.text,
                o = e.url,
                i = e.title,
                t = e.ranges,
                r = {
                    title: i,
                    url: o
                },
                n ? (r.type = "image",
                r.text = a) : (r.type = "link",
                r.children = {
                    text: a,
                    ranges: t.slice(1, a)
                }),
                r
            }
            ,
            e.lexerInlineRules = {
                escape: {
                    required: !0,
                    match: /^\\([\\`*{}\[\]()\#+\-.!_>~|@:])/,
                    token: function(e) {
                        var n, t;
                        return n = e[0],
                        t = e[1],
                        {
                            type: "text",
                            text: t
                        }
                    }
                },
                tld: {
                    match: /(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/
                },
                bareLink: {
                    match: /([^\s\x00-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+\.)+(?:tld)/
                },
                autolink: {
                    match: /^<(?:(email)|(url|bareLink))>/,
                    token: function(e) {
                        var n, t, a;
                        return n = e[0],
                        t = e[1],
                        a = e[2],
                        null != t ? {
                            type: "mailto",
                            email: t
                        } : /^[\w-]+:/.test(a) ? {
                            type: "link",
                            url: a
                        } : {
                            type: "link",
                            url: "http://" + a,
                            text: a
                        }
                    }
                },
                email: {
                    match: /^[-a-z0-9\+\._'%]+@[a-z0-9-\.]+\.[a-z]{2,}/,
                    token: function(e) {
                        var n;
                        return n = e[0],
                        {
                            type: "mailto",
                            email: n
                        }
                    }
                },
                inside: {
                    match: /(?:\[[^\]\[]*\]|[^\]\[]|\](?=[^\[]*\]))*/
                },
                href: {
                    match: /\s*<?((?:[^\s\(\)]?(?:\([^\s()<>]*\)|\()?)+)>?(?:\s+['"]([\s\S]*?)['"])?\s*/
                },
                emailLink: {
                    match: /^\[(inside)\]\((email)\)/,
                    token: function(e) {
                        var n, t, a;
                        return n = e[0],
                        a = e[1],
                        t = e[2],
                        {
                            type: "mailto",
                            email: t,
                            text: a
                        }
                    }
                },
                link: {
                    match: /^\[(inside)\]\(href\)/,
                    token: function(e, t, a) {
                        var i, r, o, s;
                        return i = e[0],
                        r = e[1],
                        s = e[2],
                        o = e[3],
                        n({
                            text: r,
                            url: s,
                            title: o,
                            ranges: a
                        })
                    }
                },
                image: {
                    match: /^(!)\[(inside)\]\(href\)/,
                    token: function(e, t, a) {
                        var i, r, o, s, u;
                        return i = e[0],
                        r = e[1],
                        o = e[2],
                        u = e[3],
                        s = e[4],
                        n({
                            image: !0,
                            text: o,
                            url: u,
                            title: s,
                            ranges: a
                        })
                    }
                },
                reflink: {
                    match: /^(!?)\[(inside)\]\s*\[([^\]]*)\]/,
                    token: function(e, t, a) {
                        var i, r, o, s, u, h;
                        return i = e[0],
                        r = e[1],
                        h = e[2],
                        u = e[3],
                        null == (o = null != (s = t.references) ? s.get(u || h) : void 0) ? !1 : n({
                            image: r,
                            text: h,
                            url: o.url,
                            title: o.title,
                            ranges: a
                        })
                    }
                },
                nolink: {
                    match: /^(!?)\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
                    token: function(e, t, a) {
                        var i, r, o, s, u;
                        return i = e[0],
                        r = e[1],
                        u = e[2],
                        null == (o = null != (s = t.references) ? s.get(u) : void 0) ? !1 : n({
                            image: r,
                            text: u,
                            url: o.url,
                            title: o.title,
                            ranges: a
                        })
                    }
                },
                url: {
                    whenAllowed: "autolink",
                    match: /^((?:[\w-]+:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:bareLink)\b)/,
                    token: function(e) {
                        var n;
                        return n = e[0],
                        /^[a-z]+:/.test(n) ? {
                            type: "link",
                            url: n
                        } : {
                            type: "link",
                            url: "http://" + n,
                            text: n
                        }
                    }
                },
                strong: {
                    match: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
                    token: function(e, n, t) {
                        var a, i, r, s;
                        return a = e[0],
                        s = e[1],
                        i = e[2],
                        r = null != s ? s : i,
                        [{
                            type: "strong_start"
                        }].concat(o.call(this.inlineLex(r, n, t.slice(2, r))), [{
                            type: "strong_end"
                        }])
                    }
                },
                em: {
                    match: /^\b_([\s\S]*?[^_])_(?!_)\b|^\*([\s\S]*?[^*])\*(?!\*)/,
                    token: function(e, n, t) {
                        var a, i, r, s;
                        return a = e[0],
                        s = e[1],
                        i = e[2],
                        r = null != s ? s : i,
                        [{
                            type: "em_start"
                        }].concat(o.call(this.inlineLex(r, n, t.slice(1, r))), [{
                            type: "em_end"
                        }])
                    }
                },
                strikethrough: {
                    match: /^~~([\s\S]+?)~~/,
                    token: function(e, n, t) {
                        var a, i, r;
                        return a = e[0],
                        i = e[1],
                        r = i,
                        [{
                            type: "strikethrough_start"
                        }].concat(o.call(this.inlineLex(r, n, t.slice(2, r))), [{
                            type: "strikethrough_end"
                        }])
                    }
                },
                code: {
                    match: /^(`+)\s*((?:\1`+|[\s\S])+?)\s*\1(?!`)/,
                    token: function(e) {
                        var n, t, a;
                        return n = e[0],
                        a = e[1],
                        t = e[2],
                        {
                            type: "code",
                            text: t
                        }
                    }
                },
                break: {
                    match: /^\x20*\n(?!\s*$)/,
                    token: function() {
                        return {
                            type: "break"
                        }
                    }
                },
                atMention: {
                    match: /^@([a-z0-9_]+)/,
                    token: function(e) {
                        var n, t;
                        return n = e[0],
                        t = e[1],
                        {
                            type: "atMention",
                            username: t
                        }
                    }
                },
                emoji: {
                    match: /^:([a-z0-9_+-]+):/,
                    token: function(e) {
                        var n, t;
                        return n = e[0],
                        t = e[1],
                        {
                            type: "emoji",
                            emoji: t
                        }
                    }
                },
                hashtag: {
                    nondefault: !0,
                    match: /^\#([\S]+)/,
                    token: function(e) {
                        var n, t;
                        return n = e[0],
                        t = e[1],
                        {
                            type: "text",
                            text: n
                        }
                    }
                },
                text: {
                    required: !0,
                    match: /^[\s\S]+?(?:\w[@\:][\s\S]+?)?(?=[\\<!\[_*`~]|\x20*\n|[@:]|(?:\b(?:url|email))|$)/,
                    token: function(e) {
                        var n;
                        return n = e[0],
                        {
                            type: "text",
                            text: n
                        }
                    }
                },
                error: {
                    required: !0,
                    match: /^[\s\S]+/,
                    token: function(e) {
                        var n;
                        throw n = e[0],
                        Error("invalid inline input " + n)
                    }
                }
            },
            i = function(e) {
                var n, t, a, i;
                return i = e.username,
                null != this.options.lookupMember && (t = this.options.lookupMember(i, this.state),
                a = t[0],
                n = t[1],
                null != a) ? this.html("span", "@" + i, {
                    attrs: {
                        class: "atMention" + (n ? " me" : ""),
                        title: "" + a
                    }
                }) : this.text("@" + i)
            }
            ,
            e.prototype.parseBlockOutput = {
                space: function() {
                    return ""
                },
                hr: function() {
                    return this.htmln("hr", null)
                },
                heading: function(e) {
                    var n, t;
                    return t = e.depth,
                    n = e.children,
                    this.htmln("h" + t, this.children(n))
                },
                blockquote_start: function() {
                    return this.htmln("blockquote", this.process("blockquote_end"), {
                        newlineAfterTag: !0
                    })
                },
                list_start: function(e) {
                    var n;
                    return n = e.tag,
                    this.htmln(n, this.process("list_end"), {
                        newlineAfterTag: !0
                    })
                },
                list_item_start: function(e) {
                    var n;
                    return n = e.condense,
                    this.htmln("li", this.process("list_item_end", n))
                },
                text: function(e) {
                    var n;
                    return n = e.children,
                    this.htmln("p", this.children(n))
                },
                code: function(e) {
                    var n;
                    return n = e.text,
                    this.htmln("code", this.text(n), {
                        preTag: "<pre>",
                        postTag: "</pre>"
                    })
                },
                atMention: i
            },
            e.prototype.parseInlineOutput = {
                text: function(e) {
                    var n;
                    return n = e.text,
                    this.text(n)
                },
                strong_start: function() {
                    return this.html("strong", this.process("strong_end"))
                },
                em_start: function() {
                    return this.html("em", this.process("em_end"))
                },
                strikethrough_start: function() {
                    return this.html("del", this.process("strikethrough_end"))
                },
                code: function(e) {
                    var n;
                    return n = e.text,
                    this.html("code", this.escape(n))
                },
                break: function() {
                    return this.html("br", null)
                },
                link: function(e) {
                    var n, t, a, i, r, o, s, u;
                    return u = e.url,
                    o = e.text,
                    s = e.title,
                    n = e.children,
                    t = null != n ? this.children(n) : this.escape(null != o ? o : u),
                    i = this.options.shouldOpenLinkInNewTab(u),
                    r = i ? "_blank" : null,
                    a = i ? "noreferrer" : null,
                    this.html("a", t, {
                        attrs: {
                            href: u,
                            title: s,
                            target: r,
                            rel: a
                        }
                    })
                },
                mailto: function(e) {
                    var n, t;
                    return n = e.email,
                    t = e.text,
                    this.html("a", this.escape(null != t ? t : n), {
                        attrs: {
                            href: "mailto:" + n
                        }
                    })
                },
                image: function(e) {
                    var n, t, a;
                    return a = e.url,
                    t = e.title,
                    n = e.text,
                    this.html("img", null, {
                        attrs: {
                            src: a,
                            alt: n,
                            title: t
                        }
                    })
                },
                atMention: i,
                emoji: function(e) {
                    var n, t, a;
                    return t = e.emoji,
                    a = "function" == typeof (n = this.options).lookupEmoji ? n.lookupEmoji(t, this.state) : void 0,
                    null != a ? this.html("img", null, {
                        attrs: {
                            src: a,
                            title: t,
                            class: "emoji"
                        }
                    }) : this.text(":" + t + ":")
                }
            },
            e.prototype.parseBlockOutputText = {
                space: function() {
                    return this.plaintextn("")
                },
                hr: function() {
                    return this.plaintextn("")
                },
                heading: function(e) {
                    var n, t;
                    return t = e.depth,
                    n = e.children,
                    this.plaintextn(this.textChildren(n))
                },
                blockquote_start: function() {
                    return this.plaintext(this.textProcess("blockquote_end"))
                },
                list_start: function(e) {
                    var n, t;
                    return t = e.tag,
                    function() {
                        var e, t, a, i;
                        for (a = this.textProcess("list_end").split("\n"),
                        i = [],
                        e = 0,
                        t = a.length; t > e; e++)
                            n = a[e],
                            i.push(this.plaintextn(" " + n));
                        return i
                    }
                    .call(this).join("")
                },
                list_item_start: function(e) {
                    var n, t, a, i;
                    return i = e.tag,
                    a = e.index,
                    t = e.condense,
                    n = "ol" === i ? a + 1 + "." : "*",
                    this.plaintextn(n + " " + this.textProcess("list_item_end", t))
                },
                text: function(e) {
                    var n;
                    return n = e.children,
                    this.plaintextn(this.textChildren(n) + "\n")
                },
                code: function(e) {
                    var n;
                    return n = e.text,
                    this.plaintextn(n)
                },
                atMention: function(e) {
                    var n;
                    return n = e.username,
                    this.plaintextn(n)
                }
            },
            e.prototype.parseInlineOutputText = {
                text: function(e) {
                    var n;
                    return n = e.text,
                    this.plaintext(n)
                },
                strong_start: function() {
                    return this.plaintext(this.textProcess("strong_end"))
                },
                em_start: function() {
                    return this.plaintext(this.textProcess("em_end"))
                },
                code: function(e) {
                    var n;
                    return n = e.text,
                    this.plaintext(n)
                },
                break: function() {
                    return this.plaintext("\n")
                },
                link: function(e) {
                    var n, t, a, i;
                    return i = e.url,
                    t = e.text,
                    a = e.title,
                    n = e.children,
                    null != n ? this.plaintext(this.textChildren(n) + " (" + i + ")") : null != t ? this.plaintext(t + " (" + i + ")") : this.plaintext(i)
                },
                mailto: function(e) {
                    var n, t;
                    return n = e.email,
                    t = e.text,
                    null != t ? this.plaintext(t + " (" + n + ")") : this.plaintext(n)
                },
                image: function(e) {
                    var n, t, a;
                    return a = e.url,
                    t = e.title,
                    n = e.text,
                    null != t ? this.plaintext(t) : this.plaintext("")
                },
                atMention: function(e) {
                    var n;
                    return n = e.username,
                    this.plaintext(n)
                },
                emoji: function(e) {
                    var n;
                    return n = e.emoji,
                    this.plaintext(":" + n + ":")
                }
            },
            e.prototype.lex = function(e, n, t, a) {
                var i, o, u, h, l, c, d, p, m, g, f, y, k, v, M, b, E, w, T, _, S;
                for (null == t && (t = {}),
                null == t.locations && (t.locations = []),
                g = a.clone(),
                n = n.replace(/^\x20+$/gm, function(e, n) {
                    return a = a.subtract(g.slice(n, e)),
                    ""
                }),
                o = [],
                l = 0; n; )
                    for (v in e)
                        if (f = e[v],
                        m = f.match_i,
                        T = f.token,
                        S = f.whenAllowed,
                        null != T && !(null != S && null != t.disallowed && s.call(t.disallowed, S) >= 0) && null != (u = m.exec(n))) {
                            if (i = u[0],
                            _ = a.slice(l, i),
                            M = T.call(this, u, t, _),
                            M === !1)
                                continue;
                            if (null != M)
                                for (r.isArray(M) || (M = [M]),
                                h = 0,
                                d = M.length; d > h; h++)
                                    w = M[h],
                                    o.push(w);
                            if (0 === i.length)
                                throw Error("infinite loop");
                            for (n = n.substr(i.length),
                            y = _.spans,
                            c = 0,
                            p = y.length; p > c; c++)
                                k = y[c],
                                b = k[0],
                                E = k[1],
                                t.locations.push({
                                    start: b,
                                    stop: E,
                                    rule: v
                                });
                            l += i.length;
                            break
                        }
                return o
            }
            ,
            e.prototype._expandChildren = function(e, n, t) {
                var i, r, s, u, h, l, c, d, p, m, g, f, y, k, v;
                if (0 !== e.length) {
                    if (t)
                        for (c = e[0],
                        y = 2 <= e.length ? o.call(e, 1) : [],
                        m = [c],
                        s = function(e, n) {
                            return e.canCondense && null != e.children && e.type === n
                        }
                        ,
                        h = u = 0,
                        d = y.length; d > u; h = ++u)
                            v = y[h],
                            s(c, "text") && (s(v, "text") || s(v, "space") && s(y[h + 1], "text")) ? c.children = {
                                text: c.children.text + v.children.text,
                                ranges: new a(o.call(c.children.ranges.spans).concat(o.call(v.children.ranges.spans)))
                            } : (m.push(v),
                            c = v);
                    else
                        m = e;
                    for (l = 0,
                    p = m.length; p > l; l++)
                        v = m[l],
                        null != v.children && (f = v.children,
                        k = f.text,
                        g = f.ranges,
                        r = "link" === v.type ? this._disallow(n, "autolink") : n,
                        i = this.inlineLex(k, r, g),
                        this._expandChildren(i, r),
                        v.children = i)
                }
            }
            ,
            e.prototype.blockLex = function(e, n, t, i) {
                var r;
                return null == t && (t = a.fromString(e)),
                null == n.references && (n.references = {
                    map: {},
                    set: function(e, n) {
                        return this.map[e.toLowerCase()] = n
                    },
                    get: function(e) {
                        return this.map[e.toLowerCase()]
                    }
                }),
                r = this.lex(this.lexerBlockRules, e, n, t),
                i && this._expandChildren(r, n, !0),
                r
            }
            ,
            e.prototype.inlineLex = function(e, n, t, i) {
                var r;
                return null == t && (t = a.fromString(e)),
                r = this.lex(this.lexerInlineRules, e, n, t),
                i && this._expandChildren(r, n, !0),
                r
            }
            ,
            e.prototype.parse = function(e, n, t) {
                var a;
                return a = {
                    options: this.options,
                    state: t,
                    index: 0,
                    next: function() {
                        return this.current = n[this.index++]
                    },
                    process: function(n, t) {
                        var i, r, o;
                        return i = function() {
                            var i;
                            for (i = []; null != (o = this.next()) && o.type !== n; )
                                if (t && "text" === o.type)
                                    i.push(a.children(o.children));
                                else {
                                    if (r = e[o.type],
                                    null == r)
                                        throw Error("invalid token type " + o.type);
                                    i.push(r.call(a, o))
                                }
                            return i
                        }
                        .call(this),
                        i.join("")
                    },
                    textProcess: function(n, t) {
                        var i, r, o;
                        return i = function() {
                            var i;
                            for (i = []; null != (o = this.next()) && o.type !== n; )
                                if (t && "text" === o.type)
                                    i.push(a.textChildren(o.children));
                                else {
                                    if (r = e[o.type],
                                    null == r)
                                        throw Error("invalid token type " + o.type);
                                    i.push(r.call(a, o))
                                }
                            return i
                        }
                        .call(this),
                        i.join("")
                    },
                    children: function(e) {
                        return function(n, a) {
                            return e.parseInline(n, t)
                        }
                    }(this),
                    textChildren: function(e) {
                        return function(n, a) {
                            return e.parseInlineText(n, t)
                        }
                    }(this),
                    escape: function(e) {
                        return null == e && (e = "undefined"),
                        e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
                    },
                    safeUrl: function(e) {
                        return /^\//.test(e) ? e : /^[^\/]*:/.test(e) ? e.replace(/^[^:]*/, function(e) {
                            return e = e.toLowerCase().replace(/[^\w-]/g, ""),
                            !e || /script|data/.test(e) ? "http" : e
                        }) : "http://" + e
                    },
                    text: function(e) {
                        return this.escape(e)
                    },
                    plaintext: function(e) {
                        return e
                    },
                    plaintextn: function(e) {
                        return this.plaintext(e) + "\n"
                    },
                    html: function(e, n, t) {
                        var a, i, r, o, s, u, h, l;
                        if (h = null != t ? t : {},
                        a = h.attrs,
                        r = h.newlineAfterTag,
                        u = h.preTag,
                        s = h.postTag,
                        o = "",
                        null != u && (o += u),
                        o += "<" + e,
                        null != a)
                            for (i in a)
                                l = a[i],
                                null != l && (("src" === i || "href" === i) && (l = this.safeUrl(l)),
                                o += " " + (i + '="' + this.escape(l) + '"'));
                        return o += ">",
                        r && (o += "\n"),
                        null != n && (o += n + ("</" + e + ">"),
                        null != s && (o += s)),
                        o
                    },
                    htmln: function() {
                        var e;
                        return e = 1 <= arguments.length ? o.call(arguments, 0) : [],
                        this.html.apply(this, e) + "\n"
                    }
                },
                a.process()
            }
            ,
            e.prototype.parseBlocks = function(e, n) {
                return null == n && (n = {}),
                this.parse(this.parseBlockOutput, e, n)
            }
            ,
            e.prototype.parseInline = function(e, n) {
                return null == n && (n = {}),
                this.parse(this.parseInlineOutput, e, n)
            }
            ,
            e.prototype.parseBlocksText = function(e, n) {
                return null == n && (n = {}),
                this.parse(this.parseBlockOutputText, e, n)
            }
            ,
            e.prototype.parseInlineText = function(e, n) {
                return null == n && (n = {}),
                this.parse(this.parseInlineOutputText, e, n)
            }
            ,
            t = function(e) {
                return e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n")
            }
            ,
            e.prototype.format = function(e, n) {
                var a, i;
                return null == n && (n = {}),
                e = t(e),
                a = this.options.inlineOnly ? this.formatInline(e, n) : (i = this.blockLex(e, n, null, !0),
                this.parseBlocks(i, n)),
                {
                    output: a,
                    locations: n.locations
                }
            }
            ,
            e.prototype.formatInline = function(e, n, t) {
                return null == n && (n = {}),
                null == t && (t = null),
                this.parseInline(this.inlineLex(e, n, t, !0), n)
            }
            ,
            e.prototype.text = function(e, n) {
                var a, i;
                return null == n && (n = {}),
                e = t(e),
                a = this.options.inlineOnly ? this.textInline(e, n) : (i = this.blockLex(e, n, null, !0),
                this.parseBlocksText(i, n)),
                a = a.replace(/^\s*|\s*$/g, "").replace(/\n(\x20*\n)+/g, "\n\n"),
                {
                    output: a,
                    locations: n.locations
                }
            }
            ,
            e.prototype.textInline = function(e, n, t) {
                return null == n && (n = {}),
                null == t && (t = null),
                this.parseInlineText(this.inlineLex(e, n, t, !0), n)
            }
            ,
            e.prototype.analyze = function(e, n) {
                return null == n && (n = {}),
                e = t(e),
                this.options.inlineOnly ? this.inlineLex(e, n) : this.blockLex(e, n, null, !0),
                n.locations
            }
            ,
            e.prototype.getMatches = function(e, n, t) {
                var a, i, r, o, s, u, h, l;
                null == t && (t = {}),
                o = this.analyze(e),
                h = {};
                for (l in n)
                    h[l] = [];
                for (a = 0,
                r = o.length; r > a; a++)
                    i = o[a],
                    i.rule in n && (s = e.slice(i.start, i.stop),
                    u = i.rule in t ? t[i.rule](s) : s,
                    h[i.rule].push(u));
                return h
            }
            ,
            e.prototype.replace = function(e, n, t) {
                var a, i, o, u, h, l, c, d, p;
                for (o = r.sortBy(this.analyze(e), function(e) {
                    var n;
                    return n = e.start,
                    -n
                }),
                u = e.length,
                h = e,
                a = 0,
                i = o.length; i > a; a++)
                    l = o[a],
                    c = l.rule,
                    d = l.start,
                    p = l.stop,
                    s.call(n, c) >= 0 && u >= p && (h = [h.slice(0, d), t(h.slice(d, p), {
                        rule: c,
                        options: this.options
                    }), h.slice(p)].join(""),
                    u = d);
                return h
            }
            ,
            e
        }(),
        a = function() {
            function e(e) {
                this.spans = null != e ? e : []
            }
            var n, t, a;
            return e.fromString = function(n) {
                return new e([[0, n.length]])
            }
            ,
            e.prototype.clone = function() {
                return new e(r.clone(this.spans))
            }
            ,
            a = function(e, n) {
                var t, a, i, o, s, u, h, l, c;
                for (t = [],
                u = r.clone(e),
                l = 0; u.length; )
                    a = u.shift(),
                    l >= n.length ? t.push(a) : (s = a[0],
                    o = a[1],
                    i = n[l],
                    c = i[0],
                    h = i[1],
                    s >= h ? (u.unshift(a),
                    l++) : c >= o ? t.push(a) : s >= c && o > h ? (u.unshift([h, o]),
                    l++) : s >= c && h >= o || (c > s && o > h ? (t.push([s, c]),
                    u.unshift([h, o]),
                    l++) : c > s && h >= o && t.push([s, c])));
                return t
            }
            ,
            e.prototype.subtract = function(n) {
                return new e(a(this.spans, n.spans))
            }
            ,
            n = function(e, n) {
                var t, a, i, r, o, s;
                for (t = 0,
                a = e.length; a > t; t++) {
                    if (i = e[t],
                    o = i[0],
                    s = i[1],
                    r = s - o,
                    r >= n)
                        return o + n;
                    n -= r
                }
                throw Error("invalid position")
            }
            ,
            t = function(e, t, i) {
                var o, s, u, h;
                return u = n(e, t),
                h = n(e, i),
                s = [0, u],
                o = [h, r.last(e)[1]],
                a(e, [s, o])
            }
            ,
            e.prototype.slice = function(n, a) {
                return r.isString(a) ? this.slice(n, n + a.length) : new e(t(this.spans, n, a))
            }
            ,
            e
        }(),
        n.exports = i
    }