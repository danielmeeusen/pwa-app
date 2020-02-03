//  offline data
db.enablePersistence().catch(err => {
  if (err.code == 'failed-precondition') {
    // probably multiple tabs open at once
    console.log('persistence failed');
  } else if (err.code == 'unimplemented') {
    // lack of browser support
    console.log('persistence is not available');
  }
});

// real-time firebase listener
db.collection('data').onSnapshot(snapshot => {
  // console.log('changes:', snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    // console.log(change, change.doc.data, change.doc.id);
    if (change.type === 'added') {
      // add document data to page
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === 'removed') {
      // remove the document data from the web page
      removeRecipe(change.doc.id);
    }
  });
});

//  add new recipe
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection('data')
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
});

// delete recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
  if (evt.target.tagName === 'I') {
    const id = evt.target.getAttribute('data-id');
    db.collection('data')
      .doc(id)
      .delete();
  }
});
