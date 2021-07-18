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
    output_csv.innerHTML = array; //表示

    // サイトの設定項目を組み立てる
    const varTitle = array[1][1];
    const varDate = array[2][1];
    const varIntroduction = array[3][1];

    document.querySelector('.js-title').innerText = varTitle;
    document.querySelector('.js-introduction').innerText = varIntroduction;

    // スケジュール
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
}

csv_data('../sample.csv'); // csvのパス

const html = '<html><body><h1>a</h1></p></body></html>';

/*
let blob = new Blob([html],{type:"text/plan"});
let link = document.getElementById('download');
link.href = URL.createObjectURL(blob);
link.download = 'result.html';
link.click();
*/
