import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaMoon, FaSun, FaPaperPlane, FaMicrophone } from 'react-icons/fa';
import { RiWechatLine } from 'react-icons/ri';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header */}
      <motion.div 
        className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RiWechatLine className={`text-3xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            </motion.div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              AI Blood Donation Assistant
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
          >
            {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-6xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex items-start space-x-2 max-w-xl ${
                  message.sender === 'User' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.sender === 'User' 
                    ? isDarkMode ? 'bg-red-600' : 'bg-red-500' 
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {message.sender === 'User' ? (
                    <FaUser className="text-white" />
                  ) : (
                    <FaRobot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.sender === 'User'
                    ? isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                    : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'User'
                      ? 'text-red-200'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Typing Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center space-x-2"
            >
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <FaRobot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: dot * 0.1 }}
                    className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <motion.div 
        className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSendMessage} className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <motion.div 
              className={`flex-1 flex items-center space-x-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
              whileFocus={{ scale: 1.02 }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 bg-transparent focus:outline-none ${
                  isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                }`}
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <FaMicrophone />
              </motion.button>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className={`p-4 rounded-full ${
                isDarkMode 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FaPaperPlane />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Chat;
