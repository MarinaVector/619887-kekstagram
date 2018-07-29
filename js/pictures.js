'use strict';

var MIN_URL = 1;
var MAX_URL = 25;
var MAX_URL_AVATAR = 6;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var USERS_PHOTOS_COUNT = 25;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var SCALE_VALUE = 1;
var SCALE_STEP = 0.25;
var LINE_WIDTH = 453;

var COMMENTS_STORAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION_STORAGE = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var commentTemplate = document.querySelector('#someCommentTemplate').content;
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var inputIdUploadFile = document.querySelector('#upload-file');
var buttonImgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
var resizeControlMinus = imgUploadOverlay.querySelector('.resize__control--minus');
var resizeControlPlus = imgUploadOverlay.querySelector('.resize__control--plus');
var resizeControlValue = imgUploadOverlay.querySelector('.resize__control--value');
var uploadImageWrapper = imgUploadOverlay.querySelector('.img-upload__preview');
var uploadImage = uploadImageWrapper.querySelector('img');
var imgUploadFieldset = imgUploadOverlay.querySelector('.img-upload__effects');
var pin = imgUploadOverlay.querySelector('.scale__pin');
var scaleLevel = imgUploadOverlay.querySelector('.scale__level');
var bigPicture = document.querySelector('.big-picture');
var buttonBigPictureCancel = bigPicture.querySelector('#picture-cancel');
var commentsList = bigPicture.querySelector('.social__comments');
var uploadForm = document.querySelector('.img-upload__form');
var hashtagsInput = uploadForm.querySelector('.text__hashtags');
var commentArea = uploadForm.querySelector('.text__description');
var checkedRadioDefault = uploadForm.querySelector('.effects__radio[checked]');
var originalImg = uploadForm.querySelector('#effect-none');

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');

var generateNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getUniqArray = function (min, max) {
  var myArray = [];

  for (var j = 0; myArray.length < max; j++) {
    var randomNumber = generateNumber(min, max);
    var found = false;
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i] === randomNumber) {
        found = true;
        break;
      }
    }
    if (!found) {
      myArray[myArray.length] = randomNumber;
    }
  }

  return myArray;
};

var generateRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var generateRandomIndexArray = function (array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return randomIndex;
};

var generateUsersPhotosObjects = function (count) {
  var usersPhotos = [];

  var uniqArray = getUniqArray(MIN_URL, MAX_URL);

  for (var i = 0; i < count; i++) {

    var userPhotoObject = {
      url: 'photos/' + uniqArray[i] + '.jpg',
      likes: generateNumber(MIN_LIKES, MAX_LIKES),
      comments: generateCommentsObjects(generateRandomIndexArray(getUniqArray(MIN_URL, MAX_URL_AVATAR))),
      description: generateRandomValue(DESCRIPTION_STORAGE)
    };

    usersPhotos[i] = userPhotoObject;
  }

  return usersPhotos;
};

var createPicture = function (userPhoto) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.addEventListener('click', function () {
    return renderBigPicture(userPhoto);
  });

  pictureElement.querySelector('.picture__img').src = userPhoto.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = userPhoto.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = userPhoto.comments.length;

  return pictureElement;
};

var getFragment = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createPicture(array[i]));
  }

  return fragment;
};

var renderPictures = function (arrayObjects) {
  var picturesRenderBlock = document.querySelector('.pictures');

  picturesRenderBlock.appendChild(getFragment(arrayObjects));
};

var generateComment = function (array) {
  var randomUniqValueArrayOne = array[generateRandomIndexArray(array)];
  var randomUniqValueArrayTwo = array[generateRandomIndexArray(array)];
  var randomUniqValueArray = randomUniqValueArrayOne + ' ' + randomUniqValueArrayTwo;

  if (randomUniqValueArrayOne === randomUniqValueArrayTwo) {
    randomUniqValueArray = randomUniqValueArrayTwo;
  }

  return randomUniqValueArray;
};

var generateCommentsObjects = function (count) {
  var usersComments = [];

  var uniqArray = getUniqArray(MIN_URL, MAX_URL_AVATAR);

  if (count === 0) {
    count++;
  }

  for (var i = 0; i < count; i++) {

    var userCommentObject = {
      url: 'img/avatar-' + uniqArray[i] + '.svg',
      commentText: generateComment(COMMENTS_STORAGE),
    };

    usersComments[i] = userCommentObject;
  }

  return usersComments;
};

var createCommentElement = function (arrayObject) {

  var commentElement = commentTemplate.querySelector('li').cloneNode(true);

  commentElement.classList.add('social__comment--text');
  commentElement.querySelector('img').src = arrayObject.url;
  commentElement.querySelector('.social__text').textContent = arrayObject.commentText;

  return commentElement;
};

var renderCommentsList = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createCommentElement(array[i]));
  }

  return fragment;
};

var renderBigPicture = function (userPhoto) {
  commentDelete();

  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img img').src = userPhoto.url;
  bigPicture.querySelector('.likes-count').textContent = userPhoto.likes;
  bigPicture.querySelector('.comments-count').textContent = userPhoto.comments.length;
  bigPicture.querySelector('.social__caption').textContent = userPhoto.description;

  commentsList.appendChild(renderCommentsList(userPhoto.comments));

  document.addEventListener('keydown', onPopupEscPress);
};

var commentDelete = function () {
  var commentArray = commentsList.querySelectorAll('li');
  for (var i = 0; i < commentArray.length; i++) {
    commentArray[i].remove();
  }
};

var changeFilterLevel = function (positionValue) {

  var pinPosition = Math.round(positionValue);

  imgUploadOverlay.querySelector('.scale__value').value = pinPosition;

  var effectIndex = 1;

  var uploadImageClass = uploadImage.classList;
  switch (uploadImageClass[0]) {
    case 'effects__preview--chrome':
      uploadImage.style = 'filter: grayscale(' + (pinPosition * 0.01) + ')';
      break;
    case 'effects__preview--sepia':
      uploadImage.style = 'filter: sepia(' + (pinPosition * 0.01) + ')';
      break;
    case 'effects__preview--marvin':
      uploadImage.style = 'filter: invert(' + pinPosition + '%' + ')';
      break;
    case 'effects__preview--phobos':
      uploadImage.style = 'filter: blur(' + (pinPosition * 0.03) + 'px' + ')';
      break;
    case 'effects__preview--heat':
      uploadImage.style = 'filter: brightness(' + (pinPosition * 0.02 + effectIndex) + ')';
      break;
    default:
      uploadImage.style = 'filter: none';
  }
};

var movesPin = function (evt) {

  var startCoordPin = {
    x: evt.clientX
  };

  var onMouseMovePin = function (moveEvt) {
    moveEvt.preventDefault();
    var shiftPin = {
      x: startCoordPin.x - moveEvt.clientX
    };

    startCoordPin = {
      x: moveEvt.clientX
    };

    var pinPositionValue = (pin.offsetLeft - shiftPin.x) * 100 / LINE_WIDTH;
    if (pinPositionValue <= 0) {
      pinPositionValue = 0;
    } else if (pinPositionValue >= 100) {
      pinPositionValue = 100;
    }

    pin.style.left = pinPositionValue + '%';
    scaleLevel.style.width = pinPositionValue + '%';

    changeFilterLevel(pinPositionValue);
  };

  var onMouseUpPin = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMovePin);
    document.removeEventListener('mouseup', onMouseUpPin);
  };

  document.addEventListener('mousemove', onMouseMovePin);
  document.addEventListener('mouseup', onMouseUpPin);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeImgUploadOverlay();
    closeBigPicture();
  }
};

var radioChecked = function (evt) {
  imgUploadOverlay.querySelector('.scale').classList.remove('hidden');
  originalImg.removeAttribute('checked');
  var classList = uploadImage.classList;
  for (var i = 0; i < classList.length; i++) {
    classList.remove(classList[i]);
  }
  if (evt.target.checked) {
    classList.add('effects__preview--' + evt.target.value);
    resizeControlValue.value = 100 + '%';
    SCALE_VALUE = 1;
    uploadImage.style = 'none';
    if (evt.target.value === 'none') {
      imgUploadOverlay.querySelector('.scale').classList.add('hidden');
    }
  }
  uploadImageWrapper.style = 'filter: none';
  pin.addEventListener('mousedown', movesPin);
};

var minusImageSize = function () {
  SCALE_VALUE -= SCALE_STEP;
  if (SCALE_VALUE <= SCALE_STEP) {
    SCALE_VALUE = SCALE_STEP;
  }
  resizeControlValue.value = SCALE_VALUE * 100 + '%';
  uploadImageWrapper.style = 'transform: scale(' + SCALE_VALUE + ')';
};

var plusImageSize = function () {
  SCALE_VALUE += SCALE_STEP;
  if (SCALE_VALUE >= 1) {
    SCALE_VALUE = 1;
  }
  resizeControlValue.value = SCALE_VALUE * 100 + '%';
  uploadImageWrapper.style = 'transform: scale(' + SCALE_VALUE + ')';
};

var doubleTagDetector = function (arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toLowerCase();
    obj[str] = true;
  }

  var result = Object.keys(obj);

  var doubleTag = false;
  if (result.length < arr.length) {
    doubleTag = true;
  }
  return doubleTag;
};

var splitString = function (evt) {
  var target = evt.target;
  var tagsArray = target.value.split(' ');

  for (var i = 0; i < tagsArray.length; i++) {
    var tagSymbols = tagsArray[i].split('');

    if (/[a-zа-я0-9]#/g.test(tagsArray[i])) {
      target.setCustomValidity('Хэштеги должны разделяться пробелами перед символом "#"');
    } else if (tagSymbols[0] !== '#') {
      target.setCustomValidity('Хэштег должен начинаться с символа "#"');
    } else if (tagsArray[i] === '#') {
      target.setCustomValidity('Хэштег не может состоять только из символа "#"');
    } else if (tagsArray.length > 5) {
      target.setCustomValidity('Вы можете добавить не более 5-ти хэштегов к одной фотографии');
    } else if (tagSymbols.length > 20) {
      target.setCustomValidity('Максимальная длина хэштега не должна превышать 20-ти символов, включая "#"');
    } else if (doubleTagDetector(tagsArray)) {
      target.setCustomValidity('Хэштеги должны быть уникальными');
    } else {
      target.setCustomValidity('');
    }
  }
};

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

var clearImgUploadOverlay = function () {
  var classList = uploadImage.classList;
  for (var i = 0; i < classList.length; i++) {
    classList.remove(classList[i]);
  }
  SCALE_VALUE = 1;
  uploadImageWrapper.style = 'none';
  document.querySelector('.img-upload__form').reset();
};

var openImgUploadOverlay = function () {
  checkedRadioDefault.removeAttribute('checked');
  originalImg.setAttribute('checked', '');
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  resizeControlValue.value = SCALE_VALUE * 100 + '%';
  resizeControlMinus.addEventListener('click', minusImageSize);
  resizeControlPlus.addEventListener('click', plusImageSize);
  imgUploadFieldset.addEventListener('change', radioChecked);
  imgUploadOverlay.querySelector('.scale').classList.add('hidden');
  hashtagsInput.addEventListener('input', splitString);
  hashtagsInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });
  commentArea.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });
  hashtagsInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscPress);
  });
  commentArea.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscPress);
  });
};

var closeImgUploadOverlay = function () {
  imgUploadOverlay.classList.add('hidden');
  inputIdUploadFile.removeEventListener('change', openImgUploadOverlay);
  document.removeEventListener('keydown', onPopupEscPress);
  resizeControlMinus.removeEventListener('click', minusImageSize);
  resizeControlPlus.removeEventListener('click', plusImageSize);
  imgUploadFieldset.removeEventListener('change', radioChecked);
  clearImgUploadOverlay();
  hashtagsInput.removeEventListener('input', splitString);
};

inputIdUploadFile.addEventListener('change', function () {
  openImgUploadOverlay();
});

buttonImgUploadCancel.addEventListener('click', function () {
  closeImgUploadOverlay();
});

buttonImgUploadCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeImgUploadOverlay();
  }
});

buttonBigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});

buttonBigPictureCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeBigPicture();
  }
});

renderPictures(generateUsersPhotosObjects(USERS_PHOTOS_COUNT));
