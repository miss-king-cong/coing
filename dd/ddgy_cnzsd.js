/*
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#滴滴果园吹牛赚水滴
00 00 0,2,4,6,8,10,12,14,16,18,20,22 * * * jd_speed_sign.js, tag=滴滴果园吹牛赚水滴, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "00 00 0,2,4,6,8,10,12,14,16,18,20,22 * * *" script-path=jd_speed_sign.js,tag=滴滴果园吹牛赚水滴

===============Surge=================
滴滴果园吹牛赚水滴 = type=cron,cronexp="00 00 0,2,4,6,8,10,12,14,16,18,20,22 * * *",wake-system=1,timeout=33600,script-path=jd_speed_sign.js

============小火箭=========
滴滴果园吹牛赚水滴 = type=cron,script-path=jd_speed_sign.js, cronexpr="00 00 0,2,4,6,8,10,12,14,16,18,20,22 * * *", timeout=33600, enable=true
*/

const $ = new Env('滴滴果园吹牛赚水滴');
var appUrlArr = [];
var xpsid = '';
var xoid = '';
var uid = '';
var xpsid_root = '';
var token = '';
var wsgsig = '';

!(async () => {
    //检查环境变量
    if (!(await checkEnv())) {
        return;
    } else {
        //获取用户信息
        await initAccountInfo();
    }
})().catch((e) => $.logErr(e)).finally(() => $.done());


async function checkEnv() {
    if ($.isNode()) {
        DdgyWxUrl = process.env.DdgyWxUrl;

    } else {
        DdgyWxUrl = $.getdata('DdgyWxUrl');
    }
    if (!DdgyWxUrl) {
        let str1 = DdgyWxUrl ? "" : "DdgyWxUrl";
        $.log(`未找到环境变量: ${str1}\n`);
        return false;
    }
    if (DdgyWxUrl.indexOf('#') != -1) {
        appUrlArrs = DdgyWxUrl.split('#');
        $.log(`您选择的是用"#"隔开DdgyWxUrl\n`);
    } else if (DdgyWxUrl.indexOf('\n') != -1) {
        appUrlArrs = DdgyWxUrl.split('\n');
        $.log(`您选择的是用"\\n"隔开DdgyWxUrl\n`);
    } else if (DdgyWxUrl.indexOf('@') != -1) {
        appUrlArrs = DdgyWxUrl.split('@');
        $.log(`您选择的是用"@"隔开DdgyWxUrl\n`);
    }
    Object.keys(appUrlArrs).forEach((item) => {
        if (appUrlArrs[item]) {
            appUrlArr.push(appUrlArrs[item]);
        }
    });
    totalUser = appUrlArr.length;
    $.log(`共找到${totalUser}个用户\n`);
    return true;
}

async function getEnvParam(userNum) {
    let appUrlArrVal = appUrlArr[userNum];
    if (appUrlArrVal.indexOf('?') != -1) {
        let str = appUrlArrVal.split('?')[1];
        let str2 = str.split('&');
        for (let i = 0; i < str2.length; i++) {
            let str3 = str2[i];
            if (str3.indexOf('xpsid') != -1) {
                xpsid = str3.split('=')[1];
            } else if (str3.indexOf('xoid') != -1) {
                xoid = str3.split('=')[1];
            } else if (str3.indexOf('uid') != -1) {
                uid = str3.split('=')[1];
            } else if (str3.indexOf('xpsid_root') != -1) {
                xpsid_root = str3.split('=')[1];
            } else if (str3.indexOf('token') != -1) {
                token = str3.split('=')[1];
            } else if (str3.indexOf('wsgsig') != -1) {
                wsgsig = str3.split('=')[1];
            }
        }
    } else {
        $.log("DdgyWxUrl错误");
    }
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        await goal();
        await heartbeatDog();
        await recBucketWater();
        await $.wait(5000); //等待5秒
    }
}

//吹牛赚水滴刷水滴
async function goal() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/cow/goal?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": `${xpsid}`,
                "dchn": "EpjLe00",
                "xoid": `${xoid}`,
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": `${xpsid_root}`,
                "xpsid_from": "",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`吹牛赚水滴刷水滴Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`吹牛赚水滴刷水滴成功` + data2.data.water_wallet.cur);
                        await $.wait(2000); //等待2秒
                        await goal();
                    } else {
                        $.log(`吹牛赚水滴刷水滴` + data2.errmsg);
                        await award();
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//吹牛赚水滴领水滴
async function award() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/cow/award?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": `${xpsid}`,
                "dchn": "EpjLe00",
                "xoid": `${xoid}`,
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": `${xpsid_root}`,
                "xpsid_from": "",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`吹牛赚水滴领水滴Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`吹牛赚水滴领水滴成功`);
                    } else {
                        $.log(`吹牛赚水滴领水滴` + data2.errmsg);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//狗狗在线2分钟领化肥
async function heartbeatDog() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/heartbeatDog?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": `${xpsid}`,
                "dchn": "EpjLe00",
                "xoid": `${xoid}`,
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": `${xpsid_root}`,
                "xpsid_from": "",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`领取化肥Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`领取化肥成功` + data2.data.fertilizer);
                    } else {
                        $.log(`领取化肥次数今日已满`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//领取水桶水滴
async function recBucketWater() {
    return new Promise((resolve) => {
        let url = {
            url: `https://game.xiaojukeji.com/api/game/plant/recBucketWater?wsgsig=${wsgsig}`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'D-Header-T': `${token}`
            },
            body: JSON.stringify({
                "xbiz": "240301",
                "prod_key": "didi-orchard",
                "xpsid": `${xpsid}`,
                "dchn": "EpjLe00",
                "xoid": `${xoid}`,
                "uid": `${uid}`,
                "xenv": "wxmp",
                "xspm_from": "none.none.none.none",
                "xpsid_root": `${xpsid_root}`,
                "xpsid_from": "",
                "xpsid_share": "",
                "platform": 1,
                "token": `${token}`
            }),
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`领取水桶水滴Api请求失败`);
                } else {
                    let data2 = JSON.parse(data);
                    if (data2.errno == 0) {
                        $.log(`领取水桶水滴成功` + data2.data.rec_water);
                    } else {
                        $.log(`领取水桶水滴` + data2.errmsg);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t;
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s);
                });
            });
        }
        get(t) {
            return this.send.call(this.env, t);
        }
        post(t) {
            return this.send.call(this.env, t, "POST");
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports;
        }
        isQuanX() {
            return "undefined" != typeof $task;
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
        }
        isLoon() {
            return "undefined" != typeof $loon;
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t);
            } catch {
                return e;
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t);
            } catch {
                return e;
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t));
            } catch {}
            return s;
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e);
            } catch {
                return !1;
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i));
            });
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, (t, e, i) => s(i));
            }).catch(t => this.logErr(t));
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i));
                    } catch (t) {
                        return {};
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r;
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t);
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e;
                } catch (t) {
                    e = "";
                }
            }
            return e;
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i);
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i);
                }
            } else s = this.setval(t, e);
            return s;
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null;
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i);
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o);
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar;
                    }
                } catch (t) {
                    this.logErr(t);
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o);
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body);
            }));
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i);
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o);
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o);
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body);
                });
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t;
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        };
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        };
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        };
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h);
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t));
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
        }
    }(t, e);
}
