'use strict';

var minUrl = 1;
var maxUrl = 25;
var minLikes = 15;
var maxLikes = 200;
var usersPhotosCount = 25;

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var picturesRenderBlock = document.querySelector('#pictures');

var commentsStorage = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptionStorage = [
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

var generateUrl = function (min, max) {
  return 'photos/' + generateNumber(min, max) + '.jpg';
};

var generateRandomValue = function (array) {
  var randomValue = array[Math.floor(Math.random() * array.length)];
  return randomValue;
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

  usersPhotos.length = count - 1;

  for (var i = 0; i < count; i++) {

    var userPhotoObject = {
      url: generateUrl(minUrl, maxUrl),
      likes: generateNumber(minLikes, maxLikes),
      comments: generateRandomValueList(commentsStorage),
      description: generateRandomValue(descriptionStorage)
    };

    usersPhotos[i] = userPhotoObject;
  }

  return usersPhotos;
};

var usersPhotoSet = generateUsersPhotosObjects(usersPhotosCount);

var renderPicture = function (userPhoto) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = userPhoto.url.toSring;
  pictureElement.querySelector('.picture__stat--likes').textContent = userPhoto.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = userPhoto.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i <= usersPhotoSet.length; i++) {
  fragment.appendChild(renderPicture(usersPhotoSet[i]));
}

picturesRenderBlock.appendChild(fragment);
