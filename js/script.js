var nav = $('.navigation')
  btn = $('.bm');
  link = $('.menu__href')
  btnburger = $('.btnburger')
  btn.on('click', function () {
    nav.toggleClass('active');
    });
  link.on('click', function () {
    nav.removeClass('active');
  });
  btnburger.on('click', function () {
    nav.removeClass('active');
    });
// Кнопка закрытия для всех попап
var bClose = $('.popup-close')
    popup = $('.popup')
    bClose.on('click', function () {
      popup.removeClass('popup--visible')
    });
//    
//попап парикмахерский зал
var bWig = $('.bWig')
    pWig = $('.popup-wig')
    bWig.on('click', function () {
      pNails.toggleClass('popup--visible');
    });

// попап для ногтей 
var bNails = $('.bNails')
    pNails = $('.popup-nails')
    bNails.on('click', function () {
      pNails.toggleClass('popup--visible');
    });
// попап для makeup
var bMakeup = $('.bMakeup')
    pMakeup = $('.popup-makeup')
    bMakeup.on('click', function () {
      pMakeup.toggleClass('popup--visible');
    }); 
    // попап для Mantrim
var bMantrim = $('.bMantrim')
pMantrim = $('.popup-mantrim')
bMantrim.on('click', function () {
  pMantrim.toggleClass('popup--visible');
}); 

// попап для procedures
var bProcedures = $('.bProcedures')
pProcedures = $('.popup-procedures')
bProcedures.on('click', function () {
  pProcedures.toggleClass('popup--visible');
}); 

// попап для procedures
var bSolarium = $('.bSolarium')
pSolarium = $('.popup-solarium')
bSolarium.on('click', function () {
  pSolarium.toggleClass('popup--visible');
}); 


var mySwiper = new Swiper('.hero .swiper-container', {
  // Optional parameters

  loop: true,

  // If we need pagination
  pagination: {
    el: '.hero .swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.hero .swiper-button-next',
    prevEl: '.hero .swiper-button-prev',
  },

  // And if we need scrollbar

})

var swiper = new Swiper('.gallery .swiper-container', {
  slidesPerView: 1,
  spaceBetween: 10,
  
  scrollbar: {
    el: '.gallery .swiper-scrollbar',
    hide: true,
  },
  navigation: {
    nextEl: '.gallery .swiper-button-next',
    prevEl: '.gallery .swiper-button-prev',
  },
  breakpoints: {
    550: {
      slidesPerView: 3,
      spaceBetween: 20,
    }}
});
var swiper = new Swiper('.comment .swiper-container', {
  loop: true,

  navigation: {
    nextEl: '.comment .swiper-button-next',
    prevEl: '.comment .swiper-button-prev',
  },
});

//Переменная для включения/отключения индикатора загрузки
var spinner = $('.ymap-container').children('.loader');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
var check_if_load = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
var myMapTemp, myPlacemarkTemp;

//Функция создания карты сайта и затем вставки ее в блок с идентификатором "map-yandex"
function init () {
  var myMapTemp = new ymaps.Map("map-yandex", {
    center: [55.856538, 37.343793 ], // координаты центра на карте
    zoom: 17, // коэффициент приближения карты
    controls: ['zoomControl', 'fullscreenControl'] // выбираем только те функции, которые необходимы при использовании
  });
  var myPlacemarkTemp = new ymaps.GeoObject({

    geometry: {
        type: "Point",
        coordinates: [55.856573, 37.344781] // координаты, где будет размещаться флажок на карте  
    },
            
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: '../img/map-icon.png',
            // Размеры метки.
            iconImageSize: [30, 30],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-15, -20]
  });
  
  myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту

  // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
  var layer = myMapTemp.layers.get(0).get(0);

  // Решение по callback-у для определния полной загрузки карты
  waitForTilesLoad(layer).then(function() {
    // Скрываем индикатор загрузки после полной загрузки карты
    spinner.removeClass('is-active');
  });
}

// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
function waitForTilesLoad(layer) {
  return new ymaps.vow.Promise(function (resolve, reject) {
    var tc = getTileContainer(layer), readyAll = true;
    tc.tiles.each(function (tile, number) {
      if (!tile.isReady()) {
        readyAll = false;
      }
    }); 
    if (readyAll) {
      resolve();
    } else {
      tc.events.once("ready", function() {
        resolve();
      });
    }
  });
}

function getTileContainer(layer) {
  for (var k in layer) {
    if (layer.hasOwnProperty(k)) {
      if (
        layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
        || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
      ) {
        return layer[k];
      }
    }
  }
  return null;
}

// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript(url, callback){
  var script = document.createElement("script");

  if (script.readyState){  // IE
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" ||
              script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  // Другие браузеры
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Основная функция, которая проверяет когда мы навели на блок с классом "ymap-container"
var ymap = function() {
  $('.ymap-container').mouseenter(function(){
      if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем
    
    // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
        check_if_load = true; 
    
    // Показываем индикатор загрузки до тех пор, пока карта не загрузится
        spinner.addClass('is-active');

    // Загружаем API Яндекс.Карт
        loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&loadByRequire=1", function(){
           // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором "map-yandex"
          ymaps.load(init);
        });                
      }
    }
  );  
}

$(function() {

  //Запускаем основную функцию
  ymap();

});