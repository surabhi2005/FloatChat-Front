// Voice synthesis utility functions
export const speakText = (text, voiceId = 'en-US-AriaNeural') => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if available
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name.includes(voiceId.split('-').pop()));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Configure speech settings
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    return utterance;
  } else {
    console.warn('Speech synthesis not supported in this browser');
    return null;
  }
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const getAvailableVoices = () => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};

export const previewVoice = (voiceId, sampleText = "Hello, this is a preview of the selected voice.") => {
  return speakText(sampleText, voiceId);
};
