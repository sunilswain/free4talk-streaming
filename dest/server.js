require('source-map-support').install(),
  (function(e) {
    var t = {};
    function n(r) {
      if (t[r]) return t[r].exports;
      var o = (t[r] = { i: r, l: !1, exports: {} });
      return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    (n.m = e),
      (n.c = t),
      (n.d = function(e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
      }),
      (n.r = function(e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (n.t = function(e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var o in e)
            n.d(
              r,
              o,
              function(t) {
                return e[t];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return n.d(t, 'a', t), t;
      }),
      (n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.p = ''),
      n((n.s = 7));
  })([
    function(e, t) {
      e.exports = require('path');
    },
    function(e, t) {
      e.exports = require('express');
    },
    function(e, t, n) {
      const r = n(16),
        o = n(17),
        s = n(3),
        a = {},
        i = async (e, t = !0) => {
          const n = await o.getTrackers(),
            a = { ...s.torrent, trackers: n },
            i = r(e, a);
          return new Promise((e, n) => {
            const r = setTimeout(() => {
              i.destroy(), n(new Error('Get Magnet Info Timeout'));
            }, 3e4);
            i.on('ready', () => {
              clearTimeout(r);
              const n = i.files.filter(
                e => (e.deselect(), (e.engine = i), e.name.endsWith('.mp4'))
              );
              t && i.destroy(), e(n);
            });
          });
        };
      e.exports = {
        getMp4Files: i,
        getFile: async (e, t) => {
          if (a.file) {
            if (a.magnetUrl === e && a.path === t) return a.file;
            a.file.engine.destroy();
          }
          const n = (await i(e, !1)).find(e => e.path === t);
          if (!n) throw new Error('File is not found');
          return (a.magnetUrl = e), (a.path = t), (a.file = n), n;
        },
      };
    },
    function(e, t, n) {
      const r = n(0);
      e.exports = {
        port: 8888,
        torrent: {
          connections: 100,
          uploads: 0,
          tmp: r.resolve(__dirname, '../tmp'),
          path: r.resolve(__dirname, '../tmp/my-files'),
          verify: !0,
          dht: !0,
          tracker: !0,
          trackers: [],
        },
      };
    },
    ,
    ,
    ,
    function(e, t, n) {
      const r = n(1),
        o = n(8),
        s = n(9),
        a = n(3),
        i = r();
      i.use('/streaming', o(), s),
        i.listen(a.port, () => {
          console.info(
            '\nFree4Talk-Streaming-Server is started.\nYou can comeback Free4Talk and start to use Streaming.\n  '.trim()
          );
        });
    },
    function(e, t) {
      e.exports = require('cors');
    },
    function(e, t, n) {
      const r = n(1),
        o = n(10),
        s = (n(11), n(12)),
        a = n(13),
        i = n(14),
        c = n(15),
        u = n(21),
        p = r.Router();
      p.use('/ping', s),
        p.use(i('before')),
        p.use(o.urlencoded({ extended: !0 })),
        p.use(o.json()),
        p.use(i('after')),
        p.post('/get/files', c),
        p.get('/get/video', u),
        p.use(a),
        (e.exports = p);
    },
    function(e, t) {
      e.exports = require('body-parser');
    },
    function(e, t) {
      e.exports = (e = 1e3) =>
        async function(t, n, r) {
          await new Promise(t => setTimeout(t, e)), r();
        };
    },
    function(e, t) {
      e.exports = function(e, t) {
        return t.send('pong');
      };
    },
    function(e, t) {
      e.exports = function(e, t, n, r) {
        e instanceof Error
          ? (console.error(e.stack),
            n.set({ Connection: 'close' }),
            n
              .status(500)
              .json({
                success: !1,
                type: e.type,
                title: e.title,
                error: e.message,
                data: null,
              }))
          : e instanceof Buffer
          ? (n.set({
              'Content-Type': 'application/json',
              'Content-Length': e.length,
            }),
            n.write(e),
            n.end())
          : n.json({ success: !0, error: null, data: e });
      };
    },
    function(e, t) {
      function n(e, t, n) {
        'POST' === e.method
          ? (e.query.a &&
              ((e.headers['content-type'] = 'application/json'),
              delete e.query.a),
            n())
          : n();
      }
      function r(e, t, n) {
        'POST' === e.method
          ? (e.body && e.body.body && (e.body = e.body.body), n())
          : n();
      }
      e.exports = function(e) {
        return 'before' === e ? n : r;
      };
    },
    function(e, t, n) {
      const r = n(2);
      e.exports = async function(e, t, n) {
        try {
          const { url: t } = e.body;
          n({
            files: (await r.getMp4Files(t)).map(e => ({
              name: e.name,
              path: e.path,
              length: e.length,
            })),
          });
        } catch (e) {
          n(e);
        }
      };
    },
    function(e, t) {
      e.exports = require('torrent-stream');
    },
    function(e, t, n) {
      const r = n(18),
        { axiosFetch: o } = n(19),
        s = {};
      e.exports = {
        getTrackers: async () => {
          if (s.trackers && Date.now() - s.at < r('1h')) return s.trackers;
          const { data: e } = await o({
              url: 'https://newtrackon.com/api/stable',
              method: 'GET',
            }),
            t = (e || '')
              .split('\n')
              .filter(Boolean)
              .map(e => e.replace('/announce', ''));
          return t.length && ((s.trackers = t), (s.at = Date.now())), t;
        },
      };
    },
    function(e, t) {
      e.exports = require('ms');
    },
    function(e, t, n) {
      const r = n(20),
        o = {
          headers: { 'Accept-Encoding': '' },
          timeout: 1e4,
          decompress: !1,
          validateStatus: () => !0,
        },
        s = r.create({ ...o });
      e.exports = { axios: r, axiosFetch: s };
    },
    function(e, t) {
      e.exports = require('axios');
    },
    function(e, t, n) {
      const r = n(2);
      e.exports = async function(e, t, n) {
        try {
          const { url: n, path: o } = e.query,
            s = await r.getFile(n, o),
            a = s.length,
            { range: i } = e.headers;
          let c;
          if (i) {
            const { start: e, end: n } = ((e, t) => {
              let [n, r] = e.replace(/bytes=/, '').split('-');
              return (
                (n = parseInt(n, 10)),
                (r = r ? parseInt(r, 10) : t - 1),
                !Number.isNaN(n) && Number.isNaN(r) && (r = t - 1),
                Number.isNaN(n) &&
                  !Number.isNaN(r) &&
                  ((n = t - r), (r = t - 1)),
                { start: n, end: r }
              );
            })(i, a);
            if (e >= a || n >= a)
              return (
                t.writeHead(416, { 'Content-Range': 'bytes */' + a }),
                void t.end()
              );
            t.writeHead(206, {
              'Content-Range': `bytes ${e}-${n}/${a}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': n - e + 1,
              'Content-Type': 'video/mp4',
            }),
              (c = s.createReadStream({ start: e, end: n }));
          } else
            t.writeHead(200, {
              'Content-Length': a,
              'Content-Type': 'video/mp4',
            }),
              (c = s.createReadStream());
          c.pipe(t),
            t.on('close', () => {
              c.destroy();
            });
        } catch (e) {
          n(e);
        }
      };
    },
  ]);
//# sourceMappingURL=server.js.map
