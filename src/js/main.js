if (typeof QUIZ_DB !== "undefined") {
  const test = new Vue({
    el: "#app",
    data: () => {
      return {
        quiz: QUIZ_DB,
        isEndOfTest: false,
        groupIndex: 0,
        questionIndex: 0,
        userResponses: [],
      };
    },
    created() {
      this.quiz.groups.forEach((group, gIndex) => {
        this.userResponses[gIndex] = {
          groupName: group.name,
          questions: [],
        };
        group.questions.forEach((element, qIndex) => {
          let correctAnswer = element.responses.find((value) => {
            return value.correct ? value.text : false;
          });
          this.userResponses[gIndex].questions[qIndex] = {
            text: element.text,
            correctAnswer: correctAnswer.text,
            userAnswer: null,
            isCorrect: false,
          };
        });
      });
    },
    methods: {
      handleRadio(value, text) {
        this.userResponses[this.groupIndex].questions[
          this.questionIndex
        ].isCorrect = value ? value : false;
        this.userResponses[this.groupIndex].questions[
          this.questionIndex
        ].userAnswer = text;
        let testDataElement = document.querySelector("#test-data");
        if (!testDataElement) {
          console.error("testDataElement with ID #test-data not found!");
        }
        testDataElement.value = JSON.stringify(this.userResponses);
      },
      next() {
        let inputs = document.querySelectorAll(".b-test-content__variable");
        inputs.forEach((el) => {
          if (el.matches(":checked")) {
            this.questionIndex++;
          }
        });
        // last question detection
        if (
          this.userResponses[this.groupIndex].questions.length - 1 ===
          this.questionIndex
        ) {
          //
        }
      },
      nextGroup() {
        // detect end of test
        if (this.userResponses.length - 1 === this.groupIndex) {
          this.isEndOfTest = true;
        } else {
          this.groupIndex++;
          this.questionIndex = 0;
        }
      },
      isLastGroupQuestion(gIndex) {
        return (
          this.userResponses[this.groupIndex].questions.length ===
            this.questionIndex && gIndex === this.groupIndex
        );
      },
      getQuestionCountInGroup(groupIndex) {
        return this.userResponses[groupIndex].questions.length;
      },
      getCountOfRightAnswersInGroup(groupIndex) {
        let cnt = 0;
        this.userResponses[groupIndex].questions.forEach((question, index) => {
          if (question.isCorrect) {
            cnt++;
          }
        });
        return cnt;
      },
      getCountOfRightAnswers() {
        let cnt = 0;
        this.userResponses.forEach((group, gIndex) => {
          cnt += this.getCountOfRightAnswersInGroup(gIndex);
        });
        return cnt;
      },
      getCountOfAllQuestions() {
        let cnt = 0;
        this.userResponses.forEach((group, gIndex) => {
          cnt += group.questions.length;
        });
        return cnt;
      },
    },
    computed: {
      currentValue() {
        return (
          Math.round(
            (100 / this.quiz.groups[this.groupIndex].questions.length) *
              this.questionIndex
          ) + "%"
        );
      },
      pageCounter() {
        return (
          this.questionIndex +
          1 +
          "/" +
          this.quiz.groups[this.groupIndex].questions.length
        );
      },
      showNextGroupBtn() {
        return this.userResponses.length - 1 !== this.groupIndex;
      },
    },
  });
}

//burger
const burger = document.querySelector(".b-burger");
const menu = document.querySelector(".b-menu");
burger.addEventListener("click", () => {
  burger.classList.toggle("active-burger");
  if (
    !menu.classList.contains("active-block") &&
    !menu.classList.contains("active-menu")
  ) {
    menu.classList.add("active-block");
    setTimeout(() => {
      menu.classList.add("active-menu");
    }, 100);
    document.body.classList.add("b-fixed");
  }
  if (
    menu.classList.contains("active-block") &&
    menu.classList.contains("active-menu")
  ) {
    menu.classList.remove("active-menu");
    setTimeout(() => {
      menu.classList.remove("active-block");
    }, 400);
    document.body.classList.remove("b-fixed");
  }
});

//ACCORDEON
const accordeonBtn = document.querySelectorAll("[data-accordeon-btn]");
const accordeonContent = document.querySelectorAll("[data-accordeon-content]");

accordeonBtn.forEach((el) => {
  el.addEventListener("click", (event) => {
    if (!el.classList.contains("active")) {
      cleanActivBtns();
      el.classList.add("active");
      const target = event.currentTarget.getAttribute("data-accordeon-btn");
      hideAccordeons();
      let currentAccordeon = document.querySelector(
        `[data-accordeon-content="${target}"]`
      );
      var accordeonChild = currentAccordeon.firstElementChild.scrollHeight;
      currentAccordeon.style.height = `calc(${accordeonChild}px + 10.6vw)`;
      currentAccordeon.classList.add("active");
    } else if (el.classList.contains("active")) {
      cleanActivBtns();
      hideAccordeons();
    }

    function hideAccordeons() {
      accordeonContent.forEach((el) => {
        el.style.height = "0";
        el.classList.remove("active");
      });
    }

    function cleanActivBtns() {
      accordeonBtn.forEach((el) => {
        el.classList.remove("active");
      });
    }
  });
});

//LOAD VIDEO from link after click 'play'
const videos = document.querySelectorAll(".b-video");
let generateUrl = function (id) {
  let query = "?rel=0&showinfo=0&autoplay=1";
  return "https://www.youtube.com/embed/" + id + query;
};
let createIframe = function (id) {
  let iframe = document.createElement("iframe");
  iframe.setAttribute("allowfullscreen", "");
  iframe.setAttribute("allow", "autoplay; encrypted-media");
  iframe.setAttribute("src", generateUrl(id));
  return iframe;
};
videos.forEach((el) => {
  let videoHref = el.getAttribute("data-video");
  let deletedLength = "https://www.youtube.com/watch?v=".length;
  let videoId = videoHref.substring(deletedLength, videoHref.length);
  let img = el.querySelector("img");
  let youtubeImgSrc =
    "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg";
  img.setAttribute("src", youtubeImgSrc);
  el.addEventListener("click", (e) => {
    e.preventDefault();
    let iframe = createIframe(videoId);
    el.querySelector("img").remove();
    el.appendChild(iframe);
    el.querySelector("button").remove();
  });
});

//---MODALS---
//hide all modals
const modalOpen = document.querySelectorAll("[data-modal-open]");
const modals = document.querySelectorAll("[data-modal]");
const moadalInner = document.querySelectorAll(".b-modal");
const closeModal = document.querySelectorAll("[data-modal-close]");

function hideModals() {
  modals.forEach((elem) => {
    elem.classList.remove("b-show");
  });
}

//find & open current modal, close rest & block scroll
modalOpen.forEach((elem) => {
  elem.addEventListener("click", (event) => {
    event.preventDefault();
    let target = event.currentTarget.getAttribute("data-modal-open");
    hideModals();
    document.body.classList.add("b-blockScroll");
    let targetModal = document.querySelector(`[data-modal="${target}"]`);
    targetModal.classList.add("b-show");
    let currentVideo = document.querySelector("video");
    if (targetModal.contains(currentVideo)) {
      currentVideo.play();
      currentVideo.setAttribute("data-play", "");
    }
  });
});

//close btn active
closeModal.forEach(
  (el) =>
    (el.onclick = () => {
      hideModals();
      document.body.classList.remove("b-blockScroll");
    })
);

//close to click overlay
window.addEventListener("click", function (e) {
  modals.forEach((el) => {
    if (el == e.target && e.target != moadalInner) {
      document.body.classList.remove("b-blockScroll");
      hideModals();
      closeVideo();
    }
  });
});

function closeVideo() {
  currentPlayVideo.forEach((el) => {
    el.pause();
    el.currentTime = 0;
  });
}

//sliders
const swiper = new Swiper(".mySwiper", {
  spaceBetween: 100,
  effect: "fade",
  centeredSlides: "true",
  clickable: "false",
  autoplay: {
    delay: 5000,
  },
  fadeEffect: {
    crossFade: true,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "custom",
    renderCustom: function (swiper, current, total) {
      if (current < 10) {
        current = "0" + current;
      }
      if (total < 10) {
        total = "0" + total;
      }
      return current + " ... " + total;
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const slidesText = document.querySelectorAll(".b-slide-section__description");
for (let i = 0; i < slidesText.length - 1; i++) {
  const nextSlide = document.querySelector(".swiper-button-next");
  const prevSlide = document.querySelector(".swiper-button-prev");
  const slideSwape = document.querySelectorAll(".swiper-slide");
  let currentSlide = 0;

  const showSlide = () =>
    (slidesText[currentSlide].style = "opacity: 1; display: flex;");
  const hideSlide = () =>
    (slidesText[currentSlide].style = "opacity: 0; display: none;");
  const iterNext = () => currentSlide++;
  const iterPrev = () => currentSlide--;
  showSlide();

  nextSlide.addEventListener("click", () => [
    hideSlide(),
    iterNext(),
    showSlide(),
  ]);
  prevSlide.addEventListener("click", () => [
    hideSlide(),
    iterPrev(),
    showSlide(),
  ]);

  swiper.on("transitionEnd", function () {
    hideSlide();
    currentSlide = swiper.realIndex;
    showSlide();
  });
}
