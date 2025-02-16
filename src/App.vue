<template>
  <div class="min-h-screen bg-white py-8 px-4">
    <div class="max-w-md mx-auto">
      <div class="flex items-center justify-end mb-4">
        <div class="text-sm">
          {{ currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </div>
      </div>
      <div class="mb-6">
        <div class="bg-purple-600 rounded-xl p-4 text-white flex justify-between items-center">
          <div>Goal: {{ quizStore.totalPossiblePoints }} points</div>
          <div>Current Points: {{ quizStore.currentPoints }}</div>
        </div>
      </div>
      <div class="w-full bg-gray-200 h-1 mb-6 rounded-full overflow-hidden">
        <div
          class="bg-purple-600 h-full transition-all duration-300"
          :style="{ width: `${quizStore.progress}%` }"
        ></div>
      </div>
      <div class="mb-6">
        <h3 class="text-sm mb-2">Question {{ quizStore.currentQuestionIndex + 1 }}</h3>
        <p class="text-gray-700 mb-6">{{ quizStore.currentQuestion.question }}</p>
        <div v-if="quizStore.currentQuestion.type === 'multiple-choice'" class="space-y-3">
          <button
            v-for="(option, index) in quizStore.currentQuestion.options"
            :key="index"
            @click="selectOption(option, index)"
            :disabled="showFeedback"
            :class="[
              'w-full p-4 text-left rounded-xl border-2 transition-all duration-200',
              option.feedback === 'correct'
                ? 'border-green-500 bg-green-50'
                : option.feedback === 'incorrect'
                  ? 'border-red-500 bg-red-50'
                  : selectedOption === option
                    ? 'border-purple-600'
                    : 'border-gray-200',
              'disabled:cursor-not-allowed',
            ]"
          >
            <div class="flex justify-between items-center">
              <span>{{ option.text }}</span>
              <span v-if="option.feedback === 'correct'" class="text-green-500">✓</span>
              <span v-if="option.feedback === 'incorrect'" class="text-red-500">×</span>
            </div>
          </button>
        </div>
        <div v-else-if="quizStore.currentQuestion.type === 'drag-drop'" class="space-y-6">
          <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-sm text-gray-600 mb-4">{{ quizStore.currentQuestion.definition }}</p>
            <div
              class="min-h-[60px] bg-white rounded-xl border-2 border-dashed border-gray-300 p-2"
              @dragover.prevent
              @drop.prevent="onDrop"
              @touchend.prevent="onTouchEnd"
            >
              <div v-if="selectedTerm" class="inline-block">
                <div class="bg-purple-100 rounded-lg px-4 py-2">
                  {{ selectedTerm }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="term in quizStore.currentQuestion.terms"
              :key="term"
              draggable="true"
              @dragstart="onDragStart(term)"
              @touchstart="onTouchStart(term, $event)"
              class="bg-gray-900 text-white px-4 py-3 rounded-xl text-center cursor-move select-none active:opacity-60"
            >
              {{ term }}
            </div>
          </div>
        </div>
        <div
          v-if="showFeedback"
          class="mt-4 transition-all duration-300 ease-in-out"
          :class="{ 'opacity-100': showFeedback, 'opacity-0': !showFeedback }"
        >
          <div
            :class="[
              'p-4 rounded-xl',
              isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800',
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="mr-2">
                  <svg
                    v-if="isCorrect"
                    class="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
                <span class="font-medium">{{ isCorrect ? 'Right!' : 'Think again!' }}</span>
              </div>

              <div v-if="!isCorrect">
                <button
                  v-if="retryAttempts > 0"
                  @click="handleRetry"
                  class="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
                <button
                  v-else
                  @click="handleNextQuestion"
                  class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Next Question
                </button>
              </div>
            </div>
            <p class="text-sm mt-1">{{ feedbackMessage }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showResults"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold mb-4">Quiz Results</h2>
        <div class="space-y-4">
          <div class="bg-purple-100 p-4 rounded-lg">
            <p class="font-medium">
              Total Points: {{ quizStore.currentPoints }}/{{ quizStore.totalPossiblePoints }}
            </p>
            <p class="text-sm mt-2">
              Questions Passed: {{ quizStore.totalQuestions - failedQuestions.length }}/{{
                quizStore.totalQuestions
              }}
            </p>
          </div>

          <div v-if="failedQuestions.length > 0" class="mt-4">
            <h3 class="font-medium mb-2">Questions to Review:</h3>
            <ul class="space-y-2">
              <li v-for="(q, index) in failedQuestions" :key="index" class="text-sm text-gray-600">
                {{ q.question }}
              </li>
            </ul>
          </div>

          <button
            class="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            @click="showResults = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'

const quizStore = useQuizStore()

const selectedOption = ref(null)
const selectedTerm = ref(null)
const showFeedback = ref(false)
const isCorrect = ref(false)
const feedbackMessage = ref('')
const retryAttempts = ref(1)
const failedQuestions = ref([])
const showResults = ref(false)
const currentTime = ref(new Date())

let timer

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const updateTime = () => {
  currentTime.value = new Date()
}

const resetQuestion = () => {
  selectedOption.value = null
  selectedTerm.value = null
  showFeedback.value = false
  retryAttempts.value = 1
}

const handleRetry = () => {
  if (retryAttempts.value > 0) {
    retryAttempts.value--
    selectedOption.value = null
    selectedTerm.value = null
    showFeedback.value = false
  }
}

const handleNextQuestion = () => {
  failedQuestions.value.push({
    questionIndex: quizStore.currentQuestionIndex,
    question: quizStore.currentQuestion.question,
  })

  quizStore.reduceTotalPoints(quizStore.currentQuestion.points)

  if (!quizStore.isLastQuestion) {
    quizStore.nextQuestion()
    resetQuestion()
  } else {
    showResults.value = true
  }
}

const selectOption = (option, index) => {
  if (showFeedback.value) return
  selectedOption.value = option
  setTimeout(() => {
    validateAnswer(index)
  }, 1000)
}

const onDragStart = (term) => {
  selectedTerm.value = term
}

const onTouchStart = (term, event) => {
  event.preventDefault()
  selectedTerm.value = term
  event.target.style.opacity = '0.6'
}

const onTouchEnd = (event) => {
  event.preventDefault()

  document.querySelectorAll('.cursor-move').forEach((el) => {
    el.style.opacity = '1'
  })

  if (selectedTerm.value) {
    validateAnswer()
  }
}

const onDrop = () => {
  setTimeout(() => {
    validateAnswer()
  }, 1000)
}

const validateAnswer = (optionIndex) => {
  const currentQuestion = quizStore.currentQuestion

  if (currentQuestion.type === 'multiple-choice') {
    if (!selectedOption.value) return

    isCorrect.value = selectedOption.value.correct
    quizStore.setOptionFeedback(optionIndex, isCorrect.value)

    if (isCorrect.value) {
      quizStore.addPoints(currentQuestion.points)
      feedbackMessage.value = currentQuestion.feedback.correct

      if (!quizStore.isLastQuestion) {
        setTimeout(() => {
          quizStore.nextQuestion()
          resetQuestion()
        }, 2000)
      } else {
        setTimeout(() => {
          showResults.value = true
        }, 2000)
      }
    } else {
      feedbackMessage.value = `${currentQuestion.feedback.incorrect} ${
        retryAttempts.value > 0
          ? `\nYou have ${retryAttempts.value} more ${
              retryAttempts.value === 1 ? 'try' : 'tries'
            } left.`
          : 'Moving to next question...'
      }`

      if (retryAttempts.value === 0) {
        setTimeout(() => {
          handleNextQuestion()
        }, 1500)
      }
    }
  } else {
    isCorrect.value = selectedTerm.value === currentQuestion.correctTerm

    if (isCorrect.value) {
      quizStore.addPoints(currentQuestion.points)
      feedbackMessage.value = currentQuestion.feedback.correct

      if (!quizStore.isLastQuestion) {
        setTimeout(() => {
          quizStore.nextQuestion()
          resetQuestion()
        }, 2000)
      } else {
        setTimeout(() => {
          showResults.value = true
        }, 2000)
      }
    } else {
      feedbackMessage.value = `${currentQuestion.feedback.incorrect} ${
        retryAttempts.value > 0
          ? `\nYou have ${retryAttempts.value} more ${
              retryAttempts.value === 1 ? 'try' : 'tries'
            } left.`
          : 'Moving to next question.'
      }`

      if (retryAttempts.value === 0) {
        setTimeout(() => {
          handleNextQuestion()
        }, 1500)
      }
    }
  }

  showFeedback.value = true
}
</script>
