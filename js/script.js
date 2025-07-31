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
    // console.log(questionData);

    //Reuseable Variable
    const initialContainer = document.querySelector(".initial_container");
    const playContainer = document.querySelector(".play_container");
    const categoryName = document.querySelector(".selected_category_name");

    let selectedCategory = null;
    let selectedQuantity = null;

    //Render Categories
    const categoryContainer = document.querySelector(".category_container");

    questionData.forEach((data) => {
      // console.log(q.category);
      const categoryText = data.category;

      const category = document.createElement("div");
      category.classList.add("category");
      category.textContent = categoryText;

      categoryContainer.append(category);

      //Get category from render
      category.addEventListener("click", (e) => {
        // get all category div to remove active style
        const allCategoryBtn = document.querySelectorAll(".category");
        allCategoryBtn.forEach((c) => {
          c.classList.remove("active");
        });

        //set category style active
        const catTextNode = e.target.textContent;
        e.target.classList.add("active");
        //match item with find()
        selectedCategory = questionData.find(
          (cat) => cat.category === catTextNode
        );
        // console.log(selectedCategory);
      });
    });

    // Get Quantity
    const quantityTag = new Array(...document.querySelectorAll(".quantity"));
    quantityTag.forEach((num) => {
      num.addEventListener("click", (n) => {
        // console.log(typeof n.target.textContent);
        if (!selectedCategory) {
          alert("Select a Category First!");
          return;
        }

        // get all quantity div to remove active style
        quantityTag.forEach((q) => {
          q.classList.remove("active");
        });

        //set quantity style active
        n.target.classList.add("active");

        // change number type
        selectedQuantity = parseInt(n.target.textContent);
        // console.log(selectedQuantity);
      });
    });

    //Start Button
    const startBtn = document.querySelector(".start_btn");
    startBtn.addEventListener("click", () => {
      if (!selectedCategory || selectedQuantity === null) {
        alert("Please select a Category and Question quantity");
      } else {
        initialContainer.style.display = "none";
        playContainer.style.display = "block";

        //call render Function
        renderQuestions(selectedCategory, selectedQuantity);
      }
    });

    //Reuseable Variables
    let currentQuestions = [];
    let currentQuestionIndex = 0;

    // Render Function
    const renderQuestions = (userSelectedCategory, userSelectedQuantity) => {
      // console.log(userSelectedQuantity);

      categoryName.textContent = userSelectedCategory.category;

      const currentCategoryQuestions = userSelectedCategory.survey;
      // console.log(currentCategoryQuestions);

      //Fisher Yate (shuffled)
      for (let i = currentCategoryQuestions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [currentCategoryQuestions[i], currentCategoryQuestions[j]] = [
          currentCategoryQuestions[j],
          currentCategoryQuestions[i],
        ];
      }
      // console.log(currentCategoryQuestions);

      //get questions quantity based on user selected
      currentQuestions = currentCategoryQuestions.slice(
        0,
        userSelectedQuantity
      );
      console.log(currentQuestions);

      showQuestions(currentQuestions);
    };

    //Show question one by one
    const showQuestions = (cq) => {
      let questionName = document.querySelector(".question_name");
      console.log(cq[currentQuestionIndex]);
      questionName = cq[currentQuestionIndex].question;
      console.log(questionName);
    };
  } catch (error) {
    console.error("Error: ", error);
  }
};

fetchData();
