/*
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#美团
00 00 7,9,11 * * * jd_speed_sign.js, tag=美团, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "00 00 7,9,11 * * *" script-path=jd_speed_sign.js,tag=美团

===============Surge=================
美团 = type=cron,cronexp="00 00 7,9,11 * * *",wake-system=1,timeout=33600,script-path=jd_speed_sign.js

============小火箭=========
美团 = type=cron,script-path=jd_speed_sign.js, cronexpr="00 00 7,9,11 * * *", timeout=33600, enable=true
*/
console.log(123)
