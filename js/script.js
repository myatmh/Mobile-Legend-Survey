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
    const scoreContainer = document.querySelector(".score_container");
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
        playContainer.classList.add("tran");

        //call render Function
        renderQuestions(selectedCategory, selectedQuantity);
      }
    });

    //Reuseable Variables
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 15;
    let timerId = null;

    const nextBtn = document.querySelector(".nextBtn");
    const finalBtn = document.querySelector(".final");

    const pointText = document.querySelector(".point");
    const trackPoint = document.querySelector(".track_point");

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
      // console.log(currentQuestions);

      showQuestions(currentQuestions);
    };

    //Show question one by one
    const showQuestions = (cq) => {
      const showTrackQuestionNumber =
        document.querySelector(".current_question");
      const questionName = document.querySelector(".question_name");
      const answersContainer = document.querySelector(".answers_container");

      answersContainer.innerHTML = "";
      // console.log(cq[currentQuestionIndex]);
      questionName.textContent = cq[currentQuestionIndex].question;

      showTrackQuestionNumber.innerHTML = `Question: <span>${
        currentQuestionIndex + 1
      } / ${currentQuestions.length}</span>`;

      //Render Answers
      const answerArray = cq[currentQuestionIndex].answers;
      const correctAnswer = cq[currentQuestionIndex].correct;

      answerArray.forEach((ans, index) => {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answers_wrapper");
        answerDiv.disabled = true;
        answerDiv.setAttribute("data-set", ans);

        const spanDiv = document.createElement("span");
        spanDiv.textContent = index + 1;

        const answer = document.createElement("div");
        answer.classList.add("answers");
        answer.innerText = ans;

        answerDiv.append(spanDiv, answer);

        answersContainer.appendChild(answerDiv);
      });

      //get all answers div and styled selected answer
      const allAnswerDiv = new Array(
        ...document.querySelectorAll(".answers_wrapper")
      );

      // startTime();
      const timer = document.querySelector(".timer");

      //reset timer
      if (timerId) clearInterval(timerId);
      timeLeft = 15;
      timer.textContent = timeLeft;

      timerId = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        if (timeLeft === 0) {
          // console.log("done");
          clearInterval(timerId);
          currentQuestionIndex++;
          if (currentQuestionIndex === currentQuestions.length) {
            finalBtn.style.display = "block";
          } else {
            setTimeout(() => {
              showNextBtn();
            }, 500);
          }

          allAnswerDiv.forEach((fail) => {
            fail.classList.add("disabled");
            if (fail.getAttribute("data-set") === correctAnswer) {
              fail.classList.add("answer_active");
            }
          });
          // console.log(currentQuestionIndex);
        }
      }, 1000);

      const showNextBtn = () => {
        nextBtn.classList.add("show-btn");
      };

      // console.log(allAnswerDiv);
      allAnswerDiv.forEach((all) => {
        all.addEventListener("click", (e) => {
          clearInterval(timerId);

          if (currentQuestionIndex + 1 === currentQuestions.length) {
            finalBtn.style.display = "block";
          } else {
            setTimeout(() => {
              showNextBtn();
            }, 500);
          }

          const correctData = e.currentTarget.getAttribute("data-set");
          // console.log(correctData);

          if (correctData === correctAnswer) {
            // console.log(true);
            all.classList.add("answer_active");
            score++;
            currentQuestionIndex++;
            allAnswerDiv.forEach((d) => {
              d.classList.add("disabled");
            });
          } else {
            // console.log(false);
            e.currentTarget.classList.add("wrong_active");
            currentQuestionIndex++;
            allAnswerDiv.forEach((d) => {
              d.classList.add("disabled");
              if (d.getAttribute("data-set") === correctAnswer) {
                d.classList.add("compare_active");
              }
            });
          }
          // console.log(currentQuestionIndex);
        });
      });
    };

    nextBtn.addEventListener("click", () => {
      setTimeout(() => {
        showQuestions(currentQuestions);
        if (nextBtn.classList.contains("show-btn")) {
          nextBtn.classList.remove("show-btn");
        }
      }, 500);
    });

    finalBtn.addEventListener("click", () => {
      if (timerId) clearInterval(timerId);
      playContainer.classList.remove("tran");
      scoreContainer.classList.add("tran");

      setTimeout(() => {
        playContainer.style.display = "none";
        scoreContainer.style.display = "flex";
      }, 300);

      pointText.textContent = score;
      trackPoint.textContent = currentQuestions.length;
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

fetchData();
