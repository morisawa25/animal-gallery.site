/* global $ MobileDetect */

// モバイルブラウザかどうか判定
const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile();

/**
 * ----------------------
 * 指定された名前のタブを表示
 * ----------------------
 */
const showTab = (tabName) => {
  // すでに表示されている場合は何もせずに終了
  if ($(`#${tabName}`).is(':visible')) {
    return;
  }

  const tabsContainer = $(`a[href='#${tabName}']`).closest('.tabs');
  // .tabs__menu liのうちtabNameに該当するものにだけactiveクラスを付ける
  tabsContainer.find('.tabs__menu li').removeClass('active');
  tabsContainer
    .find(`.tabs__menu a[href='#${tabName}']`)
    .parent('li')
    .addClass('active');

  // .tabs__contentの直下の要素をすべて非表示
  tabsContainer.find('.tabs__content > *').css({ display: 'none' });
  // #<tabName>と.tabs__content .<tabName>を表示
  tabsContainer
    .find(`#${tabName}, .tabs__content .${tabName}`)
    .css({
      display: 'block',
      opacity: 0.7,
    })
    .animate(
      {
        opacity: 1,
      },
      400,
    );
};

/**
 * -------------
 * パララックス関連
 * -------------
 */

// 背景画像のスクロール速度。数字が小さいほど速い。
const parallaxXSpeed = 12;
const parallaxYSpeed = 3;
const parallaxXSpeedSmall = 5;
const parallaxYSpeedSmall = 1;

// パララックスを適用する関数
const showParallax = () => {
  const scrollTop = $(window).scrollTop();

  // 背景画像の位置をスクロールに合わせて変える
  const offsetX = Math.round(scrollTop / parallaxXSpeed);
  const offsetY = Math.round(scrollTop / parallaxYSpeed);
  const offsetXSmall = Math.round(scrollTop / parallaxXSpeedSmall);
  const offsetYSmall = Math.round(scrollTop / parallaxYSpeedSmall);

  $('.puppies').css({
    'background-position':
      // 一番上
      `${-offsetX}px ${-offsetY}px, ${
        // 上から2番目
        offsetXSmall
      }px ${-offsetYSmall}px, `
      // 一番下
      + '0% 0%',
  });

  $('.kittens').css({
    'background-position':
      // 一番上
      `${offsetX}px ${-offsetY}px, ${
        // 上から2番目
        -offsetXSmall
      }px ${-offsetYSmall}px, `
      // 一番下
      + '0% 0%',
  });
};

// パララックスを初期化する関数
const initParallax = () => {
  $(window).off('scroll', showParallax);

  if (!isMobile) {
    // モバイルブラウザでなければパララックスを適用
    showParallax();

    // スクロールのたびにshowParallax関数を呼ぶ
    $(window).on('scroll', showParallax);
  }
};

/**
 * ------------------
 * イベントハンドラの登録
 * ------------------
 */

/**
 * animatedクラスを持つ要素が画面内に入ったら
 * Animate.cssのfadeInUpエフェクトを適用
 */
$('.animated').waypoint({
  handler(direction) {
    if (direction === 'down') {
      $(this.element).addClass('fadeInUp');
      this.destroy();
    }
  },
  
 
  offset: '100%',
});

$(window).on('resize', () => {
  // ウインドウがリサイズされるとここが実行される
  initParallax();
});

// タブがクリックされたらコンテンツを表示
$('.tabs__menu a').on('click', (e) => {
  const tabName = $(e.currentTarget).attr('href');

  e.preventDefault();

  if (tabName[0] === '#') {
    showTab(tabName.substring(1));
  }
});

$('.nav-link').on('click', (e) => {
  const destination = $(e.target).attr('href');

  // 本来のクリックイベントは処理しない
  e.preventDefault();

  $('html, body').animate(
    {
      scrollTop: $(destination).offset().top,
    },
    1000,
  );

  // ハンバーガーメニューが開いている場合は閉じる
  $('.navbar-toggler:visible').trigger('click');
});

// d-inline-blockクラスの付いた要素にMagnific Popupを適用
$('.d-inline-block').magnificPopup({
  type: 'image',
  gallery: { enabled: true },

  mainClass: 'mfp-fade',

  // ポップアップが非表示になるまでの待ち時間
  removalDelay: 300,
});

/**
 * ---------------------------------------
 * ページの読み込みが完了したタイミングで行うDOM操作
 * ---------------------------------------
 */

// モバイルブラウザでは静止画を表示し、それ以外では動画を表示
if (isMobile) {
  $('.top__bg').css({
    'background-image': 'url(https://morisawa25.github.io/animal-gallery.site/top-video-still.jpg)',
  });
} else {
  $('.top__video').css({ display: 'block' });
}

// 初期状態として1番目のタブを表示
showTab('puppies-1');
showTab('kittens-1');

// パララックスを初期化する
initParallax();

const apikey='becf2d957e4589528869bdc7ac07eba5';

const getFlickrImageURL=(photo,size)=>{
  let  url=`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
    photo.secret
  }`;
  if(size) {
    //サイズ指定ありの場合
    url+=`_${size}`;
  }
   url+='.jpg';
   return url;
  };
  
  //Flickr画像の元ページのURLを返す
  const getFlickrPageURL=photo=>`https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
  
  //Flickr画像のaltテキストを返す
  const getFlickrText =(photo)=>{
    let text=`"${photo.title}"by ${photo.ownername}`;
    if(photo.license==='4'){
      //CC BYライセンス
      text+=' /CC BY';
    }
    return text;
  };
  
//リクエストパラメータ猫
 const parametersCat=$.param({
  method:'flickr.photos.search',
  api_key:apikey,
  sort:'interestingness-desc',
  license:'4',//creative Commoms Attributionのみ
  extras:'owner_name,license',//追加で取得する情報
  format:'json',
  nojsoncallback:1,
  text:'cat',
  per_page:4,
  });
 
  const urlCat=`https://api.flickr.com/services/rest/?${parametersCat}`;
  console.log(urlCat);

//画像を検索して表示
 $.getJSON(urlCat,(data)=>{
   console.log(data);
   
   //データが取得できなかった場合
   if(data.stat !=='ok'){
     console.error('データの取得に失敗しました。');
     return;
   }
  
   //空のdivを作る
   const $div=$('<div>');
   
   //ヒット件数
   $div.append(`<div>${data.photos.total}photos in total<div>`);
   
    for(let i=0; i<data.photos.photo.length;i++){
     const photo=data.photos.photo[i];
     const photoText=getFlickrText(photo);

//$divに<a href="..."...><img src="..."...></a>を追加する
 $div.append(
   $('<a>',{
     href:getFlickrPageURL(photo),
     class:'d-inline-block',
     target:'_blank',
     'data-toggle':'tooltip',
     'data-placement':'bottom',
     title:photoText,
   }).append(
     $('<img>',{
       src:getFlickrImageURL(photo,'q'),
       width:150,
       height:150,
       alt:photoText,
      }),
     ),
    );
   }
  
   
   //$divを#mainに追加
  $div.appendTo('#main');

 //Tooltip適用 
  $('[data-toggle="tooltip"]').tooltip();
  
});


//リクエストパラメータ犬
 const parametersDog=$.param({
  method:'flickr.photos.search',
  api_key:apikey,
  sort:'interestingness-desc',
  license:'4',//creative Commoms Attributionのみ
  extras:'owner_name,license',//追加で取得する情報
  format:'json',
  nojsoncallback:1,
  text:'dog',
  per_page:4,
  });
 
  const urlDog=`https://api.flickr.com/services/rest/?${parametersDog}`;
  console.log(urlDog);

//画像を検索して表示
 $.getJSON(urlDog,(data)=>{
   console.log(data);
   
   //データが取得できなかった場合
   if(data.stat !=='ok'){
     console.error('データの取得に失敗しました。');
     return;
   }
  
   //空のdivを作る
   const $div=$('<div>');
   
   //ヒット件数
   $div.append(`<div>${data.photos.total}photos in total<div>`);
   
    for(let i=0; i<data.photos.photo.length;i++){
     const photo=data.photos.photo[i];
     const photoText=getFlickrText(photo);

//$divに<a href="..."...><img src="..."...></a>を追加する
 $div.append(
   $('<a>',{
     href:getFlickrPageURL(photo),
     class:'d-inline-block',
     target:'_blank',
     'data-toggle':'tooltip',
     'data-placement':'bottom',
     title:photoText,
   }).append(
     $('<img>',{
       src:getFlickrImageURL(photo,'q'),
       width:150,
       height:150,
       alt:photoText,
      }),
     ),
    );
   }
  
   
   //$divを#mainに追加
  $div.appendTo('#main');

 //Tooltip適用 
  $('[data-toggle="tooltip"]').tooltip();
  
});

