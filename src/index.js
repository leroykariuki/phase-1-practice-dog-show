document.addEventListener("DOMContentLoaded", () => {
   const dogTable = document.querySelector("tbody");
   fetch("http://localhost:3000/dogs")
      .then((res) => res.json())
      .then((data) => addToPage(data))
      .catch((error) => console.log(error.message));

   function addToPage(dogs) {
      dogs.forEach((dog) => {
         addToTable(dog);
      });
   }

   function addToTable(dog) {
      const tr = document.createElement("tr");
      tr.id = dog.id;
      tr.innerHTML = `
    <tr>
		<td>${dog.name}</td> 
		<td>${dog.breed}</td> 
		<td>${dog.sex}</td> 
		<td><button data-id=${dog.id}>Edit</button></td>
	</tr>`;
      dogTable.append(tr);
   }

   dogTable.addEventListener("click", (e) => {
      //   e.target.dataset.id && addToForm();
      if (e.target.dataset.id) {
         addToForm();
      }
   });

   const form = document.querySelector("form");
   function addToForm() {
      let row = event.target.parentElement.parentElement.children;
      form.children[0].value = row[0].innerText;
      form.children[1].value = row[1].innerText;
      form.children[2].value = row[2].innerText;
      form.children[3].dataset.id = row[3].children[0].dataset.id;
   }

   //    handleSubmit
   form.addEventListener("submit", (e) => {
      e.preventDefault();

      //   Variables to be edited
      const dogName = form.children[0].value;
      const dogBreed = form.children[1].value;
      const dogSex = form.children[2].value;
      const dogId = form.children[3].dataset.id;

      editDog(dogBreed, dogId, dogName, dogSex)
         .then((res) => res.json())
         .then(
            (dog) =>
               (dogTable.innerHTML = `
        <tr>
				<td>${dog.name}</td> 
				<td>${dog.breed}</td> 
				<td>${dog.sex}</td> 
				<td><button data-id=${dog.id}>Edit</button></td>
			</tr>
        `)
         );

      function editDog(name, breed, sex, id) {
         const dogObj = {
            name: name,
            breed: breed,
            sex: sex,
         };
         return fetch(`http://localhost:3000/dogs/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
            },
            body: JSON.stringify({
               name: name,
               breed: breed,
               sex: sex,
            }),
         });
      }
      console.log("submitted");
   });
});