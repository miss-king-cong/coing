/*
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#吴江应急管理有奖答题
00 00 9,10,11,12,13,14,15 * * * jd_speed_sign.js, tag=吴江应急管理有奖答题, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "00 00 9,10,11,12,13,14,15 * * *" script-path=jd_speed_sign.js,tag=吴江应急管理有奖答题

===============Surge=================
吴江应急管理有奖答题 = type=cron,cronexp="00 00 9,10,11,12,13,14,15 * * *",wake-system=1,timeout=33600,script-path=jd_speed_sign.js

============小火箭=========
吴江应急管理有奖答题 = type=cron,script-path=jd_speed_sign.js, cronexpr="00 00 9,10,11,12,13,14,15 * * *", timeout=33600, enable=true
*/

const $ = new Env('吴江应急管理有奖答题');
var appUrlArr = [];
var appUrlArrs = '';
var MjyjglUrl = '';
var Authorization = '';
var userId = '';
var phone = '';
var userName = '';

!(async () => {
    //检查环境变量
    $.log(`开始检测环境变量`);
    if (!(await checkEnv())) {
        return;
    } else {
        //获取用户信息
        await initAccountInfo();
    }
})().catch((e) => $.logErr(e)).finally(() => $.done());


async function checkEnv() {
    if ($.isNode()) {
        MjyjglUrl = process.env.MjyjglUrl;
    } else {
        MjyjglUrl = $.getdata('MjyjglUrl');
    }
    if (!MjyjglUrl) {
        let str1 = MjyjglUrl ? "" : "MjyjglUrl";
        $.log(`未找到环境变量: ${str1}\n`);
        return false;
    }
    if (MjyjglUrl.indexOf('#') != -1) {
        appUrlArrs = MjyjglUrl.split('#');
        $.log(`您选择的是用"#"隔开MjyjglUrl\n`);
    } else if (MjyjglUrl.indexOf('\n') != -1) {
        appUrlArrs = MjyjglUrl.split('\n');
        $.log(`您选择的是用"\\n"隔开MjyjglUrl\n`);
    } else if (MjyjglUrl.indexOf('@') != -1) {
        appUrlArrs = MjyjglUrl.split('@');
        $.log(`您选择的是用"@"隔开MjyjglUrl\n`);
    } else {
        appUrlArrs = [MjyjglUrl];
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
    Authorization = appUrlArrVal.split("&")[0];
    userId = appUrlArrVal.split("&")[1];
}

async function initAccountInfo() {
    for (numUser = 0; numUser < totalUser; numUser++) {
        $.log(`用户` + (numUser + 1) + `开始执行`);
        await getEnvParam(numUser);
        phone = '';
        await getIntegral();
        if (phone != '') {
            $.log(`手机号:${phone} 日志`);
            await $.wait(5000); //等待5秒
            await updateChanceCount();
            await $.wait(5000); //等待5秒
            await findChance();
            await $.wait(5000); //等待5秒
            await getIntegral();
            await $.wait(5000); //等待5秒
        }
    }
}

function object2str(t) {
    var a = [];
    for (var b in t) a.push(b + "=" + t[b]);
    return a.join("&");
}

function object2query3(t) {
    var a = [];
    for (var b in t) a.push(b);
    a.sort();
    var c = [];
    for (var d in a) c.push(a[d] + "=" + t[a[d]]);
    return c.join("");
}

//查询
async function getIntegral() {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/el_exam_integral/getIntegral`,
            body: JSON.stringify({
                "userId": `${userId}`
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        phone = html.data.phone;
                        userName = html.data.userName;
                        var totalIntegral = html.data.totalIntegral;
                        var residualIntegral = html.data.residualIntegral;
                        $.log(`现有积分:` + totalIntegral + ` 总共获得过积分:` + residualIntegral);
                    } else {
                        $.log(`查询 ` + html.msg);
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

//分享
async function updateChanceCount() {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/el_exam_chance/updateChanceCount`,
            body: JSON.stringify({
                "eventName": "分享后增加次数"
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`分享Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        $.log(`分享 ` + html.msg);
                    } else {
                        $.log(`分享 ` + html.msg);
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

//查询答题次数
async function findChance() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/el_exam_chance/findChance`,
            body: JSON.stringify({
                "userId": `${userId}`,
                "year": year,
                "month": month,
                "day": day
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`查询答题次数Api请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let chanceCount = html.data.chanceCount;
                        $.log(`答题次数:` + chanceCount);
                        if (chanceCount > 0) {
                            await $.wait(5000); //等待5秒
                            await exam_detail();
                            await paging();
                            await create_paper();
                        }
                    } else {
                        $.log(`查询答题次数 ` + html.msg);
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

//exam_detail
async function exam_detail() {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/exam/exam/detail`,
            body: JSON.stringify({
                "id": "1663728908601487362"
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`exam_detailApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        $.log(`exam_detail ` + html.msg);
                    } else {
                        $.log(`exam_detail ` + html.msg);
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

//paging
async function paging() {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/paging`,
            body: JSON.stringify({
                "current": 1,
                "size": 10,
                "params": {
                    "userId": `${userId}`,
                    "examId": "1663728908601487362",
                    "state": 0
                }
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`pagingApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        $.log(`paging ` + html.msg);
                    } else {
                        $.log(`paging ` + html.msg);
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

//create-paper
async function create_paper() {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/create-paper`,
            body: JSON.stringify({
                "examId": "1663728908601487362",
                "password": ""
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`create-paperApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let id = html.data.id;
                        await $.wait(5000); //等待5秒
                        await paper_detail(id);
                    } else {
                        $.log(`create-paper ` + html.msg);
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

//paper-detail
async function paper_detail(id) {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/paper-detail`,
            body: JSON.stringify({
                "id": id
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`paper-detailApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let radioList = html.data.radioList;
                        let judgeList = html.data.judgeList;;
                        for (let i = 0; i < radioList.length; i++) {
                            let quId = radioList[i].quId;
                            let paperId = radioList[i].paperId;
                            await $.wait(5000); //等待5秒
                            await qu_detail(paperId, quId);
                        }
                        for (let i = 0; i < judgeList.length; i++) {
                            let quId = judgeList[i].quId;
                            let paperId = judgeList[i].paperId;
                            await $.wait(5000); //等待5秒
                            await qu_detail(paperId, quId);
                        }
                        await $.wait(5000); //等待5秒
                        await hand_exam(id);
                        await paper_result(id);
                        await updateUserIntegral();
                    } else {
                        $.log(`paper-detail ` + html.msg);
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

//qu-detail
async function qu_detail(paperId, quId) {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/qu-detail`,
            body: JSON.stringify({
                "paperId": paperId,
                "quId": quId
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`qu-detailApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let answerList = html.data.answerList;
                        await qu_qu_detail(paperId, quId, answerList);
                    } else {
                        $.log(`qu-detail ` + html.msg);
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

//qu/qu/detail
async function qu_qu_detail(paperId, quId, answerList) {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/qu/qu/detail`,
            body: JSON.stringify({
                "id": quId
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`qu/qu/detailApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        let answerList2 = html.data.answerList;
                        let id2;
                        for (let i = 0; i < answerList2.length; i++) {
                            let isRight = answerList2[i].isRight;
                            id2 = answerList2[i].id;
                            if (isRight) {
                                break;
                            }
                        }
                        for (let i = 0; i < answerList.length; i++) {
                            let answerId = answerList[i].answerId;
                            let id = answerList[i].id;
                            if (id2 == answerId) {
                                await fill_answer_new(paperId, quId, id);
                                break;
                            }
                        }
                    } else {
                        $.log(`qu/qu/detail ` + html.msg);
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

//fill-answer-new
async function fill_answer_new(paperId, quId, id) {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/fill-answer-new`,
            body: JSON.stringify({
                "fillingQu": false,
                "paperId": paperId,
                "quId": quId,
                "answers": [id],
                "answerContents": [],
                "answer": "",
                "remainSeconds": 599330
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`fill-answer-newApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        $.log(`fill-answer-new ` + html.msg);
                    } else {
                        $.log(`fill-answer-new ` + html.msg);
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

//hand-exam
async function hand_exam(paperId) {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/hand-exam`,
            body: JSON.stringify({
                "id": paperId
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`hand-examApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        $.log(`hand-exam ` + html.msg);
                    } else {
                        $.log(`hand-exam ` + html.msg);
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

//paper-result
async function paper_result(paperId) {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/paper/paper/paper-result`,
            body: JSON.stringify({
                "id": paperId
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`paper-resultApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 0) {
                        $.log(`paper-result ` + html.msg);
                    } else {
                        $.log(`paper-result ` + html.msg);
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

//updateUserIntegral
async function updateUserIntegral() {
    return new Promise((resolve) => {
        let url = {
            url: `http://wx.wujiangsafety.com/api/el_exam_integral/updateUserIntegral`,
            body: JSON.stringify({
                "userId": `${userId}`,
                "userName": `${userName}`,
                "phone": `${phone}`,
                "eventName": "考试后修改积分",
                "score": 10
            }),
            headers: {
                'Authorization': `Bearer ${Authorization}`,
                'Client-Type': 'WX_PLATFORM',
                'Content-Type': 'application/json',
                'Origin': 'http://wx.wujiangsafety.com',
                'X-Requested-With': 'com.tencent.mm',
                'Referer': 'http://wx.wujiangsafety.com/web/kaoshi/pages/index/index',
                'Cookie': ''
            }
        };
        $.post(url, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(`updateUserIntegralApi请求失败`);
                } else {
                    let html = JSON.parse(data);
                    if (html.code == 200) {
                        $.log(`updateUserIntegral ` + html.msg);
                    } else {
                        $.log(`updateUserIntegral ` + html.msg);
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

/** MD5
 * 加密 */
function toMd5Hex(text) {
    var hexcase = 0;
    var chrsz = 8;

    function core_md5(x, len) {
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }

    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }

    return binl2hex(core_md5(str2binl(text), text.length * chrsz));
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
