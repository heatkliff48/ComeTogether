ymaps.ready(init);

function init() {
  var myPlacemark,
    myMap = new ymaps.Map(
      'map',
      {
        center: [55.753994, 37.622093],
        zoom: 9,
        controls: ['zoomControl'],
      },
      {
        searchControlProvider: 'yandex#search',
      }
    );
  (async function () {
    const response = await fetch('/event/mark', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (response.ok) {
      const dataFromBback = await response.json();
      dataFromBback.forEach(function (event) {
        const placemark = new ymaps.Placemark([event.coordinatx, event.coordinaty], {
          // Зададим содержимое заголовка балуна.
          balloonContentHeader: `<p>${event.title}</p><br>`,
          // Зададим содержимое основной части балуна.
          balloonContentBody: `<p>${event.text}</p>`,
          // Зададим содержимое нижней части балуна.
          balloonContentFooter:

            ` <p>Контакты событейника</p>` +
            ` <p>${event.User.telegram}</p>` +
            ` <p>Имя событейника</p><br/>`+
            ` <p>${event.User.name}</p><br/>`,
          // Зададим содержимое всплывающей подсказки.
          hintContent: `<p>${event.title}</p>`,
        });
        myMap.geoObjects.add(placemark);
      });
    }
  })();

  // Слушаем клик на карте.
  myMap.events.add('click', function (e) {
    var coords = e.get('coords');

    const modalForm = document.forms.modalForm;

    modalForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const buttonAdd = modalForm.querySelector('[data-add]');
      if (buttonAdd) {
        const myData = Object.fromEntries(new FormData(modalForm));
        const response = await fetch('/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ myData, coords }),
        });
        if (response.status === 200) {
          window.location.pathname = '/';
        }
      }
    });
    // Если метка уже создана – просто передвигаем ее.
    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords);
    }
    // Если нет – создаем.
    else {
      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      // Слушаем событие окончания перетаскивания на метке.
      myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates());
      });
    }
  });

  // Создание метки.
  function createPlacemark(coords) {
    return new ymaps.Placemark(coords);
  }
}
