// watchされているので保存したらビルドされる

const output_csv = document.getElementById('csv');

function csv_data(dataPath) {
    const request = new XMLHttpRequest(); // HTTPでファイルを読み込む
    request.addEventListener('load', (event) => { // ロードさせ実行
        const response = event.target.responseText; // 受け取ったテキストを返す
        csv_array(response); //csv_arrayの関数を実行
    });
    request.open('GET', dataPath, true); // csvのパスを指定
    request.send();
}
function csv_array(data) {
    const array = []; //配列を用意
    const dataString = data.split('\n'); //改行で分割
    for (let i = 0; i < dataString.length; i++) { //あるだけループ
        array[i] = dataString[i].split(',');
    }
    console.log(array);
    output_csv.innerHTML = array; //表示



    /////////////////////////////////////
    // サイトの設定項目を組み立てる

    // title
    const optionTitle = array.filter(value => value[0] === 'Title');
    const varTitle = optionTitle[0][1];
    document.querySelector('.js-title').innerText = varTitle;

    // Introduction
    const optionIntroduction = array.filter(value => value[0] === 'Introduction');
    const varIntroduction = optionIntroduction[0][1];
    document.querySelector('.js-introduction').innerText = varIntroduction;

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

csv_data('../sample.csv'); // csvのパス

// ロードが終わってからDOMを取得する
window.addEventListener('load', function() {
    const snapshot = new XMLSerializer().serializeToString(document);
    console.log(snapshot);

    let blob = new Blob([snapshot],{type:"text/plan"});
    let link = document.getElementById('download');
    link.href = URL.createObjectURL(blob);
    link.download = 'result.html';

})


