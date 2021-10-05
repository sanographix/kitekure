// カウントダウンタイマー
// UTCで指定された日付から残り時間を算出したのち、タイムゾーンとの時差を解消
(function() {
  window.addEventListener("load", function () {
    const optDateUtc = document.documentElement.getAttribute('data-target-date-utc');
    const endDate = new Date(optDateUtc);
    const interval = 1000;
    function countdownTimer() {
      var nowDate = new Date(); // ローカルの時間
      var jisa = nowDate.getTimezoneOffset(); // UTCとの時差(-540)
      var periodUtc = endDate - nowDate; // UTC基準の日付 - ローカルタイムの日付
      var period = periodUtc - jisa * 60000; // 時差が分なのでミリ秒に変換
      var addZero = function (n) {
        return ("0" + n).slice(-2);
      };
      var addZeroDay = function (n) {
        return ("00" + n).slice(-3);
      };
      if (period >= 0) {
        var day = Math.floor(period / (1000 * 60 * 60 * 24));
        period -= day * (1000 * 60 * 60 * 24);
        var hour = Math.floor(period / (1000 * 60 * 60));
        period -= hour * (1000 * 60 * 60);
        var minute = Math.floor(period / (1000 * 60));
        period -= minute * (1000 * 60);
        var second = Math.floor(period / 1000);
        document.querySelector(".js-countdown-days").textContent = addZeroDay(day);
        document.querySelector(".js-countdown-hours").textContent = addZero(hour);
        document.querySelector(".js-countdown-mins").textContent = addZero(minute);
        document.querySelector(".js-countdown-secs").textContent = addZero(second);
        // 数字が2以上のとき複数形にする
        if (day > 1) {
          document.querySelector(".js-label-days").textContent = 'Days';
        } else {
          document.querySelector(".js-label-days").textContent = 'Day';
        }
        if (hour > 1) {
          document.querySelector(".js-label-hours").textContent = 'Hrs';
        } else {
          document.querySelector(".js-label-hours").textContent = 'Hr';
        }
        if (minute > 1) {
          document.querySelector(".js-label-mins").textContent = 'Mins';
        } else {
          document.querySelector(".js-label-mins").textContent = 'Min';
        }
        if (second > 1) {
          document.querySelector(".js-label-secs").textContent = 'Secs';
        } else {
          document.querySelector(".js-label-secs").textContent = 'Sec';
        }
        setTimeout(countdownTimer, interval);
      } else {
        document.querySelector(".js-countdown-days").textContent = "000";
        document.querySelector(".js-countdown-hours").textContent = "00";
        document.querySelector(".js-countdown-mins").textContent = "00";
        document.querySelector(".js-countdown-secs").textContent = "00";
      }
    }
    if (document.querySelector(".js-countdown")) {
      countdownTimer();
    }
  });
}());

// prebuildバナー
(function() {
  window.addEventListener("load", function () {
    const banner = document.querySelector('.js-prebuild');
    const toggleBtn = document.querySelector('.js-prebuild-toggle');
    // バナーが存在するときはトグルで最小化できる
    if (banner) {
      toggleBtn.addEventListener('click', function(){
        banner.classList.toggle('is-minimize');
      });
    }
  });
}());
