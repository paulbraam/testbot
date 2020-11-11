const Markup = require('telegraf/markup')

const defaultKeyboard = Markup
  .keyboard([
    ['🚀 Курсы', '🗣 Общение'],
    ['💜 Подписка', '🧩 Тесты'],
    ['⭐️ Отзывы', '⁉️ Справка']
  ])
  .resize()
  .oneTime()
  .extra();




const backKeyboard = Markup
.keyboard([
  ['↩️ Назад']
])
.resize()
.oneTime()
.extra();




const whileTestKeyboard = Markup
  .keyboard([
    ['❗️ Завершить']
  ])
  .resize()
  .oneTime()
  .extra()

const initTestKeyboard = Markup
  .keyboard([
    ['🎯 Тесты', '📕 TestDaF'],
    ['✏️ onDaf', '↩️ В меню']
  ])
  .resize()
  .oneTime()
  .extra();

const onDaFKeyboard = Markup
  .keyboard([
    ['#1', '#2'],
    ['↩️ Вернуться']
  ])
  .resize()
  .oneTime()
  .extra()

const testDaFKeyboard = Markup
  .keyboard([
    ['📖 Leseverstehen', '🎧 Hörverstehen'],
    ['↩️ Вернуться']
  ])
  .resize()
  .oneTime()
  .extra()

const readKeyboard = Markup
  .keyboard([
    ['LV #1', 'LV #2'],
    ['Назад']
  ])
  .resize()
  .oneTime()
  .extra()

const listenKeyboard = Markup
.keyboard([
  ['HV #1', 'HV #2'],
  ['Назад']
])
.resize()
.oneTime()
.extra()

const emptyKeyboard = Markup.removeKeyboard().extra()

module.exports = {defaultKeyboard,  emptyKeyboard, testKeyboard, backKeyboard, initTestKeyboard, whileTestKeyboard, settingsKeyboard,readKeyboard, listenKeyboard}