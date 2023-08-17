//秒数转化为时分秒
export function formatSeconds(value) {
  var secondTime = parseInt(value); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取余，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取余的分，获取分钟除以60取余的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result = "" + parseInt(secondTime) + "秒";

  if (minuteTime > 0) {
    result = "" + parseInt(minuteTime) + "分" + result;
  }
  if (hourTime > 0) {
    result = "" + parseInt(hourTime) + "小时" + result;
  }
  console.log("result", result);
  return result;
}

// 根据id去重
export function unique(arr1) {
  const res = new Map();
  return arr1.filter((a) => !res.has(a.id) && res.set(a.id, 1));
}

//去除HTML Tag
export function htmlReg(msg) {
  var msg = msg.replace(/<[^>]+>|&[^>]+;/g, "");
  msg = msg.replace(/[|]*\n/, ""); //去除行尾空格
  msg = msg.replace(/&npsp;/gi, ""); //去掉npsp
  return msg;
}

// 防抖和节流区别：
// 防抖是让你多次触发，只生效最后一次。适用于只需要一次触发生效的场景。
// 节流是让你的操作，每隔一段时间触发一次。适用于多次触发要多次生效的场景
const resumeCollection = 0;
// 节流函数 =>
export function throttle(time = 2000) {
  // 节流 => time 2000毫秒内 打断
  let nowTime = new Date().getTime();
  if (nowTime - resumeCollection <= time && resumeCollection > 0) return false;
  resumeCollection = nowTime;
  return true;
}

/**
 * 防抖函数
 * @param {Function} fn 执行函数
 * @param {Number} delay 延迟时间
 */
export function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}

// 根据id进行排序
let arr = [
  {
    id: 1,
  },
  {
    id: 3,
  },
  {
    id: 5,
  },
  {
    id: 2,
  },
];
/**
 * 二维数组排序
 * @param {Array} arr 需要排序的数组
 * @param {string} key 根据key字段进行排序
 */
export function sortArr(arr, key) {
  let newArr = JSON.parse(JSON.stringify(arr));
  for (var i = 0; i < newArr.length - 1; i++) {
    for (var j = 0; j < newArr.length - i - 1; j++) {
      if (parseInt(newArr[j][key]) > parseInt(newArr[j + 1][key])) {
        console.log(newArr[j][key], newArr[j + 1][key]);
        var c = newArr[j];
        newArr[j] = newArr[j + 1];
        newArr[j + 1] = c;
      }
    }
  }
  return newArr;
}

/**
 * 正则校验
 * @param {string} reg 校验规则
 * @param {string} str 校验的字符串
 * @param {Function} fn 执行函数
 */
//  1、中国手机号(严谨), 根据工信部2019年最新公布的手机号段
//  /^((\+|00)86)?1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/

//  2、中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可
//  /^((\+|00)86)?1[3-9]\d{9}$/

//  3、中国手机号(最宽松), 只要是1开头即可, 如果你的手机号是用来接收短信, 优先建议选择这一条
//  /^((\+|00)86)?1\d{10}$/

// 强：最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
// /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/

// 中：字母+数字，字母+特殊字符，数字+特殊字符
// /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/

// 弱：纯数字，纯字母，纯特殊字符
// /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/

// 1、一代身份证号(15位数字)
// /^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$/

// 2、二代身份证号(18位数字),最后一位是校验位,可能为数字或字符X
// /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/

// 3、身份证号, 支持1/2代(15位/18位数字)
// /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/

// 中文姓名
// /^([\u4e00-\u9fa5·]{2,16})$/

// 英文姓名
// /(^[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1}$)/

//邮箱格式
// /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

// 银行卡
// /^([1-9]{1})(\d{15}|\d{18})$/

export function cegularCheck(reg, str, fn) {
  if (reg.test(str)) {
    fn();
  }
}

/**
 * 当前浏览器是否为移动端浏览器
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 判断当前是否为 Android 机器
 */
export const isAndroid = /Android/i.test(navigator.userAgent);
export const isMicroMessenger = /MicroMessenger/i.test(navigator.userAgent);
export const isIosSafari =
  /iPhone/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent);

/**
 * 判断当前移动端浏览器是否为竖屏状态
 * @returns Boolean
 */
export function isVerticalScreen() {
  return window.orientation === 180 || window.orientation === 0;
}

/**
 * 匹配每一个关键字字符
 * @param {Object} text 内容
 * @param {Object} keyword 关键词
 * @param {Object} tag 被包裹的标签
 */
function highLightKeywords(text, keyword, tag) {
  // 默认的标签，如果没有指定，使用span
  tag = tag || "span";
  text = text.replace(
    keyword,
    "<" + tag + ' class="highlight">' + keyword + "</" + tag + ">"
  );
  return text;
}

/**
 * 模糊匹配
 * @param {Object} keywordsData 内容
 * @param {Object} keyword 关键词
 */
export function onChangeKeywordsVal(keywordsData, keyword) {
  //定义一个空数组，用于存储匹配到的模糊词
  let keywordsList = [];
  //对当前input框中的值进行截取成数组，对每个字符进行遍历
  keyword.split("").forEach((data) => {
    //对总模糊词列表进行遍历
    keywordsData.forEach((item) => {
      //将总模糊词的遍历值和当前input的每个字符进行匹配，如果当前总模糊词遍历的该项没有包含input的字符则进行退出当前项的遍历，进行下一次项，依次往复，如果匹配上了则进行下一步操作
      if (!item.content.includes(data)) return;
      //声明一个标签模板字符串，用于替换匹配到模糊词的进行高亮
      const HTMLSTR = `<span style="color:highlight;">${data}</span>`;
      //声明正则，匹配全部字符且不区分大小写
      const STR = new RegExp(data, "gi");
      //对当前的模糊词进行匹配替换
      item.content = item.content.replace(STR, HTMLSTR);
      //追加到存储匹配模糊词中
      keywordsList.push(item);
    });
  });
  // 暂时用不到
  // 赋值给当前显示的模糊词列表，让页面进行渲染，由于我们是通过标签的方式对匹配词进行高亮的，所以需要使用v-html执行，将每个循环出来模糊词进行显示即可
  console.log(keywordsList, "keywordsList");
}

// el-iput 密码校验
var validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (this.ruleForm.pass !== "") {
      let reg = /^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9]{8,16}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("密码格式不正确"));
      }
    }
    callback();
  }
};

// 计算年龄
export function jsGetAge(strBirthday) {
  var returnAge;

  // 根据生日计算年龄

  //以下五行是为了获取出生年月日，如果是从身份证上获取需要稍微改变一下

  var strBirthdayArr = strBirthday.split("-");

  var birthYear = strBirthdayArr[0];

  var birthMonth = strBirthdayArr[1];

  var birthDay = strBirthdayArr[2];

  d = new Date();

  var nowYear = d.getFullYear();

  var nowMonth = d.getMonth() + 1;

  var nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear; //年之差

    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差

        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差

        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge; //返回周岁年龄
}
