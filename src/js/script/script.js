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
        var minutes = Math.floor(period / (1000 * 60));
        period -= minutes * (1000 * 60);
        document.querySelector(".js-countdown-days").textContent = addZeroDay(day);
        document.querySelector(".js-countdown-hours").textContent = addZero(hour);
        document.querySelector(".js-countdown-mins").textContent = addZero(minutes);
        setTimeout(countdownTimer, interval);
      } else {
        document.querySelector(".js-countdown-days").textContent = "000";
        document.querySelector(".js-countdown-hours").textContent = "00";
        document.querySelector(".js-countdown-mins").textContent = "00";
      }
    }
    if (document.querySelector(".js-countdown")) {
      countdownTimer();
    }
  });
}());

// googleカレンダーに追加
(function() {
  window.addEventListener("load", function () {
    const optDateUtc = document.documentElement.getAttribute('data-target-date-utc');
    const utcDate = new Date(optDateUtc);
    const googleCalendar = 'https://www.google.com/calendar/event?action=TEMPLATE';
    // カレンダーで登録するタイトル
    const calText = document.title;
    // カレンダーで登録する日付
    const calDate = utcDate.getFullYear() + "" +  ("0" + (utcDate.getMonth() + 1)).slice(-2) + ("0" + utcDate.getDate()).slice(-2) + "T" + ("0" + utcDate.getHours()).slice(-2) + ("0" + utcDate.getMinutes()).slice(-2) + ("0" + utcDate.getSeconds()).slice(-2) + "Z";

    // リンクを組み立てる
    // 終了時刻はわからないのでとりあえず同じ時間としておく
    const link = googleCalendar + "&text=" + calText + "&dates=" + calDate + "/" + calDate;

    const addCalendarBtn = document.querySelector('.js-add-google-calendar');
    addCalendarBtn.setAttribute('href', link);
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
