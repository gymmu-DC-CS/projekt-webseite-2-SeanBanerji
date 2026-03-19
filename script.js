// =============================================
//   THE BEAUTIFUL GAME — script.js
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // --- NAVBAR: darken on scroll ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelector('.nav-links');
  let lastScrollY = 0;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgb(0, 0, 0)';
    } else {
      navbar.style.background = 'rgb(0, 0, 0)';
    }

    // Hide nav-links when scrolling down, show when scrolling up
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      navLinks.style.maxHeight = '0';
      navLinks.style.opacity = '0';
      navLinks.style.overflow = 'hidden';
    } else {
      navLinks.style.maxHeight = '500px';
      navLinks.style.opacity = '1';
      navLinks.style.overflow = 'visible';
    }
    lastScrollY = window.scrollY;
  });

  // Show nav-links on navbar hover
  navbar.addEventListener('mouseenter', function () {
    navLinks.style.maxHeight = '500px';
    navLinks.style.opacity = '1';
    navLinks.style.overflow = 'visible';
  });

  navbar.addEventListener('mouseleave', function () {
    if (window.scrollY > 100) {
      navLinks.style.maxHeight = '0';
      navLinks.style.opacity = '0';
      navLinks.style.overflow = 'hidden';
    }
  });

  // --- NAVBAR LOGO: scroll to top ---
  const navLogo = document.querySelector('.nav-logo');
  navLogo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  navLogo.style.cursor = 'pointer';

  
  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll(
    '.card, .cl-card, .legend-card, .moment, .fact-bubble, .timeline-item'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });

  // --- ACTIVE NAV LINK ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.style.color = '';
      link.style.borderBottomColor = 'transparent';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#e8b84b';
        link.style.borderBottomColor = '#e8b84b';
      }
    });
  });

  // =============================================
  //   QUIZ
  // =============================================

  const quizData = [
    {
      question: 'In which year was the Football Association (FA) founded in England?',
      options: ['1848', '1863', '1871', '1888'],
      correct: 1,
      fact: 'The FA was founded on 26 October 1863 at the Freemasons\' Tavern in London — making it the world\'s oldest football governing body.'
    },
    {
      question: 'Which country has won the most FIFA World Cups?',
      options: ['Germany', 'Argentina', 'Brazil', 'Italy'],
      correct: 2,
      fact: 'Brazil has won the World Cup 5 times: 1958, 1962, 1970, 1994, and 2002. They are also the only nation to have played in every single World Cup.'
    },
    {
      question: 'Who is the all-time top scorer in the UEFA Champions League?',
      options: ['Lionel Messi', 'Raúl', 'Robert Lewandowski', 'Cristiano Ronaldo'],
      correct: 3,
      fact: 'Cristiano Ronaldo holds the all-time Champions League scoring record with over 140 goals, spread across Manchester United, Real Madrid, and Juventus.'
    },
    {
      question: 'What happened in the 2005 Champions League final?',
      options: ['AC Milan won 3–1', 'Liverpool came back from 3–0 down to win on penalties', 'AC Milan trashed Liverpool 8-2', 'The Final got cancelled due to harsh weather and was never rescheduled'],
      correct: 1,
      fact: 'AC Milan led 3–0 at half-time, but Liverpool scored three goals in six incredible minutes, drawing 3–3. They then won on penalties — one of the greatest comebacks ever.'
    },
    {
      question: 'Against which country did Maradona score the "Hand of God" goal in 1986?',
      options: ['Brazil', 'West Germany', 'England', 'Italy'],
      correct: 2,
      fact: 'The "Hand of God" goal was scored against England in the 1986 World Cup quarter-final. Moments later, Maradona scored the "Goal of the Century" in the same match.'
    },
    {
      question: 'What were the odds of Leicester City winning the 2015-16 Premier League?',
      options: ['500 to 1', '1,000 to 1', '5,000 to 1', '250 to 1'],
      correct: 2,
      fact: 'Leicester City were priced at 5,000 to 1 outsiders. Their title win is widely considered the greatest sporting miracle in modern history.'
    },
    {
      question: 'How many Ballon d\'Or awards has Lionel Messi won?',
      options: ['6', '7', '8', '5'],
      correct: 2,
      fact: 'Lionel Messi has won a record 8 Ballon d\'Or awards, cementing his status as one of the greatest players in football history.'
    },
    {
      question: 'Which club has won the most UEFA Champions League titles?',
      options: ['AC Milan', 'Barcelona', 'Bayern Munich', 'Real Madrid'],
      correct: 3,
      fact: 'Real Madrid have won the Champions League a record 15 times, including the first 5 consecutive editions from 1956 to 1960.'
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const quizFeedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-btn');
  const quizResult = document.getElementById('quiz-result');
  const resultText = document.getElementById('result-text');
  const restartBtn = document.getElementById('restart-btn');
  const quizCurrentEl = document.getElementById('quiz-current');
  const quizTotalEl = document.getElementById('quiz-total');
  const questionBox = document.getElementById('question-box');

  quizTotalEl.textContent = quizData.length;

  function loadQuestion() {
    answered = false;

    quizFeedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
    quizResult.classList.add('hidden');
    questionBox.classList.remove('hidden');

    const q = quizData[currentQuestion];
    quizCurrentEl.textContent = 'Question ' + (currentQuestion + 1);
    questionText.textContent = q.question;

    optionsContainer.innerHTML = '';

    q.options.forEach(function (option, index) {
      const btn = document.createElement('button');
      btn.classList.add('option-btn');
      btn.textContent = option;
      btn.addEventListener('click', function () {
        selectAnswer(index, btn);
      });
      optionsContainer.appendChild(btn);
    });
  }

  function selectAnswer(selectedIndex, clickedBtn) {
    if (answered) return;
    answered = true;

    const q = quizData[currentQuestion];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    allBtns.forEach(function (btn) {
      btn.disabled = true;
    });

    if (selectedIndex === q.correct) {
      clickedBtn.classList.add('correct');
      score++;
      quizFeedback.textContent = '✓ Correct! ' + q.fact;
      quizFeedback.style.borderLeftColor = 'var(--green-light)';
    } else {
      clickedBtn.classList.add('wrong');
      allBtns[q.correct].classList.add('correct');
      quizFeedback.textContent = '✗ Not quite! ' + q.fact;
      quizFeedback.style.borderLeftColor = '#cc4444';
    }

    quizFeedback.classList.remove('hidden');

    if (currentQuestion < quizData.length - 1) {
      nextBtn.classList.remove('hidden');
    } else {
      setTimeout(showResult, 700);
    }
  }

  nextBtn.addEventListener('click', function () {
    currentQuestion++;
    loadQuestion();
  });

  function showResult() {
    quizFeedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
    questionBox.classList.add('hidden');

    let message = '';
    if (score === quizData.length) {
      message = '🏆 Perfect score! You\'re a true football historian. ' + score + '/' + quizData.length + ' correct.';
    } else if (score >= quizData.length * 0.75) {
      message = '⚽ Excellent! You really know your football. ' + score + '/' + quizData.length + ' correct.';
    } else if (score >= quizData.length * 0.5) {
      message = '👍 Not bad! Brush up on the history and try again. ' + score + '/' + quizData.length + ' correct.';
    } else {
      message = '📚 Time to study! Only ' + score + '/' + quizData.length + ' correct. The history is all above!';
    }

    resultText.textContent = message;
    quizResult.classList.remove('hidden');
  }

  restartBtn.addEventListener('click', function () {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
  });

  // Start the quiz
  loadQuestion();

}); // end DOMContentLoaded