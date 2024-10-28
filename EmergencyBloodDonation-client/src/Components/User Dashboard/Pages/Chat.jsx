import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'AI',
        text: 'Hello! I am here to assist you with any questions about blood donation. You can ask me about eligibility, the donation process, preparation tips, and more. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'User',
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = generateResponse(newMessage);
      const aiMessage = {
        id: messages.length + 2,
        sender: 'AI',
        text: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();

    const responses = [
      // Greetings
      {
        patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
        response: 'Hello! How can I assist you with blood donation today?',
      },
      // Instructions
      {
        patterns: ['help', 'how to use', 'instructions', 'guide', 'what can you do'],
        response: 'You can ask me about blood donation eligibility, the donation process, preparation tips, types of donations, and more. Just type your question, and I\'ll do my best to help!',
      },
      // Eligibility
      {
        patterns: [
          'eligibility',
          'can i donate',
          'who can donate',
          'am i eligible',
          'eligibility criteria',
        ],
        response:
          'To be eligible for blood donation, you generally need to be at least 17 years old, weigh at least 110 pounds, and be in good health. Specific requirements may vary based on location and health conditions.',
      },
      // Age Limit
      {
        patterns: ['age limit', 'minimum age', 'maximum age'],
        response:
          "The minimum age to donate blood is typically 17 years old in most countries. There's often no upper age limit as long as you meet the health requirements.",
      },
      // Medications
      {
        patterns: ['medications', 'on medication', 'taking medicine'],
        response:
          'Some medications may prevent you from donating blood temporarily or permanently. Please consult with the donation center for specifics about your medication.',
      },
      // Health Conditions
      {
        patterns: [
          'health conditions',
          'diseases',
          'illnesses',
          'cancer',
          'diabetes',
          'blood pressure',
        ],
        response:
          "Certain health conditions may affect your eligibility to donate blood. It's best to discuss your specific condition with the donation center staff.",
      },
      // Travel
      {
        patterns: ['travel', 'visited', 'traveled'],
        response:
          'Recent travel to certain countries may temporarily defer you from donating due to the risk of infectious diseases. Please provide your travel history to the donation center.',
      },
      // Donation Process
      {
        patterns: [
          'process',
          'how does it work',
          'donation procedure',
          'what to expect',
        ],
        response:
          'The blood donation process involves registration, a health history questionnaire, a mini-physical, the donation itself, and a short rest period with refreshments afterward.',
      },
      // Preparation
      {
        patterns: ['prepare', 'preparation', 'before donating', 'what to do before'],
        response:
          'Before donating blood, make sure to eat a healthy meal, stay hydrated, and get plenty of rest. Avoid heavy exercise before donation.',
      },
      // Side Effects
      {
        patterns: ['side effects', 'after effects', 'feel after', 'reactions'],
        response:
          'Most donors feel fine after donating blood. Some may experience lightheadedness, dizziness, or bruising at the needle site. These are usually temporary.',
      },
      // Benefits
      {
        patterns: [
          'benefits',
          'why donate',
          'importance',
          'save lives',
        ],
        response:
          "Donating blood saves lives! It helps patients undergoing surgery, accident victims, and those with diseases like cancer or blood disorders. It's a simple way to make a big difference.",
      },
      // Types of Donation
      {
        patterns: [
          'types of donation',
          'what can i donate',
          'platelets',
          'plasma',
          'double red cells',
        ],
        response:
          'You can donate whole blood, platelets, plasma, or double red cells. Each type of donation helps patients with different needs.',
      },
      // Donation Locations
      {
        patterns: [
          'where to donate',
          'location',
          'find donation center',
          'near me',
        ],
        response:
          'You can find a local blood donation center by visiting organizations like the Red Cross website or searching online for nearby centers.',
      },
      // Scheduling
      {
        patterns: ['schedule', 'appointment', 'book', 'when can i donate'],
        response:
          'You can schedule an appointment online or by calling your local blood donation center. Walk-ins are also welcome at many locations.',
      },
      // After Donation
      {
        patterns: [
          'after donation',
          'recovery',
          'what to do after',
          'post-donation',
        ],
        response:
          'After donating, rest for a few minutes, have a snack and a drink. Avoid strenuous activities for the rest of the day and keep the bandage on for at least four hours.',
      },
      // Blood Types
      {
        patterns: [
          'blood types',
          'compatibility',
          'universal donor',
          'o negative',
        ],
        response:
          'There are eight main blood types, and compatibility is important for transfusions. O negative blood is considered the universal donor.',
      },
      // COVID-19
      {
        patterns: [
          'covid',
          'coronavirus',
          'pandemic',
          'vaccination',
        ],
        response:
          "If you've received a COVID-19 vaccine, you may still be eligible to donate blood. Please check with the donation center for their specific guidelines.",
      },
      // Iron Levels
      {
        patterns: ['iron levels', 'hemoglobin', 'anemia'],
        response:
          'Adequate iron levels are necessary for blood donation. If you are anemic or have low hemoglobin, you may need to wait until your levels improve.',
      },
      // Blood Tests
      {
        patterns: ['blood tests', 'screening', 'tested for'],
        response:
          'All donated blood is tested for various infectious diseases to ensure safety. You will be notified if any tests come back positive.',
      },
      // Donation Duration
      {
        patterns: [
          'how long does it take',
          'duration',
          'time required',
        ],
        response:
          'The entire blood donation process takes about an hour, with the actual blood collection lasting about 10-15 minutes.',
      },
      // Safety
      {
        patterns: ['is it safe', 'safety', 'risk', 'dangerous'],
        response:
          'Yes, donating blood is safe. Sterile equipment is used for each donor to prevent any risk of infection.',
      },
      // Pain
      {
        patterns: ['will it hurt', 'pain', 'does it hurt'],
        response:
          'You may feel a slight pinch when the needle is inserted, but most donors report little to no discomfort during the donation.',
      },
      // Frequency
      {
        patterns: ['frequency', 'how often', 'donate again', 'wait between donations'],
        response:
          'You can donate whole blood every 56 days. The waiting period may differ for other types of donations like platelets or plasma.',
      },
      // Donation After Illness
      {
        patterns: ['donate after illness', 'post illness donation', 'recovering from illness'],
        response:
          'If you have recently recovered from an illness, you may need to wait until you are fully recovered and meet the health requirements for donating blood. Please consult with your healthcare provider or the donation center for specific guidelines.',
      },
      // Default Fallback with Suggestions
      {
        patterns: [],
        response: "I'm sorry, I didn't quite catch that. Here are some things you can ask me:\n- What are the eligibility criteria for donating blood?\n- How do I prepare for a blood donation?\n- What are the benefits of donating blood?\n- Where is the nearest blood donation center?\nFeel free to ask any of these or other questions related to blood donation!",
      },
    ];

    for (const item of responses) {
      if (item.patterns.length === 0) continue; // Skip the default fallback

      for (const pattern of item.patterns) {
        if (lowerInput.includes(pattern)) {
          return item.response;
        }
      }
    }

    // If no patterns matched, return the fallback response with suggestions
    const fallback = responses.find((item) => item.patterns.length === 0);
    return fallback ? fallback.response : "I'm sorry, I didn't quite catch that. Could you please rephrase or ask another question about blood donation?";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'User' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'User'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="font-semibold">{message.sender}</p>
              <p>{message.text}</p>
              <p className="text-xs mt-1 text-gray-300">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <p>AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
