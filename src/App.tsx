import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Flag, Trash2 } from 'lucide-react';
import { rawQuestions } from './data';

const REVIEW_TOPIC = "📚 Tekrar Edilecekler (Yanlışlar & Kaydedilenler)";
const topics = ["Tümü", REVIEW_TOPIC, ...new Set(rawQuestions.map(q => q.topic))];

const wrongMessages = [
  "Olsun canım, sonrakinde doğru bilirsin! ❤️",
  "Buna biraz daha çalışırsan yapabileceğine eminim.",
  "Hiç moral bozmak yok, harika gidiyorsun!",
  "Küçük bir hata sadece, sen halledersin!",
  "Öğrenmek için buradayız sevgilim, devam!",
  "Bunu saymıyoruz, bir sonrakine odaklanalım!",
  "Biraz daha dikkatle bu iş tamam aşkım.",
  "Senin zekana güveniyorum, bunu da aşarsın.",
  "Asla pes etme benim güzel sevgilim!",
  "Canın sağ olsun, bir dahakine kesin doğru!",
  "Hatalar bizi geliştirir, çok iyi gidiyorsun.",
  "Benim aşkım bunun üstesinden gelir.",
  "Sadece küçük bir dalgınlık, hadi devam!",
  "Gülümse ve bir sonrakine geç canım.",
  "Sen her şeyin en iyisini yaparsın, buna da çalışırız."
];

const complimentMessages = [
  "Bravo aşkım, 5 tane daha bildin! 🎉",
  "Süper gidiyorsun aşkım, gurur duyuyorum! 💖",
  "Benim zeki sevgilim, harikasın! 🌟",
  "İşte benim aşkım, durdurulamıyorsun! 🚀",
  "Maşallah sevgilime, zehir gibisin! 🧠❤️"
];

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState("Tümü");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  
  const [flaggedIds, setFlaggedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('askim_flaggedIds');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [wrongIds, setWrongIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('askim_wrongIds');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [hearts, setHearts] = useState<{id: number, left: string, animationDuration: string, fontSize: string}[]>([]);
  const [avatarData, setAvatarData] = useState<{image: string | null, message: string}>({ image: null, message: '' });

  useEffect(() => {
    localStorage.setItem('askim_flaggedIds', JSON.stringify(flaggedIds));
  }, [flaggedIds]);

  useEffect(() => {
    localStorage.setItem('askim_wrongIds', JSON.stringify(wrongIds));
  }, [wrongIds]);

  const filteredQuestions = useMemo(() => {
    if (selectedTopic === "Tümü") return rawQuestions;
    if (selectedTopic === REVIEW_TOPIC) {
      return rawQuestions.filter(q => flaggedIds.includes(q.id) || wrongIds.includes(q.id));
    }
    return rawQuestions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic, flaggedIds, wrongIds]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (checked[questionId]) return; 
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const triggerFloatingHearts = () => {
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10 + '%',
      animationDuration: (Math.random() * 1.5 + 1.5) + 's',
      fontSize: (Math.random() * 2 + 1.5) + 'rem'
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 3000);
  };

  const showAvatar = (img: string, msg: string) => {
    setAvatarData({ image: img, message: msg });
    if ((window as any).avatarTimeout) clearTimeout((window as any).avatarTimeout);
    (window as any).avatarTimeout = setTimeout(() => {
      setAvatarData({ image: null, message: '' });
    }, 5000);
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedIds(prev => 
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const handleCheck = (questionId: number) => {
    if (answers[questionId] === undefined) return;
    setChecked(prev => ({ ...prev, [questionId]: true }));

    const q = rawQuestions.find(r => r.id === questionId);
    if (!q) return;
    const isCorrect = answers[questionId] === q.answer;

    if (isCorrect) {
      const newTotal = totalCorrect + 1;
      const newStreak = streak + 1;
      setTotalCorrect(newTotal);
      setStreak(newStreak);
      triggerFloatingHearts();

      if (wrongIds.includes(questionId)) {
        setWrongIds(prev => prev.filter(id => id !== questionId));
      }

      if (newTotal > 0 && newTotal % 5 === 0) {
        showAvatar('extra-supportive', complimentMessages[Math.floor(Math.random() * complimentMessages.length)]);
      } else if (newStreak >= 3) {
        showAvatar('extra-supportive', "Harika bir seri yakaladın aşkım! 🔥");
      } else {
        showAvatar('regular', "Doğru cevap aşkım! ❤️");
      }
    } else {
      setStreak(0);
      showAvatar('supportive', wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
      
      if (!wrongIds.includes(questionId)) {
        setWrongIds(prev => [...prev, questionId]);
      }
    }
  };

  const handleReset = () => {
    setAnswers({});
    setChecked({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearReviewList = () => {
    if (window.confirm("Tekrar edilecekler listesindeki tüm soruları temizlemek istediğine emin misin aşkım?")) {
      setFlaggedIds([]);
      setWrongIds([]);
    }
  };

  const getOptionStyles = (q: any, optionIndex: number) => {
    const isSelected = answers[q.id] === optionIndex;
    const isCorrect = q.answer === optionIndex;
    const isChecked = checked[q.id];

    if (!isChecked) {
      return isSelected
        ? "border-blue-500 bg-blue-50 text-blue-800"
        : "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700";
    }

    if (q.answer === -1) { 
      return isSelected ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-white";
    }

    if (isCorrect) {
      return "border-green-500 bg-green-50 font-medium";
    }
    
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50";
    }

    return "border-slate-200 bg-white text-slate-500 opacity-60";
  };

  const validCheckedQuestions = Object.keys(checked).filter(id => rawQuestions.find(q => q.id === parseInt(id))?.answer !== -1);
  const checkedCount = validCheckedQuestions.length;
  const currentScore = validCheckedQuestions.reduce((score, qId) => {
    const q = rawQuestions.find(rq => rq.id === parseInt(qId));
    return answers[parseInt(qId)] === q?.answer ? score + 1 : score;
  }, 0);
  const scorePercentage = checkedCount > 0 ? Math.round((currentScore / checkedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden">
      
      {/* PERMANENT TOP BANNER */}
      <header className="fixed top-0 left-0 right-0 h-10 bg-rose-600 text-white flex items-center justify-center z-50 shadow-md">
        <p className="text-sm font-semibold tracking-wide flex items-center gap-2">
          Seni çok seviyorum aşkım ❤️
        </p>
      </header>

      <main className="mt-10 flex-1 flex flex-col p-4 md:p-8 gap-6 max-w-5xl mx-auto w-full pb-20">
        
        {/* HEADER CARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sınav Pratiği</h1>
            <p className="text-slate-500 text-sm mt-1">Senin için hazırlandı 💖</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map(t => (
                <option key={t} value={t}>
                  {t} {t === "Tümü" ? `(${rawQuestions.length})` : t === REVIEW_TOPIC ? `(${flaggedIds.length + wrongIds.length})` : ""}
                </option>
              ))}
            </select>
            {selectedTopic === REVIEW_TOPIC && (flaggedIds.length > 0 || wrongIds.length > 0) && (
              <button 
                onClick={handleClearReviewList}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-medium rounded-lg transition-colors border border-rose-100"
              >
                Listeyi Temizle
              </button>
            )}
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              İlerlemeyi Sıfırla
            </button>
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-bold whitespace-nowrap">
              Puan: <span>{currentScore}</span>/{checkedCount}
            </div>
          </div>
        </div>

        {/* QUESTION LIST */}
        <div className="flex-1 space-y-6">
          {filteredQuestions.map((q) => {
            const isFlagged = flaggedIds.includes(q.id);
            return (
              <section key={q.id} className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                
                {/* Status Bars */}
                {checked[q.id] && q.answer === answers[q.id] && q.answer !== -1 && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 z-10"></div>
                )}
                {checked[q.id] && q.answer !== answers[q.id] && q.answer !== -1 && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 z-10"></div>
                )}

                <div className="p-6 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                        Soru {q.id}
                      </span>
                      <span className="text-slate-400 text-xs italic">Kategori: {q.topic}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-medium leading-relaxed text-slate-800 mb-8">{q.question}</h2>
                  
                  <div className="space-y-3 pl-0">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[q.id] === optIdx;
                      const isChecked = checked[q.id];
                      const isCorrect = q.answer === optIdx;
                      
                      let indicatorStyles = "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600";
                      if (isSelected && !isChecked) indicatorStyles = "bg-blue-600 text-white";
                      if (isChecked && isCorrect) indicatorStyles = "bg-green-600 text-white";
                      if (isChecked && isSelected && !isCorrect) indicatorStyles = "bg-red-600 text-white";

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={checked[q.id]}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${checked[q.id] ? 'cursor-default' : 'cursor-pointer'} ${getOptionStyles(q, optIdx)}`}
                        >
                          <div className="flex items-center pr-4">
                            <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4 transition-colors ${indicatorStyles}`}>
                               {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className={`${(isChecked && isCorrect) || (isSelected && !isChecked) ? 'text-slate-800 font-medium' : 'text-slate-700'}`}>{opt}</span>
                          </div>
                          
                          {checked[q.id] && q.answer === optIdx && q.answer !== -1 && (
                            <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                          )}
                          {checked[q.id] && answers[q.id] === optIdx && q.answer !== optIdx && q.answer !== -1 && (
                            <XCircle className="text-red-500 flex-shrink-0" size={24} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {checked[q.id] && (
                    <div className="mt-5 pt-2">
                       <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                          q.answer === -1 ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : q.answer === answers[q.id] ? 'bg-green-50 text-green-800 border-green-200' 
                          : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {q.answer === -1 ? (
                            <>
                              <AlertCircle className="flex-shrink-0 mt-0.5 text-amber-600" size={20} /> 
                              <span className="text-sm font-medium">Bu soru orijinal dosyada eksikti ve skora dahil edilmedi.</span>
                            </>
                          ) : q.answer === answers[q.id] ? (
                            <>
                              <CheckCircle2 className="flex-shrink-0 mt-0.5 text-green-600" size={20} /> 
                              <span className="text-sm font-bold">Harikasın! Doğru bildin. 🎉</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="flex-shrink-0 mt-0.5 text-red-600" size={20} /> 
                              <span className="text-sm">
                                <span className="font-bold">Yanlış cevap.</span> Doğru seçenek: <strong className="block mt-2 bg-white/70 px-3 py-1.5 rounded-lg text-slate-800 border border-red-100 shadow-sm">{q.options[q.answer]}</strong>
                              </span>
                            </>
                          )}
                        </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2">
                  <button 
                    onClick={() => toggleFlag(q.id)}
                    className={`p-2 rounded-lg transition-colors ${isFlagged ? 'bg-amber-100 text-amber-600' : 'text-amber-500 hover:bg-amber-50'}`}
                    title="Daha sonra tekrar bakmak için kaydet"
                  >
                     <Flag size={20} className={isFlagged ? "fill-current" : ""} />
                  </button>
                  {!checked[q.id] && (
                    <button
                      disabled={answers[q.id] === undefined}
                      onClick={() => handleCheck(q.id)}
                      className={`px-8 py-2 font-semibold rounded-lg shadow-sm transition-colors ${
                        answers[q.id] !== undefined
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Cevabı Kontrol Et
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center bg-white p-12 rounded-2xl border border-slate-200 mt-6 shadow-sm">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">Burada soru yok!</h3>
            <p className="text-slate-500 text-sm">Bu konuya ait soru bulunamadı veya kaydedilen soru yok.</p>
          </div>
        )}
      </main>

      {/* FLOATING HEARTS LAYER */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-80vh) scale(1.5); opacity: 0; }
        }
        .floating-heart {
          position: fixed;
          bottom: 10px;
          animation: floatUp 2.5s ease-out forwards;
          z-index: 9999;
          pointer-events: none;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .avatar-container {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />

      {hearts.map(h => (
        <div key={h.id} className="floating-heart" style={{ left: h.left, animationDuration: h.animationDuration, fontSize: h.fontSize }}>
          ❤️
        </div>
      ))}

      {/* AVATAR LAYER */}
      {avatarData.image && (
        <div className="fixed bottom-0 right-4 md:right-10 z-[100] flex flex-col items-end pointer-events-none avatar-container max-w-[280px]">
          {avatarData.message && (
            <div className="bg-white border-2 border-pink-200 rounded-3xl rounded-br-none p-4 shadow-xl mb-[-10px] z-10 text-pink-700 font-bold text-sm md:text-base relative mr-8 animate-bounce">
              {avatarData.message}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-200 transform rotate-45"></div>
            </div>
          )}
          <img
            src={`/${avatarData.image}.png`}
            alt="Avatar"
            className="w-40 md:w-56 h-auto drop-shadow-2xl"
            style={{ mixBlendMode: 'multiply' }}
            onError={(e) => {
              // Hide image if it doesn't load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

