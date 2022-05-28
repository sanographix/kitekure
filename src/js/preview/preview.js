/*@license
 *
 * Kitekure:
 *   licenses: MIT
 *   Copyright (c) 2021 sanographix
 *   https://github.com/sanographix/kitekure
 * CSV.js:
 *   licenses: MIT
 *   Copyright (c) 2014 Kash Nouroozi
 *   https://github.com/knrz/CSV.js
 */

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

  // Site URL (ファイル名を除いたパスを取得)
  const url = location.href.split(/#/)[0];
  const siteUrl = `${url.substring(0, url.lastIndexOf("/"))}/`

  // Hashtag
  const valHashtag = array.filter((value) => value.option === 'Hashtag')[0].value1;

  // Favicon
  try {
    const optFavicon = array.filter((value) => value.option === 'Site Icon (favicon)');
    const valFavicon = optFavicon[0].value1;
    const domFavicon = document.getElementById('favicon');
    domFavicon.href = valFavicon;
  } catch(error) {
    console.error('Error: favicon');
  }

  // Canonical
  try {
    const domCanonical = document.getElementById('canonical');
    domCanonical.href = siteUrl;
  } catch(error) {
    console.error('Error: canonical');
  }

  // og-image
  const optOgImage = array.filter((value) => value.option === 'Share Image');
  const valOgImage = optOgImage[0].value1;

  // og-description
  // Introduction の1行目の値を利用する
  const optIntroduction = array.filter((value) => value.option === 'Introduction');
  const valIntroduction = optIntroduction[0].value1;

  // OGP
  try {
    const OGP = [
      {
        'property': 'og:description',
        'content': valIntroduction
      }, {
        'property': 'og:title',
        'content': siteTitle
      }, {
        'property': 'og:url',
        'content': siteUrl
      }, {
        'name': 'og:image',
        'content': siteUrl + valOgImage
      }, {
        'name': 'twitter:title',
        'content': siteTitle
      }, {
        'name': 'twitter:description',
        'content': valIntroduction
      }, {
        'name': 'twitter:image',
        'content': siteUrl + valOgImage
      }
    ]
    for (let i = 0; i < OGP.length; i++) {
      const metaTag = document.createElement('meta');
      for (let prop in OGP[i]) {
          metaTag.setAttribute(prop, OGP[i][prop]);
      }
      document.head.appendChild(metaTag);
    }
  } catch(error) {
    console.error('Error: OGP');
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
  try {
    const valTheme = array.filter((value) => value.option === 'Theme')[0].value1;
    document.documentElement.setAttribute('data-theme', valTheme);
  } catch(error) {
    console.error('Error: theme');
  }

  // Accent Color
  try {
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
  } catch(error) {
    console.error('Error: accent-color');
  }

  /////////////////////////////////////
  // -Header-

  // Header
  try {
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
  } catch(error) {
    console.error('Error: header');
  }

  // Header title
  try {
    const domTitle = document.querySelector('.js-title');
    domTitle.textContent = valEventTitle;
    // 文字数が長いときフォントサイズを変える
    const eventTitleStringCount = valEventTitle.length;
    if (eventTitleStringCount > 20) {
      domTitle.classList.add('is-string-count-long');
    }
  } catch(error) {
    console.error('Error: header title');
  }

  // Reverse Title Color
  try {
    const optReverseTitleColor = array.filter((value) => value.option === 'Reverse Title Color on Image');
    const valReverseTitleColor = optReverseTitleColor[0].value1;
    // 有効時
    if (valReverseTitleColor == '✅') {
      const domTitle = document.querySelector('.js-title');
      domTitle.classList.toggle('is-reverse-color');
    }
  } catch(error) {
    console.error('Error: Reverse title color');
  }

  // Header Subtitle (Option)
  try {
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
  } catch(error) {
    console.error('Error: Header subtitle');
  }

  // Action Button (option)
  try {
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
  } catch(error) {
    console.error('Error: Action button');
  }

  // Callout (Option)
  try {
    const domCalloutWrap = document.querySelector(
      '.js-callout-wrap'
    );
    const domCallout = document.querySelector('.js-callout'); // コピー元を取得
    const optCallout = array.filter((value) => value.option === 'Callout');
    for (let i = 0; i < optCallout.length; i++) {
      const domCalloutClone = domCallout.cloneNode(true);
      domCalloutClone.textContent = optCallout[i].value1;
      domCalloutWrap.appendChild(domCalloutClone);
    }
    domCallout.remove(); // コピー元を削除
    // 空欄ならHTMLから非表示
    if (optCallout[0].value1 == '') {
      domCalloutWrap.remove();
    }
  } catch(error) {
    console.error('Error: callout');
  }

  // Stream
  try {
    const domStreamPlayer = document.querySelector('.js-stream-player');
    const optStream = array.filter((value) => value.option === 'Stream');
    const valStreamService = optStream[0].value1;
    const valStreamChannel = optStream[0].value2;
    switch (valStreamService) {
      case 'Twitch':
        domStreamPlayer.setAttribute(
          'src',
          'https://player.twitch.tv/?channel=' +
            valStreamChannel +
            '&parent=' +
            location.hostname
        );
        document.getElementById('youtube-embed').remove();
        break;
      case 'Youtube Live':
        domStreamPlayer.setAttribute(
          'src',
          'https://www.youtube.com/embed/' + valStreamChannel
        );
        document.getElementById('twitch-embed').remove();
        break;
      default:
        domStreamPlayer.remove();
    }
    // 空欄ならHTMLから非表示
    if (valStreamChannel == '') {
      document.querySelector('.js-stream').remove();
    }
  } catch(error) {
    console.error('Error: Stream');
  }

  // Share buttons
  try {
    const domShareTwitter = document.querySelector('.js-share-tw');
    const domShareFacebook = document.querySelector('.js-share-fb');
    let twitterLink = 'https://twitter.com/share?text=' + encodedSiteTitle + '&url=' + siteUrl;
    // ハッシュタグが設定されていればシェアURLに含める
    if (valHashtag != '') {
      twitterLink += '&hashtags=' + valHashtag;
    }
    domShareTwitter.setAttribute('href', twitterLink);
    const facebookLink = 'http://www.facebook.com/sharer.php?u=' + siteUrl;
    domShareFacebook.setAttribute('href', facebookLink);

  } catch(error) {
    console.error('Error: Share buttons');
  }

  // googleカレンダーに追加
  try {
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
      const calLink = googleCalendarUrl + '&text=' + encodedEventTitle + '&details=' + siteUrl + '&dates=' + calDate + '/' + calDate;

      addCalendarBtn.setAttribute('href', calLink);
    }
  } catch(error) {
    console.error('Error: Google calendar');
  }

  /////////////////////////////////////
  // -Introduction-
  // Introduction Heading
  try {
    const domIntroductionHeading = document.querySelector('.js-introduction-heading');
    const optIntroductionHeading = array.filter((value) => value.option === 'Introduction Heading');
    const valIntroductionHeading = optIntroductionHeading[0].value1;
    domIntroductionHeading.textContent = valIntroductionHeading;
    document.querySelector('.js-nav-link-about').textContent = valIntroductionHeading;
  } catch(error) {
    console.error('Error: Introduction heading');
  }

  // Introduction
  try {
    const domIntroductionWrap = document.querySelector('.js-introduction-wrap');
    const domIntroduction = document.querySelector('.js-introduction'); // コピー元を取得
    for (let i = 0; i < optIntroduction.length; i++) {
      const domIntroductionClone = domIntroduction.cloneNode(true);
      domIntroductionClone.textContent = optIntroduction[i].value1;
      domIntroductionWrap.appendChild(domIntroductionClone);
    }
    domIntroduction.remove(); // コピー元を削除
  } catch(error) {
    console.error('Error: Introduction');
  }

  /////////////////////////////////////
  // -Schedule-

  // Schedule Heading
  try {
    const domScheduleHeading = document.querySelector('.js-schedule-heading');
    const optScheduleHeading = array.filter((value) => value.option === 'Schedule Heading');
    const valScheduleHeading = optScheduleHeading[0].value1;
    domScheduleHeading.textContent = valScheduleHeading;
    document.querySelector('.js-nav-link-schedule').textContent = valScheduleHeading;
  } catch(error) {
    console.error('Error: Schedule heading');
  }

  // Schedule
  try {
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
  } catch(error) {
    console.error('Error: Schedule');
  }

  /////////////////////////////////////
  // -member-

  // Member heading
  try {
    const domMemberHeading = document.querySelector('.js-member-heading');
    const optMemberHeading = array.filter((value) => value.option === 'Member Heading');
    const valMemberHeading = optMemberHeading[0].value1;
    domMemberHeading.textContent = valMemberHeading;
    document.querySelector('.js-nav-link-member').textContent = valMemberHeading;
  } catch(error) {
    console.error('Error: Member heading');
  }

  // Member
  try {
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
  } catch(error) {
    console.error('Error: Member');
  }

  /////////////////////////////////////
  // -Overview-
  const optEventVenueAddress = array.filter((value) => value.option === 'Address'); // try-catch内で宣言してしまうと他から参照できなくなるので一旦外に置く

  //Event Title
  try {
    const domEventTitle = document.querySelector('.js-event-title');
    domEventTitle.textContent = valEventTitle;
  } catch(error) {
    console.error('Error: Overview event title');
  }

  // Date
  try {
    const domEventDate = document.querySelector('.js-event-date');
    domEventDate.textContent = valEventDate;
  } catch(error) {
    console.error('Error: Overview date');
  }

  // Hashtag
  try {
    const domEventHashtag = document.querySelector('.js-event-hashtag');
    const domEventHashtagLabel = document.querySelector('.js-event-hashtag-label');
    const domEventHashtagLink = document.querySelector('.js-event-hashtag-link');
    if (valHashtag != '') {
      domEventHashtagLink.textContent = '#' + valHashtag;
      const eventHashtagLink = 'https://twitter.com/hashtag/' + valHashtag + '?src=hash';
      domEventHashtagLink.setAttribute('href', eventHashtagLink);
    } else {
      domEventHashtag.remove();
      domEventHashtagLabel.remove();
    }
  } catch(error) {
    console.error('Error: Overview hashtag');
  }

  // Venue
  try {
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
  } catch(error) {
    console.error('Error: Overview venue');
  }

  // Address (option)
  try {
    const domEventVenueAddress = document.querySelector(
      '.js-event-venue-address'
    );
    if (domEventVenueAddress && optEventVenueAddress) {
      const valEventVenueAddress = optEventVenueAddress[0].value1;
      domEventVenueAddress.textContent = valEventVenueAddress;
    } else {
      domEventVenueAddress.remove();
    }
  } catch(error) {
    console.error('Error: Overview address');
  }

  // map (Option)
  try {
    const domMap = document.querySelector('.js-event-venue-map');
    if (optEventVenueAddress[0].value2 != '') {
      domMap.setAttribute('src', 'https://www.google.com/maps/embed?pb=' + optEventVenueAddress[0].value2);
    } else {
      domMap.remove();
    }
  } catch(error) {
    console.error('Error: Overview map');
  }

  // Additional Overview (option)
  try {
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
  } catch(error) {
    console.error('Error: Overview additional');
  }

  /////////////////////////////////////
  // -Notice-
  try {
    const domNoticeWrap = document.querySelector('.js-notice-wrap');
    const domNotice = document.querySelector('.js-notice'); // コピー元を取得
    const optNotice = array.filter((value) => value.option === 'Notice');
    for (let i = 0; i < optNotice.length; i++) {
      const domNoticeClone = domNotice.cloneNode(true);
      domNoticeClone.textContent = optNotice[i].value1;
      domNoticeWrap.appendChild(domNoticeClone);
    }
    domNotice.remove(); // コピー元を削除

  } catch(error) {
    console.error('Error: Notice');
  }

  /////////////////////////////////////
  // footer
  document.querySelector('.js-footer-eventTitle').textContent = valEventTitle;
  // footer-text (option)
  try {
    const domFooterText = document.querySelector('.js-footer-text');
    const optFooterText = array.filter((value) => value.option === 'Footer Text');
    const valFooterText = optFooterText[0].value1;
    if (valFooterText != '') {
      domFooterText.textContent = valFooterText
    } else {
      domFooterText.remove();
    }
  } catch(error) {
    console.error('Error: Footer text');
  }

  // クエリパラメータが?prebuild=trueのときテンプレートをダウンロード
  const urlParam = location.search;
  if (urlParam === "?prebuild=true") {
    // プレビュー用バナーを消す
    document.querySelector('.js-prebuild').remove();
    // 検索避けない設定の場合noindex消す
    const valRobots = array.filter((value) => value.option === 'Hide on Search Results')[0].value1;
    if (valRobots == '-') {
      document.getElementById('meta-robots').remove();
    }
    // jsでの書き換えがロードしきってからDOMを取得する
    window.addEventListener("load", function () {
      let snapshot = new XMLSerializer().serializeToString(document);
      // 不要な要素をhtml文字列から抜き取る
      snapshot = snapshot.replace('<script src="_src/preview.js"></script>', '');
      // ダウンロード
      let blob = new Blob([snapshot], { type: "text/plan" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "index.html";
      link.click();
    });
  }

}
