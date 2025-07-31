const categoryContainer = document.querySelector(".category_container");

let questionData = [];
//Fetch Json Function
const url = "./js/data.json";
const fetchData = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const data = await response.json();
    questionData = data;
    console.log(questionData);

    //Render Categories
    questionData.forEach((q) => {
      // console.log(q.category);

      const categoryText = q.category;

      const category = document.createElement("div");
      category.classList.add("category");
      category.textContent = categoryText;

      categoryContainer.append(category);

      category.addEventListener("click", (e) => {
        const catTextNode = e.target.textContent;
        const result = questionData.find((cat) => cat.category === catTextNode);
        console.log(result);
      });
    });

    //Get Quantity
    const quantityTag = new Array(...document.querySelectorAll(".quantity"));
    console.log(quantityTag);
  } catch (error) {
    console.error("Error: ", error);
  }
};

fetchData();
