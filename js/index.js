// APIのURL
const baseApiUrl = '';
// チャンネル一覧取得
const getChannels = () => $.ajax(baseApiUrl);
// 指定したチャンネルの最新20件取得
const getMessages = cname => $.ajax(`${baseApiUrl}/${cname}/messages`);
// 指定したチャンネルにメッセージを送信する
const postChannelsMessage = (cname, msg) => {
  return $.ajax({
    url: `${baseApiUrl}/${cname}/messages`,
    type: 'POST',
    data: {
      body: msg
    },
  });
};
// メッセージをすべて消す
const resetChannels = () => $.ajax({
  url: ``,
  type: 'POST',
});

// 取得した部屋名を格納
let channels = null;

// イベント設定
function initEvent() {
  $(window).on('hashchange', () => {
    showSection();
  });
  $('#send-message').on('submit', (e) => {
    e.preventDefault();
    sendMessage($('#chat-text').val());
  });
}

// 初期化処理
function init() {
  // ハッシュを初期化しておく
  window.location.hash = 'home';
  getChannels()
    .then(
      res => { // 成功
        channels = res.channels;
        createNaviMenu(res.channels);
        initEvent();
      },
      () => { // 失敗
        window.alert('エラーが発生しました。')
      }
    );
}

// サイドメニューを作成
function createNaviMenu(channels) {
  const naviLink = [];
  naviLink.push(`
      <a class="mdl-navigation__link" href="#home">
        <i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>
        home
      </a>`);
  channels.forEach(channel => {
    naviLink.push(
      `<a class="mdl-navigation__link" href="#${channel}">
        <i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>
        ${channel}
      </a>`);
  });
  $('#demo-navi-content')[ 0 ].innerHTML = naviLink.join('');
}

// コンテンツの表示切り替え
function showSection() {
  const hash = window.location.hash.slice(1);
  // チャンネル存在確認
  if(channels.indexOf(hash) >= 0) {
    // 存在する
    $('#home-section').hide();
    $('#chat-section').show();
    createMessages();
  } else {
    // 存在しない
    $('#home-section').show();
    $('#chat-section').hide();
    window.location.hash = 'home';
    changeTitle('home');
  }
}

// チャットの内容を表示
function createMessages() {
  const cname = window.location.hash.slice(1);
  getMessages(cname)
    .then(
      res => {
        const list = [];
        res.messages.reverse();
        res.messages.forEach(msg => {
          list.push(`
              <li class="mdl-list__item mdl-list__item--three-line">
                <span class="mdl-list__item-primary-content">
                  <i class="material-icons mdl-list__item-avatar">person</i>
                  <span>${msg.user.name}<span class="sub-title">${msg.date}</span></span>
                  <span class="mdl-list__item-text-body">
                  ${msg.body}
                  </span>
                </span>
              </li>`);
        });
        $('#chat-list')[ 0 ].innerHTML = list.join('');
        changeTitle(cname);
      },
      () => {
        window.alert('エラーが発生しました。');
      }
    );
}

// メッセージを送信する
function sendMessage(str) {
  if(str) {
    postChannelsMessage(window.location.hash.slice(1), str)
      .then(
        res => {
          // メッセージが成功したかどうか
          if(res.result === 'ok') {
            // 再取得
            createMessages();
            // テキストエリアクリア
            $('#chat-text').val('')
          }
        },
        () => {
          window.alert('エラーが発生しました。')
        }
      )
  } else {
    alert('メッセージを入力してください！');
  }
}

// タイトルを変える
function changeTitle(cname) {
  $('#chat-title').text(cname);
}

// 読み込みが終わったら
$(() => {
  init();
});
