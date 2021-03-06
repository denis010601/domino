
var thank = $('.thank')
    thank.on('click', function (){
      thank.removeClass('thank--visible')
    })
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
var modal = $('.modal')
    jsbtn = $('.js-modal')
    jsbtn.on('click', function () {
      modal.toggleClass('modal--visible')
    })
// Кнопка закрытия для всех попап
var bClose = $('.popup-close')
    popup = $('.popup')
    modal = $('.modal')
    bClose.on('click', function () {
      popup.removeClass('popup--visible')
    });
    bClose.on('click', function () {
      modal.removeClass('modal--visible')
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
            iconImageHref: 'img/map-icon.png',
            // Размеры метки.
            iconImageSize: [30, 30],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-15, -20],
            
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



  
document.addEventListener ('DOMContentLoaded', function (){
  const links = document.querySelectorAll ('.js-header__menu-link' );

  for(let i = 0; i<links.length; i++){
    links[i].addEventListener('click', function (event) {
      event.preventDefault();
      
      const blockID = event.target.getAttribute("href").substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: "start"
      })
    })
  }
});
document.addEventListener ('DOMContentLoaded', function (){
  const links = document.querySelectorAll ('.js-menu__href' );

  for(let i = 0; i<links.length; i++){
    links[i].addEventListener('click', function (event) {
      event.preventDefault();
      
      const blockID = event.target.getAttribute("href").substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: "start"
      })
    })
  }
});


$(".modal__form").validate({
  errorElement: "div",
  errorClass: "invalid",
  rules: {
    // simple rule, converted to {required:true}
    userName: {
      required: true,
      minlength: 2,
      maxlength:15
    },
    userPhone: {
      required: true,
      minlength: 17,
    },
    // compound rule

    
  },
    messages: {
      userName: {
        required:"Имя обязательно",
        minlength: "Имя не короче двух букв",
        maxlength: "Имя не длиньше 15 букв"
      } ,
      userPhone: {
        required :"Телефон обязателен",
        minlength: "Введите в формате +7(000) 000-00-00",
      },

      
  },
  submitHandler: function(form) {
    $.ajax ({
      type: "POST",
      url: "send.php",
      data: $(form).serialize(),
      success: function (response) {
        thank.toggleClass('thank--visible');
        $(form)[0].reset();
        modal.removeClass('modal--visible');
      }
    });
  }
});
$('[type=tel]').mask('+7(000) 000-00-00', {placeholder: "Телефон"}, {minLength: 11});

$(".bid__form").validate({
  errorElement: "div",
  errorClass: "invalid",
  rules: {
    // simple rule, converted to {required:true}
    userName: {
      required: true,
      minlength: 2,
      maxlength:15
    },
    userPhone: {
      required: true,
      minlength: 17,
    },
    // compound rule

    
  },
    messages: {
      userName: {
        required:"Имя обязательно",
        minlength: "Имя не короче двух букв",
        maxlength: "Имя не длиньше 15 букв"
      } ,
      userPhone: {
        required :"Телефон обязателен",
        minlength: "Введите в формате +7(000) 000-00-00",
      },


  },
  submitHandler: function(form) {
    $.ajax ({
      type: "POST",
      url: "send.php",
      data: $(form).serialize(),
      success: function (response) {
        thank.toggleClass('thank--visible');
        $(form)[0].reset();
        modal.removeClass('modal--visible');
      }
    });
  }
});
$('[type=tel]').mask('+7(000) 000-00-00', {placeholder: "Телефон"}, {minLength: 11});
