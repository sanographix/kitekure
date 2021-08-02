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
  const optSiteTitle = array.filter((value) => value.option === 'Site Title');
  const valSiteTitle = optSiteTitle[0].value1;
  document.title = valSiteTitle;

  // host
  const hostname = location.hostname;

  // Favicon
  const optFavicon = array.filter((value) => value.option === 'Site Icon (favicon)');
  const valFavicon = optFavicon[0].value1;
  const domFavicon = document.getElementById('favicon');
  domFavicon.href = valFavicon;

  // Date (UTC)
  // カウントダウンタイマー
  const valDateUtc = array.filter((value) => value.option === 'Date (UTC)')[0].value1;
  document.documentElement.setAttribute('data-target-date-utc', valDateUtc);

  // Theme
  const valTheme = array.filter((value) => value.option === 'Theme')[0].value1;
  document.documentElement.setAttribute('data-theme', valTheme);

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
  }

  // Header Introduce
  const domHeaderIntroduce = document.querySelector('.js-header-introduce');
  const optHeaderIntroduce = array.filter(
    (value) => value.option === 'Header Introduce'
  );
  const valHeaderIntroduce = optHeaderIntroduce[0].value1;
  domHeaderIntroduce.textContent = valHeaderIntroduce;

  // Header title
  const domTitle = document.querySelector('.js-title');
  const optTitle = array.filter((value) => value.option === 'Header Title');
  if (domTitle && optTitle) {
    const valTitle = optTitle[0].value1;
    domTitle.textContent = valTitle;
  }

  // Header Subtitle
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


  // Action Button (option)
  const domActionButton = document.querySelector('.js-action-button');
  const optActionButton = array.filter((value) => value.option === 'Action Button');
  if (domActionButton && optActionButton) {
    const valActionButtonLabel = optActionButton[0].value1;
    const valActionButtonUrl = optActionButton[0].value2;
    domActionButton.textContent = valActionButtonLabel;
    domActionButton.setAttribute('href', valActionButtonUrl);
  }

  // Stream
  const domStreamPlayer = document.querySelector('.js-stream-player');
  const optStream = array.filter((value) => value.option === 'Stream');
  if (domStreamPlayer && optStream) {
    const optStreamService = optStream[0].value1;
    const optStreamChannel = optStream[0].value2;
    switch (optStreamService) {
      case 'Twitch':
        domStreamPlayer.setAttribute(
          'src',
          'https://player.twitch.tv/?channel=' +
            optStreamChannel +
            '&parent=' +
            hostname
        );
        break;
      case 'Youtube Live':
        domStreamPlayer.setAttribute(
          'src',
          'https://www.youtube.com/embed/' + optStreamChannel
        );
        break;
      default:
        domStreamPlayer.remove();
    }
  }

  /////////////////////////////////////
  // -Introduction-
  // Introduction
  const domIntroductionWrap = document.querySelector('.js-introduction-wrap');
  const domIntroduction = document.querySelector('.js-introduction'); // コピー元を取得
  const optIntroduction = array.filter((value) => value.option === 'Introduction');
  for (let i = 0; i < optIntroduction.length; i++) {
    const domIntroductionClone = domIntroduction.cloneNode(true);
    domIntroductionClone.textContent = optIntroduction[i].value1;
    domIntroductionWrap.appendChild(domIntroductionClone);
  }
  domIntroduction.remove(); // コピー元を削除

  /////////////////////////////////////
  // -Overview-

  // Title
  const domEventTitle = document.querySelector('.js-event-title');
  if (domEventTitle && optTitle) {
    const valTitle = optTitle[0].value1;
    domEventTitle.textContent = valTitle;
  }

  // Date
  const domEventDate = document.querySelector('.js-event-date');
  const optEventDate = array.filter(
    (value) => value.option === 'Date (Local Time)'
  );
  if (domEventDate && optEventDate) {
    const valEventDate = optEventDate[0].value1;
    domEventDate.textContent = valEventDate;
  }

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
  // -Schedule-
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
  // -members-
  const domMemberWrap = document.querySelector('.js-member-wrap');
  const domMember = document.querySelector('.js-member'); // コピー元を取得
  const optMember = array.filter((value) => value.option === 'Member');
  console.log(optMember);
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
      '<script src="js/parse.js"></script>',
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
