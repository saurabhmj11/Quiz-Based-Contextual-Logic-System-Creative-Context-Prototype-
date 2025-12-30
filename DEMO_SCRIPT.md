# Demo Script: NeuroAdaptive Quiz Engine

**Context**: You are presenting this to a recruiter or senior engineer.

## Scene 1: The "Happy Path" (Adaptive Difficulty)
1. **Start the Quiz**: Show the clean, minimalist UI. "Notice there is no gamification noise."
2. **Answer Correctly**: Select the correct answer for the first question.
3. **Show Adaptation**: "The system detects high confidence (I set slider to 90%). The next question is fetched from a higher difficulty tier (Difficulty 2 -> 3)."
4. **Visual Proof**: Point to the "Skill Graph" updating in real-time (Mastery goes up).

## Scene 2: The "Teachable Moment" (Misconception Detection)
1. **Trigger Error**: On a question about "Cell Cycle", choose "G2 phase" instead of "S phase".
2. **Confidence Trap**: Set confidence to High (80%). "I am confidently wrong."
3. **System Reaction**: 
   - Instead of a red "X", the `ExplanationBox` slides up.
   - Read the text: "You mixed growth phase with replication..."
   - Explain: "This isn't a hardcoded error message. The LLM analyzed my specific wrong answer ('G2') and generated a contextual correction."

## Scene 3: The "Reasoning" Check (ML Question)
1. **Switch Topic**: Move to an ML question (e.g., Bias-Variance).
2. **Explain Design**: "Here the system switches from retrieval to reasoning mode."
3. **Conclusion**: "This demonstrates not just a quiz app, but a learner modeling engine."
