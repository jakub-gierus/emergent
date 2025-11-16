import { useState } from 'react';
import { usePerson } from '../hooks/useDB';
import { useGameStore } from '../stores/game';
import { INTERVIEW_RESPONSES } from '../lib/case';

export function Interview() {
  const { interviewingPersonId } = useGameStore();
  const { data: personData } = usePerson(interviewingPersonId);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState(3);

  if (!interviewingPersonId) {
    return (
      <div className="p-4 text-center text-slate-400">
        Select a person to interview from the suspects list
      </div>
    );
  }

  if (!personData || personData.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  const person = personData[0];
  const responses = INTERVIEW_RESPONSES[person.id] || {};
  const availableQuestions = Object.keys(responses);

  const handleAskQuestion = (question: string) => {
    setSelectedQuestion(question);
    setAskedQuestions([...askedQuestions, question]);
    const response = responses[question];
    if (response) {
      setStressLevel(Math.min(10, stressLevel + response.stress_increase));
    }
  };

  const currentResponse = selectedQuestion ? responses[selectedQuestion] : null;

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">Interview: {person.name}</h2>

      <div className="mb-4 flex justify-between items-center p-3 bg-slate-800 rounded">
        <div>
          <span className="text-slate-400">Stress Level:</span> {stressLevel}/10
        </div>
        <div className="text-sm text-slate-400">
          {stressLevel > 7 && 'Subject is very stressed - may lawyer up soon'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded">
          <h3 className="font-semibold mb-3">Available Questions</h3>
          <div className="space-y-2">
            {availableQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleAskQuestion(question)}
                disabled={askedQuestions.includes(question)}
                className={`w-full text-left p-3 rounded transition ${
                  askedQuestions.includes(question)
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {question}
                {askedQuestions.includes(question) && (
                  <span className="ml-2 text-xs">✓ Asked</span>
                )}
              </button>
            ))}
          </div>

          {availableQuestions.length === 0 && (
            <div className="text-slate-400 text-sm">
              No interview responses available for this person
            </div>
          )}
        </div>

        {currentResponse && (
          <div className="bg-slate-800 p-4 rounded border-l-4 border-yellow-500">
            <div className="font-semibold mb-2 text-yellow-400">
              {person.name}:
            </div>
            <div className="mb-3 italic">"{currentResponse.answer}"</div>
            {currentResponse.body_language && (
              <div className="text-sm text-slate-400">
                <span className="font-semibold">Body Language:</span> {currentResponse.body_language}
              </div>
            )}
          </div>
        )}

        {askedQuestions.length > 0 && (
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-semibold mb-2">Interview Summary</h3>
            <div className="text-sm text-slate-400">
              Questions asked: {askedQuestions.length}
            </div>
            <div className="text-sm text-slate-400">
              Current stress: {stressLevel}/10
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
