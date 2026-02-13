'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Star, BookOpen, Sparkles } from 'lucide-react';

interface DailyWisdom {
  id: string;
  date: string;
  quote: string;
  translation: string;
  source: string;
  relevance: string;
}

export function DailyWisdom() {
  const [wisdom, setWisdom] = useState<DailyWisdom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaysWisdom();
  }, []);

  const loadTodaysWisdom = async () => {
    try {
      const response = await fetch('/api/daily-wisdom');
      const data = await response.json();
      if (data.success) {
        setWisdom(data.wisdom);
      }
    } catch (error) {
      console.error('Failed to load daily wisdom:', error);
      // Fallback wisdom
      setWisdom({
        id: '1',
        date: new Date().toISOString().split('T')[0],
        quote: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
        translation: 'You have the right to perform your actions, but not to the fruits of action',
        source: 'Bhagavad Gita 2.47',
        relevance: 'Focus on studying without attachment to results. Your dedication to NEET preparation is your dharma.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/20 relative overflow-hidden">
        {/* Enhanced Animated Om Symbol */}
        <div className="absolute top-4 right-4 opacity-15">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-7xl text-orange-400 filter drop-shadow-lg"
          >
            ॐ
          </motion.div>
        </div>

        {/* Enhanced Animated Swastik */}
        <div className="absolute bottom-4 left-4 opacity-15">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 5, -5, 0],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ 
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-5xl text-yellow-400 filter drop-shadow-lg"
          >
            卐
          </motion.div>
        </div>

        {/* Floating Lotus Petals */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400/10 text-2xl pointer-events-none"
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -15, 10, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
          >
            🪷
          </motion.div>
        ))}

        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="h-6 w-6 text-yellow-400 filter drop-shadow-md" />
            </motion.div>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              आज का आध्यात्मिक ज्ञान
            </motion.span>
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
            >
              <Sparkles className="h-5 w-5 text-orange-400 filter drop-shadow-md" />
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {wisdom && (
            <>
              {/* Sanskrit Quote */}
              <motion.div 
                className="text-center p-6 bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-lg border border-orange-500/30"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-orange-300 text-xl font-bold mb-3 leading-relaxed">
                  {wisdom.quote}
                </p>
                <p className="text-gray-300 text-base mb-3 italic">
                  "{wisdom.translation}"
                </p>
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4 text-yellow-400" />
                  <p className="text-yellow-400 text-sm font-medium">
                    {wisdom.source}
                  </p>
                </div>
              </motion.div>

              {/* NEET Relevance */}
              <motion.div 
                className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  आपकी NEET यात्रा के लिए
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {wisdom.relevance}
                </p>
              </motion.div>

              {/* Daily Affirmation */}
              <motion.div 
                className="text-center p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {(() => {
                  const affirmations = [
                    { hindi: "मैं अपने अध्ययन में पूर्ण समर्पण के साथ लगी रहूंगी और सफलता मेरे कदम चूमेगी।", english: "I will dedicate myself completely to my studies and success will follow." },
                    { hindi: "मैं धैर्य और दृढ़ता के साथ हर चुनौती का सामना करूंगी और NEET में सफल होऊंगी।", english: "I will face every challenge with patience and determination and succeed in NEET." },
                    { hindi: "मेरा ज्ञान प्रतिदिन बढ़ता जा रहा है और मैं अपने लक्ष्य के करीब पहुंच रही हूं।", english: "My knowledge grows daily and I am getting closer to my goal." },
                    { hindi: "मैं अपनी क्षमताओं पर विश्वास रखती हूं और कड़ी मेहनत से डॉक्टर बनूंगी।", english: "I believe in my abilities and will become a doctor through hard work." },
                    { hindi: "सत्य और ईमानदारी के साथ मैं अपनी पढ़ाई करूंगी और सफलता पाऊंगी।", english: "With truth and honesty, I will study and achieve success." },
                    { hindi: "मैं अपने आप को जानती हूं और अपनी शक्तियों का सदुपयोग करके NEET जीतूंगी।", english: "I know myself and will win NEET by utilizing my strengths properly." },
                    { hindi: "धैर्य मेरी शक्ति है और मैं हर कठिनाई को पार करके अपने सपने पूरे करूंगी।", english: "Patience is my strength and I will overcome every difficulty to fulfill my dreams." },
                    { hindi: "मैं निरंतर अभ्यास से अपनी बुद्धि को तेज़ बनाऊंगी।", english: "I will sharpen my intellect through continuous practice." },
                    { hindi: "हर दिन मैं अपने सपनों के करीब जा रही हूं।", english: "Every day I am getting closer to my dreams." },
                    { hindi: "मैं कभी हार नहीं मानूंगी और अपने लक्ष्य को पाकर रहूंगी।", english: "I will never give up and will achieve my goal." },
                    { hindi: "मेरी मेहनत और लगन मुझे सफलता दिलाएगी।", english: "My hard work and dedication will bring me success." },
                    { hindi: "मैं हर कठिनाई को अवसर में बदल दूंगी।", english: "I will turn every difficulty into an opportunity." },
                    { hindi: "मेरा आत्मविश्वास मेरी सबसे बड़ी ताकत है।", english: "My self-confidence is my greatest strength." },
                    { hindi: "मैं अपने सपनों को साकार करने के लिए पूरी तरह तैयार हूं।", english: "I am fully prepared to make my dreams come true." },
                    { hindi: "हर प्रश्न मुझे और मजबूत बनाता है।", english: "Every question makes me stronger." },
                    { hindi: "मैं अपनी गलतियों से सीखकर आगे बढ़ूंगी।", english: "I will learn from my mistakes and move forward." },
                    { hindi: "मेरा फोकस और एकाग्रता मुझे विजयी बनाएगी।", english: "My focus and concentration will make me victorious." },
                    { hindi: "मैं हर दिन बेहतर बनती जा रही हूं।", english: "I am becoming better every day." },
                    { hindi: "मेरी तैयारी मुझे NEET में टॉप रैंक दिलाएगी।", english: "My preparation will get me a top rank in NEET." },
                    { hindi: "मैं अपने परिवार का गर्व बनूंगी।", english: "I will make my family proud." },
                    { hindi: "हर चुनौती मुझे और दृढ़ बनाती है।", english: "Every challenge makes me more determined." },
                    { hindi: "मैं अपने लक्ष्य के प्रति पूर्णतः समर्पित हूं।", english: "I am completely dedicated to my goal." },
                    { hindi: "मेरी मेहनत का फल मुझे जरूर मिलेगा।", english: "I will definitely get the fruits of my hard work." },
                    { hindi: "मैं हर दिन नई ऊंचाइयों को छूऊंगी।", english: "I will touch new heights every day." },
                    { hindi: "मेरा जुनून मुझे सफलता तक ले जाएगा।", english: "My passion will lead me to success." },
                    { hindi: "मैं अपने डर को हराकर आगे बढ़ूंगी।", english: "I will overcome my fears and move forward." },
                    { hindi: "हर सुबह मैं नई उम्मीद के साथ उठती हूं।", english: "Every morning I wake up with new hope." },
                    { hindi: "मेरी दृढ़ता मेरी सफलता की गारंटी है।", english: "My determination is the guarantee of my success." },
                    { hindi: "मैं अपने सपनों को हकीकत बनाने के लिए तैयार हूं।", english: "I am ready to turn my dreams into reality." },
                    { hindi: "हर पल मैं अपने लक्ष्य के करीब जा रही हूं।", english: "Every moment I am getting closer to my goal." },
                    { hindi: "मेरी एकाग्रता मुझे विजय दिलाएगी।", english: "My concentration will bring me victory." },
                    { hindi: "मैं कभी भी अपने सपनों को छोड़ने वाली नहीं हूं।", english: "I will never give up on my dreams." },
                    { hindi: "मेरा अभ्यास मुझे परफेक्ट बनाएगा।", english: "My practice will make me perfect." },
                    { hindi: "हर दिन मैं अपनी क्षमताओं को बढ़ाती हूं।", english: "Every day I enhance my abilities." },
                    { hindi: "मैं अपने लक्ष्य को पाने के लिए कुछ भी कर सकती हूं।", english: "I can do anything to achieve my goal." },
                    { hindi: "मेरी मेहनत मेरी किस्मत बदल देगी।", english: "My hard work will change my destiny." },
                    { hindi: "मैं हर बाधा को पार करके आगे बढ़ूंगी।", english: "I will overcome every obstacle and move forward." },
                    { hindi: "मेरा आत्मविश्वास मेरी सबसे बड़ी पूंजी है।", english: "My self-confidence is my greatest asset." },
                    { hindi: "हर प्रयास मुझे मेरे लक्ष्य के करीब ले जाता है।", english: "Every effort brings me closer to my goal." },
                    { hindi: "मैं अपने सपनों का राजा बनने के लिए तैयार हूं।", english: "I am ready to become the king of my dreams." },
                    { hindi: "मेरी तैयारी मुझे अजेय बनाएगी।", english: "My preparation will make me invincible." },
                    { hindi: "हर दिन मैं अपने आप को बेहतर बनाती हूं।", english: "Every day I make myself better." },
                    { hindi: "मैं अपने लक्ष्य के लिए पूरी तरह समर्पित हूं।", english: "I am completely dedicated to my goal." },
                    { hindi: "मेरी दृढ़ता मुझे हर मुश्किल से निकालेगी।", english: "My determination will get me out of every difficulty." },
                    { hindi: "हर चुनौती मुझे और मजबूत बनाती है।", english: "Every challenge makes me stronger." },
                    { hindi: "मैं अपने सपनों को साकार करने के लिए कड़ी मेहनत करूंगी।", english: "I will work hard to make my dreams come true." },
                    { hindi: "मेरा जुनून मेरी सफलता की कुंजी है।", english: "My passion is the key to my success." },
                    { hindi: "हर दिन मैं नए रिकॉर्ड बनाती हूं।", english: "Every day I create new records." },
                    { hindi: "मैं अपने लक्ष्य को पाने के लिए अथक प्रयास करूंगी।", english: "I will make relentless efforts to achieve my goal." },
                    { hindi: "मेरी मेहनत का परिणाम जरूर मिलेगा।", english: "The result of my hard work will definitely come." },
                    { hindi: "हर कदम मुझे मेरी मंजिल के करीब ले जाता है।", english: "Every step takes me closer to my destination." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए पूरी तरह तैयार हूं।", english: "I am fully prepared to fulfill my dreams." },
                    { hindi: "मेरा आत्मविश्वास मुझे हर बाधा से पार करवाएगा।", english: "My self-confidence will help me overcome every obstacle." },
                    { hindi: "हर प्रयास मुझे मेरे लक्ष्य के करीब ले जाता है।", english: "Every effort brings me closer to my goal." },
                    { hindi: "मैं अपने सपनों को हकीकत बनाने के लिए कुछ भी कर सकती हूं।", english: "I can do anything to turn my dreams into reality." },
                    { hindi: "मेरी तैयारी मुझे NEET में सफलता दिलाएगी।", english: "My preparation will bring me success in NEET." },
                    { hindi: "हर दिन मैं अपनी क्षमताओं को निखारती हूं।", english: "Every day I polish my abilities." },
                    { hindi: "मैं अपने लक्ष्य के लिए पूर्ण समर्पण के साथ काम करूंगी।", english: "I will work with complete dedication for my goal." },
                    { hindi: "मेरी दृढ़ता मेरी सफलता का आधार है।", english: "My determination is the foundation of my success." },
                    { hindi: "हर चुनौती मुझे और बेहतर बनाती है।", english: "Every challenge makes me better." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए हर संभव प्रयास करूंगी।", english: "I will make every possible effort to fulfill my dreams." },
                    { hindi: "मेरा जुनून मुझे मेरी मंजिल तक ले जाएगा।", english: "My passion will take me to my destination." },
                    { hindi: "हर दिन मैं अपने आप को चुनौती देती हूं।", english: "Every day I challenge myself." },
                    { hindi: "मैं अपने लक्ष्य को पाने के लिए निरंतर प्रयास करूंगी।", english: "I will continuously strive to achieve my goal." },
                    { hindi: "मेरी मेहनत मुझे मेरे सपनों तक ले जाएगी।", english: "My hard work will take me to my dreams." },
                    { hindi: "हर कदम मुझे सफलता के करीब ले जाता है।", english: "Every step takes me closer to success." },
                    { hindi: "मैं अपने सपनों को साकार करने के लिए पूरी तरह प्रतिबद्ध हूं।", english: "I am fully committed to making my dreams come true." },
                    { hindi: "मेरा आत्मविश्वास मेरी सबसे बड़ी शक्ति है।", english: "My self-confidence is my greatest power." },
                    { hindi: "हर प्रयास मुझे मेरे लक्ष्य के करीब ले जाता है।", english: "Every effort brings me closer to my goal." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए कड़ी मेहनत करने को तैयार हूं।", english: "I am ready to work hard to fulfill my dreams." },
                    { hindi: "मेरी तैयारी मुझे विजयी बनाएगी।", english: "My preparation will make me victorious." },
                    { hindi: "हर दिन मैं अपने लक्ष्य के करीब जाती हूं।", english: "Every day I get closer to my goal." },
                    { hindi: "मैं अपने सपनों को हकीकत बनाने के लिए पूरी तरह तैयार हूं।", english: "I am fully prepared to turn my dreams into reality." },
                    { hindi: "मेरी दृढ़ता मुझे हर मुश्किल से पार करवाएगी।", english: "My determination will help me overcome every difficulty." },
                    { hindi: "हर चुनौती मुझे और दृढ़ बनाती है।", english: "Every challenge makes me more determined." },
                    { hindi: "मैं अपने लक्ष्य के लिए अथक प्रयास करने को तैयार हूं।", english: "I am ready to make tireless efforts for my goal." },
                    { hindi: "मेरा जुनून मेरी सफलता की गारंटी है।", english: "My passion is the guarantee of my success." },
                    { hindi: "हर दिन मैं नई ऊंचाइयों को छूने की कोशिश करती हूं।", english: "Every day I try to touch new heights." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए हर संभव कोशिश करूंगी।", english: "I will make every possible effort to fulfill my dreams." },
                    { hindi: "मेरी मेहनत का फल मुझे अवश्य मिलेगा।", english: "I will definitely get the fruits of my hard work." },
                    { hindi: "हर कदम मुझे मेरी मंजिल के करीब ले जाता है।", english: "Every step takes me closer to my destination." },
                    { hindi: "मैं अपने लक्ष्य को पाने के लिए पूर्ण समर्पण के साथ काम करूंगी।", english: "I will work with complete dedication to achieve my goal." },
                    { hindi: "मेरा आत्मविश्वास मुझे हर बाधा से पार करने में मदद करेगा।", english: "My self-confidence will help me overcome every obstacle." },
                    { hindi: "हर प्रयास मुझे मेरे सपनों के करीब ले जाता है।", english: "Every effort brings me closer to my dreams." },
                    { hindi: "मैं अपने सपनों को साकार करने के लिए कुछ भी करने को तैयार हूं।", english: "I am ready to do anything to make my dreams come true." },
                    { hindi: "मेरी तैयारी मुझे NEET में टॉप रैंक दिलाएगी।", english: "My preparation will get me a top rank in NEET." },
                    { hindi: "हर दिन मैं अपनी क्षमताओं को बढ़ाने की कोशिश करती हूं।", english: "Every day I try to enhance my abilities." },
                    { hindi: "मैं अपने लक्ष्य के लिए निरंतर संघर्ष करूंगी।", english: "I will continuously struggle for my goal." },
                    { hindi: "मेरी दृढ़ता मेरी सफलता का मार्ग है।", english: "My determination is the path to my success." },
                    { hindi: "हर चुनौती मुझे और मजबूत और बेहतर बनाती है।", english: "Every challenge makes me stronger and better." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए हर दिन मेहनत करूंगी।", english: "I will work hard every day to fulfill my dreams." },
                    { hindi: "मेरा जुनून मुझे मेरे लक्ष्य तक ले जाने के लिए पर्याप्त है।", english: "My passion is enough to take me to my goal." },
                    { hindi: "हर दिन मैं अपने आप को बेहतर बनाने की कोशिश करती हूं।", english: "Every day I try to make myself better." },
                    { hindi: "मैं अपने लक्ष्य को पाने के लिए कभी हार नहीं मानूंगी।", english: "I will never give up to achieve my goal." },
                    { hindi: "मेरी मेहनत मुझे मेरी मंजिल तक ले जाएगी।", english: "My hard work will take me to my destination." },
                    { hindi: "हर कदम मुझे सफलता के और करीब ले जाता है।", english: "Every step takes me closer to success." },
                    { hindi: "मैं अपने सपनों को हकीकत बनाने के लिए पूरी तरह प्रतिबद्ध हूं।", english: "I am fully committed to turning my dreams into reality." },
                    { hindi: "मेरा आत्मविश्वास मेरी सबसे बड़ी ताकत और पूंजी है।", english: "My self-confidence is my greatest strength and asset." },
                    { hindi: "हर प्रयास मुझे मेरे लक्ष्य के और करीब ले जाता है।", english: "Every effort brings me closer to my goal." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए हर संभव प्रयास करने को तैयार हूं।", english: "I am ready to make every possible effort to fulfill my dreams." },
                    { hindi: "मेरी तैयारी मुझे निश्चित रूप से विजयी बनाएगी।", english: "My preparation will definitely make me victorious." },
                    { hindi: "हर दिन मैं अपने लक्ष्य के करीब जाने की कोशिश करती हूं।", english: "Every day I try to get closer to my goal." },
                    { hindi: "मैं अपने सपनों को साकार करने के लिए पूरी तरह से तैयार और प्रतिबद्ध हूं।", english: "I am fully prepared and committed to making my dreams come true." },
                    { hindi: "मेरी दृढ़ता और मेहनत मुझे हर मुश्किल से पार करवाएगी।", english: "My determination and hard work will help me overcome every difficulty." },
                    { hindi: "हर चुनौती मुझे और भी दृढ़ और मजबूत बनाती है।", english: "Every challenge makes me even more determined and stronger." },
                    { hindi: "मैं अपने लक्ष्य के लिए दिन-रात अथक प्रयास करने को तैयार हूं।", english: "I am ready to make tireless efforts day and night for my goal." },
                    { hindi: "मेरा जुनून और समर्पण मेरी सफलता की पक्की गारंटी है।", english: "My passion and dedication are the sure guarantee of my success." },
                    { hindi: "हर दिन मैं नई ऊंचाइयों को छूने और पार करने की कोशिश करती हूं।", english: "Every day I try to touch and cross new heights." },
                    { hindi: "मैं अपने सपनों को पूरा करने के लिए हर संभव कोशिश और प्रयास करूंगी।", english: "I will make every possible effort and attempt to fulfill my dreams." },
                    { hindi: "मेरी कड़ी मेहनत का मीठा फल मुझे जरूर और अवश्य मिलेगा।", english: "I will definitely and surely get the sweet fruits of my hard work." },
                    { hindi: "हर कदम और हर प्रयास मुझे मेरी मंजिल के और भी करीब ले जाता है।", english: "Every step and every effort takes me even closer to my destination." },
                    { hindi: "मैं अपने लक्ष्य को पाने के लिए पूर्ण समर्पण और निष्ठा के साथ काम करूंगी।", english: "I will work with complete dedication and devotion to achieve my goal." },
                    { hindi: "मेरा अटूट आत्मविश्वास मुझे हर बाधा और मुश्किल से पार करने में मदद करेगा।", english: "My unwavering self-confidence will help me overcome every obstacle and difficulty." },
                    { hindi: "हर प्रयास और हर कोशिश मुझे मेरे सुनहरे सपनों के करीब ले जाती है।", english: "Every effort and every attempt brings me closer to my golden dreams." },
                    { hindi: "मैं अपने सपनों को साकार करने के लिए कुछ भी करने को पूरी तरह तैयार हूं।", english: "I am completely ready to do anything to make my dreams come true." },
                    { hindi: "मेरी बेहतरीन तैयारी मुझे NEET में शानदार और टॉप रैंक दिलाएगी।", english: "My excellent preparation will get me a brilliant and top rank in NEET." },
                    { hindi: "हर दिन मैं अपनी क्षमताओं और कौशल को बढ़ाने और निखारने की कोशिश करती हूं।", english: "Every day I try to enhance and polish my abilities and skills." },
                    { hindi: "मैं अपने महान लक्ष्य के लिए निरंतर और अविरल संघर्ष करती रहूंगी।", english: "I will continuously and relentlessly struggle for my great goal." },
                    { hindi: "मेरी अडिग दृढ़ता और संकल्प मेरी निश्चित सफलता का मजबूत आधार है।", english: "My unwavering determination and resolve are the strong foundation of my certain success." },
                    { hindi: "हर चुनौती और हर कठिनाई मुझे और भी मजबूत, दृढ़ और बेहतर बनाती है।", english: "Every challenge and every difficulty makes me even stronger, more determined and better." },
                    { hindi: "मैं अपने सुनहरे सपनों को पूरा करने के लिए हर दिन पूरी मेहनत और लगन से काम करूंगी।", english: "I will work with complete hard work and dedication every day to fulfill my golden dreams." },
                    { hindi: "मेरा अटूट जुनून और पूर्ण समर्पण मुझे मेरे लक्ष्य तक पहुंचाने के लिए काफी है।", english: "My unwavering passion and complete dedication are enough to take me to my goal." },
                    { hindi: "हर दिन मैं अपने आप को बेहतर से बेहतर और उत्कृष्ट बनाने की पूरी कोशिश करती हूं।", english: "Every day I make a complete effort to make myself better and excellent." },
                    { hindi: "मैं अपने महत्वपूर्ण लक्ष्य को पाने के लिए कभी भी हार नहीं मानूंगी और न ही रुकूंगी।", english: "I will never give up or stop to achieve my important goal." },
                    { hindi: "मेरी निरंतर और कड़ी मेहनत मुझे निश्चित रूप से मेरी मंजिल तक पहुंचाएगी।", english: "My continuous and hard work will definitely take me to my destination." },
                    { hindi: "हर कदम, हर प्रयास और हर संघर्ष मुझे सफलता के और भी करीब ले जाता है।", english: "Every step, every effort and every struggle takes me even closer to success." },
                    { hindi: "मैं अपने अनमोल सपनों को हकीकत बनाने के लिए पूरी तरह से प्रतिबद्ध और समर्पित हूं।", english: "I am completely committed and dedicated to turning my precious dreams into reality." },
                    { hindi: "मेरा मजबूत आत्मविश्वास और अटूट विश्वास मेरी सबसे बड़ी ताकत और संपत्ति है।", english: "My strong self-confidence and unwavering faith are my greatest strength and wealth." },
                    { hindi: "हर प्रयास, हर कोशिश और हर संघर्ष मुझे मेरे सुनहरे लक्ष्य के और करीब ले जाता है।", english: "Every effort, every attempt and every struggle brings me closer to my golden goal." },
                    { hindi: "मैं अपने महान सपनों को पूरा करने के लिए हर संभव प्रयास और कोशिश करने को तैयार हूं।", english: "I am ready to make every possible effort and attempt to fulfill my great dreams." },
                    { hindi: "मेरी उत्कृष्ट और व्यापक तैयारी मुझे निश्चित रूप से शानदार विजय दिलाएगी।", english: "My excellent and comprehensive preparation will definitely bring me brilliant victory." },
                    { hindi: "हर दिन मैं अपने लक्ष्य के करीब जाने और उसे पाने की दिशा में आगे बढ़ती हूं।", english: "Every day I move forward towards getting closer to my goal and achieving it." },
                    { hindi: "मैं अपने अनमोल सपनों को साकार करने के लिए पूरी तरह से तैयार, प्रतिबद्ध और समर्पित हूं।", english: "I am completely prepared, committed and dedicated to making my precious dreams come true." },
                    { hindi: "मेरी अडिग दृढ़ता, कड़ी मेहनत और पूर्ण समर्पण मुझे हर मुश्किल से पार करवाएगा।", english: "My unwavering determination, hard work and complete dedication will help me overcome every difficulty." },
                    { hindi: "हर चुनौती, हर बाधा और हर कठिनाई मुझे और भी दृढ़, मजबूत और बेहतर बनाती है।", english: "Every challenge, every obstacle and every difficulty makes me even more determined, stronger and better." },
                    { hindi: "मैं अपने महत्वपूर्ण लक्ष्य के लिए दिन-रात निरंतर और अथक प्रयास करने को पूरी तरह तैयार हूं।", english: "I am completely ready to make continuous and tireless efforts day and night for my important goal." },
                    { hindi: "मेरा प्रबल जुनून, पूर्ण समर्पण और अटूट निष्ठा मेरी निश्चित सफलता की पक्की गारंटी है।", english: "My strong passion, complete dedication and unwavering devotion are the sure guarantee of my certain success." },
                    { hindi: "हर दिन मैं नई ऊंचाइयों को छूने, पार करने और उन्हें जीतने की पूरी कोशिश करती हूं।", english: "Every day I make a complete effort to touch, cross and conquer new heights." },
                    { hindi: "मैं अपने सुनहरे और अनमोल सपनों को पूरा करने के लिए हर संभव कोशिश और प्रयास करूंगी।", english: "I will make every possible effort and attempt to fulfill my golden and precious dreams." },
                    { hindi: "मेरी निरंतर और कड़ी मेहनत का मीठा और सुनहरा फल मुझे जरूर और अवश्य मिलेगा।", english: "I will definitely and surely get the sweet and golden fruits of my continuous and hard work." },
                    { hindi: "हर कदम, हर प्रयास और हर संघर्ष मुझे मेरी सुनहरी मंजिल के और भी करीब ले जाता है।", english: "Every step, every effort and every struggle takes me even closer to my golden destination." },
                    { hindi: "मैं अपने महान लक्ष्य को पाने के लिए पूर्ण समर्पण, निष्ठा और दृढ़ता के साथ काम करूंगी।", english: "I will work with complete dedication, devotion and determination to achieve my great goal." },
                    { hindi: "मेरा अटूट और मजबूत आत्मविश्वास मुझे हर बाधा, मुश्किल और चुनौती से पार करने में मदद करेगा।", english: "My unwavering and strong self-confidence will help me overcome every obstacle, difficulty and challenge." },
                    { hindi: "हर प्रयास, हर कोशिश और हर संघर्ष मुझे मेरे सुनहरे और चमकदार सपनों के करीब ले जाता है।", english: "Every effort, every attempt and every struggle brings me closer to my golden and bright dreams." },
                    { hindi: "मैं अपने अनमोल सपनों को साकार करने के लिए कुछ भी करने को पूरी तरह से तैयार और प्रतिबद्ध हूं।", english: "I am completely ready and committed to do anything to make my precious dreams come true." },
                    { hindi: "मेरी बेहतरीन, व्यापक और गहरी तैयारी मुझे NEET में शानदार, उत्कृष्ट और टॉप रैंक दिलाएगी।", english: "My excellent, comprehensive and deep preparation will get me a brilliant, outstanding and top rank in NEET." },
                    { hindi: "हर दिन मैं अपनी क्षमताओं, कौशल और प्रतिभा को बढ़ाने, निखारने और विकसित करने की कोशिश करती हूं।", english: "Every day I try to enhance, polish and develop my abilities, skills and talents." },
                    { hindi: "मैं अपने महान और महत्वपूर्ण लक्ष्य के लिए निरंतर, अविरल और दृढ़ता से संघर्ष करती रहूंगी।", english: "I will continuously, relentlessly and determinedly struggle for my great and important goal." },
                    { hindi: "मेरी अडिग दृढ़ता, मजबूत संकल्प और पूर्ण निष्ठा मेरी निश्चित और शानदार सफलता का मजबूत आधार है।", english: "My unwavering determination, strong resolve and complete devotion are the strong foundation of my certain and brilliant success." },
                    { hindi: "हर चुनौती, हर कठिनाई और हर बाधा मुझे और भी मजबूत, दृढ़, बेहतर और उत्कृष्ट बनाती है।", english: "Every challenge, every difficulty and every obstacle makes me even stronger, more determined, better and excellent." },
                    { hindi: "मैं अपने सुनहरे और चमकदार सपनों को पूरा करने के लिए हर दिन पूरी मेहनत, लगन और समर्पण से काम करूंगी।", english: "I will work with complete hard work, dedication and devotion every day to fulfill my golden and bright dreams." },
                    { hindi: "मेरा अटूट जुनून, पूर्ण समर्पण और दृढ़ संकल्प मुझे मेरे महान लक्ष्य तक पहुंचाने के लिए पर्याप्त और काफी है।", english: "My unwavering passion, complete dedication and firm resolve are sufficient and enough to take me to my great goal." },
                    { hindi: "हर दिन मैं अपने आप को बेहतर से बेहतर, उत्कृष्ट से उत्कृष्ट और महान बनाने की पूरी कोशिश और प्रयास करती हूं।", english: "Every day I make a complete effort and attempt to make myself better than better, more excellent than excellent and great." },
                    { hindi: "मैं अपने अत्यंत महत्वपूर्ण और जीवन बदलने वाले लक्ष्य को पाने के लिए कभी भी हार नहीं मानूंगी, न रुकूंगी और न ही थकूंगी।", english: "I will never give up, stop or get tired to achieve my extremely important and life-changing goal." }
                  ];
                  const hourOfDay = Math.floor(Date.now() / (1000 * 60 * 60 * 4)) % affirmations.length;
                  const affirmationIndex = hourOfDay;
                  const todaysAffirmation = affirmations[affirmationIndex];
                  
                  return (
                    <>
                      <p className="text-purple-300 text-sm font-medium">
                        आज का संकल्प: "{todaysAffirmation.hindi}"
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        Today's Affirmation: "{todaysAffirmation.english}"
                      </p>
                    </>
                  );
                })()}
              </motion.div>

              {/* Date Display */}
              <div className="text-center">
                <p className="text-gray-400 text-xs">
                  {new Date(wisdom.date).toLocaleDateString('hi-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}