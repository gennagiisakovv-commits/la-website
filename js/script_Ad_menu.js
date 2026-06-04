/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
/* Перевод. Переключение между добавлением и удалением «отзывчивого» класса в topnav, когда пользователь нажимает на значок. */
/* Функция описывается с помощью ключевого слова function по следующей схеме:
function <Имя функции>([<Параметры через запятую>]) {
<Тело функции>
[return[ <Возвращаемое значение>];]
}
Функция должна иметь уникальное имя.
стр.289
*/
function myFunction() 
/* Здесь функция: function, имя: myFunction, без параметров: ()   */
{var x = document.getElementById("myTopnav");
/* Здесь объявление переменной: var x =  */
/* Здесь переменная: document.getElementById("myTopnav")  */
/* При нажатии на кнопку будет вызвана функция, например: 
(стр.314) document.getElementById("btn3").onclick = handler2; */
/* Чтобы получить доступ к свойствам элемента, нужно вначале получить ссылку на сам элемент с помощью метода getElementById() объекта document. В качестве значения метод принимает строку с идентификатором элемента. */
/* Здесь идентификатор элемента: "myTopnav"
 В п.58 index.html указан указан идентификатор документа: id="myTopnav"
 Вся строка: <div class="topnav" id="myTopnav"> */
/* В п.1258 style.css указан class (className): 
.topnav {
	background-color: rgba(250, 250, 250, 1);
	overflow: hidden;
  } */
if (x.className === "topnav") 
/* Оператор сравнения: строго равно === (стр.220) */
/* Оператор ветвления: if (стр.225) */
/* Логическое выражение: x.className === "topnav" */
/* Если истинно логическое выражение (строго равно): x.className === "topnav", то здесь выполняется функция присвоения x.className += " responsive"; */
/* В п.1353 - 1373 style.css приведен класс .topnav.responsive */
{
    x.className += " responsive";
/* Оператор присваивания: += (стр.219) */
} 
  else {
    x.className = "topnav";
/* Если ложное логическое выражение: x.className === "topnav", то выполняется функция x.className = "topnav"; */
}
}