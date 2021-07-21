// watchされているので保存したらビルドされる

function csv_data(dataPath) {
    const request = new XMLHttpRequest(); // HTTPでファイルを読み込む
    request.addEventListener('load', (event) => { // ロードさせ実行
        const response = event.target.responseText; // 受け取ったテキストを返す
        csv_array(response); //csv_arrayの関数を実行
    });
    request.open('GET', dataPath, true); // csvのパスを指定
    request.send();
}
csv_data('../sample2.csv'); // csvのパス


function csv_array(data) {
    const array = []; //配列を用意
    const dataString = data.split('\n'); //改行で分割
    for (let i = 0; i < dataString.length; i++) { //あるだけループ
        array[i] = dataString[i].split(',');
    }
    console.log(array);

    /////////////////////////////////////
    // サイトの設定項目を組み立てる

    // title
    const domTitle = document.querySelector('.js-title');
    const optTitle = array.filter(value => value[0] === 'Header Title');
    const valTitle = optTitle[0][1];
    domTitle.innerText = valTitle;

    // Introduction
    const domIntroductionWrap = document.querySelector('.js-introduction-wrap');
    const domIntroduction = document.querySelector('.js-introduction'); // コピー元を取得
    for (let i = 0; i < dataString.length; i++) {
        if (array[i][0] == 'Introduction') {
            const domIntroductionClone = domIntroduction.cloneNode(true);
            domIntroductionClone.innerText = array[i][1];
            domIntroductionWrap.appendChild(domIntroductionClone);
        }
    }
    domIntroduction.remove(); // コピー元を削除

    // Header
    const optionHeader = array.filter(value => value[0] === 'Header');
    const headerType = optionHeader[0][1];
    const headerSrc = optionHeader[0][2];
    const headerVideo = document.querySelector('.js-header-video');
    const headerImage = document.querySelector('.js-header-image');

    switch (headerType){
        case 'Video':
          headerVideo.setAttribute('src', headerSrc);
          headerImage.remove();
          break;
        case 'Image':
          headerImage.setAttribute('src', headerSrc);
          headerVideo.remove();
          break;
        default:
          headerVideo.remove();
          headerImage.remove();
    }

    // Date
    const optionDate = array.filter(value => value[0] === 'Date');
    const varDate = optionDate[0][1];
    document.querySelector('.js-date').innerText = varDate;


    // カウントダウンタイマー
    // UTC変換できるか確認
    var endDate = new Date('2021/07/21 05:30');
    console.log(endDate);
    var interval = 1000;

    function countdownTimer(){
      var nowDate = new Date(); // ローカルの時間
      var jisa = nowDate.getTimezoneOffset(); // UTCとの時差(-540)
      var periodUtc = endDate - nowDate; // UTC基準の日付 - ローカルタイムの日付
      var period = periodUtc - (jisa * 60000); // 時差が分なのでミリ秒に変換

      var addZero = function(n){return('0'+n).slice(-2);}
      var addZeroDay = function(n){return('00'+n).slice(-3);}
      if(period >= 0) {
      var day = Math.floor(period / (1000 * 60 * 60 * 24));
      period -=  (day *(1000 * 60 * 60 * 24));
      var hour = Math.floor(period / (1000 * 60 * 60));
      period -= (hour *(1000 * 60 * 60));
      var minutes =  Math.floor(period / (1000 * 60));
      period -= (minutes * (1000 * 60));
      var insert = "";
      insert += '<span class="h">' + addZeroDay(day) +':' + '</span>';
      insert += '<span class="h">' + addZero(hour) + ':'+'</span>';
      insert +=  '<span class="m">' + addZero(minutes)  + '</span>';
      document.getElementById('countdown').innerHTML = insert;
      setTimeout(countdownTimer,interval);
      }
      else{
        var insert = "";
        var number = 0;
        insert += '<span class="h">' + number + number + '</span>';
        insert +=  '<span class="m">' + number + number + '</span>';
        insert += '<span class="s">' + number + number + '</span>';
        document.getElementById('countdown').innerHTML = insert;
      }
    }
    if ( document.getElementById('countdown') ) {
      countdownTimer();
    }


    // Schedule
    const scheduleItems = document.querySelector('.js-schedule-items');
    const schedule = document.querySelector('.js-schedule'); // コピー元を取得
    for (let i = 0; i < dataString.length; i++) {
        if (array[i][0] == 'Schedule') {
            const schedule_clone = schedule.cloneNode(true);
            schedule_clone.querySelector('.js-schedule-time').innerText = array[i][1];
            schedule_clone.querySelector('.js-schedule-name').innerText = array[i][2];

            scheduleItems.appendChild(schedule_clone);
        }
    }
    schedule.remove(); // コピー元を削除

    // Twitch
    const optionTwitch = array.filter(value => value[0] === 'Twitch');
    const varTwitch = optionTwitch[0][1];
    const twitch = document.querySelector('.js-stream');
    const twitchPlayer = document.querySelector('.js-stream-twitch');
    if(varTwitch){
        twitchPlayer.setAttribute('src', 'https://player.twitch.tv/?channel=' + varTwitch + '&parent=localhost');
    } else {

    }

    // Stream
    const optionStream = array.filter(value => value[0] === 'Stream');
    const varStream = optionStream[0][1];
    const stream = document.querySelector('.js-stream');
    const streamPlayer = document.querySelector('.js-stream-player');
    if(varStream){
        streamPlayer.setAttribute('src', 'https://www.youtube.com/embed/' + varStream);
    } else {
        stream.remove();
    }




  }

// クエリパラメータが?preview=trueのときテンプレートをダウンロード
const urlParam = location.search;
console.log(urlParam);
if ( urlParam ===  '?preview=true' )  {
    // jsでの書き換えがロードしきってからDOMを取得する
    window.addEventListener('load', function() {
        const snapshot = new XMLSerializer().serializeToString(document);
        // このjs（プレビュー用のjs）をhtml文字列から抜き取る
        const snapshotRemoveJs = snapshot.replace('<script src="js/scripts.js"></script>', '');
        // ダウンロード
        let blob = new Blob([snapshotRemoveJs],{type:"text/plan"});
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'result.html';
        link.click();
    })
}
