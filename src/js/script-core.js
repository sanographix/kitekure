// watchされているので保存したらビルドされる

function csv_data(dataPath) {
  const request = new XMLHttpRequest();
  request.addEventListener("load", (event) => {
    // ロードさせ実行
    const response = event.target.responseText; // 受け取ったテキストを返す
    csv_array(response); //csv_arrayの関数を実行
  });
  request.open("GET", dataPath, true); // csvのパスを指定
  request.send();
}
csv_data("../sample.csv"); // csvのパス

function csv_array(data) {
  const array = []; //配列を用意
  const dataString = data.split("\n"); //改行で分割
  for (let i = 0; i < dataString.length; i++) {
    //あるだけループ
    array[i] = dataString[i].split(",");
  }
  console.log(array);

  // ここからサイトの設定項目を組み立てる

  /////////////////////////////////////
  // -Basics-
  // Site Title
  const optSiteTitle = array.filter((value) => value[0] === "Site Title");
  if (optSiteTitle) {
    const valSiteTitle = optSiteTitle[0][1];
    document.title = valSiteTitle;
  }

  // host
  const hostname = location.hostname;

  // -Header-
  // Header Introduce
  const domHeaderIntroduce = document.querySelector(".js-header-introduce");
  const optHeaderIntroduce = array.filter(
    (value) => value[0] === "Header Introduce"
  );
  if (domHeaderIntroduce && optHeaderIntroduce) {
    const valHeaderIntroduce = optHeaderIntroduce[0][1];
    domHeaderIntroduce.innerText = valHeaderIntroduce;
  }

  // Header title
  const domTitle = document.querySelector(".js-title");
  const optTitle = array.filter((value) => value[0] === "Header Title");
  if (domTitle && optTitle) {
    const valTitle = optTitle[0][1];
    domTitle.innerText = valTitle;
  }

  // Header Subtitle
  const domHeaderSubtitleWrap = document.querySelector(
    ".js-header-subtitle-wrap"
  );
  const domHeaderSubtitle = document.querySelector(".js-header-subtitle"); // コピー元を取得
  for (let i = 0; i < dataString.length; i++) {
    if (array[i][0] == "Header Subtitle") {
      const domHeaderSubtitleClone = domHeaderSubtitle.cloneNode(true);
      domHeaderSubtitleClone.innerText = array[i][1];
      domHeaderSubtitleWrap.appendChild(domHeaderSubtitleClone);
    }
  }
  domHeaderSubtitle.remove(); // コピー元を削除

  // Action Button (option)
  const domActionButton = document.querySelector(".js-action-button");
  const optActionButton = array.filter((value) => value[0] === "Action Button");
  if (domActionButton && optActionButton) {
    const valActionButtonLabel = optActionButton[0][1];
    const valActionButtonUrl = optActionButton[0][2];
    domActionButton.innerText = valActionButtonLabel;
    domActionButton.setAttribute("href", valActionButtonUrl);
  }

  /////////////////////////////////////
  // -Introduction-
  // Introduction
  const domIntroductionWrap = document.querySelector(".js-introduction-wrap");
  const domIntroduction = document.querySelector(".js-introduction"); // コピー元を取得
  for (let i = 0; i < dataString.length; i++) {
    if (array[i][0] == "Introduction") {
      const domIntroductionClone = domIntroduction.cloneNode(true);
      domIntroductionClone.innerText = array[i][1];
      domIntroductionWrap.appendChild(domIntroductionClone);
    }
  }
  domIntroduction.remove(); // コピー元を削除

  // Header
  const domHeaderVideo = document.querySelector(".js-header-video");
  const domHeaderImage = document.querySelector(".js-header-image");
  const optHeader = array.filter((value) => value[0] === "Header");
  if ( (domHeaderImage || domHeaderVideo ) && optHeader) {
    const optHeaderType = optHeader[0][1];
    const optHeaderSrc = optHeader[0][2];
    switch (optHeaderType) {
      case "Video":
        domHeaderVideo.setAttribute("src", optHeaderSrc);
        domHeaderImage.remove();
        break;
      case "Image":
        domHeaderImage.setAttribute("src", optHeaderSrc);
        domHeaderVideo.remove();
        break;
      default:
        domHeaderVideo.remove();
        domHeaderImage.remove();
    }
  }

  // カウントダウンタイマー
  // UTC変換できるか確認
  const optDateUtc = array.filter((value) => value[0] === "Date (UTC)")[0][1];
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
      document.querySelector(".js-countdown-days").innerText = addZeroDay(day);
      document.querySelector(".js-countdown-hours").innerText = addZero(hour);
      document.querySelector(".js-countdown-mins").innerText = addZero(minutes);
      setTimeout(countdownTimer, interval);
    } else {
      document.querySelector(".js-countdown-days").innerText = "000";
      document.querySelector(".js-countdown-hours").innerText = "00";
      document.querySelector(".js-countdown-mins").innerText = "00";
    }
  }
  if (document.querySelector(".js-countdown")) {
    countdownTimer();
  }

  // Stream
  const domStreamPlayer = document.querySelector(".js-stream-player");
  const optStream = array.filter((value) => value[0] === "Stream");
  if (domStreamPlayer && optStream) {
    const optStreamService = optStream[0][1];
    const optStreamChannel = optStream[0][2];
    switch (optStreamService) {
      case "Twitch":
        domStreamPlayer.setAttribute(
          "src",
          "https://player.twitch.tv/?channel=" + optStreamChannel + "&parent=" + hostname
        );
        break;
      case "Youtube Live":
        domStreamPlayer.setAttribute(
          "src",
          "https://www.youtube.com/embed/" + optStreamChannel
        );
        break;
      default:
        domStreamPlayer.remove();
    }
  }

  // Schedule
  const domScheduleWrap = document.querySelector(".js-schedule-wrap");
  const domSchedule = document.querySelector(".js-schedule"); // コピー元を取得
  for (let i = 0; i < dataString.length; i++) {
    if (array[i][0] == "Schedule") {
      const domScheduleClone = domSchedule.cloneNode(true);
      domScheduleClone.querySelector(".js-schedule-time").innerText =
        array[i][1];
      domScheduleClone.querySelector(".js-schedule-name").innerText =
        array[i][2];
      domScheduleClone.querySelector(".js-schedule-description").innerText =
        array[i][3];
      domScheduleWrap.appendChild(domScheduleClone);
    }
  }
  domSchedule.remove(); // コピー元を削除
}

// クエリパラメータが?preview=trueのときテンプレートをダウンロード
const urlParam = location.search;
console.log(urlParam);
if (urlParam === "?preview=true") {
  // jsでの書き換えがロードしきってからDOMを取得する
  window.addEventListener("load", function () {
    const snapshot = new XMLSerializer().serializeToString(document);
    // このjs（プレビュー用のjs）をhtml文字列から抜き取る
    const snapshotRemoveJs = snapshot.replace(
      '<script src="js/scripts.js"></script>',
      ""
    );
    // ダウンロード
    let blob = new Blob([snapshotRemoveJs], { type: "text/plan" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "result.html";
    link.click();
  });
}
