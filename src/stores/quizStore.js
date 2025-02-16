import { defineStore } from 'pinia'
export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentQuestionIndex: 0,
    currentPoints: 0,
    remainingPossiblePoints: 0,
    questions: [
      {
        type: 'multiple-choice',
        question: 'What do plants need for photosynthesis?',
        points: 5,
        options: [
          { text: 'Oxygen & Sugar', correct: false },
          { text: 'Sunlight, Water & Carbon Dioxide', correct: true },
          { text: 'Protein & Salt', correct: false },
        ],
        feedback: {
          correct:
            'Plants use sunlight, water, and carbon dioxide to create their own food through photosynthesis!',
          incorrect: 'Think about the basic elements plants need to create their food.',
        },
      },
      {
        type: 'drag-drop',
        question: 'Match the Algebraic Term!',
        points: 5,
        definition: 'A fixed number that does not change',
        terms: ['Variable', 'Constant', 'Expression', 'Equation'],
        correctTerm: 'Constant',
        feedback: {
          correct: "Correct! A constant is a fixed number that doesn't change.",
          incorrect: 'Think about which term represents a value that stays the same.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'Which organelle is known as the powerhouse of the cell?',
        points: 5,
        options: [
          { text: 'Mitochondria', correct: true },
          { text: 'Nucleus', correct: false },
          { text: 'Golgi Apparatus', correct: false },
        ],
        feedback: {
          correct: 'Yes! Mitochondria produce energy through cellular respiration.',
          incorrect: 'This organelle is specifically known for energy production.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'What is the chemical symbol for Gold?',
        points: 5,
        options: [
          { text: 'Ag', correct: false },
          { text: 'Au', correct: true },
          { text: 'Fe', correct: false },
        ],
        feedback: {
          correct: 'Correct! Au is the chemical symbol for Gold.',
          incorrect: 'Think about the Latin name for Gold.',
        },
      },
      {
        type: 'drag-drop',
        question: 'Match the Science Term!',
        points: 5,
        definition: 'The process by which plants make their food',
        terms: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
        correctTerm: 'Photosynthesis',
        feedback: {
          correct: 'Correct! Photosynthesis is how plants make food using sunlight.',
          incorrect: 'This process involves sunlight, water, and carbon dioxide.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'Which planet is known as the Red Planet?',
        points: 5,
        options: [
          { text: 'Venus', correct: false },
          { text: 'Mars', correct: true },
          { text: 'Jupiter', correct: false },
        ],
        feedback: {
          correct: 'Correct! Mars is known as the Red Planet due to its iron oxide-rich surface.',
          incorrect: 'Think about the planet associated with the color red.',
        },
      },
      {
        type: 'drag-drop',
        question: 'Match the Geography Term!',
        points: 5,
        definition: 'A large body of saltwater',
        terms: ['River', 'Lake', 'Sea', 'Pond'],
        correctTerm: 'Sea',
        feedback: {
          correct: 'Correct! A sea is a large body of saltwater.',
          incorrect: 'Think about a vast body of water connected to an ocean.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'What is the largest organ in the human body?',
        points: 5,
        options: [
          { text: 'Heart', correct: false },
          { text: 'Brain', correct: false },
          { text: 'Skin', correct: true },
        ],
        feedback: {
          correct: 'Correct! Skin is the largest organ, protecting the body from external factors.',
          incorrect: 'This organ covers the entire body surface.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'Who proposed the theory of relativity?',
        points: 5,
        options: [
          { text: 'Isaac Newton', correct: false },
          { text: 'Albert Einstein', correct: true },
          { text: 'Galileo Galilei', correct: false },
        ],
        feedback: {
          correct: 'Correct! Albert Einstein proposed the theory of relativity.',
          incorrect: 'This scientist is famous for the equation E=mc².',
        },
      },
      {
        type: 'multiple-choice',
        question: 'What is the capital of France?',
        points: 5,
        options: [
          { text: 'Berlin', correct: false },
          { text: 'Madrid', correct: false },
          { text: 'Paris', correct: true },
        ],
        feedback: {
          correct: 'Correct! Paris is the capital city of France.',
          incorrect: 'This city is known for the Eiffel Tower.',
        },
      },
      {
        type: 'drag-drop',
        question: 'Match the Mathematical Term!',
        points: 5,
        definition: 'A mathematical sentence that shows two expressions are equal',
        terms: ['Function', 'Equation', 'Expression', 'Variable'],
        correctTerm: 'Equation',
        feedback: {
          correct: 'Correct! An equation shows that two expressions are equal.',
          incorrect: 'It relates to equality between two expressions.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'Which element is essential for the formation of bones and teeth?',
        points: 5,
        options: [
          { text: 'Iron', correct: false },
          { text: 'Calcium', correct: true },
          { text: 'Potassium', correct: false },
        ],
        feedback: {
          correct: 'Correct! Calcium is essential for strong bones and teeth.',
          incorrect: 'This mineral is commonly found in milk and dairy products.',
        },
      },
      {
        type: 'multiple-choice',
        question: 'Who wrote "Romeo and Juliet"?',
        points: 5,
        options: [
          { text: 'William Shakespeare', correct: true },
          { text: 'Charles Dickens', correct: false },
          { text: 'Jane Austen', correct: false },
        ],
        feedback: {
          correct: 'Correct! William Shakespeare wrote "Romeo and Juliet".',
          incorrect: 'This author is known as the Bard of Avon.',
        },
      },
    ],
  }),

  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    totalQuestions: (state) => state.questions.length,
    totalPossiblePoints: (state) =>
      state.questions.reduce((sum, question) => sum + question.points, 0),
    isLastQuestion: (state) => state.currentQuestionIndex === state.questions.length - 1,
    progress: (state) => ((state.currentQuestionIndex + 1) / state.questions.length) * 100,
  },

  actions: {
    initializeQuiz() {
      // Calculate and set initial total possible points
      this.remainingPossiblePoints = this.questions.reduce(
        (sum, question) => sum + question.points,
        0,
      )
      this.currentQuestionIndex = 0
      this.currentPoints = 0
      this.questions.forEach((question) => {
        if (question.type === 'multiple-choice') {
          question.options.forEach((option) => {
            delete option.feedback
          })
        }
      })
    },
    reduceTotalPoints(points) {
      this.remainingPossiblePoints -= points
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
      }
    },
    addPoints(points) {
      this.currentPoints += points
    },
    resetQuiz() {
      this.currentQuestionIndex = 0
      this.currentPoints = 0
      this.questions.forEach((question) => {
        if (question.type === 'multiple-choice') {
          question.options.forEach((option) => {
            delete option.feedback
          })
        }
      })
    },
    setOptionFeedback(optionIndex, isCorrect) {
      if (this.currentQuestion.type === 'multiple-choice') {
        this.currentQuestion.options[optionIndex].feedback = isCorrect ? 'correct' : 'incorrect'
      }
    },
  },
})
