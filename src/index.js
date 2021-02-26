let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    const toyForm = document.querySelector("body > div.container > form");
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyForm.addEventListener("submit", handleToySubmit);
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys();
});

function getToys() {
  return fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(toys => toys.forEach(toy => appendToy(toy)))
}

function appendToy(toy) {
  let card = document.createElement("div");
  let h2 = document.createElement("h2");
  let img = document.createElement("img");
  let p = document.createElement("p");
  let button = document.createElement("button");
  card.className = 'card';
  // add id to make them easier to select when adding likes
  card.id = `toy-${toy.id}`;
  h2.innerText = toy.name;
  img.src = toy.image;
  img.className = 'toy-avatar';
  p.innerText = `${toy.likes} likes`;
  button.className = 'like-btn';
  button.innerText = 'Like <3';
  [h2, img, p, button].forEach(ele => card.appendChild(ele));
  document.body.appendChild(card);
  button.addEventListener('click', e => postLike(e))
  addToy = false;
}

function handleToySubmit(event) {
  event.preventDefault();
  let toyName = document.querySelector("body > div.container > form > input:nth-child(2)").value;
  let toyImg = document.querySelector("body > div.container > form > input:nth-child(4)").value;
  postToy(toyName, toyImg)
}

function postToy(name, image) {
  let toy = {name: name, image: image, likes: 0};
  let configObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toy)
  }
  return fetch('http://localhost:3000/toys', configObj)
    .then(resp => resp.json())
    .then(toy => appendToy(toy))
}

function postLike(event) {
  event.preventDefault
  // event.target is like button
  // like obj is p element that is a sibling of like button
  let likeObj = event.target.previousElementSibling;
  // split likeObj on space to have an array [likeCount, 'likes'], and select first element
  let newLikeCount = parseInt(likeObj.innerText.split(' ')[0]) + 1;
  let configObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({"likes": newLikeCount})
  }
  // This gets us the id of toy in database
  // card id is in format 'toy-toy.id', e.g. 'toy-1'
  const id = event.target.parentElement.id.split('-')[1]
  return fetch(`http://localhost:3000/toys/${id}`, configObj)
    .then(resp => resp.json())
    .then(() => likeObj.innerText = `${newLikeCount} likes`)
}

