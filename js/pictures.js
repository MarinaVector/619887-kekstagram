'use strict';

var MIN_URL = 1;
var MAX_URL = 25;
var MAX_URL_AVATAR = 6;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var USERS_PHOTOS_COUNT = 25;

var pictureTemplate = document.querySelector('#picture').content;
var picturesRenderBlock = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var commentsList = bigPicture.querySelector('.social__comments');

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

    return myArray;
};

var generateRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var generateRandomValueList = function (array) {
  var randomValueList = [];

  randomValueList.length = Math.floor(Math.random() * array.length);

  for (var i = 0; i < randomValueList.length; i++) {
    randomValueList[i] = generateRandomValue(array);
  }

  return randomValueList;
};

var generateUsersPhotosObjects = function (count) {
  var usersPhotos = [];

  var uniqArray = getUniqArray(MIN_URL, MAX_URL);

  for (var i = 0; i < count; i++) {

    var userPhotoObject = {
      url: 'photos/' + uniqArray[i] + '.jpg',
      likes: generateNumber(MIN_LIKES, MAX_LIKES),
      comments: generateRandomValueList(COMMENTS_STORAGE),
      description: generateRandomValue(DESCRIPTION_STORAGE)
    };

    usersPhotos[i] = userPhotoObject;
  }

  return usersPhotos;
};

var usersPhotoSet = generateUsersPhotosObjects(USERS_PHOTOS_COUNT);

var createPicture = function (userPhoto) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = userPhoto.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = userPhoto.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = userPhoto.comments.length;

  return pictureElement;
};

var getFragment = function (functionName, array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(functionName(array[i]));
  }

  return fragment;
};

picturesRenderBlock.appendChild(getFragment(createPicture, usersPhotoSet));

document.querySelector('.big-picture').classList.remove('hidden');

bigPicture.querySelector('.big-picture__img img').src = usersPhotoSet[0].url;
bigPicture.querySelector('.likes-count').textContent = usersPhotoSet[0].likes;
bigPicture.querySelector('.comments-count').textContent = usersPhotoSet[0].comments.length;
bigPicture.querySelector('.social__caption').textContent = usersPhotoSet[0].description;

var avatarCommentUrlNumber = getUniqArray(MIN_URL, MAX_URL_AVATAR);

var commentsArray = commentsList.children;

for (var i = 0; i < commentsArray.length; i++) {
  commentsArray[i].classList.add('social__comment--text');
  commentsArray[i].querySelector('img').src = 'img/avatar-' + avatarCommentUrlNumber[i] + '.svg';
  commentsArray[i].querySelector('.social__text').textContent = usersPhotoSet[i].comments;
};

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');

bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
