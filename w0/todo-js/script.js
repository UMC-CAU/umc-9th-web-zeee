// Elements : “화면에서 필요한 것들을 Id로 찾아서 이름표를 붙일 거예요.”
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');

// Add item by Enter (form submit) 
form.addEventListener('submit', (e) => {
  e.preventDefault(); //  웹이 기본적으로 하는 새로고침을 막음
  const text = input.value.trim(); //text에서 공백 없애기
  if (!text) return; // 텍스트 없으면 걍 끝냄
  const li = createTodoItem(text); //text를 todoitem 함수에 넣어서 반환값을 li에 담는다.
  todoList.prepend(li); // 새로 만든 게 위로 오게
  input.value = ''; //입력칸 비우기
  input.focus(); //커서를 다시 입력칸으로 옮김 (선택사항)
});

// Create a '해야 할 일' item
function createTodoItem(text) { //해야할 일 함수 정의
  const li = document.createElement('li'); //리스트 줄 만들기
  const span = document.createElement('span'); //span 만들기
  span.className = 'item-text'; //<span class="item-text"></span>과 동일함 
  span.textContent = text; //span 안에 글자 넣음

  const btn = document.createElement('button'); //버튼 생성
  btn.type = 'button'; //타입을 버튼으로 함
  btn.className = 'btn btn-complete'; //버튼에 className 설정함 -> 2개 한 이유는 예쁘게 하고 싶어서
  btn.textContent = '완료'; // 버튼에 글자
  li.append(span, btn); //리스트 안에 span, button 넣음
  return li; //리스트로 반환(span-할일텍스트 포함되어 있음, button)
}

// Create a '해낸 일' item
function createDoneItem(text) { //해낸 일 함수 정의
  const li = document.createElement('li');//li 만들기
  const span = document.createElement('span'); //span 만들기
  span.className = 'item-text'; //span에 class 붙여주고
  span.textContent = text; //text 넣어주기

  const btn = document.createElement('button'); //버튼 정의
  btn.type = 'button'; // 버튼 형태로 타입 설정
  btn.className = 'btn btn-delete'; //class 설정
  btn.textContent = '삭제'; // 버튼에 글자
  li.append(span, btn); //리스트 안에 span, button 넣음
  return li; // //리스트로 반환(span-할일텍스트 포함되어 있음, button)
}

// Event delegation for buttons
todoList.addEventListener('click', (e) => { //클릭이벤트
  const btn = e.target.closest('.btn-complete'); //클릭한 곳에서 가까운 완료 버튼을 찾음(부모를 찾기 가장 똑똑한 방법이라고 함)
  if (!btn) return; //완료 버튼 아니면 끝
  const li = btn.closest('li'); //그 버튼이 들어있는 list 찾기
  if (!li) return; //li 없으면 그냥 리턴
  // move to done
  const text = li.querySelector('.item-text').textContent; //그 줄 안에서 span을 class명으로 찾아서 글자 내용을 꺼냄
  const doneItem = createDoneItem(text); //해낸 일 줄을 새로 만듦
  doneList.prepend(doneItem); //해낸 일 맨 위에 붙여넣음
  li.remove(); //해야할 일에 있던 건 지움
});

doneList.addEventListener('click', (e) => { //클릭이벤트
  const btn = e.target.closest('.btn-delete'); //클릭한 곳 근처에서 '삭제'버튼 찾기
  if (!btn) return; // 없으면 그대로 끝
  const li = btn.closest('li'); //가까운 리스트 찾기
  if (!li) return; //없으면 그대로 끝
  li.remove(); //있으면 리스트 없애기
});
