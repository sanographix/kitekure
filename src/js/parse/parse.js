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
csv_data("../config.csv"); // csvのパス

function csv_array(data) {
  const array = new CSV(data, {
    header: ['option', 'value1', 'value2', 'value3', 'value4', 'value5', 'required', 'description'],
    cast: false,
  }).parse(); //配列を用意

  console.log(array);

  // ここからサイトの設定項目を組み立てる

  /////////////////////////////////////
  // -Basics-

  // Site Title
  const optEventTitle = array.filter((value) => value.option === 'Event Title');
  const optEventDate = array.filter((value) => value.option === 'Date (Local Time)');

  const valEventTitle = optEventTitle[0].value1;
  const valEventDate = optEventDate[0].value1;
  // エンコードされたイベントタイトル（Googleカレンダー追加ボタンに使う）
  const encodedEventTitle = encodeURIComponent(valEventTitle);

  const siteTitle = new String(valEventTitle + ' | ' + valEventDate);
  // エンコードされたタイトル（シェアボタンに使う）
  const encodedSiteTitle = encodeURIComponent(siteTitle);

  document.title = siteTitle;

  // Site URL
  const hostname = location.hostname;
  let valSiteUrl = array.filter((value) => value.option === 'Site URL')[0].value1;
  // トレイリングスラッシュついてなければアリで統一
  if (valSiteUrl.substr(-1) !== '/') {
    valSiteUrl = valSiteUrl.concat('/');
  }

  // Favicon
  const optFavicon = array.filter((value) => value.option === 'Site Icon (favicon)');
  const valFavicon = optFavicon[0].value1;
  const domFavicon = document.getElementById('favicon');
  domFavicon.href = valFavicon;

  // og-image
  const optOgImage = array.filter((value) => value.option === 'Share Image');
  const valOgImage = optOgImage[0].value1;

  // og-description
  // Introduction の1行目の値を利用する
  const optIntroduction = array.filter((value) => value.option === 'Introduction');
  const valIntroduction = optIntroduction[0].value1;

  // OGP
  const OGP = [
    {
      'property': 'og:description',
      'content': valIntroduction
    }, {
      'property': 'og:title',
      'content': siteTitle
    }, {
      'property': 'og:url',
      'content': valSiteUrl
    }, {
      'name': 'og:image',
      'content': valSiteUrl + valOgImage
    }, {
      'name': 'twitter:title',
      'content': siteTitle
    }, {
      'name': 'twitter:description',
      'content': valIntroduction
    }, {
      'name': 'twitter:image',
      'content': valSiteUrl + valOgImage
    }
  ]
  for (let i = 0; i < OGP.length; i++) {
    const metaTag = document.createElement('meta');
    for (let prop in OGP[i]) {
        metaTag.setAttribute(prop, OGP[i][prop]);
    }
    document.head.appendChild(metaTag);
  }

  // 検索避け
  const valRobots = array.filter((value) => value.option === 'Hide on Search Results')[0].value1;
  // 検索に出す設定ならrobots書き換え
  if (valRobots == '✅') {
    const metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots')
    metaRobots.setAttribute('content', 'noindex');
    document.head.appendChild(metaRobots);
  }

  // Date (UTC) (Option)
  // カウントダウンタイマー
  const valDateUtc = array.filter((value) => value.option === 'Date (UTC)')[0].value1;
  document.documentElement.setAttribute('data-target-date-utc', valDateUtc);
  // 空欄ならカウントダウンタイマーを消す
  if (valDateUtc == '') {
    document.querySelector('.js-countdown').remove();
  }

  // Theme
  const valTheme = array.filter((value) => value.option === 'Theme')[0].value1;
  document.documentElement.setAttribute('data-theme', valTheme);

  // Accent Color
  const valAccentColor = array.filter((value) => value.option === 'Accent Color (Hex)')[0].value1;
  if (valAccentColor != '') {
    // アクセントカラーを適用
    document.head.insertAdjacentHTML('beforeend', '<style>:root{--color-primary:' + valAccentColor + '}</style>');
    document.documentElement.setAttribute('data-accent-color', valAccentColor);
    // metaタグに指定
    const domThemeColor = document.getElementById('meta-theme-color');
    domThemeColor.content = valAccentColor;

    // アクセントカラーのボタン文字色を白黒から判定
    function blackOrWhite ( hexcolor ) {
      var r = parseInt( hexcolor.substr( 1, 2 ), 16 ) ;
      var g = parseInt( hexcolor.substr( 3, 2 ), 16 ) ;
      var b = parseInt( hexcolor.substr( 5, 2 ), 16 ) ;
      return ( ( ( (r * 299) + (g * 587) + (b * 114) ) / 1000 ) < 128 ) ? 'white' : 'black' ;
    }
    const AccentColorText = blackOrWhite( valAccentColor ) ;
    switch (AccentColorText) {
      case 'black':
        document.head.insertAdjacentHTML('beforeend', '<style>:root{--color-btn-primary-text: var(--color-black)}</style>');
        break;
      case 'white':
        document.head.insertAdjacentHTML('beforeend', '<style>:root{--color-btn-primary-text: var(--color-white)}</style>');
        break;
      default:
        break;
    }
  }

  /////////////////////////////////////
  // -Header-

  // Header
  const domHeaderVideo = document.querySelector('.js-header-video');
  const domHeaderImage = document.querySelector('.js-header-image');
  const optHeader = array.filter((value) => value.option === 'Header');
  const optHeaderType = optHeader[0].value1;
  const optHeaderSrc = optHeader[0].value2;
  switch (optHeaderType) {
    case 'Video':
      domHeaderVideo.setAttribute('src', optHeaderSrc);
      domHeaderImage.remove();
      break;
    case 'Image':
      domHeaderImage.setAttribute('src', optHeaderSrc);
      domHeaderVideo.remove();
      break;
    default:
      domHeaderVideo.remove();
      domHeaderImage.remove();
      break;
  }

  // Header title
  const domTitle = document.querySelector('.js-title');
  domTitle.textContent = valEventTitle;
  // 文字数が長いときフォントサイズを変える
  const eventTitleStringCount = valEventTitle.length;
  if (eventTitleStringCount > 20) {
    domTitle.classList.add('is-string-count-long');
  }

  // Reverse Title Color
  const optReverseTitleColor = array.filter((value) => value.option === 'Reverse Title Color on Image');
  const valReverseTitleColor = optReverseTitleColor[0].value1;
  // 有効時
  if (valReverseTitleColor == '✅') {
    domTitle.classList.toggle('is-reverse-color');
  }

  // Header Subtitle (Option)
  const domHeaderSubtitleWrap = document.querySelector(
    '.js-header-subtitle-wrap'
  );
  const domHeaderSubtitle = document.querySelector('.js-header-subtitle'); // コピー元を取得
  const optHeaderSubtitle = array.filter((value) => value.option === 'Header Subtitle');
  for (let i = 0; i < optHeaderSubtitle.length; i++) {
    const domHeaderSubtitleClone = domHeaderSubtitle.cloneNode(true);
    domHeaderSubtitleClone.textContent = optHeaderSubtitle[i].value1;
    domHeaderSubtitleWrap.appendChild(domHeaderSubtitleClone);
  }
  domHeaderSubtitle.remove(); // コピー元を削除
  // 空欄ならHTMLから非表示
  if (optHeaderSubtitle[0].value1 == '') {
    domHeaderSubtitleWrap.remove();
  }

  // Action Button (option)
  const domActionButton = document.querySelector('.js-action-button');
  const optActionButton = array.filter((value) => value.option === 'Action Button');
  const valActionButtonLabel = optActionButton[0].value1;
  const valActionButtonUrl = optActionButton[0].value2;
  domActionButton.textContent = valActionButtonLabel;
  domActionButton.setAttribute('href', valActionButtonUrl);
  // 空欄ならHTMLから非表示
  if (valActionButtonLabel == '') {
    domActionButton.remove();
  }

  // Stream
  const domStreamPlayer = document.querySelector('.js-stream-player');
  const optStream = array.filter((value) => value.option === 'Stream');
  const valStreamService = optStream[0].value1;
  const valStreamChannel = optStream[0].value2;
  switch (valStreamService) {
    case 'Twitch':
      new Twitch.Player("twitch-embed", {
        channel: valStreamChannel
      });
      document.getElementById('youtube-embed').remove();
      break;
    case 'Youtube Live':
      domStreamPlayer.setAttribute(
        'src',
        'https://www.youtube.com/embed/' + valStreamChannel
      );
      document.getElementById('twitch-embed').remove();
      document.getElementById('twitch-embed-script').remove();
      break;
    default:
      domStreamPlayer.remove();
  }
  // 空欄ならHTMLから非表示
  if (valStreamChannel == '') {
    document.querySelector('.js-stream').remove();
  }

  // Share buttons
  const domShareTwitter = document.querySelector('.js-share-tw');
  const domShareFacebook = document.querySelector('.js-share-fb');
  const twitterLink = 'https://twitter.com/share?text=' + encodedSiteTitle + '&url=' + valSiteUrl;
  domShareTwitter.setAttribute('href', twitterLink);
  const facebookLink = 'http://www.facebook.com/sharer.php?u=' + valSiteUrl;
  domShareFacebook.setAttribute('href', facebookLink);

  // googleカレンダーに追加
  const addCalendarBtn = document.querySelector('.js-add-google-calendar');
  if (valDateUtc == '') {
    // 空欄ならボタンを消す
    addCalendarBtn.remove();
  } else {
    // 値が入っていればカレンダー追加ボタンのhref属性を組み立てる
    const utcDate = new Date(valDateUtc);
    const googleCalendarUrl = 'https://www.google.com/calendar/event?action=TEMPLATE';
    // カレンダーで登録する日付
    const calDate = utcDate.getFullYear() + '' + ('0' + (utcDate.getMonth() + 1)).slice(-2) + ('0' + utcDate.getDate()).slice(-2) + 'T' + ('0' + utcDate.getHours()).slice(-2) + ('0' + utcDate.getMinutes()).slice(-2) + ('0' + utcDate.getSeconds()).slice(-2) + 'Z';
    // リンクを組み立てる
    // 終了時刻はわからないのでとりあえず同じ時間としておく
    const calLink = googleCalendarUrl + '&text=' + encodedEventTitle + '&details=' + valSiteUrl + '&dates=' + calDate + '/' + calDate;

    addCalendarBtn.setAttribute('href', calLink);
  }

  /////////////////////////////////////
  // -Introduction-
  // Introduction Heading
  const domIntroductionHeading = document.querySelector('.js-introduction-heading');
  const optIntroductionHeading = array.filter((value) => value.option === 'Introduction Heading');
  const valIntroductionHeading = optIntroductionHeading[0].value1;
  domIntroductionHeading.textContent = valIntroductionHeading;
  document.querySelector('.js-nav-link-about').textContent = valIntroductionHeading;

  // Introduction
  const domIntroductionWrap = document.querySelector('.js-introduction-wrap');
  const domIntroduction = document.querySelector('.js-introduction'); // コピー元を取得
  for (let i = 0; i < optIntroduction.length; i++) {
    const domIntroductionClone = domIntroduction.cloneNode(true);
    domIntroductionClone.textContent = optIntroduction[i].value1;
    domIntroductionWrap.appendChild(domIntroductionClone);
  }
  domIntroduction.remove(); // コピー元を削除



  /////////////////////////////////////
  // -Schedule-

  // Schedule Heading
  const domScheduleHeading = document.querySelector('.js-schedule-heading');
  const optScheduleHeading = array.filter((value) => value.option === 'Schedule Heading');
  const valScheduleHeading = optScheduleHeading[0].value1;
  domScheduleHeading.textContent = valScheduleHeading;
  document.querySelector('.js-nav-link-schedule').textContent = valScheduleHeading;

  // Schedule
  const domScheduleWrap = document.querySelector('.js-schedule-wrap');
  const domSchedule = document.querySelector('.js-schedule'); // コピー元を取得
  const optSchedule = array.filter((value) => value.option === 'Schedule');
  for (let i = 0; i < optSchedule.length; i++) {
    const domScheduleClone = domSchedule.cloneNode(true);
    domScheduleClone.querySelector('.js-schedule-time').textContent =
      optSchedule[i].value1;
    domScheduleClone.querySelector('.js-schedule-name').textContent =
      optSchedule[i].value2;
    domScheduleClone.querySelector('.js-schedule-description').textContent =
      optSchedule[i].value3;
    domScheduleWrap.appendChild(domScheduleClone);
  }
  domSchedule.remove(); // コピー元を削除

  /////////////////////////////////////
  // -member-
  // Member heading
  const domMemberHeading = document.querySelector('.js-member-heading');
  const optMemberHeading = array.filter((value) => value.option === 'Member Heading');
  const valMemberHeading = optMemberHeading[0].value1;
  domMemberHeading.textContent = valMemberHeading;
  document.querySelector('.js-nav-link-member').textContent = valMemberHeading;

  // Member
  const domMemberWrap = document.querySelector('.js-member-wrap');
  const domMember = document.querySelector('.js-member'); // コピー元を取得
  const optMember = array.filter((value) => value.option === 'Member');
  for (let i = 0; i < optMember.length; i++) {
    const domMemberClone = domMember.cloneNode(true);
    domMemberClone.querySelector('.js-member-name').textContent = optMember[i].value1;
    domMemberClone.querySelector('.js-member-image').setAttribute('alt', optMember[i].value1);
    domMemberClone.querySelector('.js-member-image').setAttribute('src', optMember[i].value2);
    domMemberClone.querySelector('.js-member-profile').textContent = optMember[i].value4;
    // option
    if (optMember[i].value3 != '') {
      domMemberClone.querySelector('.js-member-role').textContent = optMember[i].value3;
    } else {
      domMemberClone.querySelector('.js-member-role').remove();
    }
    if (optMember[i].value5 != '') {
      domMemberClone.querySelector('.js-member-url').setAttribute('href', optMember[i].value5);
    } else {
      domMemberClone.querySelector('.js-member-link').remove();
    }
    domMemberWrap.appendChild(domMemberClone);
  }
  domMember.remove(); // コピー元を削除


  /////////////////////////////////////
  // -Overview-

  //Event Title
  const domEventTitle = document.querySelector('.js-event-title');
  domEventTitle.textContent = valEventTitle;

  // Date
  const domEventDate = document.querySelector('.js-event-date');
  domEventDate.textContent = valEventDate;

  // Venue
  const domEventVenueLabel = document.querySelector('.js-event-venue-label');
  const domEventVenueContent = document.querySelector(
    '.js-event-venue-content'
  );
  const optEventVenue = array.filter((value) => value.option === 'Venue');
  if (domEventVenueLabel && optEventVenue) {
    const valEventVenueHeading = optEventVenue[0].value1;
    const valEventVenueTitle = optEventVenue[0].value2;
    domEventVenueLabel.textContent = valEventVenueHeading;
    domEventVenueContent.textContent = valEventVenueTitle;
  }

  // Address (option)
  const domEventVenueAddress = document.querySelector(
    '.js-event-venue-address'
  );
  const optEventVenueAddress = array.filter((value) => value.option === 'Address');
  if (domEventVenueAddress && optEventVenueAddress) {
    const valEventVenueAddress = optEventVenueAddress[0].value1;
    domEventVenueAddress.textContent = valEventVenueAddress;
  } else {
    domEventVenueAddress.remove();
  }

  // map (Option)
  const domMap = document.querySelector('.js-event-venue-map');
  if (optEventVenueAddress[0].value2 != '') {
    domMap.setAttribute('src', 'https://www.google.com/maps/embed?pb=' + optEventVenueAddress[0].value2);
  } else {
    domMap.remove();
  }

  // Additional Overview (option)
  const domOverview = document.querySelector('.js-overview');
  const domOverviewLabel = document.querySelector('.js-overview-label');
  const domOverviewContent = document.querySelector('.js-overview-content');
  const optOverview = array.filter((value) => value.option === 'Overview');
  for (let i = 0; i < optOverview.length; i++) {
    const domOverviewLabelClone = domOverviewLabel.cloneNode(true);
    const domOverviewContentClone = domOverviewContent.cloneNode(true);
    domOverviewLabelClone.textContent = optOverview[i].value1;
    domOverview.appendChild(domOverviewLabelClone);
    domOverviewContentClone.textContent = optOverview[i].value2;
    domOverview.appendChild(domOverviewContentClone);
  }
  domOverviewLabel.remove();
  domOverviewContent.remove();

  /////////////////////////////////////
  // -Notice-
  const domNoticeWrap = document.querySelector('.js-notice-wrap');
  const domNotice = document.querySelector('.js-notice'); // コピー元を取得
  const optNotice = array.filter((value) => value.option === 'Notice');
  for (let i = 0; i < optNotice.length; i++) {
    const domNoticeClone = domNotice.cloneNode(true);
    domNoticeClone.textContent = optNotice[i].value1;
    domNoticeWrap.appendChild(domNoticeClone);
  }
  domNotice.remove(); // コピー元を削除

  /////////////////////////////////////
  // footer
  document.querySelector('.js-footer-eventTitle').textContent = valEventTitle;
  // footer-text (option)
  const domFooterText = document.querySelector('.js-footer-text');
  const optFooterText = array.filter((value) => value.option === 'Footer Text');
  const valFooterText = optFooterText[0].value1;
  if (valFooterText != '') {
    domFooterText.textContent = valFooterText
  } else {
    domFooterText.remove();
  }

  // クエリパラメータが?prebuild=trueのときテンプレートをダウンロード
  const urlParam = location.search;

  if (urlParam === "?prebuild=true") {
    // プレビュー用バナーを消す
    document.querySelector('.js-prebuild').remove();
    // jsでの書き換えがロードしきってからDOMを取得する
    window.addEventListener("load", function () {
      const snapshot = new XMLSerializer().serializeToString(document);
      // このjs（プレビュー用のjs）をhtml文字列から抜き取る
      const snapshotRemoveJs = snapshot.replace(
        '<script src="_src/parse.js"></script>',
        ""
      );
      // ダウンロード
      let blob = new Blob([snapshotRemoveJs], { type: "text/plan" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "index.html";
      link.click();
    });
  }

}
