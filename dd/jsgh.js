/*
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#嘉兴工会
00 00 8,10 * * * jd_speed_sign.js, tag=嘉兴工会, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "00 00 8,10 * * *" script-path=jd_speed_sign.js,tag=嘉兴工会

===============Surge=================
嘉兴工会 = type=cron,cronexp="00 00 8,10 * * *",wake-system=1,timeout=33600,script-path=jd_speed_sign.js

============小火箭=========
嘉兴工会 = type=cron,script-path=jd_speed_sign.js, cronexpr="00 00 8,10 * * *", timeout=33600, enable=true
const $ = new Env('嘉兴工会');
*/
