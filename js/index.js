/**
 * 名前空間
 * */ 
var pf = pf || {};

pf.constants = {
	// 活性
	ACTIVE_CLASS: 'is-active',
  // 非表示
	HIDDEN_CLASS: 'is-hidden'
};

/**
 * 郵便番号API
 */
pf.postApi = function() {
  var api = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode='; // ?zipcode=を追加して謎１解決
  var error = $('#js-post').find('.error');
  var postInput = $('#js-post').find('#js-post-input');
  var postInputVal = postInput.val().replace('-', '');
  var todohuken = $('#js-address').find('#js-address-01');
  var sikuchoson = $('#js-address').find('#js-address-02');
  var choiki = $('#js-address').find('#js-address-03');
  var param = api + postInputVal; // ここで連結してajaxのurlに突っ込む

  /**
   * 謎１
   * valをobjectに突っ込まないと200がかえってこない？
   * apiのurlとparamを連結して突っ込んだら解決
   * var param = {
   * zipcode: postInput.val()
   * };
   */

  $.ajax ({
    url: param,
    type: 'GET',
    cache: false,
    dataType: 'jsonp',
    // 処理が成功したとき
    success:function(data){
      // 正常時はstatusが200
      if (data.status === 200) {
        // エラー文削除
        error.text('');
        $(data.results).each(function(i, result) {
          // テキスト表示
          todohuken.val(result.address1)
          sikuchoson.val(result.address2)
          choiki.val(result.address3)
        }) 
        // NGは400
      } else if(data.status === 400){
        // エラー文表示
        error.text('正しい郵便番号を入力してください');
        console.log(data.message);
      }
    },
    // 処理が失敗したとき
    error:function(){
    }
  })
};

/**
 * スクロール途中でヘッダー固定
 * @param {String} target 対象の要素
 */
pf.scrollFixed = function() {
  var target = $('#top');
  var header = $('#header_fixed');
  var headerHight = 120;
  var targetPosition = target.offset().top + headerHight;
  var winPosition = $(window).scrollTop();
  
  /**
   * 謎２
   * 中断からTOPに遷移したときにヘッダーがチラつく
   * is-activeが削除→付与→削除になってしまう・・
   */
  
  // 活性クラスの有無確認
  if(!header.hasClass(pf.constants.ACTIVE_CLASS)) {
    if (winPosition > targetPosition) {
      // ヘッダー固定
      header.addClass(pf.constants.ACTIVE_CLASS);
    } 
  } else if(winPosition < targetPosition) {
    // ヘッダー削除
    header.removeClass(pf.constants.ACTIVE_CLASS);
  }
};

/**
 * スムーススクロール
 * @param {String} target 対象の要素
 * @return {void} 何も返さない
 * */
pf.smoothScroll = function(target) {
  // ヘッダーの高さ
  var headerHight = 90;
  var href = $(target).attr("href");
  // hrefに存在する移動先のidを取得
  var targetHtml = $(href == "#" || href == "" ? 'html' : href);
  var positionFv = targetHtml.offset().top;
  var positionMenu = targetHtml.offset().top - headerHight
  $("html, body").animate({
    scrollTop: positionMenu
  });

  if (href === '#firstview') {
    // FVは高さ不要
    $("html, body").animate({
      scrollTop: positionFv
    });
  }
  return false;
};

/**
 * controller
 * */

// スクロール監視
 $(window).scroll(function() {
  // ヘッダー途中固定
  pf.scrollFixed();
});

$(function() {

  // スムーススクロール
  $('.js-nav').click(function() {
    pf.smoothScroll(this);
  });

  // 郵便番号検索押下
  $('#js-post').find('#js-post-action').click(function() {
    pf.postApi();    
  })
});