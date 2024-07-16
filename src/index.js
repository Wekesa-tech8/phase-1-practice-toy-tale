document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const newToyBtn = document.getElementById('new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  const toyForm = document.getElementById('toy-form');

  // Toggle the form visibility
  newToyBtn.addEventListener('click', () => {
    toyForm.style.display = toyForm.style.display === 'none' ? 'block' : 'none';
  });

  // Fetch and render toys
  fetchToys();

  // Add a new toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    createToy(name, image);
  });

  // Fetch toys from the server
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(renderToy);
      });
  }

  // Render a toy card
  function renderToy(toy) {
    const toyCard = document.createElement('div');
    toyCard.className = 'card';
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    
    // Add event listener for the like button
    toyCard.querySelector('.like-btn').addEventListener('click', () => {
      increaseLikes(toy);
    });

    toyCollection.appendChild(toyCard);
  }

  // Create a new toy and add it to the DOM
  function createToy(name, image) {
    const toyData = {
      name: name,
      image: image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(newToy => {
        renderToy(newToy);
      });
  }

  // Increase the like count for a toy
  function increaseLikes(toy) {
    toy.likes += 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: toy.likes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        const toyCard = document.getElementById(updatedToy.id).parentElement;
        toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
      });
  }
});